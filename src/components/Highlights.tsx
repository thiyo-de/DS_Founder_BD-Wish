import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Video,
  Camera,
  Clock,
  ExternalLink,
} from "lucide-react";

// Updated data with YouTube video IDs and actual content
const highlights = [
  {
    id: "1",
    title: "Company Foundation Ceremony",
    description:
      "The historic moment when our founder established the company with a vision to revolutionize the industry",
    thumbnail:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    type: "video",
    duration: "3:45",
    date: "2020-03-15",
    views: "1.2M",
  },
  {
    id: "2",
    title: "Innovation Award Acceptance",
    description:
      "Receiving the prestigious industry innovation award for groundbreaking technology",
    thumbnail:
      "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=400&h=300&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    type: "video",
    duration: "2:30",
    date: "2021-06-22",
    views: "890K",
  },
  {
    id: "3",
    title: "Team Building Retreat",
    description:
      "Candid moments building relationships across the organization in our annual retreat",
    thumbnail:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    type: "video",
    duration: "4:15",
    date: "2022-09-10",
    views: "567K",
  },
  {
    id: "4",
    title: "Global Expansion Announcement",
    description:
      "The exciting announcement of our international expansion into European markets",
    thumbnail:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    type: "video",
    duration: "4:20",
    date: "2023-01-30",
    views: "1.5M",
  },
  {
    id: "5",
    title: "Leadership Summit",
    description:
      "Inspiring moments mentoring the next generation of leaders at our annual summit",
    thumbnail:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    type: "video",
    duration: "3:55",
    date: "2023-05-18",
    views: "723K",
  },
  {
    id: "6",
    title: "Community Impact Initiative",
    description:
      "Leading community initiatives and social responsibility programs across cities",
    thumbnail:
      "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=400&h=300&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    type: "video",
    duration: "5:15",
    date: "2023-11-05",
    views: "934K",
  },
];

const photoCarousel = [
  {
    id: "p1",
    title: "Early Days & Vision",
    description:
      "The journey begins with determination, vision, and a small team of passionate innovators working late nights to build something extraordinary",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    year: "1990s",
    decade: "Foundation",
  },
  {
    id: "p2",
    title: "First Office Space",
    description:
      "Setting up the foundation for future success with our first dedicated office space that became the birthplace of many innovations",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop",
    year: "2001",
    decade: "Establishment",
  },
  {
    id: "p3",
    title: "Team Growth & Culture",
    description:
      "Building an incredible team of talented individuals who shared our vision and helped scale the company to new heights",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    year: "2005",
    decade: "Expansion",
  },
  {
    id: "p4",
    title: "Innovation Lab Launch",
    description:
      "Creating dedicated spaces for creativity and breakthrough thinking that led to our most successful product lines",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    year: "2015",
    decade: "Innovation",
  },
  {
    id: "p5",
    title: "Global Presence Established",
    description:
      "Expanding our impact across continents and cultures with offices in 15 countries serving millions of customers worldwide",
    image:
      "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600&h=400&fit=crop",
    year: "2020",
    decade: "Globalization",
  },
];

