import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Heart,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Cake,
} from "lucide-react";
import Logo from "../Assets/logo.png";

// Define CSS variables properly
const styles = {
  "--brand-blue": "#0606bc",
  "--brand-yellow": "#faf200",
  "--coral-accent": "#FF6B6B",
  "--light-gray": "#F5F5F5",
  "--deep-navy": "#0A0A2E",
  "--cool-gray": "#E8E8ED",
  "--off-white": "#FEFDF8",
  "--dark-charcoal": "#333333",
} as React.CSSProperties;

const socialLinks = [
  { name: "LinkedIn", icon: <Linkedin className="h-4 w-4" />, href: "#" },
  { name: "Twitter", icon: <Twitter className="h-4 w-4" />, href: "#" },
  { name: "Instagram", icon: <Instagram className="h-4 w-4" />, href: "#" },
  { name: "YouTube", icon: <Youtube className="h-4 w-4" />, href: "#" },
];

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Share Wish", href: "#share" },
  { name: "Wishes Wall", href: "#wishes" },
  { name: "Highlights", href: "#highlights" },
  { name: "Legacy", href: "#legacy" },
];

export const Footer = () => {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative overflow-hidden" style={styles}>
      {/* Main background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--deep-navy) 0%, var(--brand-blue) 100%)",
        }}
      />

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full"
          style={{ backgroundColor: "var(--brand-yellow)" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 rounded-full"
          style={{ backgroundColor: "var(--coral-accent)" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
          style={{ backgroundColor: "var(--light-gray)" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-12">
        {/* Main footer content */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-10">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <img
                src={Logo}
                alt="Logo"
                className="w-12 h-12 rounded-xl object-contain border-2"
                style={{ borderColor: "var(--brand-yellow)" }}
              />
              <div>
                <h3
                  className="font-bold text-xl"
                  style={{ color: "var(--brand-yellow)" }}
                >
                  Birthday Wishes
                </h3>
                <p
                  className="opacity-90 font-medium"
                  style={{ color: "var(--off-white)" }}
                >
                  to our Founder
                </p>
              </div>
            </div>

            <p
              className="leading-relaxed mb-6 max-w-md opacity-90"
              style={{ color: "var(--off-white)" }}
            >
              Join us in celebrating the remarkable journey, vision, and impact
              of our founder. Every wish, every memory, and every moment of
              recognition contributes to this special tribute.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="flex items-center gap-2 p-3 rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    color: "var(--deep-navy)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "var(--brand-yellow)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {social.icon}
                  <span className="text-sm font-medium hidden sm:inline">
                    {social.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h4
              className="font-semibold text-lg mb-6"
              style={{ color: "var(--brand-yellow)" }}
            >
              Quick Links
            </h4>
            <nav className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left p-3 rounded-lg transition-all duration-300 font-medium"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "var(--off-white)",
                  }}
                  whileHover={{
                    backgroundColor: "var(--coral-accent)",
                    color: "var(--deep-navy)",
                    translateX: 5,
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {link.name}
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Celebration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-1 md:col-span-2 lg:col-start-3 lg:row-start-1"
          >
            <Card
              className="p-6 border-0 shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--coral-accent) 0%, var(--brand-yellow) 100%)",
                color: "var(--deep-navy)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Cake className="h-6 w-6" />
                <Heart className="h-5 w-5" />
                <Cake className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-lg mb-2">Celebrating Excellence</h4>
              <p className="text-sm opacity-90">
                Join us in honoring the vision and dedication that built our
                legacy. Your wishes make this celebration unforgettable.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Company Links Section */}
        <motion.div
          className="border-t pt-8 mb-8"
          style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="w-full">
              <h4
                className="font-semibold mb-4 text-lg"
                style={{ color: "var(--brand-yellow)" }}
              >
                DS Group Companies
              </h4>
              <div className="flex flex-wrap gap-3">
                {[
                  "Innovation Labs",
                  "Digital Solutions",
                  "Community Impact",
                  "Global Ventures",
                ].map((company, index) => (
                  <motion.div
                    key={company}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.button
                      className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm transition-all duration-300 border font-medium"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "var(--off-white)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm">{company}</span>
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section - Copyright & Legal */}
        <motion.div
          className="border-t pt-8 flex flex-col lg:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* Copyright */}
          <div
            className="flex items-center gap-3 opacity-90 text-sm"
            style={{ color: "var(--off-white)" }}
          >
            <span>&copy; {currentYear} DS Group. All rights reserved.</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
            >
              <Heart
                className="h-4 w-4"
                style={{ color: "var(--coral-accent)" }}
              />
            </motion.div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item, index) => (
                <motion.button
                  key={item}
                  className="opacity-80 hover:opacity-100 transition-opacity duration-300 hover:underline font-medium"
                  style={{ color: "var(--brand-yellow)" }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {item}
                </motion.button>
              )
            )}
          </div>
        </motion.div>

        {/* Final Celebration Message */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block p-1 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-yellow) 0%, var(--coral-accent) 100%)",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card
              className="px-6 py-4 border-0"
              style={{
                backgroundColor: "var(--deep-navy)",
              }}
            >
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <motion.div
                  animate={{ rotate: [0, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 10,
                  }}
                >
                  <Cake
                    className="h-5 w-5"
                    style={{ color: "var(--brand-yellow)" }}
                  />
                </motion.div>
                <p
                  className="font-medium"
                  style={{ color: "var(--off-white)" }}
                >
                  Made with love for an extraordinary founder
                </p>
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 10,
                    delay: 1,
                  }}
                >
                  <Heart
                    className="h-5 w-5"
                    style={{ color: "var(--coral-accent)" }}
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
