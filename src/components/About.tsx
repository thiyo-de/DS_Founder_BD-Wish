import { motion } from "framer-motion";
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
  Lightbulb,
  Rocket,
  Users,
} from "lucide-react";
import "./About.css";

/* ------ Brand (mirrors CSS variables) ------ */
const BRAND = {
  yellow: "#FAF200",
  blue: "#0606BC",
  coral: "#FF6B6B",
  offWhite: "#FEFDF8",
  navy: "#0A0A2E",
  charcoal: "#333333",
  coolGray: "#E8E8ED",
};

const milestones = [
  {
    year: "Education",
    title: "Education Without Barriers",
    description:
      "Millions of students educated from LKG to MBBS—Dhanalakshmi Srinivasan University and its institutions equip learners with global skills, many at free or subsidized cost.",
    icon: GraduationCap,
    gradient: "linear-gradient(135deg, var(--brand-blue) 0%, #2D2DFF 100%)",
  },
  {
    year: "Healthcare",
    title: "Health for Every Heart",
    description:
      "Super-specialty hospitals delivering world-class, affordable care—advanced surgeries, organ transplants, free healthcare in 56 villages, free baby deliveries, and vaccinations for all.",
    icon: HeartPulse,
    gradient: "linear-gradient(135deg, var(--coral-accent) 0%, #FF8E8E 100%)",
  },
  {
    year: "Energy",
    title: "Green Power & Biofuel",
    description:
      "26 MW bagasse-powered plants and ethanol production turning waste into wealth, fueling India’s clean mobility and future-ready energy ecosystem.",
    icon: Zap,
    gradient: "linear-gradient(135deg, var(--brand-yellow) 0%, #FFFB7D 100%)",
  },
  {
    year: "Pharma",
    title: "Affordable Medicines",
    description:
      "CASID Pharmaceuticals—accessible, innovative formulations ensuring stronger health outcomes across India.",
    icon: Pill,
    gradient: "linear-gradient(135deg, #8E44AD 0%, #BB8FCE 100%)",
  },
  {
    year: "Finance",
    title: "Finance for All",
    description:
      "Chit funds, business loans, vehicle and property loans—flexible financial solutions unlocking growth for families and entrepreneurs.",
    icon: Wallet,
    gradient: "linear-gradient(135deg, #27AE60 0%, #58D68D 100%)",
  },
  {
    year: "Infra & Hospitality",
    title: "Building Tomorrow",
    description:
      "100 km of highways, bridges, flyovers, urban spaces, hotels, and marriage halls—every project a foundation of progress and celebration.",
    icon: Building2,
    gradient: "linear-gradient(135deg, #E67E22 0%, #F39C12 100%)",
  },
  {
    year: "Transport",
    title: "Connecting Communities",
    description:
      "Transport services linking 50+ villages, students, farmers, and industries—making growth accessible and unstoppable.",
    icon: Bus,
    gradient: "linear-gradient(135deg, #3498DB 0%, #5DADE2 100%)",
  },
  {
    year: "Dairy",
    title: "Nurturing Daily Health",
    description:
      "300+ cattle producing fresh, hygienic milk reaching students and families daily—nutrition with dignity and trust.",
    icon: Milk,
    gradient: "linear-gradient(135deg, #95A5A6 0%, #BDC3C7 100%)",
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Visionary Innovation",
    description:
      "Pioneering breakthrough solutions that shape the future of India—across education, healthcare, energy, and beyond.",
    color: BRAND.blue,
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description:
      "Empowering individuals and institutions to grow with knowledge, skills, and leadership at every level.",
    color: BRAND.coral,
  },
  {
    icon: Rocket,
    title: "Excellence & Quality",
    description:
      "Upholding the highest standards in everything—classrooms, hospitals, industries, and communities.",
    color: BRAND.yellow,
  },
  {
    icon: Users,
    title: "Community Impact",
    description:
      "Building meaningful connections, uplifting farmers, empowering rural families, and transforming lives nationwide.",
    color: "#27AE60",
  },
];

