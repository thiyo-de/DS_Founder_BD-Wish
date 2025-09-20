import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Gift, Sparkles } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        "header-sticky transition-all duration-300",
        isScrolled 
          ? "backdrop-blur bg-white/80 border-b border-neutral-200" 
          : "bg-transparent border-b border-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container-modern py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
              <Gift className="text-primary-foreground h-5 w-5" />
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button 
              onClick={() => scrollToSection("#share")}
              className="btn-primary hover-lift"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Share Your Wish
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav
            className="lg:hidden mt-4 pt-4 border-t border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col gap-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    scrollToSection(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-foreground hover:text-primary transition-colors font-medium py-2"
                >
                  {item.name}
                </button>
              ))}
              <Button 
                onClick={() => {
                  scrollToSection("#share");
                  setIsMobileMenuOpen(false);
                }}
                className="btn-primary mt-2 w-full"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Share Your Wish
              </Button>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};