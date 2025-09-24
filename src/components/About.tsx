import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import {
  GraduationCap,
  HeartPulse,
  Zap,
  Pill,
  Wallet,
  Building2,
  Bus,
  Milk,
  Rocket,
  Star,
  Target,
  HeartHandshake,
} from "lucide-react";

const BRAND = { yellow: "#FAF219", blue: "#1E1EC2", darkBlue: "#15158A" };

/** Use cubic-bezier arrays to satisfy framer-motion TS types */
const easeOutQuart: [number, number, number, number] = [0.25, 1, 0.5, 1];

/** Animations */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOutQuart,
    },
  },
};

const milestones = [
  {
    year: "Education",
    title: "Education Without Barriers",
    description:
      "From LKG to MBBS and beyond—universities, colleges and schools that make quality learning accessible, many with free or subsidized education.",
    icon: GraduationCap,
    gradient: "from-blue-50 to-yellow-50",
    accent: BRAND.blue,
  },
  {
    year: "Healthcare",
    title: "Health for Every Heart",
    description:
      "World-class hospitals delivering advanced care and community programs—free baby deliveries, vaccinations, and support across 50+ villages.",
    icon: HeartPulse,
    gradient: "from-pink-50 to-blue-50",
    accent: "#EC4899",
  },
  {
    year: "Energy",
    title: "Green Power & Biofuel",
    description:
      "26 MW clean energy and ethanol production—turning waste to wealth and fueling a cleaner mobility future for India.",
    icon: Zap,
    gradient: "from-green-50 to-blue-50",
    accent: "#10B981",
  },
  {
    year: "Pharma",
    title: "Affordable Medicines",
    description:
      "CASID Pharmaceuticals—reliable, accessible formulations that strengthen the Group's health mission.",
    icon: Pill,
    gradient: "from-purple-50 to-pink-50",
    accent: "#8B5CF6",
  },
  {
    year: "Finance",
    title: "Finance for All",
    description:
      "Chit funds and loans for business, vehicle and property—unlocking growth for families and entrepreneurs.",
    icon: Wallet,
    gradient: "from-emerald-50 to-blue-50",
    accent: "#059669",
  },
  {
    year: "Infra & Hospitality",
    title: "Building Tomorrow",
    description:
      "Highways, bridges, urban spaces, hotels and halls—projects that enable prosperity, celebration and connection.",
    icon: Building2,
    gradient: "from-orange-50 to-red-50",
    accent: "#F59E0B",
  },
  {
    year: "Transport",
    title: "Connecting Communities",
    description:
      "Transport services that link students, farmers and industries across 50+ villages—progress in motion.",
    icon: Bus,
    gradient: "from-cyan-50 to-blue-50",
    accent: "#06B6D4",
  },
  {
    year: "Dairy",
    title: "Nurturing Daily Health",
    description:
      "Modern dairy with 300+ cattle—fresh milk to students and communities, reinforcing nutrition with dignity.",
    icon: Milk,
    gradient: "from-white to-blue-50",
    accent: BRAND.blue,
  },
];

const values = [
  {
    icon: Target,
    title: "Visionary Innovation",
    description:
      "Pioneering breakthrough solutions that shape the future of our industry.",
    color: BRAND.blue,
  },
  {
    icon: Rocket,
    title: "Excellence & Quality",
    description:
      "Maintaining the highest standards in everything we do, every single day.",
    color: "#EC4899",
  },
  {
    icon: HeartHandshake,
    title: "Community Impact",
    description:
      "Building meaningful connections and creating positive change in our communities.",
    color: "#10B981",
  },
  {
    icon: Star,
    title: "Continuous Learning",
    description:
      "Embracing knowledge and fostering growth at every level of the organization.",
    color: "#F59E0B",
  },
];

