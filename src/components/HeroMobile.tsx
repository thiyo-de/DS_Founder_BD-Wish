import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import "./HeroMobile.css";

import S_img from "../Slideshow/Banner1 copy.jpg";
import S_img_2 from "../Slideshow/Banner2 copy.jpg";
import S_img_3 from "../Slideshow/Banner3 copy.jpg";
import S_img_4 from "../Slideshow/Banner4 copy.jpg";

/* ---------- Types ---------- */
export type Slide = {
  id: string | number;
  title: string;
  region: string;
  description: string;
  image: string;
};

type HeroMobileProps = {
  slides?: Slide[];
  autoPlayMs?: number; // default 6000
  initialIndex?: number; // default 0
};

/* ---------- Demo Slides ---------- */
const DEMO_SLIDES: Slide[] = [
  {
    id: 1,
    title: "Chancellor’s Vision",
    region: "Shri. A. Srinivasan – Founder",
    description:
      "Building without limits — a future-ready India where innovation thrives, communities flourish, and every dream finds wings.",
    image: S_img,
  },
  {
    id: 2,
    title: "The Growth Engine",
    region: "Dhanalakshmi Srinivasan Group",
    description:
      "From education to healthcare, agriculture to energy, a multi-sector force powering prosperity and transforming lives across India.",
    image: S_img_2,
  },
  {
    id: 3,
    title: "Transforming Lives",
    region: "Education, Healthcare & Empowerment",
    description:
      "Lakhs empowered with knowledge, compassion-driven hospitals, farmers supported with fair returns — growth that uplifts generations.",
    image: S_img_3,
  },
  {
    id: 4,
    title: "Legacy of Opportunities",
    region: "The Man Behind Millions of Success Stories",
    description:
      "A visionary leader shaping institutions and industries, creating leaders, professionals, and entrepreneurs for tomorrow.",
    image: S_img_4,
  },
];

/* ---------- Utils ---------- */
const mod = (n: number, m: number) => ((n % m) + m) % m;

