import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Video,
  Image as ImageIcon,
  MessageSquare,
  Search,
  Filter,
  Play,
  X,
  Calendar,
  MapPin,
  Users,
  FileText,
  Mic,
  Film,
  Zap,
  Loader,
  Eye,
  Download,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* =========================================================
   DESIGN TOKENS
   ========================================================= */
const DESIGN_TOKENS = {
  colors: {
    brandBlue: "#0606bc",
    brandYellow: "#faf200",
    coralAccent: "#FF6B6B",
    lightGray: "#F5F5F5",
    deepNavy: "#0A0A2E",
    coolGray: "#E8E8ED",
    offWhite: "#FEFDF8",
    darkCharcoal: "#333333",
  },
  gradients: {
    section:
      "linear-gradient(140deg, rgba(250,242,0,0.08) 0%, rgba(255,255,255,1) 38%, rgba(6,6,188,0.06) 100%)",
    accent: "linear-gradient(135deg, #0606bc 0%, #0A0A2E 100%)",
    video: "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)",
    photo: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    audio: "linear-gradient(135deg, #A166AB 0%, #C4B0FF 100%)",
    text: "linear-gradient(135deg, #06beb6 0%, #48b1bf 100%)",
  },
  shadows: {
    card: "0 8px 24px rgba(10,10,46,0.06)",
    cardHover: "0 18px 40px rgba(6,6,188,0.10)",
  },
} as const;

/* =========================================================
   TYPES
   ========================================================= */
type Submission = {
  id: string;
  type: "video" | "photo" | "post" | "voice" | "text" | "image" | "audio";
  name: string;
  message: string | null;
  url: string | null;
  provider: string | null;
  org: string | null;
  city: string | null;
  created_at: string;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  duration: number | null;
  thumbnail_url: string | null;
};

/* =========================================================
   FILTERS
   ========================================================= */
const filters = [
  { key: "all", label: "All", icon: Zap, count: 0 },
  { key: "video", label: "Video", icon: Film, count: 0 },
  { key: "photo", label: "Photo", icon: ImageIcon, count: 0 },
  { key: "audio", label: "Audio", icon: Mic, count: 0 },
  { key: "text", label: "Text", icon: FileText, count: 0 },
];

/* =========================================================
   UTILS
   ========================================================= */
const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const formatDuration = (seconds: number | null) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getTypeGradient = (type: Submission["type"]) => {
  switch (type) {
    case "video":
      return DESIGN_TOKENS.gradients.video;
    case "photo":
    case "post":
    case "image":
      return DESIGN_TOKENS.gradients.photo;
    case "voice":
    case "audio":
      return DESIGN_TOKENS.gradients.audio;
    case "text":
      return DESIGN_TOKENS.gradients.text;
    default:
      return "linear-gradient(135deg, #E8E8ED 0%, #F5F5F5 100%)";
  }
};

const getTypeIcon = (type: Submission["type"], iconClass = "h-4 w-4") => {
  switch (type) {
    case "video":
      return <Video className={iconClass} aria-hidden="true" />;
    case "photo":
    case "image":
    case "post":
      return <ImageIcon className={iconClass} aria-hidden="true" />;
    case "voice":
    case "audio":
      return <Mic className={iconClass} aria-hidden="true" />;
    case "text":
      return <FileText className={iconClass} aria-hidden="true" />;
    default:
      return <MessageSquare className={iconClass} aria-hidden="true" />;
  }
};

/* =========================================================
   WISH CARD
   ========================================================= */
const CARD_H = { base: 420, sm: 440, lg: 460 };
const MEDIA_H = { base: 160, sm: 180, lg: 200 };

