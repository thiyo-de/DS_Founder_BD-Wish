import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { Play, HeartPulse, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FOUNDER_IMAGE from "../Assets/Iyya.png";
import "./Hero.css";

type HeroProps = { imageSrc?: string; imageAlt?: string };

const easeOutExpo = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

export const Hero = ({
  imageSrc,
  imageAlt = "Founder portrait",
}: HeroProps) => {
  const prefersReducedMotion = useReducedMotion();
  const src = imageSrc ?? FOUNDER_IMAGE;

  return (
    <section className="hero-slim pt-[var(--nav-h,64px)]">
      <div className="blur-pill blur-pill--tr" aria-hidden="true" />
      <div className="blur-pill blur-pill--bl" aria-hidden="true" />
      <div className="blur-pill blur-pill--tl" aria-hidden="true" />
      <div className="blur-pill blur-pill--br" aria-hidden="true" />

      {/* BIG BACKGROUND TITLE (kept subtle) */}
      <div className="bg-headline" aria-hidden="true">
        <h1>
          <span className="line">A Founder, A Visionary</span>
          <span className="line">A Living Legacy</span>
          <p>
            From Education to Healthcare, From Hospitality to Pharma — he
            dreamed, he built, he inspired. 80 not just in age, but in wisdom,
            courage, and service.
          </p>
        </h1>
      </div>

      <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
        <motion.div
          className="container-custom relative z-10 py-14 md:py-20"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25, margin: "-10% 0px -10% 0px" }}
        >
          <div className="hero-stage">
            {/* LEFT (md+) */}
            <motion.div
              className="left-stack hidden md:block"
              variants={fadeUp}
            >
              <aside className="info-card card elev-2 hover-lift text-center">
                <h3 className="info-title">
                  A Founder, A Visionary, A Living Legacy
                </h3>
                <p className="info-text">
                  From Education to Healthcare, From Hospitality to Pharma — he
                  dreamed, he built, he inspired. 80 not just in age, but in
                  wisdom, courage, and service.
                </p>

                {/* Metrics row (md only) */}
                <div className="metrics-row md:flex lg:hidden justify-center">
                  <div className="metric-chip">
                    <div className="metric-icon bg-primary/10">
                      <HeartPulse className="w-5 h-5 text-primary" />
                    </div>
                    <div className="metric-meta">
                      <span className="metric-label">Wishes</span>
                      <strong className="metric-value">78+ Wishes</strong>
                    </div>
                  </div>
                  <div className="metric-chip">
                    <div
                      className="metric-icon"
                      style={{ background: "#FAF200" }}
                    >
                      <BarChart3
                        className="w-5 h-5"
                        style={{ color: "#0606BC" }}
                      />
                    </div>
                    <div className="metric-meta">
                      <span className="metric-label">Industries</span>
                      <strong className="metric-value">125 Industries</strong>
                    </div>
                  </div>
                </div>

                {/* CTAs centered */}
                <div className="info-cta justify-center">
                  <Button
                    className="btn-hero"
                    onClick={() =>
                      document
                        .querySelector("#share")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    aria-label="Share your wish"
                  >
                    Share Wish
                  </Button>
                  <Button
                    variant="outline"
                    className="btn-hero-outline"
                    onClick={() =>
                      document
                        .querySelector("#highlights")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    aria-label="Watch highlights"
                  >
                    <Play className="mr-2 h-5 w-5" /> Highlights
                  </Button>
                </div>
              </aside>
            </motion.div>

            {/* CENTER (portrait + optional chips on lg+) */}
            <motion.div className="portrait-col" variants={fadeUp}>
              <div className="portrait-wrap">
                <div className="portrait-chip chip-left">
                  <div className="chip-icon bg-primary/10">
                    <HeartPulse className="w-5 h-5 text-primary" />
                  </div>
                  <div className="chip-meta">
                    <span className="chip-label">Wishes</span>
                    <strong className="chip-value" style={{ color: "#0606BC" }}>
                      78+ Wishes
                    </strong>
                  </div>
                </div>

                <div className="portrait-chip chip-right">
                  <div className="chip-icon" style={{ background: "#FAF200" }}>
                    <BarChart3
                      className="w-5 h-5"
                      style={{ color: "#0606BC" }}
                    />
                  </div>
                  <div className="chip-meta">
                    <span className="chip-label">Industries</span>
                    <strong className="chip-value" style={{ color: "#0606BC" }}>
                      125 Industries
                    </strong>
                  </div>
                </div>

                <img
                  src={src}
                  alt={imageAlt}
                  className="portrait-img fade-bottom"
                  loading="eager"
                />
              </div>
            </motion.div>

            {/* RIGHT (md+) — Simplified “85th Birthday” */}
            <motion.aside
              className="right-stack hidden md:grid"
              variants={fadeUp}
            >
              <div className="card elev-2 hover-lift p-6 text-center birthday-card birthday-card--lg">
                <motion.div
                  className="birthday-badge"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  aria-label="Eighty Fifth Birthday"
                >
                  <span className="birthday-number birthday-number--lg">
                    85
                  </span>
                  <span className="birthday-suffix birthday-suffix--lg">
                    th
                  </span>
                </motion.div>

                <div className="birthday-title birthday-title--lg">
                  BIRTHDAY
                </div>
              </div>
            </motion.aside>
          </div>

          {/* MOBILE STACK */}
          <div className="md:hidden mt-6 space-y-4">
            <div className="card elev-1 p-4 text-center">
              <h3 className="info-title">A legacy of health & opportunity</h3>
              <p className="info-text">
                Share your wish and explore milestones that shaped thousands of
                lives.
              </p>
            </div>

            <div className="metrics-row-mobile">
              <div className="metric-chip">
                <div className="metric-icon bg-primary/10">
                  <HeartPulse className="w-5 h-5 text-primary" />
                </div>
                <div className="metric-meta">
                  <span className="metric-label">Wishes</span>
                  <strong className="metric-value">78+ Wishes</strong>
                </div>
              </div>
              <div className="metric-chip">
                <div className="metric-icon" style={{ background: "#FAF200" }}>
                  <BarChart3 className="w-5 h-5" style={{ color: "#0606BC" }} />
                </div>
                <div className="metric-meta">
                  <span className="metric-label">Industries</span>
                  <strong className="metric-value">125 Industries</strong>
                </div>
              </div>
            </div>

            <div className="info-cta info-cta--mobile">
              <Button
                className="btn-hero"
                onClick={() =>
                  document
                    .querySelector("#share")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Share Wish
              </Button>
              <Button
                variant="outline"
                className="btn-hero-outline"
                onClick={() =>
                  document
                    .querySelector("#highlights")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Play className="mr-2 h-5 w-5" /> Highlights
              </Button>
            </div>

            {/* MOBILE: Simplified “85th Birthday” */}
            <motion.div className="card elev-1 p-6 text-center birthday-card">
              <motion.div
                className="birthday-badge"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                aria-label="Eighty Fifth Birthday"
              >
                <span className="birthday-number">85</span>
                <span className="birthday-suffix">th</span>
              </motion.div>

              <div className="birthday-title">BIRTHDAY</div>
            </motion.div>
          </div>
        </motion.div>
      </MotionConfig>
    </section>
  );
};

export default Hero;
