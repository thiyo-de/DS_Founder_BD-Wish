import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Crown, Medal, Zap, Quote } from "lucide-react";

// Color palette implementation
const colors = {
  brandBlue: "#0606bc",
  brandYellow: "#faf200",
  coralAccent: "#FF6B6B",
  lightGray: "#F5F5F5",
  deepNavy: "#0A0A2E",
  coolGray: "#E8E8ED",
  offWhite: "#FEFDF8",
  darkCharcoal: "#333333",
};

// Background gradient for the entire section
const backgroundGradient = `linear-gradient(135deg, ${colors.offWhite} 0%, #f0f4ff 50%, ${colors.offWhite} 100%)`;

const awards = [
  {
    id: "1",
    title: "Innovation Excellence Award",
    issuer: "Tech Industry Association",
    year: "2023",
    icon: <Trophy className="h-8 w-8" />,
    description:
      "Recognized for groundbreaking innovations that transformed industry standards and practices.",
    category: "Innovation",
    color: colors.brandYellow,
    bgColor: `${colors.brandYellow}15`,
  },
  {
    id: "2",
    title: "Outstanding Leadership Recognition",
    issuer: "Business Leaders Forum",
    year: "2022",
    icon: <Crown className="h-8 w-8" />,
    description:
      "Honored for exceptional leadership skills and ability to inspire teams toward excellence.",
    category: "Leadership",
    color: colors.brandBlue,
    bgColor: `${colors.brandBlue}15`,
  },
  {
    id: "3",
    title: "Entrepreneur of the Year",
    issuer: "Global Business Council",
    year: "2021",
    icon: <Star className="h-8 w-8" />,
    description:
      "Celebrated for visionary entrepreneurship and successful business development strategies.",
    category: "Entrepreneurship",
    color: colors.coralAccent,
    bgColor: `${colors.coralAccent}15`,
  },
  {
    id: "4",
    title: "Community Impact Champion",
    issuer: "Social Impact Network",
    year: "2020",
    icon: <Medal className="h-8 w-8" />,
    description:
      "Acknowledged for significant contributions to community development and social responsibility.",
    category: "Social Impact",
    color: "#10B981",
    bgColor: "#10B98115",
  },
  {
    id: "5",
    title: "Digital Transformation Pioneer",
    issuer: "Technology Innovation Board",
    year: "2019",
    icon: <Zap className="h-8 w-8" />,
    description:
      "Leading the digital revolution and implementing cutting-edge technological solutions.",
    category: "Technology",
    color: "#8B5CF6",
    bgColor: "#8B5CF615",
  },
  {
    id: "6",
    title: "Excellence in Corporate Culture",
    issuer: "Workplace Excellence Institute",
    year: "2018",
    icon: <Award className="h-8 w-8" />,
    description:
      "Building an inclusive, innovative, and empowering workplace culture for all employees.",
    category: "Culture",
    color: "#EC4899",
    bgColor: "#EC489915",
  },
];

const legacyImages = [
  {
    id: "l1",
    title: "Founding Moment",
    description: "The historic signing of the company charter",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    placeholder: "📋",
    year: "2001",
    bgColor: colors.brandBlue,
  },
  {
    id: "l2",
    title: "First Major Client",
    description: "Celebrating the partnership that launched our growth",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    placeholder: "🤝",
    year: "2003",
    bgColor: colors.brandYellow,
  },
  {
    id: "l3",
    title: "Team Milestone",
    description: "Reaching 100 employees - a family grows",
    image:
      "https://images.unsplash.com/photo-1571624436279-b272aff752b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    placeholder: "👥",
    year: "2008",
    bgColor: colors.coralAccent,
  },
  {
    id: "l4",
    title: "Innovation Lab Launch",
    description: "Opening our state-of-the-art research facility",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    placeholder: "🔬",
    year: "2012",
    bgColor: colors.brandBlue,
  },
  {
    id: "l5",
    title: "Global Recognition",
    description: "Accepting our first international award",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    placeholder: "🌍",
    year: "2015",
    bgColor: colors.brandYellow,
  },
  {
    id: "l6",
    title: "Next Generation",
    description: "Mentoring future leaders and innovators",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    placeholder: "🌱",
    year: "2020",
    bgColor: colors.coralAccent,
  },
  {
    id: "l7",
    title: "Sustainability Initiative",
    description: "Leading environmental responsibility programs",
    image:
      "https://images.unsplash.com/photo-1758640920659-0bb864175983?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    placeholder: "♻️",
    year: "2021",
    bgColor: colors.brandBlue,
  },
  {
    id: "l8",
    title: "Community Center",
    description: "Opening our community impact center",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    placeholder: "🏛️",
    year: "2022",
    bgColor: colors.brandYellow,
  },
];

// Fallback component for images
const LegacyImage = ({ image, placeholder, title, bgColor }) => {
  return (
    <div
      className="w-full h-full bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${image})`,
        backgroundColor: `${bgColor}30`,
      }}
    >
      {/* Loading/fallback state */}
      <div className="absolute inset-0 bg-current opacity-10"></div>

      {/* Fallback text display if image fails */}
      <div className="hidden group-hover:flex absolute inset-0 items-center justify-center">
        <span className="text-2xl opacity-20">{placeholder}</span>
      </div>
    </div>
  );
};

