import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "About", href: "#about" },
  { name: "Share Wish", href: "#share" },
  { name: "Wishes Wall", href: "#wishes" },
  { name: "Highlights", href: "#highlights" },
  { name: "Legacy", href: "#legacy" },
  { name: "Contact", href: "#contact" }
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/90 backdrop-blur-lg border-b border-border shadow-soft" 
          : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-outfit font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="font-outfit font-bold text-xl text-foreground">
                Birthday Wishes
              </h1>
              <p className="text-sm text-muted-foreground">to our Founder</p>
            </div>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground hover:text-primary transition-colors font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button 
              onClick={() => scrollToSection("#share")}
              className="btn-hero"
            >
              Share Your Wish
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};