export const About = () => {
  const stackPosition = "18%";

  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Background Elements (kept as-is) */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-10 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: BRAND.blue }}
        />
        <div
          className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: BRAND.yellow }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16 lg:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Badge
              className="text-xs sm:text-sm px-4 py-2 rounded-full font-medium tracking-wide border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.darkBlue} 100%)`,
                color: "#fff",
              }}
            >
              <Star className="w-3 h-3 mr-1" />
              Our Founder's Journey
            </Badge>
          </motion.div>

          <motion.h2
            className="font-satoshi font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl lg:leading-tight"
            variants={itemVariants}
          >
            A Legacy of{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.darkBlue} 100%)`,
                WebkitBackgroundClip: "text",
              }}
            >
              Education
            </span>
            , Health &{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background:
                  "linear-gradient(135deg, #FFD84A 0%, #E6B800 100%)",
                WebkitBackgroundClip: "text",
              }}
            >
              Opportunity
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto max-w-4xl text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600"
            variants={itemVariants}
          >
            From a humble beginning to a multi-sector movement, the
            Dhanalakshmi Srinivasan Group has empowered lakhs of people through
            education, accessible healthcare, sustainable industry and dignified
            jobs.
          </motion.p>
        </motion.header>

        {/* ScrollStack */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: easeOutQuart }}
        >
          <ScrollStack
            className="mt-4"
            baseScale={0.92}
            itemScale={0.035}
            itemDistance={100}
            itemStackDistance={32}
            stackPosition={stackPosition}
            scaleEndPosition="10%"
            rotationAmount={0.2}
            blurAmount={0.8}
            useWindowScroll={true}
            showProgress={true}
            onStackComplete={() => console.log("Stack complete!")}
          >
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <ScrollStackItem key={milestone.title} index={index}>
                  <Card className="relative group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                    {/* Animated gradient border */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                      style={{
                        background: `linear-gradient(135deg, ${milestone.accent}20, transparent 50%)`,
                      }}
                    />

                    <CardContent className="relative p-6 sm:p-8 lg:p-10 z-10">
                      {/* Icon row */}
                      <div className="flex items-center justify-between mb-6">
                        <Badge
                          className="text-xs font-semibold px-4 py-2 rounded-full border-0 shadow-md"
                          style={{
                            background: `linear-gradient(135deg, ${BRAND.yellow} 0%, #FFD700 100%)`,
                            color: BRAND.darkBlue,
                          }}
                        >
                          {milestone.year}
                        </Badge>

                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${milestone.accent} 0%, ${milestone.accent}80 100%)`,
                          }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <h4
                        className="text-xl sm:text-2xl lg:text-3xl font-satoshi font-bold leading-tight mb-4 group-hover:translate-x-2 transition-transform duration-300"
                        style={{ color: milestone.accent }}
                      >
                        {milestone.title}
                      </h4>

                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:translate-x-1 transition-transform duration-300">
                        {milestone.description}
                      </p>

                      {/* Hover effect line */}
                      <div
                        className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                        style={{ background: milestone.accent }}
                      />
                    </CardContent>
                  </Card>
                </ScrollStackItem>
              );
            })}
          </ScrollStack>
        </motion.div>

        {/* Values */}
        <motion.div
          className="mt-20 sm:mt-24 lg:mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <motion.h3
            className="text-center text-2xl sm:text-3xl lg:text-4xl font-satoshi font-bold mb-8 sm:mb-12"
            variants={itemVariants}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.darkBlue} 100%)`,
                WebkitBackgroundClip: "text",
              }}
            >
              Guiding Principles
            </span>
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: easeOutQuart },
                  }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl bg-white/80 backdrop-blur-sm group transition-all duration-500 overflow-hidden">
                    <CardContent className="p-6 sm:p-8 text-center space-y-4 sm:space-y-6 h-full flex flex-col relative">
                      {/* Hover background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                        style={{ background: value.color }}
                      />

                      <div
                        className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${value.color} 0%, ${value.color}80 100%)`,
                        }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <h4 className="text-lg sm:text-xl font-satoshi font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                        {value.title}
                      </h4>

                      <p className="text-sm text-gray-600 leading-relaxed flex-grow group-hover:text-gray-700 transition-colors duration-300">
                        {value.description}
                      </p>

                      {/* Animated border */}
                      <div
                        className="absolute bottom-0 left-1/2 w-0 h-1 rounded-full group-hover:w-4/5 transition-all duration-500"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${value.color}, transparent)`,
                          transform: "translateX(-50%)",
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-20 sm:mt-24 lg:mt-32 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: "50K+", label: "Students Educated" },
              { number: "100+", label: "Villages Served" },
              { number: "26MW", label: "Clean Energy" },
              { number: "300+", label: "Cattle Dairy" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-clip-text text-transparent"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.darkBlue} 100%)`,
                    WebkitBackgroundClip: "text",
                  }}
                >
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
