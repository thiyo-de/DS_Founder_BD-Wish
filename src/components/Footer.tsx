import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ExternalLink, Heart } from "lucide-react";

const socialLinks = [
  { name: "LinkedIn", icon: "💼", href: "#" },
  { name: "Twitter", icon: "🐦", href: "#" },
  { name: "Instagram", icon: "📸", href: "#" },
  { name: "YouTube", icon: "🎥", href: "#" }
];

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Share Wish", href: "#share" },
  { name: "Wishes Wall", href: "#wishes" },
  { name: "Highlights", href: "#highlights" },
  { name: "Awards", href: "#legacy" }
];

export const Footer = () => {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <span className="text-primary font-outfit font-bold text-xl">F</span>
              </div>
              <div>
                <h3 className="font-outfit font-bold text-xl">Birthday Celebration</h3>
                <p className="text-primary-foreground/80">Honoring Our Founder</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/90 leading-relaxed mb-6 max-w-md">
              Join us in celebrating the remarkable journey, vision, and impact of our 
              founder. Every wish, every memory, and every moment of recognition contributes 
              to this special tribute.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg">{social.icon}</span>
                  <span className="text-sm">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-outfit font-semibold text-lg mb-6">Quick Links</h4>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-outfit font-semibold text-lg mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-primary-foreground/90">Email</p>
                  <a 
                    href="mailto:celebration@company.com" 
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    celebration@company.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-primary-foreground/90">Phone</p>
                  <a 
                    href="tel:+1234567890" 
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    +1 (234) 567-8900
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-primary-foreground/90">Office</p>
                  <p className="text-sm text-primary-foreground/80">
                    123 Innovation Drive<br />
                    Silicon Valley, CA 94000
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Company Links */}
        <motion.div
          className="border-t border-primary-foreground/20 pt-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-outfit font-semibold mb-3 text-accent">DS Group Companies</h4>
              <div className="flex flex-wrap gap-4">
                {[
                  "Innovation Labs",
                  "Digital Solutions",
                  "Community Impact",
                  "Global Ventures"
                ].map((company) => (
                  <Button
                    key={company}
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground/80 hover:text-accent hover:bg-primary-foreground/10"
                  >
                    {company}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Copyright & Legal */}
        <motion.div
          className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <span>&copy; {currentYear} DS Group. All rights reserved.</span>
            <Heart className="h-4 w-4 text-accent" />
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <button className="text-primary-foreground/80 hover:text-accent transition-colors">
              Privacy Policy
            </button>
            <button className="text-primary-foreground/80 hover:text-accent transition-colors">
              Terms of Service
            </button>
            <button className="text-primary-foreground/80 hover:text-accent transition-colors">
              Cookie Policy
            </button>
          </div>
        </motion.div>

        {/* Celebration Message */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="inline-block bg-accent/20 border-accent/30 backdrop-blur-sm">
            <div className="p-4">
              <p className="text-accent font-outfit font-medium">
                🎉 Made with love for an extraordinary founder 🎂
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </footer>
  );
};