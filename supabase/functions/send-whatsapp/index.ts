// supabase/functions/send-whatsapp/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

/* ------- Secrets (Project Settings → Configuration → Secrets) ------- */
const TOKEN = Deno.env.get("WHATSAPP_TOKEN") ?? "";
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") ?? "";
const DEFAULT_CC = Deno.env.get("DEFAULT_COUNTRY_CODE") ?? "91";

/** If true, we always return ok:true to the client, hiding backend errors. */
const HIDE_ERRORS_FROM_CLIENT = true;

/* ------------------------------ Types ------------------------------ */
interface Payload {
  to: string;              // phone; local or intl (we normalize digits)
  name?: string;           // used in the caption
  caption?: string;        // custom text
  imageUrl?: string;       // public HTTPS image URL
  templateName?: string;   // approved template (optional)
  countryCode?: string;    // override default country code
}

interface WhatsAppTemplatePayload {
  messaging_product: "whatsapp";
  to: string;
  type: "template";
  template: {
    name: string;
    language: { code: string };
    components: Array<{
      type: "header" | "body" | "button";
      parameters: Array<Record<string, unknown>>;
    }>;
  };
}

interface WhatsAppImagePayload {
  messaging_product: "whatsapp";
  to: string;
  type: "image";
  image: { link: string; caption?: string };
}

interface WhatsAppTextPayload {
  messaging_product: "whatsapp";
  to: string;
  type: "text";
  text: { body: string };
}

type WhatsAppPayload =
  | WhatsAppTemplatePayload
  | WhatsAppImagePayload
  | WhatsAppTextPayload;

/* ----------------------------- Helpers ----------------------------- */
const buildCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") ?? "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8",
  };
};

const json = (req: Request, body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    ...(init ?? {}),
    headers: { ...buildCorsHeaders(req), ...(init?.headers ?? {}) },
  });

const empty = (req: Request, init?: ResponseInit) =>
  new Response(null, {
    ...(init ?? {}),
    headers: { ...buildCorsHeaders(req), ...(init?.headers ?? {}) },
  });

const digits = (v: string) => v.replace(/\D/g, "");

const normPhone = (raw: string, cc = DEFAULT_CC): string => {
  const d = digits(raw || "");
  if (!d) return "";
  return d.startsWith(cc) ? d : cc + d;
};

const isHttps = (url?: string) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
};

/* ------------------------------ Handler ---------------------------- */
serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === "OPTIONS") return empty(req, { status: 204 });
  if (req.method !== "POST") return json(req, { error: "Method not allowed" }, { status: 405 });

  let body: Payload | null = null;
  try {
    body = (await req.json()) as Payload;
  } catch {
    // Don’t expose details to client
    if (HIDE_ERRORS_FROM_CLIENT) return json(req, { ok: true });
    return json(req, { error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const to = normPhone(body?.to ?? "", body?.countryCode || DEFAULT_CC);
    const name = (body?.name || "Friend").trim();
    const caption = (body?.caption || `Thank you ${name}! Your birthday wish made our day ❤️`).trim();
    const imageUrl = body?.imageUrl?.trim();
    const templateName = body?.templateName?.trim();

    // If missing phone or secrets, we just log and pretend success.
    if (!to) {
      console.warn("send-whatsapp: invalid phone input", body);
      return json(req, { ok: true }); // hide error from client
    }
    if (!TOKEN || !PHONE_NUMBER_ID) {
      console.warn("send-whatsapp: WA secrets missing; returning ok:true (mock).");
      return json(req, { ok: true, mocked: true });
    }
    if (imageUrl && !isHttps(imageUrl)) {
      console.warn("send-whatsapp: non-HTTPS imageUrl", imageUrl);
      return json(req, { ok: true }); // silently succeed
    }

    // Build WA payload
    let waPayload: WhatsAppPayload;
    if (templateName && imageUrl) {
      waPayload = {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en" },
          components: [
            {
              type: "header",
              parameters: [{ type: "image", image: { link: imageUrl } }],
            },
            {
              type: "body",
              parameters: [{ type: "text", text: name }],
            },
          ],
        },
      };
    } else if (imageUrl) {
      waPayload = {
        messaging_product: "whatsapp",
        to,
        type: "image",
        image: { link: imageUrl, caption },
      };
    } else {
      waPayload = {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: caption },
      };
    }

    // Call Meta Graph API
    const graphUrl = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
    const res = await fetch(graphUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(waPayload),
    });

    // Always hide detailed errors from client
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.error("send-whatsapp: WA API error", res.status, err);
      return json(req, { ok: true }); // pretend success
    }

    // Success
    return json(req, { ok: true });
  } catch (e) {
    console.error("send-whatsapp: handler error", e);
    return json(req, { ok: true }); // still pretend success
  }
});
