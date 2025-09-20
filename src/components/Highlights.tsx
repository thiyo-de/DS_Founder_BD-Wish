import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, X, ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";

const highlights = [
  {
    id: "1",
    title: "Company Foundation Ceremony",
    description: "The historic moment when our founder established the company",
    thumbnail: "🏢",
    type: "video",
    date: "2001",
    location: "Silicon Valley",
    duration: "3:45"
  },
  {
    id: "2",
    title: "Innovation Award Acceptance",
    description: "Receiving the prestigious industry innovation award",
    thumbnail: "🏆",
    type: "video",
    date: "2020",
    location: "New York",
    duration: "2:30"
  },
  {
    id: "3",
    title: "Team Building Moments",
    description: "Candid moments building relationships across the organization",
    thumbnail: "👥",
    type: "photo",
    date: "2023",
    location: "Various"
  },
  {
    id: "4",
    title: "Global Expansion Announcement",
    description: "The exciting announcement of international expansion",
    thumbnail: "🌍",
    type: "video",
    date: "2010",
    location: "London",
    duration: "4:20"
  },
  {
    id: "5",
    title: "Mentorship Sessions",
    description: "Inspiring moments mentoring the next generation of leaders",
    thumbnail: "📚",
    type: "photo",
    date: "2022",
    location: "Campus"
  },
  {
    id: "6",
    title: "Community Impact Project",
    description: "Leading community initiatives and social responsibility programs",
    thumbnail: "❤️",
    type: "video",
    date: "2019",
    location: "Community Center",
    duration: "5:15"
  }
];

const photoCarousel = [
  {
    id: "p1",
    title: "Early Days",
    description: "The journey begins with determination and vision",
    image: "🌱",
    year: "1990s"
  },
  {
    id: "p2",
    title: "First Office",
    description: "Setting up the foundation for future success",
    image: "🏢",
    year: "2001"
  },
  {
    id: "p3",
    title: "Team Growth",
    description: "Building an incredible team of talented individuals",
    image: "👥",
    year: "2005"
  },
  {
    id: "p4",
    title: "Innovation Lab",
    description: "Creating spaces for creativity and breakthrough thinking",
    image: "⚡",
    year: "2015"
  },
  {
    id: "p5",
    title: "Global Presence",
    description: "Expanding impact across continents and cultures",
    image: "🌍",
    year: "2020"
  }
];

export const Highlights = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photoCarousel.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photoCarousel.length) % photoCarousel.length);
  };

  const VideoLightbox = ({ videoId, onClose }: { videoId: string; onClose: () => void }) => (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-background rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-outfit font-semibold text-xl">Video Highlight</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="aspect-video bg-surface rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Play className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Video player would be embedded here</p>
            <p className="text-sm text-muted-foreground mt-2">
              In production, this would show the actual video content
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <section id="highlights" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-outfit font-bold mb-6 text-primary">
            Highlights & Memories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of memorable moments, achievements, and milestones that 
            showcase the incredible journey and impact of our founder.
          </p>
        </motion.div>

        {/* Video Highlights */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-outfit font-semibold text-center mb-12">
            📹 Video Highlights
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="wish-card overflow-hidden group cursor-pointer"
                      onClick={() => highlight.type === "video" && setSelectedVideo(highlight.id)}>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-accent relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-70">{highlight.thumbnail}</span>
                      </div>
                      
                      {highlight.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow">
                              <Play className="h-8 w-8 text-primary-foreground ml-1" />
                            </div>
                          </motion.div>
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-background/90 text-foreground">
                          {highlight.type === "video" ? "📹 Video" : "📷 Photo"}
                        </Badge>
                      </div>
                      
                      {highlight.duration && (
                        <div className="absolute bottom-4 right-4">
                          <Badge variant="secondary" className="bg-black/60 text-white">
                            {highlight.duration}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h4 className="font-outfit font-semibold text-lg mb-2">
                        {highlight.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {highlight.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {highlight.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {highlight.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Photo Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-outfit font-semibold text-center mb-12">
            📸 Photo Journey
          </h3>
          
          <div className="relative max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-card">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-hero relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span 
                      className="text-8xl"
                      key={currentPhotoIndex}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {photoCarousel[currentPhotoIndex].image}
                    </motion.span>
                  </div>
                  
                  {/* Navigation */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={prevPhoto}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={nextPhoto}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  
                  {/* Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {photoCarousel.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentPhotoIndex ? "bg-accent" : "bg-white/50"
                        }`}
                        onClick={() => setCurrentPhotoIndex(index)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <motion.div
                    key={currentPhotoIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Badge variant="outline" className="mb-3">
                      {photoCarousel[currentPhotoIndex].year}
                    </Badge>
                    <h4 className="font-outfit font-semibold text-xl mb-2">
                      {photoCarousel[currentPhotoIndex].title}
                    </h4>
                    <p className="text-muted-foreground">
                      {photoCarousel[currentPhotoIndex].description}
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Video Lightbox */}
      {selectedVideo && (
        <VideoLightbox
          videoId={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  );
};