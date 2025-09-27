import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import "./Hero.css";

import S_img from "../Slideshow/Banner1 copy.jpg";
import S_img_2 from "../Slideshow/Banner2 copy.jpg";
import S_img_3 from "../Slideshow/Banner3 copy.jpg";
import S_img_4 from "../Slideshow/Banner4 copy.jpg";

/* ---------------- Types ---------------- */
export type Slide = {
  id: string | number;
  title: string;
  region: string;
  description: string;
  image: string;
};

type HeroProps = {
  slides?: Slide[];
  /** milliseconds per slide; must be >= 1000 to autoplay */
  autoPlayMs?: number;
  initialIndex?: number;
  /** if true, will pause on hover/focus (default false = always autoplay) */
  pauseOnHover?: boolean;
};

/* ---------------- Demo Slides ---------------- */
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

/* ---------------- Utility ---------------- */
const mod = (n: number, m: number) => ((n % m) + m) % m;

/* ---------------- Component ---------------- */
export default function Hero({
  slides = DEMO_SLIDES,
  autoPlayMs = 6000,
  initialIndex = 0,
  pauseOnHover = false, // default: ALWAYS autoplay
}: HeroProps) {
  // Never early-return before hooks; make slides safe.
  const effectiveSlides = slides && slides.length > 0 ? slides : DEMO_SLIDES;
  const safeStart = mod(initialIndex, effectiveSlides.length);

  const [index, setIndex] = useState(safeStart);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlayMs >= 1000);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const activeSlide = effectiveSlides[index];
  const isImageLoaded = loadedImages.has(String(activeSlide.id));

  /* --------- Image Loading ---------- */
  const handleImageLoad = useCallback((id: string | number) => {
    const key = String(id);
    setLoadedImages((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  useEffect(() => {
    // Preload
    effectiveSlides.forEach((s) => {
      const img = new Image();
      img.src = s.image;
      img.onload = () => handleImageLoad(s.id);
      if (import.meta.env.MODE !== "production") {
        img.onerror = () => console.warn(`Failed to load image: ${s.image}`);
      }
    });
  }, [effectiveSlides, handleImageLoad]);

  /* --------- Autoplay ---------- */
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setupTimer = useCallback(() => {
    clearTimer();
    if (!isAutoPlaying || autoPlayMs < 1000 || effectiveSlides.length < 2) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => mod(prev + 1, effectiveSlides.length));
    }, autoPlayMs);
  }, [isAutoPlaying, autoPlayMs, effectiveSlides.length, clearTimer]);

  useEffect(() => {
    setupTimer();
    return clearTimer;
  }, [setupTimer, clearTimer, autoPlayMs, effectiveSlides.length, isAutoPlaying]);

  /* --------- Navigation ---------- */
  const prevSlide = useCallback(() => {
    setIndex((prev) => mod(prev - 1, effectiveSlides.length));
  }, [effectiveSlides.length]);

  const nextSlide = useCallback(() => {
    setIndex((prev) => mod(prev + 1, effectiveSlides.length));
  }, [effectiveSlides.length]);

  const goToSlide = useCallback(
    (i: number) => setIndex(mod(i, effectiveSlides.length)),
    [effectiveSlides.length]
  );

  const toggleAutoPlay = () => setIsAutoPlaying((s) => !s);

  /* --------- Touch ---------- */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const delta = touchStartX - touchEndX;
    const swipeThreshold = 50;
    if (delta > swipeThreshold) nextSlide();
    if (delta < -swipeThreshold) prevSlide();
    setTouchStartX(null);
    setTouchEndX(null);
  };

  /* --------- Keyboard ---------- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        prevSlide();
        break;
      case "ArrowRight":
        nextSlide();
        break;
      case " ":
      case "Spacebar":
        e.preventDefault();
        toggleAutoPlay();
        break;
      default:
        break;
    }
  };

  /* --------- Hover/focus pause (optional) ---------- */
  const hoverHandlers = pauseOnHover
    ? {
        onMouseEnter: clearTimer,
        onMouseLeave: setupTimer,
        onFocus: clearTimer,
        onBlur: setupTimer,
      }
    : {};

  /* --------- Visible Thumbnails (paged: 3 at a time) ---------- */
  const visibleThumbs = useMemo(() => {
    const L = effectiveSlides.length;
    if (L === 0) return [];
    const groupStart = Math.floor(index / 3) * 3; // pages of 3
    const items: { slide: Slide; originalIndex: number }[] = [];
    for (let k = 0; k < 3; k++) {
      const oi = (groupStart + k) % L;
      items.push({ slide: effectiveSlides[oi], originalIndex: oi });
    }
    return items;
  }, [effectiveSlides, index]);

  return (
    <section
      className="slideshow-hero"
      ref={containerRef}
      role="region"
      aria-label="Featured destinations carousel"
      aria-roledescription="carousel"
      aria-live="polite"
      tabIndex={-1} /* prevents page jumping to hero on updates */
      onKeyDown={onKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...hoverHandlers}
    >
      {/* Background crossfade */}
      <div className="hero-bg-container" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide.id}
            src={activeSlide.image}
            className={`hero-bg ${isImageLoaded ? "loaded" : "loading"}`}
            alt=""
            /* Only fade; let CSS handle the zoom to avoid transform conflicts */
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
            onLoad={() => handleImageLoad(activeSlide.id)}
            loading="eager"
            decoding="async"
          />
        </AnimatePresence>
        <div className="hero-overlay" />

        {/* Progress Bar */}
        <div className="hero-progress">
          <motion.div
            className="progress-bar"
            key={`progress-${activeSlide.id}-${isAutoPlaying}`}
            initial={{ width: 0 }}
            animate={{ width: isAutoPlaying ? "100%" : "0%" }}
            transition={{
              duration: isAutoPlaying ? autoPlayMs / 1000 : 0,
              ease: "linear",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="hero-content">
        {/* Text */}
        <div className="hero-left">
          <motion.p
            key={`region-${activeSlide.id}`}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-region"
          >
            {activeSlide.region}
          </motion.p>

        <motion.h1
            key={`title-${activeSlide.id}`}
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hero-title"
          >
            {activeSlide.title}
          </motion.h1>

          <motion.p
            key={`desc-${activeSlide.id}`}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="hero-description"
          >
            {activeSlide.description}
          </motion.p>
        </div>

        {/* Thumbnails (paged 3 at a time) */}
        <div
          className="hero-cards-horizontal paged"
          ref={cardsContainerRef}
          aria-label="Slide thumbnails"
        >
          {visibleThumbs.map(({ slide, originalIndex }, i) => (
            <motion.button
              key={`${slide.id}-${originalIndex}`}
              type="button"
              className={`horizontal-card ${originalIndex === index ? "active" : ""}`}
              onClick={() => goToSlide(originalIndex)}
              whileHover={{ scale: originalIndex === index ? 1 : 1.02 }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              aria-current={originalIndex === index}
              aria-label={`Go to ${slide.title}`}
            >
              <img
                src={slide.image}
                alt=""
                onLoad={() => handleImageLoad(slide.id)}
                loading="lazy"
                decoding="async"
              />
              <span className="card-content">
                <span className="card-region">{slide.region}</span>
                <span className="card-title">{slide.title}</span>
              </span>
              {originalIndex === index && (
                <span className="active-indicator" aria-hidden="true" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="hero-controls" aria-label="Carousel controls">
        <button onClick={prevSlide} className="nav-btn" aria-label="Previous">
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={toggleAutoPlay}
          className="nav-btn play-pause"
          aria-pressed={isAutoPlaying}
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button onClick={nextSlide} className="nav-btn" aria-label="Next">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Counter */}
      <div className="hero-counter" aria-live="off">
        {String(index + 1).padStart(2, "0")} / {String(effectiveSlides.length).padStart(2, "0")}
      </div>

      {/* Mobile dots */}
      <div
        className="hero-mobile-indicators"
        role="tablist"
        aria-label="Slide indicators"
      >
        {effectiveSlides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            className={`mobile-indicator ${i === index ? "active" : ""}`}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
