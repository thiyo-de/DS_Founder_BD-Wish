import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, GraduationCap, Lightbulb, Users, Calendar, MapPin } from "lucide-react";

const milestones = [
  {
    year: "1985",
    title: "Early Beginnings",
    description: "Started the entrepreneurial journey with a vision to transform the industry",
    image: "🌱"
  },
  {
    year: "1992",
    title: "First Major Breakthrough",
    description: "Launched innovative solution that revolutionized market approach",
    image: "🚀"
  },
  {
    year: "2001",
    title: "Company Foundation",
    description: "Established the company that would become an industry leader",
    image: "🏢"
  },
  {
    year: "2010",
    title: "Global Expansion",
    description: "Successfully expanded operations to international markets",
    image: "🌍"
  },
  {
    year: "2020",
    title: "Innovation Excellence",
    description: "Received industry recognition for outstanding innovation and leadership",
    image: "🏆"
  },
  {
    year: "2024",
    title: "Continued Legacy",
    description: "Inspiring the next generation of leaders and innovators",
    image: "✨"
  }
];

const values = [
  {
    icon: <Building className="h-8 w-8" />,
    title: "Visionary Leadership",
    description: "Transforming industries through strategic thinking and bold decisions"
  },
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: "Commitment to Education",
    description: "Dedicated to learning, growth, and knowledge sharing"
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: "Innovation Excellence",
    description: "Pioneering solutions that create lasting positive impact"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Community Builder",
    description: "Fostering connections and empowering teams to achieve greatness"
  }
];

export const About = () => {
  return (
    <section id="about" className="py-20 bg-surface">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-outfit font-bold mb-6 text-primary">
            About Our Founder
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A remarkable journey of innovation, leadership, and dedication to creating 
            meaningful change in the world. From humble beginnings to transformative achievements, 
            our founder's story continues to inspire and guide us forward.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-outfit font-semibold text-center mb-12 flex items-center justify-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Milestones & Journey
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-accent opacity-30"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={`flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-1 px-8">
                    <Card className="wish-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary" className="bg-primary text-primary-foreground">
                            {milestone.year}
                          </Badge>
                          <span className="text-2xl">{milestone.image}</span>
                        </div>
                        <h4 className="font-outfit font-semibold text-lg mb-2">
                          {milestone.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="w-4 h-4 bg-accent rounded-full border-4 border-background shadow-soft z-10"></div>
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-outfit font-semibold text-center mb-12 flex items-center justify-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Core Values & Impact
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="wish-card text-center h-full">
                  <CardContent className="p-6">
                    <div className="text-primary mb-4 flex justify-center">
                      {value.icon}
                    </div>
                    <h4 className="font-outfit font-semibold text-lg mb-3">
                      {value.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};