const WishCard = ({
  wish,
  onPreview,
}: {
  wish: Submission;
  onPreview: (wish: Submission) => void;
}) => {
  const typeChip = (() => {
    switch (wish.type) {
      case "video":
        return { bg: "bg-red-50", txt: "text-red-700", br: "border-red-200" };
      case "photo":
      case "image":
      case "post":
        return {
          bg: "bg-emerald-50",
          txt: "text-emerald-700",
          br: "border-emerald-200",
        };
      case "voice":
      case "audio":
        return {
          bg: "bg-purple-50",
          txt: "text-purple-700",
          br: "border-purple-200",
        };
      case "text":
        return { bg: "bg-sky-50", txt: "text-sky-700", br: "border-sky-200" };
      default:
        return {
          bg: "bg-gray-50",
          txt: "text-gray-700",
          br: "border-gray-200",
        };
    }
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Card
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white transition-shadow duration-300"
        style={{
          height: `clamp(${CARD_H.base}px, 44vh, ${CARD_H.lg}px)`,
          borderColor: DESIGN_TOKENS.colors.coolGray,
          boxShadow: DESIGN_TOKENS.shadows.card,
        }}
      >
        <CardContent className="flex h-full flex-col p-4">
          {/* Top Row */}
          <div className="mb-2 flex items-center justify-between">
            <Badge
              className={`border px-2 py-1 text-xs font-semibold ${typeChip.bg} ${typeChip.txt} ${typeChip.br}`}
              aria-label={`Type: ${wish.type}`}
            >
              <span className="mr-1 inline-flex">{getTypeIcon(wish.type)}</span>
              <span className="capitalize">
                {wish.type === "voice"
                  ? "audio"
                  : wish.type === "photo"
                  ? "image"
                  : wish.type}
              </span>
            </Badge>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={wish.created_at}>
                {new Date(wish.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>

          {/* Media */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => onPreview(wish)}
              className="relative block w-full overflow-hidden rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                height: `clamp(${MEDIA_H.base}px, 20vh, ${MEDIA_H.lg}px)`,
                background: getTypeGradient(wish.type),
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
              }}
              aria-label={`Preview ${wish.type} from ${wish.name}`}
            >
              {/* VIDEO */}
              {wish.type === "video" && (
                <>
                  {wish.file_url && wish.thumbnail_url ? (
                    <img
                      src={wish.thumbnail_url}
                      alt={`Video thumbnail for ${wish.name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Video className="h-8 w-8 text-white/90" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                    <div className="rounded-full bg-white/90 p-2 shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-5 w-5 text-gray-700" />
                    </div>
                  </div>
                  {wish.duration && (
                    <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
                      {formatDuration(wish.duration)}
                    </div>
                  )}
                </>
              )}

              {/* IMAGE/POST */}
              {(wish.type === "photo" ||
                wish.type === "post" ||
                wish.type === "image") && (
                <>
                  {wish.file_url ? (
                    <img
                      src={wish.file_url}
                      alt={`Image submission from ${wish.name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-white/90" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/15">
                    <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium shadow-lg">
                        <Eye className="mr-1 inline h-4 w-4" />
                        View Image
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* AUDIO */}
              {(wish.type === "voice" || wish.type === "audio") && (
                <div className="flex h-full w-full items-center justify-center p-3 text-white">
                  <div className="text-center">
                    <div className="mx-auto mb-2 inline-flex rounded-full bg-white/25 p-3">
                      <Mic className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-semibold">Audio Message</div>
                    <div className="mt-0.5 text-xs opacity-90">
                      {wish.duration ? formatDuration(wish.duration) : "0:00"}
                    </div>
                  </div>
                </div>
              )}

              {/* TEXT */}
              {wish.type === "text" && (
                <div className="flex h-full w-full items-center justify-center p-4 text-white">
                  <div className="text-center">
                    <FileText className="mx-auto mb-2 h-8 w-8 opacity-90" />
                    <div className="text-sm font-semibold">Text Message</div>
                    <div className="mt-1 line-clamp-2 text-xs opacity-90">
                      {wish.message || "Heartfelt message"}
                    </div>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex min-h-0 flex-1 flex-col">
            <h3 className="mb-1.5 line-clamp-2 text-base font-semibold leading-tight text-gray-900">
              {wish.name}
            </h3>
            {wish.message && (
              <p className="mb-2 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3">
                {wish.message}
              </p>
            )}

            <div className="mt-auto space-y-1.5">
              {wish.org && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Users className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{wish.org}</span>
                </div>
              )}
              {wish.city && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{wish.city}</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full rounded-lg border-gray-300 text-gray-700 transition-colors hover:border-[#0606bc] hover:bg-[#0606bc]/5 hover:text-[#0606bc]"
              onClick={() => onPreview(wish)}
              style={{ borderColor: DESIGN_TOKENS.colors.coolGray }}
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* =========================================================
   PREVIEW DIALOG — compact meta (reduced prominence)
   ========================================================= */
const PreviewDialog = ({
  wish,
  open,
  onClose,
}: {
  wish: Submission | null;
  open: boolean;
  onClose: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  if (!wish) return null;

  const shareUrl = wish.url || wish.file_url || "";
  const canDownload = Boolean(wish.file_url);

  const handleCopy = async () => {
    try {
      if (shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    } catch {
      setCopied(false);
    }
  };

  const headerChipBg = (() => {
    switch (wish.type) {
      case "video":
        return "bg-[#FF6B6B]";
      case "photo":
      case "image":
      case "post":
        return "bg-[#4ECDC4]";
      case "voice":
      case "audio":
        return "bg-[#A166AB]";
      case "text":
        return "bg-[#06beb6]";
      default:
        return "bg-[#0606bc]";
    }
  })();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-4xl overflow-hidden rounded-2xl border-0 p-0"
        style={{
          background: "white",
          boxShadow: "0 28px 64px rgba(0,0,0,0.28)",
        }}
      >
        {/* HEADER (slimmer) */}
        <DialogHeader
          className="relative border-b p-0 text-white"
          style={{ background: DESIGN_TOKENS.gradients.accent }}
        >
          <div className="flex items-center justify-between p-3 sm:p-4">
            <DialogTitle className="flex items-center gap-2 text-white">
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-white shadow-md ${headerChipBg}`}
              >
                {getTypeIcon(wish.type, "h-4 w-4")}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold sm:text-base">
                  {wish.name}
                </span>
                {/* Tiny meta row */}
                <span className="flex items-center gap-2 text-[11px] opacity-90">
                  <span className="capitalize">
                    {wish.type === "voice" ? "audio" : wish.type}
                  </span>
                  <span className="opacity-50">•</span>
                  <time dateTime={wish.created_at}>
                    {new Date(wish.created_at).toLocaleDateString()}
                  </time>
                  {wish.duration &&
                    (wish.type === "video" ||
                      wish.type === "voice" ||
                      wish.type === "audio") && (
                      <>
                        <span className="opacity-50">•</span>
                        <span>{formatDuration(wish.duration)}</span>
                      </>
                    )}
                </span>
              </span>
            </DialogTitle>

            <div className="flex items-center gap-1.5">
              {shareUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 rounded-full bg-white/10 px-3 text-white hover:bg-white/20"
                  title="Copy link"
                >
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              )}
              {canDownload && (
                <a href={wish.file_url!} download className="inline-flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full bg-white/10 px-3 text-white hover:bg-white/20"
                    title="Download file"
                  >
                    <Download className="mr-1.5 h-4 w-4" />
                    Download
                  </Button>
                </a>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full text-white hover:bg-white/20"
                aria-label="Close preview"
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* BODY */}
        <div
          className="max-h-[82vh] overflow-auto p-3 sm:p-4"
          style={{ background: DESIGN_TOKENS.colors.offWhite }}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
            {/* MEDIA PANEL */}
            <div className="lg:col-span-8">
              <div
                className="relative w-full overflow-hidden rounded-xl border bg-white"
                style={{
                  borderColor: DESIGN_TOKENS.colors.coolGray,
                  boxShadow: DESIGN_TOKENS.shadows.card,
                }}
              >
                {/* VIDEO */}
                {wish.type === "video" && wish.file_url && (
                  <video
                    src={wish.file_url}
                    controls
                    autoPlay
                    className="w-full rounded-xl"
                    poster={wish.thumbnail_url ?? undefined}
                    style={{ maxHeight: "64vh" }}
                    aria-label={`Video from ${wish.name}`}
                  />
                )}

                {/* AUDIO */}
                {(wish.type === "voice" || wish.type === "audio") &&
                  wish.file_url && (
                    <div className="flex w-full flex-col items-center justify-center p-8">
                      <div
                        className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full"
                        style={{ background: getTypeGradient(wish.type) }}
                      >
                        <Mic className="h-10 w-10 text-white" />
                      </div>
                      <audio
                        src={wish.file_url}
                        controls
                        autoPlay
                        className="w-full max-w-lg"
                        aria-label={`Audio message from ${wish.name}`}
                      />
                    </div>
                  )}

                {/* IMAGE */}
                {(wish.type === "photo" ||
                  wish.type === "post" ||
                  wish.type === "image") &&
                  wish.file_url && (
                    <div className="flex w-full items-center justify-center bg-black/2">
                      <img
                        src={wish.file_url}
                        alt={`Image submission from ${wish.name}`}
                        className="max-h-[70vh] w-full rounded-xl object-contain"
                      />
                    </div>
                  )}

                {/* TEXT */}
                {wish.type === "text" && (
                  <div className="p-5 sm:p-6">
                    <div
                      className="mx-auto w-full max-w-2xl rounded-xl border bg-white p-5 shadow"
                      style={{ borderColor: DESIGN_TOKENS.colors.coolGray }}
                    >
                      <div className="mb-2 flex items-center gap-2 text-[#0606bc] text-sm">
                        <FileText className="h-4 w-4" />
                        <span className="font-semibold">Text Message</span>
                      </div>
                      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-800">
                        {wish.message || "No message content available."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* COMPACT META STRIP */}
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-600">
                {wish.duration &&
                  (wish.type === "video" ||
                    wish.type === "voice" ||
                    wish.type === "audio") && (
                    <span className="rounded-md bg-white px-2 py-1 shadow-sm">
                      Duration: {formatDuration(wish.duration)}
                    </span>
                  )}
                {wish.file_size && (
                  <span className="rounded-md bg-white px-2 py-1 shadow-sm">
                    Size: {formatFileSize(wish.file_size)}
                  </span>
                )}
                {wish.file_type && (
                  <span className="rounded-md bg-white px-2 py-1 shadow-sm">
                    Type: {wish.file_type}
                  </span>
                )}
              </div>
            </div>

            {/* DETAILS PANEL (de-emphasized) */}
            <div className="lg:col-span-4">
              <div
                className="sticky top-3 rounded-xl border bg-white p-4 shadow-sm"
                style={{ borderColor: DESIGN_TOKENS.colors.coolGray }}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {wish.name}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-gray-600">
                      {wish.org || "—"}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white"
                    style={{ background: getTypeGradient(wish.type) }}
                  >
                    {getTypeIcon(wish.type, "h-3.5 w-3.5")}
                    <span className="capitalize">
                      {wish.type === "voice" ? "audio" : wish.type}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="rounded-lg border bg-white p-2"
                    style={{ borderColor: DESIGN_TOKENS.colors.coolGray }}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
                      <Calendar className="h-3.5 w-3.5 text-[#0606bc]" />
                      <span className="font-medium">Date</span>
                    </div>
                    <time className="mt-0.5 block text-[11px] text-gray-600">
                      {new Date(wish.created_at).toLocaleDateString()}
                    </time>
                  </div>

                  <div
                    className="rounded-lg border bg-white p-2"
                    style={{ borderColor: DESIGN_TOKENS.colors.coolGray }}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
                      <MapPin className="h-3.5 w-3.5 text-[#0606bc]" />
                      <span className="font-medium">Location</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-gray-600">
                      {wish.city || "—"}
                    </div>
                  </div>
                </div>

                {wish.message && wish.type !== "text" && (
                  <div
                    className="mt-3 rounded-lg border bg-white p-3"
                    style={{ borderColor: DESIGN_TOKENS.colors.coolGray }}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-800">
                      <MessageSquare className="h-4 w-4 text-[#0606bc]" />
                      Personal Note
                    </div>
                    <p className="line-clamp-6 whitespace-pre-wrap text-[13px] leading-relaxed text-gray-700">
                      {wish.message}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {shareUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="rounded-lg text-xs"
                      style={{
                        borderColor: DESIGN_TOKENS.colors.brandBlue,
                        color: DESIGN_TOKENS.colors.brandBlue,
                      }}
                    >
                      {copied ? (
                        <Check className="mr-1.5 h-4 w-4" />
                      ) : (
                        <Share2 className="mr-1.5 h-4 w-4" />
                      )}
                      {copied ? "Link Copied" : "Copy Link"}
                    </Button>
                  )}
                  {canDownload && (
                    <a href={wish.file_url!} download className="inline-flex">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs"
                        style={{ borderColor: DESIGN_TOKENS.colors.coolGray }}
                      >
                        <Download className="mr-1.5 h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onClose}
                    className="rounded-lg text-xs text-white"
                    style={{ backgroundColor: DESIGN_TOKENS.colors.brandBlue }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* =========================================================
   MAIN LIST (aligned to "highlights" spacing & bg)
   ========================================================= */
export const WishesWall = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [previewWish, setPreviewWish] = useState<Submission | null>(null);
  const [loadMoreCount, setLoadMoreCount] = useState(6); // start at 6

  const {
    data: wishes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["approved-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Submission[];
    },
    retry: 2,
  });

  // Reset to 6 items whenever search or filter changes
  useEffect(() => {
    setLoadMoreCount(6);
  }, [searchTerm, activeFilter]);

  const handlePreview = useCallback(
    (wish: Submission) => setPreviewWish(wish),
    []
  );
  const handleClosePreview = useCallback(() => setPreviewWish(null), []);

  const filteredWishes = useMemo(() => {
    const f = wishes.filter((w) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        w.name.toLowerCase().includes(q) ||
        (w.message ?? "").toLowerCase().includes(q) ||
        (w.org ?? "").toLowerCase().includes(q);

      const normType =
        w.type === "photo" ? "image" : w.type === "voice" ? "audio" : w.type;

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "photo" &&
          (normType === "image" || w.type === "post")) ||
        (activeFilter === "audio" &&
          (normType === "audio" || w.type === "voice")) ||
        (activeFilter === "video" && normType === "video") ||
        (activeFilter === "text" && normType === "text");

      return matchesSearch && matchesFilter;
    });

    return f.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [wishes, searchTerm, activeFilter]);

  const displayedWishes = filteredWishes.slice(0, loadMoreCount);

  const loadMore = useCallback(() => {
    setLoadMoreCount((p) => p + 6);
  }, []);

  const handleSetFilter = (key: string) => {
    setActiveFilter(key);
  };
  const handleSearchChange = (v: string) => {
    setSearchTerm(v);
  };

  return (
    <section
      id="wishes"
      className="pb-20 pt-40 bg-gradient-to-br from-[#faf200]/20 via-white to-[#0606bc]/10 relative overflow-hidden"
      aria-labelledby="wishes-heading"
      style={{ background: DESIGN_TOKENS.gradients.section }}
    >
      {/* Decorative blobs (match highlights) */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-[#0606bc]/20 to-[#FF6B6B]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-[#faf200]/20 to-[#FF6B6B]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-[#FF6B6B]/15 to-[#0606bc]/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <Badge className="mx-auto mb-4 bg-gradient-to-r from-[#0606bc] to-[#FF6B6B] text-white px-4 py-1.5 text-sm font-semibold border-0">
            Birthday Wishes Wall
          </Badge>
          <h2
            id="wishes-heading"
            className="text-4xl md:text-6xl font-outfit font-bold mb-4 bg-gradient-to-r from-[#0606bc] to-[#0A0A2E] bg-clip-text text-transparent"
          >
            Heartfelt Messages &amp; Wishes
          </h2>
          <p className="text-lg md:text-xl text-[#333333] max-w-4xl mx-auto leading-relaxed">
            Here you can explore warm birthday wishes for our Founder — a
            collection of love, memories, and tributes shared by colleagues,
            friends, and admirers from around the world.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, message, or organization..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                aria-label="Search wishes"
                className="h-11 rounded-lg pl-10 pr-4 text-base focus-visible:ring-0"
                style={{ borderColor: DESIGN_TOKENS.colors.coolGray }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <div className="flex items-center gap-2 self-start lg:self-auto">
                <Filter className="h-4 w-4 text-[#0606bc]" />
                <span className="text-sm font-medium text-[#333333]">
                  Filter by:
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((f) => {
                  const Icon = f.icon;
                  const active = activeFilter === f.key;
                  return (
                    <Button
                      key={f.key}
                      variant={active ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSetFilter(f.key)}
                      aria-pressed={active}
                      className={`h-10 rounded-lg px-4 font-medium ${
                        active ? "text-white shadow-lg" : "text-gray-700"
                      }`}
                      style={
                        active
                          ? {
                              backgroundColor: DESIGN_TOKENS.colors.brandBlue,
                              borderColor: DESIGN_TOKENS.colors.brandBlue,
                            }
                          : { borderColor: DESIGN_TOKENS.colors.coolGray }
                      }
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {f.label}
                    </Button>
                  );
                })}
                {(searchTerm || activeFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setActiveFilter("all");
                      setLoadMoreCount(6);
                    }}
                    className="h-10 rounded-lg"
                    style={{
                      borderColor: DESIGN_TOKENS.colors.brandBlue,
                      color: DESIGN_TOKENS.colors.brandBlue,
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Result count */}
        {!isLoading && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-sm text-[#333333]"
            aria-live="polite"
          >
            Showing {displayedWishes.length} of {filteredWishes.length} wishes
            {searchTerm && ` for "${searchTerm}"`}
            {activeFilter !== "all" &&
              ` • ${filters.find((x) => x.key === activeFilter)?.label}`}
          </motion.p>
        )}

        {/* Loading */}
        {isLoading && (
          <motion.div
            className="py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center">
              <Loader className="mb-4 h-8 w-8 animate-spin text-[#0606bc]" />
              <p className="text-sm text-[#333333]">
                Loading heartfelt wishes…
              </p>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        {!isLoading && !error && displayedWishes.length > 0 && (
          <motion.div
            className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
            layout
          >
            <AnimatePresence>
              {displayedWishes.map((wish) => (
                <WishCard key={wish.id} wish={wish} onPreview={handlePreview} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty */}
        {!isLoading && !error && filteredWishes.length === 0 && (
          <motion.div
            className="py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card
              className="mx-auto max-w-md rounded-xl border-2 border-dashed"
              style={{
                borderColor: DESIGN_TOKENS.colors.coolGray,
                background: DESIGN_TOKENS.colors.offWhite,
              }}
            >
              <CardContent className="p-8">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: DESIGN_TOKENS.colors.coolGray }}
                >
                  <MessageSquare className="h-6 w-6 text-[#0606bc]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#333333]">
                  No wishes found
                </h3>
                <p className="mb-4 text-sm text-[#333333]">
                  {searchTerm || activeFilter !== "all"
                    ? "No results match your search criteria. Try adjusting your search or filters."
                    : "Approved wishes will appear here soon. Check back later!"}
                </p>
                {(searchTerm || activeFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setActiveFilter("all");
                      setLoadMoreCount(6);
                    }}
                    className="rounded-lg"
                    style={{
                      borderColor: DESIGN_TOKENS.colors.brandBlue,
                      color: DESIGN_TOKENS.colors.brandBlue,
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* View More */}
        {displayedWishes.length < filteredWishes.length && (
          <motion.div
            className="mt-2 flex flex-col items-center justify-center gap-1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={loadMore}
              className="rounded-lg px-8 py-2 text-base font-medium shadow-lg transition-all hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: DESIGN_TOKENS.colors.brandBlue,
                color: "white",
              }}
            >
              View More
            </Button>
            <span className="text-xs text-[#333333]/70">
              {filteredWishes.length - displayedWishes.length} more
            </span>
          </motion.div>
        )}

        {/* Preview */}
        <PreviewDialog
          wish={previewWish}
          open={!!previewWish}
          onClose={handleClosePreview}
        />
      </div>
    </section>
  );
};
