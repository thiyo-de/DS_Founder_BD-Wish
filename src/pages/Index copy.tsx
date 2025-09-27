import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { ShareWish } from "@/components/ShareWish";
import { WishesWall } from "@/components/WishesWall";
import { Highlights } from "@/components/Highlights";
import { Awards } from "@/components/Awards";
import { Footer } from "@/components/Footer";
import Hero from "@/components/Hero";
import HeroMobile from "@/components/HeroMobile";

const Index = () => (
  <div className="min-h-screen bg-background">
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
  </div>
);

export default Index;
