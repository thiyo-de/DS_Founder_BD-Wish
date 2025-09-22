import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Sparkles, Play, User } from "lucide-react";

const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  element?.scrollIntoView({ behavior: "smooth" });
};

// Calculate days until celebration
const celebrationDate = new Date('2024-03-15');
const today = new Date();
const daysUntil = Math.max(0, Math.ceil((celebrationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/20 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: 0 
            }}
            animate={{ 
              y: [null, -100, -200],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 badge-accent animate-bounce-in"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Sparkles className="w-4 h-4" />
              Special Celebration
            </motion.div>

            <div className="space-y-6">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-satoshi font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Celebrating a{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Visionary Leader
                </span>
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-muted-foreground font-space max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Join us in honoring our founder's remarkable journey of innovation, leadership, and inspiration. Share your heartfelt wishes for this special milestone.
              </motion.p>
            </div>

            {/* Countdown Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Card className="inline-flex items-center gap-4 p-6 card-glass">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-space text-muted-foreground">Celebration in</p>
                  <p className="text-2xl font-satoshi font-bold text-primary">
                    {daysUntil} days
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                onClick={() => scrollToSection("#share")}
                className="btn-hero focus-ring"
                size="lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Share Your Wish
              </Button>
              <Button
                onClick={() => scrollToSection("#highlights")}
                variant="outline"
                className="btn-hero-outline focus-ring"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Highlights
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Founder Image */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {/* Founder Image Container */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                {/* Yellow Halo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/30 to-accent/10 blur-xl animate-pulse"></div>
                
                {/* Blue Glow */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 blur-lg"></div>
                
                {/* Main Image Circle */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/5 to-accent/5 border-4 border-white/20 shadow-glow flex items-center justify-center overflow-hidden">
                  {/* Placeholder for founder image */}
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                    <User className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 text-primary/50" />
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full shadow-yellow opacity-80"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full shadow-glow opacity-60"
                  animate={{ 
                    y: [0, 10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-primary rounded-full mt-2"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};