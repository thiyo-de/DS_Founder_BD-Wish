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

/* Brand */
const BRAND = { yellow: "#FAF219", blue: "#1E1EC2" };

/* Milestones with Lucide icons (right-top icon only) */
const milestones = [
  {
    year: "Education",
    title: "Education Without Barriers",
    description:
      "From LKG to MBBS and beyond—universities, colleges and schools that make quality learning accessible, many with free or subsidized education.",
    icon: GraduationCap,
  },
  {
    year: "Healthcare",
    title: "Health for Every Heart",
    description:
      "World-class hospitals delivering advanced care and community programs—free baby deliveries, vaccinations, and support across 50+ villages.",
    icon: HeartPulse,
  },
  {
    year: "Energy",
    title: "Green Power & Biofuel",
    description:
      "26 MW clean energy and ethanol production—turning waste to wealth and fueling a cleaner mobility future for India.",
    icon: Zap,
  },
  {
    year: "Pharma",
    title: "Affordable Medicines",
    description:
      "CASID Pharmaceuticals—reliable, accessible formulations that strengthen the Group’s health mission.",
    icon: Pill,
  },
  {
    year: "Finance",
    title: "Finance for All",
    description:
      "Chit funds and loans for business, vehicle and property—unlocking growth for families and entrepreneurs.",
    icon: Wallet,
  },
  {
    year: "Infra & Hospitality",
    title: "Building Tomorrow",
    description:
      "Highways, bridges, urban spaces, hotels and halls—projects that enable prosperity, celebration and connection.",
    icon: Building2,
  },
  {
    year: "Transport",
    title: "Connecting Communities",
    description:
      "Transport services that link students, farmers and industries across 50+ villages—progress in motion.",
    icon: Bus,
  },
  {
    year: "Dairy",
    title: "Nurturing Daily Health",
    description:
      "Modern dairy with 300+ cattle—fresh milk to students and communities, reinforcing nutrition with dignity.",
    icon: Milk,
  },
];

/* Guiding Principles — icons set to brand yellow */
const values = [
  {
    icon: Lightbulb,
    title: "Visionary Innovation",
    description:
      "Pioneering breakthrough solutions that shape the future of our industry.",
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description:
      "Embracing knowledge and fostering growth at every level of the organization.",
  },
  {
    icon: Rocket,
    title: "Excellence & Quality",
    description:
      "Maintaining the highest standards in everything we do, every single day.",
  },
  {
    icon: Users,
    title: "Community Impact",
    description:
      "Building meaningful connections and creating positive change in our communities.",
  },
];

export const About = () => {
  const stackPosition = "18%"; // first card appears sooner

  return (
    <section id="about" className="py-14 sm:py-16 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-2 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          className="text-center space-y-4 sm:space-y-5 mb-10 sm:mb-12 lg:mb-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge
            className="text-[12px] sm:text-sm px-3 py-1.5 rounded-full"
            style={{ background: BRAND.blue, color: "#fff" }}
          >
            Our Founder’s Journey
          </Badge>

          <h2 className="font-satoshi font-bold tracking-[-0.02em] text-2xl sm:text-3xl lg:text-4xl">
            A Legacy of <span style={{ color: BRAND.blue }}>Education</span>, Health &{" "}
            <span style={{ color: BRAND.yellow }}>Opportunity</span>
          </h2>

          <p className="mx-auto max-w-3xl text-[13.5px] sm:text-sm lg:text-base leading-relaxed text-muted-foreground">
            From a humble beginning to a multi-sector movement, the Dhanalakshmi Srinivasan Group has empowered
            lakhs of people through education, accessible healthcare, sustainable industry and dignified jobs.
          </p>
        </motion.header>

        {/* Stacked Milestone Cards */}
        <ScrollStack
          className="mt-2"
          baseScale={0.92}
          itemScale={0.035}
          itemDistance={90}
          itemStackDistance={30}
          stackPosition={stackPosition}
          scaleEndPosition="12%"
          rotationAmount={0}
          blurAmount={0}
          useWindowScroll
        >
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <ScrollStackItem key={m.title}>
                <Card className="relative bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-5 sm:p-6 lg:p-7">
                    {/* Right-top icon (brand blue) */}
                    <div className="absolute right-6 rounded-[8px] p-2 top-6 text-gray-500 border-[1.5px] border-gray-300 opacity-90">
                      <Icon className="h-6 w-6" />
                    </div>

                    <Badge
                      className="text-[11px] sm:text-xs px-4 py-2 rounded-full"
                      style={{ background: BRAND.yellow, color: "#1E1EC2" }}
                    >
                      {m.year}
                    </Badge>

                    <h4 className="mt-2 text-[#1E1EC2] text-[16px] sm:text-lg lg:text-xl font-satoshi font-semibold leading-snug">
                      {m.title}
                    </h4>

                    <p className="mt-2 text-[12.5px] sm:text-sm lg:text-[15px] text-muted-foreground leading-relaxed">
                      {m.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>

        {/* Guiding Principles */}
        <motion.div
          className="mt-14 sm:mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-center text-lg sm:text-xl lg:text-2xl font-satoshi text-[#1E1EC2] font-semibold mb-6 sm:mb-8">
            Guiding Principles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Card
                  key={v.title}
                  className="h-full border bg-white hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6 text-center space-y-3 sm:space-y-4 h-full flex flex-col">
                    <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow bg-[#1E1EC2]">
                      {/* Icon in brand yellow */}
                      <Icon className="w-7 h-7" style={{ color: BRAND.yellow }} />
                    </div>
                    <h4 className="text-base sm:text-lg font-satoshi font-semibold">
                      {v.title}
                    </h4>
                    <p className="text-[12.5px] sm:text-sm text-muted-foreground leading-relaxed flex-grow">
                      {v.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
