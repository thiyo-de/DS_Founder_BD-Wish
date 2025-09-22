import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, GraduationCap, Rocket, Users, TrendingUp } from "lucide-react";

// Milestone data with enhanced styling
const milestones = [
  {
    year: "1995",
    title: "Humble Beginnings",
    description: "Started with a vision to transform the industry through innovation and dedication.",
    emoji: "🌱",
    color: "from-green-400/20 to-emerald-500/20"
  },
  {
    year: "2000",
    title: "First Major Breakthrough",
    description: "Launched groundbreaking solution that revolutionized customer experience.",
    emoji: "🚀",
    color: "from-blue-400/20 to-cyan-500/20"
  },
  {
    year: "2008",
    title: "Global Expansion",
    description: "Expanded operations internationally, establishing presence across multiple continents.",
    emoji: "🌍",
    color: "from-purple-400/20 to-indigo-500/20"
  },
  {
    year: "2015",
    title: "Innovation Leadership",
    description: "Recognized as industry thought leader, pioneering next-generation technologies.",
    emoji: "🏆",
    color: "from-yellow-400/20 to-orange-500/20"
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description: "Led company through digital evolution, setting new standards for excellence.",
    emoji: "💫",
    color: "from-pink-400/20 to-rose-500/20"
  },
  {
    year: "2024",
    title: "Continued Excellence",
    description: "Celebrating decades of visionary leadership and sustainable growth.",
    emoji: "🎉",
    color: "from-primary/20 to-accent/20"
  }
];

// Core values with enhanced design
const values = [
  {
    icon: Lightbulb,
    title: "Visionary Innovation",
    description: "Pioneering breakthrough solutions that shape the future of our industry.",
    gradient: "from-primary to-primary-light"
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description: "Embracing knowledge and fostering growth at every level of the organization.",
    gradient: "from-accent to-yellow-500"
  },
  {
    icon: Rocket,
    title: "Excellence & Quality",
    description: "Maintaining the highest standards in everything we do, every single day.",
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    icon: Users,
    title: "Community Impact",
    description: "Building meaningful connections and creating positive change in our communities.",
    gradient: "from-green-500 to-teal-500"
  }
];

export const About = () => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-gradient-to-br from-background via-surface to-background">
      <div className="container-custom">
        {/* Header */}
        <motion.div 
          className="text-center space-y-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="badge-primary text-base px-6 py-2">Our Founder's Journey</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-satoshi font-bold text-foreground">
            A Legacy of{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Innovation & Leadership
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-space max-w-3xl mx-auto leading-relaxed">
            From humble beginnings to industry leadership, our founder's remarkable journey spans decades of 
            innovation, breakthrough achievements, and unwavering commitment to excellence.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-satoshi font-semibold text-center mb-12 text-foreground">
            Milestone Timeline
          </h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full transform -translate-y-1/2 hidden lg:block"></div>
            
            {/* Timeline Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`card-premium hover:scale-105 transition-transform duration-300 bg-gradient-to-br ${milestone.color} border-2`}>
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="text-4xl mb-2">{milestone.emoji}</div>
                      <Badge className="badge-primary font-satoshi font-semibold">
                        {milestone.year}
                      </Badge>
                      <h4 className="text-lg font-satoshi font-semibold text-foreground">
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-muted-foreground font-space leading-relaxed">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Timeline Connector for Large Screens */}
                  {index < milestones.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 bg-primary rounded-full border-4 border-background transform -translate-y-1/2 z-10 shadow-glow"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-satoshi font-semibold text-center mb-12 text-foreground">
            Guiding Principles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-premium group hover:shadow-glow transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center space-y-4 h-full flex flex-col">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-satoshi font-semibold text-foreground">
                        {value.title}
                      </h4>
                      <p className="text-sm text-muted-foreground font-space leading-relaxed flex-grow">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="card-glass p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-primary mr-3" />
              <h4 className="text-xl font-satoshi font-semibold text-foreground">
                Join the Celebration
              </h4>
            </div>
            <p className="text-muted-foreground font-space mb-6 leading-relaxed">
              Be part of this special milestone celebration by sharing your heartfelt wishes, 
              memories, and messages of appreciation for our visionary leader.
            </p>
            <Badge className="badge-accent">
              🎂 Making birthdays memorable since 1995
            </Badge>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};