export const About = () => {
  const stackPosition = "16%";

  return (
    <section
      id="about"
      className="pb-12 sm:pb-16 lg:pb-20 pt-28 sm:pt-32 lg:pt-40 relative overflow-hidden"
    >
      {/* Light overall brand gradient background */}
      <div className="page-bg" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-5 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <motion.header
          className="text-center space-y-3 sm:space-y-4 lg:space-y-5 mb-8 sm:mb-10 lg:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Badge
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full tracking-wide font-medium shadow-sm"
            style={{
              background: BRAND.blue,
              color: BRAND.offWhite,
              border: `1px solid ${BRAND.blue}`,
            }}
          >
            Our Founder's Journey
          </Badge>

          <h2
            className="font-satoshi font-extrabold tracking-[-0.02em] text-2xl sm:text-3xl lg:text-5xl leading-tight px-2 sm:px-0"
            style={{ color: BRAND.navy }}
          >
            A Legacy of{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.yellow} 50%, ${BRAND.coral} 100%)`,
              }}
            >
              Education, Health & Opportunity
            </span>
          </h2>

          <p
            className="mx-auto max-w-3xl text-sm sm:text-base lg:text-lg leading-relaxed px-2 sm:px-0"
            style={{ color: BRAND.charcoal }}
          >
            From a humble beginning to a multi-sector movement, the Dhanalakshmi
            Srinivasan Group has empowered lakhs of people through education,
            accessible healthcare, sustainable industry and dignified jobs.
          </p>
        </motion.header>

        {/* Milestones (ScrollStack) */}
        <div className="pb-12 sm:pb-16 lg:pb-20 mobile-stack-safe">
          <ScrollStack
            className="mt-2"
            baseScale={0.94}
            itemScale={0.03}
            itemDistance={84}
            itemStackDistance={28}
            stackPosition={stackPosition}
            scaleEndPosition="12%"
            rotationAmount={0}
            blurAmount={0}
            useWindowScroll
          >
            {milestones.map((m, index) => {
              const Icon = m.icon;
              return (
                <ScrollStackItem key={m.title}>
                  <Card className="relative bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group rounded-2xl sm:rounded-3xl">
                    {/* Hover gradient ring */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl p-[1px] sm:p-[2px]"
                      style={{ background: m.gradient }}
                    >
                      <div className="w-full h-full bg-white rounded-2xl sm:rounded-3xl" />
                    </div>

                    <CardContent className="p-4 sm:p-5 lg:p-7 relative z-10">
                      {/* Step number */}
                      <div
                        className="absolute left-3 sm:left-4 top-4 sm:top-6 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md"
                        style={{ backgroundImage: m.gradient }}
                        aria-label={`Step ${index + 1}`}
                      >
                        {index + 1}
                      </div>

                      {/* Right-top icon */}
                      <div
                        className="absolute right-3 sm:right-5 top-3 sm:top-5 rounded-lg sm:rounded-xl p-2 sm:p-2.5 border shadow-sm group-hover:scale-110 transition-transform duration-300 bg-white"
                        style={{ borderColor: BRAND.coolGray }}
                      >
                        <Icon
                          className="h-4 w-4 sm:h-6 sm:w-6"
                          style={{ color: BRAND.blue }}
                        />
                      </div>

                      {/* Content */}
                      <div className="pl-12 sm:pl-16 pr-12 sm:pr-16 lg:pr-20">
                        <Badge
                          className="text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full font-medium mb-2 sm:mb-3 shadow-sm"
                          style={{
                            background: BRAND.yellow,
                            color: BRAND.navy,
                            border: `1px solid ${BRAND.coolGray}`,
                          }}
                        >
                          {m.year}
                        </Badge>

                        <h4
                          className="mt-1 sm:mt-2 text-base sm:text-lg lg:text-2xl font-satoshi font-semibold leading-snug"
                          style={{ color: BRAND.navy }}
                        >
                          {m.title}
                        </h4>

                        <p
                          className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base leading-relaxed"
                          style={{ color: BRAND.charcoal }}
                        >
                          {m.description}
                        </p>
                      </div>
                    </CardContent>

                    {/* Accent bar */}
                    <div
                      className="h-1.5 sm:h-2 w-full transition-all duration-500 group-hover:h-2 sm:group-hover:h-3"
                      style={{ background: m.gradient }}
                    />
                  </Card>
                </ScrollStackItem>
              );
            })}
          </ScrollStack>
        </div>

        {/* Values */}
        <motion.div
          className="mt-12 sm:mt-16 lg:mt-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h3
              className="text-xl sm:text-2xl lg:text-4xl font-satoshi font-bold mb-3 sm:mb-4"
              style={{ color: BRAND.navy }}
            >
              Our Pillars of Growth
            </h3>
            <p
              className="text-xs sm:text-sm lg:text-base max-w-2xl mx-auto px-2 sm:px-0"
              style={{ color: BRAND.charcoal }}
            >
              The core values that drive our mission and shape our impact across
              every sector we serve
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((v, index) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-0 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-500 group overflow-hidden rounded-xl sm:rounded-2xl">
                    <CardContent className="p-4 sm:p-5 lg:p-6 text-center flex flex-col items-center h-full">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-3 sm:mb-4"
                        style={{ background: v.color }}
                      >
                        <Icon
                          className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
                          style={{ color: BRAND.offWhite }}
                        />
                      </div>

                      <h4
                        className="text-sm sm:text-base lg:text-lg xl:text-xl font-satoshi font-semibold mb-1 sm:mb-2"
                        style={{ color: BRAND.navy }}
                      >
                        {v.title}
                      </h4>

                      <p
                        className="text-xs sm:text-sm lg:text-base leading-relaxed opacity-90 flex-grow"
                        style={{ color: BRAND.charcoal }}
                      >
                        {v.description}
                      </p>

                      <div
                        className="w-10 h-0.5 sm:w-12 sm:h-1 rounded-full mt-3 sm:mt-4 transition-all duration-500 group-hover:w-12 sm:group-hover:w-16"
                        style={{ background: v.color }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12 sm:mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 shadow-xl lg:shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.navy} 100%)`,
            }}
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-satoshi font-bold mb-3 sm:mb-4 text-white">
              Discover Heartfelt Wishes
            </h3>
            <p className="text-white/90 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto mb-4 sm:mb-5 lg:mb-6 px-2 sm:px-0">
              Explore a wall of love, memories, and tributes — messages from
              colleagues, friends, and admirers around the world.
            </p>
            <a
              href="#wishes"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ background: BRAND.yellow, color: BRAND.navy }}
            >
              View Wishes Wall
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