export const Awards = () => {
  return (
    <section id="legacy" className="pb-20 pt-40 overflow-hidden">
      {/* Enhanced Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: backgroundGradient,
          backgroundAttachment: "fixed",
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(${colors.brandBlue} 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 relative">
            <Badge className="mb-4 rounded-full bg-gradient-to-r from-[#0606bc] to-[#FF6B6B] text-white px-4 py-2 text-base font-semibold shadow-md border-none whitespace-nowrap">
              Achievements
            </Badge>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: colors.deepNavy }}
          >
            Awards & Legacy
          </h2>
          <p
            className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            style={{ color: colors.darkCharcoal }}
          >
            Every award is more than a medal — it is a story of lives
            transformed. Our Founder’s honors celebrate his vision, compassion,
            and the countless people whose futures were shaped by his work.
          </p>
        </motion.div>

        {/* Awards Grid */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-12">
            <div
              className="w-12 h-1 rounded-full mr-4"
              style={{ backgroundColor: colors.brandBlue }}
            ></div>
            <h3
              className="text-2xl sm:text-3xl font-semibold text-center"
              style={{ color: colors.deepNavy }}
            >
              Awards & Recognition
            </h3>
            <div
              className="w-12 h-1 rounded-full ml-4"
              style={{ backgroundColor: colors.brandBlue }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                className="h-full"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-sm bg-white/80">
                  <CardContent className="p-6 lg:p-8 relative">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div
                        className="absolute top-0 right-0 w-32 h-32 rotate-45 translate-x-1/2 -translate-y-1/2"
                        style={{ backgroundColor: award.bgColor }}
                      ></div>
                    </div>

                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 relative z-10"
                      style={{ backgroundColor: award.bgColor }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div style={{ color: award.color }}>{award.icon}</div>
                    </motion.div>

                    <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                      <Badge
                        className="px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: colors.brandBlue,
                          color: colors.offWhite,
                          border: "none",
                        }}
                      >
                        {award.year}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-3 py-1 text-xs border-2 font-medium"
                        style={{
                          borderColor: award.color,
                          color: award.color,
                          backgroundColor: `${award.color}08`,
                        }}
                      >
                        {award.category}
                      </Badge>
                    </div>

                    <h4
                      className="font-semibold text-xl mb-3 leading-tight relative z-10"
                      style={{ color: colors.deepNavy }}
                    >
                      {award.title}
                    </h4>

                    <p
                      className="text-sm font-medium mb-4 relative z-10"
                      style={{ color: colors.brandBlue }}
                    >
                      {award.issuer}
                    </p>

                    <p
                      className="text-base leading-relaxed relative z-10"
                      style={{ color: colors.darkCharcoal }}
                    >
                      {award.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legacy Mosaic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-12">
            <div
              className="w-12 h-1 rounded-full mr-4"
              style={{ backgroundColor: colors.coralAccent }}
            ></div>
            <h3
              className="text-2xl sm:text-3xl font-semibold text-center"
              style={{ color: colors.deepNavy }}
            >
              Legacy Moments
            </h3>
            <div
              className="w-12 h-1 rounded-full ml-4"
              style={{ backgroundColor: colors.coralAccent }}
            ></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {legacyImages.map((item, index) => (
              <motion.div
                key={item.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="overflow-hidden aspect-square border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-transparent">
                  <CardContent className="p-0 h-full relative">
                    <div className="relative h-full flex items-center justify-center overflow-hidden">
                      <LegacyImage
                        image={item.image}
                        placeholder={item.placeholder}
                        title={item.title}
                        bgColor={item.bgColor}
                      />

                      {/* Enhanced Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-4 text-center">
                        <div className="text-xs font-semibold mb-1 text-white opacity-90 bg-black/30 px-2 py-1 rounded-full">
                          {item.year}
                        </div>
                        <div className="text-sm font-bold mb-2 text-white leading-tight">
                          {item.title}
                        </div>
                        <div className="text-xs text-white/80 leading-tight mb-3">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Inspirational Quote - Fixed Background */}
          <motion.div
            className="text-center mt-12 lg:mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="inline-block max-w-4xl border-0 shadow-2xl overflow-hidden backdrop-blur-sm bg-gradient-to-r from-blue-600/90 to-purple-600/90">
              <CardContent className="p-8 lg:p-12 relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, ${colors.offWhite} 20%, transparent 50%)`,
                  }}
                ></div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 lg:p-12 border border-white/20 shadow-2xl mx-4">
                      {/* Increased spacing for decorative corners */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-yellow-400 rounded-tl-2xl"></div>
                      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-400 rounded-tr-2xl"></div>
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-yellow-400 rounded-bl-2xl"></div>
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-yellow-400 rounded-br-2xl"></div>

                      <div className="text-center relative z-10">
                        {/* Icon with better spacing */}
                        <div className="mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20">
                            <Quote className="h-8 w-8 text-yellow-300" />
                          </div>
                        </div>

                        {/* Quote text with better typography */}
                        <div className="max-w-3xl mx-auto">
                          <p className="text-xl font-satoshi lg:text-2xl font-light leading-relaxed text-white mb-8 px-4">
                            The best legacy we can leave is not just what we've
                            accomplished, but the inspiration and opportunities
                            we've created for others to achieve even more.
                          </p>

                          {/* Attribution with better spacing */}
                          <div className="flex items-center justify-center space-x-6">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
                            <span className="text-sm font-satoshi text-yellow-200 tracking-widest px-4 whitespace-nowrap">
                              Our Founder's Vision
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
                          </div>
                        </div>
                      </div>

                      {/* Subtle background pattern */}
                      <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-10">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px)`,
                            backgroundSize: "40px 40px",
                          }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
