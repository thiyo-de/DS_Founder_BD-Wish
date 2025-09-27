import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { ShareWish } from "@/components/ShareWish";
import { WishesWall } from "@/components/WishesWall";
import { Highlights } from "@/components/Highlights";
import { Awards } from "@/components/Awards";
import { Footer } from "@/components/Footer";
import Hero from "@/components/Hero";
import HeroMobile from "@/components/HeroMobile";
import { ShareWishPopup } from "@/components/ShareWishPopup";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Index = () => {
  // "boot" gating: show popup first on first session visit
  const [siteReady, setSiteReady] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Wrap all content to toggle inert + pointer events while modal is open
  const appContentRef = useRef<HTMLDivElement | null>(null);

  // On mount: if not seen this session, show popup and DON'T render site yet.
  useEffect(() => {
    const seen = sessionStorage.getItem("popupSeen");
    if (seen) {
      setSiteReady(true);
      setShowPopup(false);
    } else {
      setSiteReady(false); // hide site
      setShowPopup(true); // show popup immediately
    }
  }, []);

  // When modal is open AND site is visible, block interactions/scroll on the page wrapper
  useEffect(() => {
    const el = appContentRef.current;
    if (!el) return;

    const inertEl = el as HTMLElement & { inert?: boolean };
    const prevOverflow = el.style.overflow;
    const prevPointer = el.style.pointerEvents;

    if (siteReady && showPopup) {
      inertEl.inert = true; // block focus/tab
      el.setAttribute("aria-hidden", "true");
      el.style.pointerEvents = "none"; // block clicks/gestures
      el.style.overflow = "hidden"; // block any nested scrollers
    } else {
      inertEl.inert = false;
      el.removeAttribute("aria-hidden");
      el.style.pointerEvents = prevPointer || "";
      el.style.overflow = prevOverflow || "";
    }

    return () => {
      inertEl.inert = false;
      el.removeAttribute("aria-hidden");
      el.style.pointerEvents = prevPointer || "";
      el.style.overflow = prevOverflow || "";
    };
  }, [siteReady, showPopup]);

  // Called when popup is closed (via X or successful submit)
  const handleClosePopup = () => {
    sessionStorage.setItem("popupSeen", "true");
    setShowPopup(false);
    setSiteReady(true); // now render the site
  };

  const FloatingButton = () => (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring" }}
    >
      <Button
        onClick={() => setShowPopup(true)}
        className="rounded-full h-14 w-14 bg-gradient-to-r from-[#0606bc] to-[#FF6B6B] shadow-lg hover:shadow-xl transition-all duration-300"
        size="icon"
        aria-label="Open Share Wish popup"
      >
        <Heart className="h-6 w-6" fill="white" />
      </Button>
    </motion.div>
  );

  return (
    <>
      {/* On first visit (this session), only render the popup. After close, render the site. */}
      {siteReady && (
        <div
          ref={appContentRef}
          id="app-content"
          className="min-h-screen bg-background"
        >
          <Header />

          <main>
            {/* Desktop / Large screens (≥1024px) */}
            <div className="hidden lg:block">
              <Hero />
            </div>

            {/* Mobile Hero — only visible on sm–md (640px–1023px) */}
            <div className="block lg:hidden">
              <HeroMobile />
            </div>

            {/* Content sections */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <About />
              <ShareWish />
              <WishesWall />
              <Highlights />
              <Awards />
            </motion.div>
          </main>

          <Footer />

          {/* Floating action button to reopen popup */}
          <FloatingButton />
        </div>
      )}

      {/* Popup lives outside the content wrapper */}
      <ShareWishPopup isOpen={showPopup} onClose={handleClosePopup} />
    </>
  );
};

export default Index;
