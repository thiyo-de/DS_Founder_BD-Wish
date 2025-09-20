import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Crown, Medal, Zap } from "lucide-react";

const awards = [
  {
    id: "1",
    title: "Innovation Excellence Award",
    issuer: "Tech Industry Association",
    year: "2023",
    icon: <Trophy className="h-8 w-8" />,
    description: "Recognized for groundbreaking innovations that transformed industry standards and practices.",
    category: "Innovation",
    color: "text-yellow-600"
  },
  {
    id: "2",
    title: "Outstanding Leadership Recognition",
    issuer: "Business Leaders Forum",
    year: "2022",
    icon: <Crown className="h-8 w-8" />,
    description: "Honored for exceptional leadership skills and ability to inspire teams toward excellence.",
    category: "Leadership",
    color: "text-purple-600"
  },
  {
    id: "3",
    title: "Entrepreneur of the Year",
    issuer: "Global Business Council",
    year: "2021",
    icon: <Star className="h-8 w-8" />,
    description: "Celebrated for visionary entrepreneurship and successful business development strategies.",
    category: "Entrepreneurship",
    color: "text-blue-600"
  },
  {
    id: "4",
    title: "Community Impact Champion",
    issuer: "Social Impact Network",
    year: "2020",
    icon: <Medal className="h-8 w-8" />,
    description: "Acknowledged for significant contributions to community development and social responsibility.",
    category: "Social Impact",
    color: "text-green-600"
  },
  {
    id: "5",
    title: "Digital Transformation Pioneer",
    issuer: "Technology Innovation Board",
    year: "2019",
    icon: <Zap className="h-8 w-8" />,
    description: "Leading the digital revolution and implementing cutting-edge technological solutions.",
    category: "Technology",
    color: "text-orange-600"
  },
  {
    id: "6",
    title: "Excellence in Corporate Culture",
    issuer: "Workplace Excellence Institute",
    year: "2018",
    icon: <Award className="h-8 w-8" />,
    description: "Building an inclusive, innovative, and empowering workplace culture for all employees.",
    category: "Culture",
    color: "text-pink-600"
  }
];

const legacyImages = [
  {
    id: "l1",
    title: "Founding Moment",
    description: "The historic signing of the company charter",
    image: "📋",
    year: "2001"
  },
  {
    id: "l2",
    title: "First Major Client",
    description: "Celebrating the partnership that launched our growth",
    image: "🤝",
    year: "2003"
  },
  {
    id: "l3",
    title: "Team Milestone",
    description: "Reaching 100 employees - a family grows",
    image: "👥",
    year: "2008"
  },
  {
    id: "l4",
    title: "Innovation Lab Launch",
    description: "Opening our state-of-the-art research facility",
    image: "🔬",
    year: "2012"
  },
  {
    id: "l5",
    title: "Global Recognition",
    description: "Accepting our first international award",
    image: "🌍",
    year: "2015"
  },
  {
    id: "l6",
    title: "Next Generation",
    description: "Mentoring future leaders and innovators",
    image: "🌱",
    year: "2020"
  },
  {
    id: "l7",
    title: "Sustainability Initiative",
    description: "Leading environmental responsibility programs",
    image: "♻️",
    year: "2021"
  },
  {
    id: "l8",
    title: "Community Center",
    description: "Opening our community impact center",
    image: "🏛️",
    year: "2022"
  }
];

export const Awards = () => {
  return (
    <section id="legacy" className="py-20 bg-surface">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-outfit font-bold mb-6 text-primary">
            Awards & Legacy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A testament to excellence, innovation, and positive impact. These recognitions 
            reflect not just individual achievement, but the collective success of our entire organization.
          </p>
        </motion.div>

        {/* Awards Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-outfit font-semibold text-center mb-12">
            🏆 Awards & Recognition
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="wish-card h-full group hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 ${award.color}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {award.icon}
                    </motion.div>
                    
                    <div className="mb-3">
                      <Badge variant="secondary" className="mb-2">
                        {award.year}
                      </Badge>
                      <Badge variant="outline" className={`ml-2 ${award.color} border-current`}>
                        {award.category}
                      </Badge>
                    </div>
                    
                    <h4 className="font-outfit font-semibold text-lg mb-2">
                      {award.title}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground mb-3 font-medium">
                      {award.issuer}
                    </p>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
          <h3 className="text-2xl font-outfit font-semibold text-center mb-12">
            📸 Legacy Moments
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {legacyImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="overflow-hidden aspect-square">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-full bg-gradient-accent flex items-center justify-center">
                      <span className="text-4xl md:text-5xl">{image.image}</span>
                      
                      <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center text-primary-foreground p-4">
                          <div className="text-xs font-medium mb-1">{image.year}</div>
                          <div className="text-sm font-semibold mb-2">{image.title}</div>
                          <div className="text-xs opacity-90 leading-tight">{image.description}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="inline-block bg-accent/10 border-accent/30">
              <CardContent className="p-6">
                <p className="text-lg font-outfit font-medium text-accent-foreground">
                  "The best legacy we can leave is not just what we've accomplished, 
                  but the inspiration and opportunities we've created for others to achieve even more."
                </p>
                <p className="text-sm text-muted-foreground mt-3 font-medium">
                  — Our Founder's Philosophy
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};