import React, { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * oCursor – global custom cursor
 * - Default: dot + ring
 * - Variants: 'default' | 'hover' | 'drag' | 'hidden'
 * - Automatically reacts to <a>, <button>, [role="button"], [data-cursor], [data-draggable]
 */
export default function OCursor() {
  const enabled = useMemo(() => {
    if (typeof window === "undefined") return false;
    const mqHover = window.matchMedia("(hover: hover)");
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    return mqHover.matches && mqFine.matches && !mqReduce.matches;
  }, []);

  const [variant, setVariant] = useState<
    "default" | "hover" | "drag" | "hidden"
  >("default");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dotX = useSpring(x, { stiffness: 1000, damping: 40, mass: 0.6 });
  const dotY = useSpring(y, { stiffness: 1000, damping: 40, mass: 0.6 });
  const ringX = useSpring(x, { stiffness: 250, damping: 28, mass: 0.9 });
  const ringY = useSpring(y, { stiffness: 250, damping: 28, mass: 0.9 });

  useEffect(() => {
    if (!enabled) return;

    // Hide native cursor only when enabled
    document.documentElement.classList.add("has-ocursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const down = () => setVariant((v) => (v === "hover" ? "drag" : "drag"));
    const up = () => setVariant((v) => (v === "drag" ? "hover" : "default"));
    const leave = () => setVariant("hidden");
    const enter = () => setVariant("default");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down, { passive: true });
    window.addEventListener("mouseup", up, { passive: true });
    window.addEventListener("mouseleave", leave, { passive: true });
    window.addEventListener("mouseenter", enter, { passive: true });

    // Auto-hover targets (snapshot list for cleanup)
    const selectors =
      'a, button, [role="button"], input[type="submit"], [data-cursor="hover"], [data-cursor-hover], [data-draggable]';
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(selectors)
    );

    const enterHover = () => setVariant("hover");
    const leaveHover = () => setVariant("default");

    for (const el of targets) {
      el.addEventListener("mouseenter", enterHover);
      el.addEventListener("mouseleave", leaveHover);
    }

    // Cleanup uses the *captured* targets array (no ref)
    return () => {
      document.documentElement.classList.remove("has-ocursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("mouseenter", enter);
      for (const el of targets) {
        el.removeEventListener("mouseenter", enterHover);
        el.removeEventListener("mouseleave", leaveHover);
      }
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize = variant === "hover" ? 44 : variant === "drag" ? 52 : 36;
  const dotSize = variant === "hover" ? 6 : 8;

  return (
    <>
      {/* trailing ring */}
      <motion.div
        className="ocursor-ring"
        style={{
          translateX: ringX,
          translateY: ringY,
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
        }}
        data-variant={variant}
        aria-hidden
      />
      {/* precise dot */}
      <motion.div
        className="ocursor-dot"
        style={{
          translateX: dotX,
          translateY: dotY,
          width: dotSize,
          height: dotSize,
          marginLeft: -dotSize / 2,
          marginTop: -dotSize / 2,
        }}
        data-variant={variant}
        aria-hidden
      />
    </>
  );
}