export const Highlights = () => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photoCarousel.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + photoCarousel.length) % photoCarousel.length
    );
  };

  const VideoPreview = ({
    videoId,
    onClose,
  }: {
    videoId: string;
    onClose: () => void;
  }) => {
    const video = highlights.find((v) => v.id === videoId);

    return (
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-white to-[#E8E8ED] rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-outfit font-bold text-2xl bg-gradient-to-r from-[#0606bc] to-[#FF6B6B] bg-clip-text text-transparent">
                {video?.title}
              </h3>
              <p className="text-sm text-[#333333] mt-1">
                {video?.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-[#FF6B6B] hover:text-white rounded-full w-10 h-10 p-0 transition-colors border-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 relative">
            {video?.youtubeId && (
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section
      id="highlights"
      className="pb-20 pt-40 bg-gradient-to-br from-[#faf200]/20 via-white to-[#0606bc]/10 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-[#0606bc]/20 to-[#FF6B6B]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-[#faf200]/20 to-[#FF6B6B]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-[#FF6B6B]/15 to-[#0606bc]/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-[#0606bc] to-[#FF6B6B] text-white px-4 py-1.5 text-sm font-semibold border-0">
            Memories & Milestones
          </Badge>
          <h2 className="text-4xl md:text-6xl font-outfit font-bold mb-6 bg-gradient-to-r from-[#0606bc] to-[#0A0A2E] bg-clip-text text-transparent">
            Journey Highlights
          </h2>
          <p className="text-lg md:text-xl text-[#333333] max-w-3xl mx-auto leading-relaxed">
            Relive the most memorable moments, groundbreaking achievements, and
            inspiring milestones that define our incredible journey and lasting
            impact on the industry.
          </p>
        </motion.div>

        {/* Video Highlights Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-[#0606bc] to-[#FF6B6B] rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Video className="h-6 w-6 text-white" />
            </motion.div>
            <h3 className="text-3xl font-outfit font-bold bg-gradient-to-r from-[#0606bc] to-[#0A0A2E] bg-clip-text text-transparent">
              Featured Videos
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex"
                onMouseEnter={() => setHoveredCard(highlight.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card className="group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm overflow-hidden flex-1 hover:scale-[1.02] border border-white/20">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <motion.img
                        src={highlight.thumbnail}
                        alt={highlight.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Play button overlay */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          onClick={() => setPreviewVideo(highlight.id)}
                          className="bg-gradient-to-r from-[#faf200] to-[#FF6B6B] text-white rounded-full w-20 h-20 p-0 shadow-2xl border-0 hover:scale-110 transition-transform duration-300"
                        >
                          <motion.div
                            animate={{
                              scale:
                                hoveredCard === highlight.id ? [1, 1.1, 1] : 1,
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Play className="h-8 w-8 ml-1" />
                          </motion.div>
                        </Button>
                      </motion.div>

                      {/* Video badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#0606bc] text-white px-3 py-1.5 font-semibold border-0">
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      </div>

                      {/* Duration and views */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <Badge className="bg-black/80 text-white px-2 py-1 border-0 font-medium">
                          <Clock className="h-3 w-3 mr-1" />
                          {highlight.duration}
                        </Badge>
                        <Badge className="bg-[#FF6B6B]/90 text-white px-2 py-1 border-0 font-medium">
                          {highlight.views} views
                        </Badge>
                      </div>

                      {/* Date badge */}
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-white/90 text-[#333333] px-2 py-1 border-0 font-medium backdrop-blur-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(highlight.date).getFullYear()}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <motion.div
                      className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-[#FEFDF8]"
                      whileHover={{ backgroundColor: "#F5F5F5" }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="font-outfit font-bold text-xl text-[#0A0A2E] mb-3 leading-tight">
                        {highlight.title}
                      </h4>

                      <p className="text-[#333333] text-sm leading-relaxed flex-1 mb-4">
                        {highlight.description}
                      </p>

                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-[#E8E8ED]">
                        <div className="flex items-center text-sm text-[#666666]">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(highlight.date).toLocaleDateString()}
                        </div>
                        <Button
                          onClick={() => setPreviewVideo(highlight.id)}
                          className="bg-gradient-to-r from-[#0606bc] to-[#FF6B6B] text-white border-0 hover:from-[#FF6B6B] hover:to-[#0606bc] transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Watch Now
                        </Button>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Founder Journey Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="px-2"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-[#FF6B6B] to-[#0606bc] rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Camera className="h-6 w-6 text-white" />
            </motion.div>
            <h3 className="text-3xl font-outfit font-bold bg-gradient-to-r from-[#0A0A2E] to-[#0606bc] bg-clip-text text-transparent">
              Founder Journey
            </h3>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-white to-[#FEFDF8] border border-white/50">
              <CardContent className="p-0">
                <div className="aspect-video md:aspect-[16/9] relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      src={photoCarousel[currentPhotoIndex].image}
                      alt={photoCarousel[currentPhotoIndex].title}
                      className="w-full h-full object-cover"
                      key={currentPhotoIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Navigation Buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-lg w-12 h-12 rounded-full hidden sm:flex transition-all hover:scale-110"
                    onClick={prevPhoto}
                  >
                    <ChevronLeft className="h-6 w-6 text-[#0A0A2E]" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-lg w-12 h-12 rounded-full hidden sm:flex transition-all hover:scale-110"
                    onClick={nextPhoto}
                  >
                    <ChevronRight className="h-6 w-6 text-[#0A0A2E]" />
                  </Button>

                  {/* Mobile Navigation */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between sm:hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-lg w-10 h-10 rounded-full"
                      onClick={prevPhoto}
                    >
                      <ChevronLeft className="h-5 w-5 text-[#0A0A2E]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-lg w-10 h-10 rounded-full"
                      onClick={nextPhoto}
                    >
                      <ChevronRight className="h-5 w-5 text-[#0A0A2E]" />
                    </Button>
                  </div>

                  {/* Progress Indicators */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {photoCarousel.map((_, index) => (
                      <motion.button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 border-2 border-white ${
                          index === currentPhotoIndex
                            ? "bg-gradient-to-r from-[#faf200] to-[#FF6B6B] scale-125"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                        onClick={() => setCurrentPhotoIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-8 text-center bg-gradient-to-r from-white to-[#FEFDF8]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPhotoIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                        <Badge className="bg-gradient-to-r from-[#0606bc] to-[#0A0A2E] text-white border-0 px-4 py-1.5 text-sm font-semibold">
                          {photoCarousel[currentPhotoIndex].decade}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[#333333] border-[#0606bc] px-3 py-1 border"
                        >
                          {photoCarousel[currentPhotoIndex].year}
                        </Badge>
                      </div>
                      <h4 className="font-outfit font-bold text-2xl md:text-3xl mb-3 text-[#0A0A2E] leading-tight">
                        {photoCarousel[currentPhotoIndex].title}
                      </h4>
                      <p className="text-[#333333] leading-relaxed text-lg max-w-2xl mx-auto">
                        {photoCarousel[currentPhotoIndex].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewVideo && (
          <VideoPreview
            videoId={previewVideo}
            onClose={() => setPreviewVideo(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