/* ---------- Component ---------- */
export default function HeroMobile({
  slides = DEMO_SLIDES,
  autoPlayMs = 6000,
  initialIndex = 0,
}: HeroMobileProps) {
  const effectiveSlides = useMemo(
    () => (slides?.length ? slides : DEMO_SLIDES),
    [slides]
  );

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const [index, setIndex] = useState(mod(initialIndex, effectiveSlides.length));
  const [isAutoPlaying, setIsAutoPlaying] = useState(
    !prefersReducedMotion && autoPlayMs >= 1000
  );
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Preload & mark loaded */
  useEffect(() => {
    effectiveSlides.forEach((s) => {
      const img = new Image();
      img.src = s.image;
      img.onload = () => setLoaded((p) => ({ ...p, [String(s.id)]: true }));
    });
  }, [effectiveSlides]);

  /* Pause autoplay when tab hidden */
  useEffect(() => {
    const onVis = () => (document.hidden ? clearTimer() : setupTimer());
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, autoPlayMs, effectiveSlides.length]);

  /* Keyboard shortcuts */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setIndex((p) => mod(p + 1, effectiveSlides.length));
      if (e.key === "ArrowLeft")
        setIndex((p) => mod(p - 1, effectiveSlides.length));
      if (e.code === "Space") {
        e.preventDefault();
        setIsAutoPlaying((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [effectiveSlides.length]);

  /* Autoplay */
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setupTimer = useCallback(() => {
    clearTimer();
    if (!isAutoPlaying || autoPlayMs < 1000 || effectiveSlides.length < 2)
      return;
    intervalRef.current = setInterval(
      () => setIndex((p) => mod(p + 1, effectiveSlides.length)),
      autoPlayMs
    );
  }, [isAutoPlaying, autoPlayMs, effectiveSlides.length, clearTimer]);

  useEffect(() => {
    setupTimer();
    return clearTimer;
  }, [setupTimer, clearTimer]);

  /* Swipe for main image */
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) =>
    (startX.current = e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = startX.current - e.touches[0].clientX;
    if (Math.abs(dx) > 50) {
      setIndex((p) => mod(p + (dx > 0 ? 1 : -1), effectiveSlides.length));
      startX.current = null;
    }
  };
  const onTouchEnd = () => (startX.current = null);

  /* Grab-to-drag for thumbs rail (with click-cancel on drag) */
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);
  const pointerMoved = useRef(false);

  const onThumbPointerDown = (e: React.PointerEvent) => {
    if (!thumbsRef.current) return;
    dragging.current = true;
    pointerMoved.current = false;
    dragStartX.current = e.clientX;
    scrollStartX.current = thumbsRef.current.scrollLeft;
    thumbsRef.current.setPointerCapture(e.pointerId);
    thumbsRef.current.classList.add("dragging");
  };
  const onThumbPointerMove = (e: React.PointerEvent) => {
    if (!thumbsRef.current || !dragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 3) pointerMoved.current = true;
    thumbsRef.current.scrollLeft = scrollStartX.current - dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!thumbsRef.current) return;
    dragging.current = false;
    thumbsRef.current.releasePointerCapture(e.pointerId);
    thumbsRef.current.classList.remove("dragging");
  };

  /* Keep active thumb always visible (and centered when possible) */
  const ensureActiveThumbInView = useCallback(() => {
    const rail = thumbsRef.current;
    if (!rail) return;
    const child = rail.children[index] as HTMLElement | undefined;
    if (!child) return;

    const railWidth = rail.clientWidth;
    const maxScroll = rail.scrollWidth - railWidth;

    const childCenter = child.offsetLeft + child.offsetWidth / 2;
    let target = childCenter - railWidth / 2; // center it
    if (target < 0) target = 0;
    if (target > maxScroll) target = maxScroll;

    rail.scrollTo({ left: target, behavior: "smooth" });
  }, [index]);

  useEffect(() => {
    ensureActiveThumbInView();
  }, [index, ensureActiveThumbInView]);

  // Recenter on resize (orientation change, etc.)
  useEffect(() => {
    const onResize = () => ensureActiveThumbInView();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ensureActiveThumbInView]);

  const next = () => setIndex((p) => mod(p + 1, effectiveSlides.length));
  const prev = () => setIndex((p) => mod(p - 1, effectiveSlides.length));
  const active = effectiveSlides[index];

  const handleThumbClick = (i: number) => {
    // If the user dragged the rail, ignore click to prevent accidental jump
    if (pointerMoved.current) return;
    setIndex(i);
  };

  return (
    <section
      className="slideshow-hero-mobile with-navbar"
      aria-roledescription="carousel"
      aria-label="Founder slideshow (mobile)"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Dynamic blurred background from active image */}
      <div
        className="mh-bg"
        aria-hidden="true"
        style={{ backgroundImage: `url(${active.image})` }}
      />
      <div className="mh-bg-tint" aria-hidden="true" />

      {/* 1) Image viewer */}
      <div className="mh-viewer">
        <AnimatePresence mode="wait">
          <motion.img
            key={active.id}
            src={active.image}
            alt=""
            className={`mh-img ${
              loaded[String(active.id)] ? "loaded" : "loading"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </AnimatePresence>

        {/* Progress */}
        <div className="mh-progress" aria-hidden={!isAutoPlaying}>
          <motion.div
            key={`p-${active.id}-${isAutoPlaying}`}
            className="mh-bar"
            initial={{ width: 0 }}
            animate={{ width: isAutoPlaying ? "100%" : "0%" }}
            transition={{
              duration: isAutoPlaying ? autoPlayMs / 1000 : 0,
              ease: "linear",
            }}
          />
        </div>
      </div>

      {/* 2) Text content */}
      <div className="mh-content">
        <p className="mh-region">{active.region}</p>
        <h2 className="mh-title">{active.title}</h2>
        <p className="mh-desc">{active.description}</p>
      </div>

      {/* 3) Thumbnail cards (horizontal scroller for 10+ cards) */}
      <div
        className="mh-thumbs"
        aria-label="Slide thumbnails"
        ref={thumbsRef}
        onPointerDown={onThumbPointerDown}
        onPointerMove={onThumbPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => dragging.current && endDrag(e)}
      >
        {effectiveSlides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`mh-thumb ${i === index ? "active" : ""}`}
            onClick={() => handleThumbClick(i)}
            aria-current={i === index}
            aria-label={`Go to ${s.title}`}
          >
            <img
              src={s.image}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <span className="mh-thumb-meta">
              <span className="mh-thumb-region">{s.region}</span>
              <span className="mh-thumb-title">{s.title}</span>
            </span>
          </button>
        ))}
      </div>

      {/* 4) Controllers */}
      <div className="mh-controls" role="group" aria-label="Slideshow controls">
        <button className="mh-btn" aria-label="Previous" onClick={prev}>
          <ChevronLeft size={18} />
        </button>

        <button
          className="mh-btn mh-play"
          onClick={() => setIsAutoPlaying((s) => !s)}
          aria-pressed={isAutoPlaying}
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button className="mh-btn" aria-label="Next" onClick={next}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dots (extra space above & below) */}
      <div className="mh-dots" role="tablist" aria-label="Slide indicators">
        {effectiveSlides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            className={`mh-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
