import React, {
  ReactNode,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

/* ---------------- Types ---------------- */

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
}) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;

  /** vertical gap between cards (px) */
  itemDistance?: number;

  /** per-card scale delta (0.03 = 3%) */
  itemScale?: number;

  /** stacked offset between pinned cards (px) */
  itemStackDistance?: number;

  /** where cards “pin” in viewport (can be % or px) */
  stackPosition?: string | number;

  /** where scaling ends (can be % or px) */
  scaleEndPosition?: string | number;

  /** base scale once card reaches stack position */
  baseScale?: number;

  /** rotation per index while stacking (deg) */
  rotationAmount?: number;

  /** optional blur per depth while stacked (px) */
  blurAmount?: number;

  /** use window scroll instead of internal scroller */
  useWindowScroll?: boolean;

  /** callback when last item is pinned (once per pass) */
  onStackComplete?: () => void;
}

type TransformState = {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
};

type ScrollData = {
  scrollTop: number;
  vh: number;
};

type CSSPropertiesWithVars = React.CSSProperties & {
  /** CSS custom property used by the sticky timeline line */
  ["--stack-pos"]?: string;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const round3 = (n: number) => Math.round(n * 1000) / 1000;
const round2 = (n: number) => Math.round(n * 100) / 100;

const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function")
    return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.04,
  itemStackDistance = 36,
  stackPosition = "25%",
  scaleEndPosition = "12%",
  baseScale = 0.9,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  onStackComplete,
}) => {
  /** Root */
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  /** Cards & cached geometry */
  const cardsRef = useRef<HTMLElement[]>([]);
  const cardTopsRef = useRef<number[]>([]); // absolute Y (page) of each card top
  const lastTransformsRef = useRef<Map<number, TransformState>>(new Map());

  /** Scroll + RAF */
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const latestScrollRef = useRef<number>(0);
  const tickingRef = useRef<boolean>(false);

  /** State flags */
  const stackCompletedRef = useRef<boolean>(false);
  const reducedMotionRef = useRef<boolean>(false);

  const parsePos = useCallback((value: string | number, vh: number) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * vh;
    }
    return Number(value);
  }, []);

  /** Read-only snapshot of current scroll & viewport */
  const getScrollData = useCallback<() => ScrollData>(() => {
    if (typeof window === "undefined") return { scrollTop: 0, vh: 0 };
    return { scrollTop: latestScrollRef.current, vh: window.innerHeight };
  }, []);

  /** Measure absolute top for each card once (and on resize) */
  const measureCards = useCallback(() => {
    if (typeof window === "undefined") return;

    const root: Document | HTMLElement | null = useWindowScroll
      ? document
      : scrollerRef.current;

    const cards = Array.from(
      root?.querySelectorAll(".scroll-stack-card") ?? []
    ) as HTMLElement[];

    cardsRef.current = cards;

    const scrollY = window.scrollY || 0;
    const tops: number[] = [];

    for (let i = 0; i < cards.length; i++) {
      const el = cards[i];
      const rect = el.getBoundingClientRect();
      // absolute page Y for card top:
      const top = scrollY + rect.top;
      tops.push(top);

      // static styling (set once)
      el.style.willChange = "transform, filter";
      el.style.transformOrigin = "top center";
      el.style.backfaceVisibility = "hidden";

      // spacing to prevent overlap when transforms are disabled
      if (i < cards.length - 1) {
        el.style.marginBottom = `${itemDistance}px`;
      }
    }
    cardTopsRef.current = tops;
  }, [itemDistance, useWindowScroll]);

  /** Core transform step — uses cached geometry only */
  const updateTransforms = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length || typeof window === "undefined") return;

    // if user prefers reduced motion, skip transforms entirely
    if (reducedMotionRef.current) {
      for (let i = 0; i < cards.length; i++) {
        const el = cards[i];
        el.style.transform = "none";
        el.style.filter = "";
      }
      return;
    }

    const { scrollTop, vh } = getScrollData();
    const stackPosPx = parsePos(stackPosition, vh);
    const scaleEndPx = parsePos(scaleEndPosition, vh);

    const endEl = document.querySelector(
      ".scroll-stack-end"
    ) as HTMLElement | null;
    const endTop = endEl
      ? endEl.getBoundingClientRect().top + window.scrollY
      : Number.POSITIVE_INFINITY;

    for (let i = 0; i < cards.length; i++) {
      const el = cards[i];
      const cardTop = cardTopsRef.current[i] ?? 0;

      const triggerStart = cardTop - stackPosPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPx;

      const pinStart = triggerStart;
      const pinEnd = endTop - vh / 2;

      // scale progress
      const p =
        triggerEnd === triggerStart
          ? 1
          : clamp(
              (scrollTop - triggerStart) / (triggerEnd - triggerStart),
              0,
              1
            );

      const targetScale = baseScale + i * itemScale; // final scale at stack
      const scale = round3(1 - p * (1 - targetScale));
      const rotation = round2(rotationAmount ? i * rotationAmount * p : 0);

      // translate (pin behavior)
      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isPinned) {
        translateY = scrollTop - cardTop + stackPosPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPosPx + itemStackDistance * i;
      }
      translateY = round2(translateY);

      // optional blur by depth
      let blur = 0;
      if (blurAmount > 0) {
        let topCardIdx = 0;
        for (let j = 0; j < cards.length; j++) {
          const jTop = cardTopsRef.current[j];
          const jStart = jTop - stackPosPx - itemStackDistance * j;
          if (scrollTop >= jStart) topCardIdx = j;
        }
        if (i < topCardIdx) {
          blur = (topCardIdx - i) * blurAmount;
        }
      }
      blur = round2(blur);

      // diff check to avoid redundant styles
      const last = lastTransformsRef.current.get(i);
      if (
        !last ||
        Math.abs(last.translateY - translateY) > 0.1 ||
        Math.abs(last.scale - scale) > 0.001 ||
        Math.abs(last.rotation - rotation) > 0.1 ||
        Math.abs(last.blur - blur) > 0.1
      ) {
        el.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
        el.style.filter = blur > 0 ? `blur(${blur}px)` : "";
        lastTransformsRef.current.set(i, { translateY, scale, rotation, blur });
      }

      // last-card completion
      if (i === cards.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!inView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    }
  }, [
    baseScale,
    blurAmount,
    getScrollData,
    itemScale,
    itemStackDistance,
    onStackComplete,
    parsePos,
    rotationAmount,
    scaleEndPosition,
    stackPosition,
  ]);

  /** Scroll -> schedule RAF */
  const requestTick = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    rafIdRef.current = requestAnimationFrame(() => {
      tickingRef.current = false;
      updateTransforms();
    });
  }, [updateTransforms]);

  /** Lenis + scroll subscription */
  useEffect(() => {
    if (typeof window === "undefined") return;

    reducedMotionRef.current = prefersReducedMotion();

    if (!reducedMotionRef.current) {
      if (!lenisRef.current) {
        const lenis = new Lenis({
          duration: 1.0,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          syncTouch: true,
        });

        lenis.on("scroll", ({ scroll }: { scroll: number }) => {
          latestScrollRef.current = scroll;
          requestTick();
        });

        const raf = (time: number) => {
          lenis.raf(time);
          rafIdRef.current = requestAnimationFrame(raf);
        };
        rafIdRef.current = requestAnimationFrame(raf);

        lenisRef.current = lenis;
      } else {
        lenisRef.current.on("scroll", ({ scroll }: { scroll: number }) => {
          latestScrollRef.current = scroll;
          requestTick();
        });
      }
    } else {
      // fallback: native scroll listener when motion is reduced
      const onScroll = () => {
        latestScrollRef.current = window.scrollY || 0;
        requestTick();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    latestScrollRef.current = window.scrollY || 0;
    requestTick();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [requestTick]);

  /** Measure on mount + resize (debounced) */
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const lastTransformsMap = lastTransformsRef.current;

    const measureAndUpdate = () => {
      measureCards();
      latestScrollRef.current = window.scrollY || 0;
      updateTransforms();
    };

    measureAndUpdate();

    let rId: number | null = null;
    const onResize = () => {
      if (rId) cancelAnimationFrame(rId);
      rId = requestAnimationFrame(measureAndUpdate);
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);

    // also re-measure once images/fonts settle
    const settleTimeout = window.setTimeout(measureAndUpdate, 300);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (rId) cancelAnimationFrame(rId);
      window.clearTimeout(settleTimeout);

      cardsRef.current = [];
      cardTopsRef.current = [];
      lastTransformsMap.clear();
      stackCompletedRef.current = false;
    };
  }, [measureCards, updateTransforms]);

  /** CSS var so the timeline line can lock to the stack position exactly */
  const stackPosString = useMemo(
    () => (typeof stackPosition === "string" ? stackPosition : `${stackPosition}px`),
    [stackPosition]
  );

  const scrollerStyle = useMemo<CSSPropertiesWithVars>(
    () => ({ "--stack-pos": stackPosString }),
    [stackPosString]
  );

  const scrollerClass = useMemo(
    () => `scroll-stack-scroller ${className}`.trim(),
    [className]
  );

  return (
    <div
      className={scrollerClass}
      ref={scrollerRef}
      data-window-scroll={useWindowScroll ? "true" : "false"}
      style={scrollerStyle}
    >
      <div className="scroll-stack-inner">
        {/* Optional sticky line:
        <div className="scroll-stack-timeline" /> */}
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
