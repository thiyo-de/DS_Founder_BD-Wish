import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Play, Sparkles, PartyPopper, Cake } from "lucide-react";

export const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate days until birthday (example: March 15, 2024)
  const birthdayDate = new Date("2024-03-15");
  const today = new Date();
  const daysUntilBirthday = Math.ceil((birthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-diagonal">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container-modern py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative inline-block">
              <div className="w-48 h-48 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-accent rounded-full opacity-20 animate-pulse"></div>
                <div className="w-full h-full bg-gradient-hero portrait-ring flex items-center justify-center">
                  <Cake className="text-primary-foreground h-20 w-20" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-8 w-8 text-accent" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-semibold tracking-tight mb-6 text-[#0F0EB4]">
              Celebrating a Visionary Leader
            </h1>
            <p className="text-xl md:text-2xl text-body max-w-3xl mx-auto">
              Join us in honoring an extraordinary founder whose vision, dedication, and leadership 
              have inspired countless lives and transformed our organization into what it is today.
            </p>
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-6">
              <Card className="inline-flex items-center gap-3 p-4 bg-[#FEF200]/10 border-[#FEF200]/30 rounded-xl">
                <Calendar className="h-5 w-5 text-[#0F0EB4]" />
              <span className="font-outfit font-semibold text-lg">
                {daysUntilBirthday > 0 ? (
                  <>
                    <Cake className="inline h-5 w-5 mr-2" />
                    {daysUntilBirthday} days until the celebration
                  </>
                ) : daysUntilBirthday === 0 ? (
                  <>
                    <PartyPopper className="inline h-5 w-5 mr-2" />
                    Today is the big day!
                  </>
                ) : (
                  <>
                    <Sparkles className="inline h-5 w-5 mr-2" />
                    Celebrating our founder
                  </>
                )}
                </span>
              </Card>
              
              {/* Social Proof Chips */}
              <div className="flex flex-wrap gap-2 justify-center">
                <div className="px-3 py-1.5 bg-white/70 backdrop-blur rounded-full border border-neutral-200 text-sm text-neutral-700">
                  ✨ 4,000+ wishes submitted
                </div>
                <div className="px-3 py-1.5 bg-white/70 backdrop-blur rounded-full border border-neutral-200 text-sm text-neutral-700">
                  🌍 Global celebration
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Button
              onClick={() => scrollToSection("#share")}
              className="btn-primary text-lg px-10 py-4 hover-lift"
            >
              Share Your Wish
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              onClick={() => scrollToSection("#highlights")}
              className="btn-secondary text-lg px-10 py-4 hover-lift"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Highlights
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
    </section>
  );
};