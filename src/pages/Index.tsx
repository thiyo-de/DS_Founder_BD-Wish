import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { ShareWish } from "@/components/ShareWish";
import { WishesWall } from "@/components/WishesWall";
import { Highlights } from "@/components/Highlights";
import { Awards } from "@/components/Awards";
import { Footer } from "@/components/Footer";
import Hero from "@/components/Hero"; // default import

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />

    <main>
      <Hero />
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
