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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-soft" 
          : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-soft">
              <Gift className="text-primary-foreground h-6 w-6" />
            </div>
            <div>
              <h1 className="font-satoshi font-bold text-xl text-foreground">
                Birthday Wishes
              </h1>
              <p className="text-sm text-muted-foreground font-space">to our Founder</p>
            </div>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground hover:text-primary transition-colors font-space font-medium focus-ring px-2 py-1 rounded-lg"
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
              className="focus-ring"
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
              className="btn-hero focus-ring"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Share Your Wish
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav
            className="lg:hidden mt-6 pt-6 border-t border-border"
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
                  className="text-left text-foreground hover:text-primary transition-colors font-space font-medium py-3 px-2 rounded-lg focus-ring"
                >
                  {item.name}
                </button>
              ))}
              <Button 
                onClick={() => {
                  scrollToSection("#share");
                  setIsMobileMenuOpen(false);
                }}
                className="btn-hero mt-4 focus-ring"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Share Your Wish
              </Button>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};