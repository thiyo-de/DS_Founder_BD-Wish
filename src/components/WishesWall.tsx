import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Image, Music, MessageSquare, Search, Filter, Heart, Share, ExternalLink, Play } from "lucide-react";

// Mock data for demonstration
const mockWishes = [
  {
    id: "1",
    type: "video",
    name: "Sarah Johnson",
    message: "Happy birthday! Here's a special message from the team",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    provider: "youtube",
    status: "approved",
    createdAt: new Date("2024-01-15"),
    org: "Marketing Department",
    city: "New York",
    likes: 12
  },
  {
    id: "2",
    type: "text",
    name: "Michael Chen",
    message: "Your visionary leadership has transformed our company. Wishing you another year of success, innovation, and happiness. Thank you for being such an inspiring leader!",
    status: "approved",
    createdAt: new Date("2024-01-14"),
    city: "San Francisco",
    likes: 8
  },
  {
    id: "3",
    type: "photo",
    name: "Emily Rodriguez",
    message: "Team photo from our last conference where you inspired us all",
    url: "https://drive.google.com/file/d/example123/view",
    provider: "drive",
    status: "approved",
    createdAt: new Date("2024-01-13"),
    org: "Engineering Team",
    likes: 15
  },
  {
    id: "4",
    type: "voice",
    name: "David Kim",
    message: "A heartfelt birthday song from the Seoul office",
    url: "https://soundcloud.com/user/birthday-wish",
    provider: "soundcloud",
    status: "approved",
    createdAt: new Date("2024-01-12"),
    org: "Seoul Branch",
    city: "Seoul",
    likes: 6
  },
  {
    id: "5",
    type: "text",
    name: "Lisa Wong",
    message: "Happy birthday to the most inspiring leader! 🎉 Your dedication to innovation continues to amaze us all.",
    status: "approved",
    createdAt: new Date("2024-01-11"),
    org: "Product Team",
    likes: 9
  }
];

const filters = ["All", "Video", "Photo/Post", "Voice", "Text", "Latest", "Most Liked"];

export const WishesWall = () => {
  const [wishes] = useState(mockWishes);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [likedWishes, setLikedWishes] = useState<Set<string>>(new Set());

  const toggleLike = (wishId: string) => {
    setLikedWishes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wishId)) {
        newSet.delete(wishId);
      } else {
        newSet.add(wishId);
      }
      return newSet;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "photo": 
      case "post": return <Image className="h-4 w-4" />;
      case "voice": return <Music className="h-4 w-4" />;
      case "text": return <MessageSquare className="h-4 w-4" />;
      default: return null;
    }
  };

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case "youtube": return { text: "YouTube", color: "bg-red-100 text-red-800" };
      case "vimeo": return { text: "Vimeo", color: "bg-blue-100 text-blue-800" };
      case "instagram": return { text: "Instagram", color: "bg-pink-100 text-pink-800" };
      case "facebook": return { text: "Facebook", color: "bg-blue-100 text-blue-800" };
      case "drive": return { text: "Google Drive", color: "bg-green-100 text-green-800" };
      case "soundcloud": return { text: "SoundCloud", color: "bg-orange-100 text-orange-800" };
      default: return null;
    }
  };

  const filteredWishes = wishes
    .filter(wish => {
      const matchesSearch = wish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wish.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wish.org?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === "All" || 
                           activeFilter.toLowerCase().replace("/post", "").replace("/", "") === wish.type ||
                           (activeFilter === "Photo/Post" && (wish.type === "photo" || wish.type === "post"));
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (activeFilter === "Most Liked") {
        return (b.likes || 0) - (a.likes || 0);
      }
      if (activeFilter === "Latest") {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  const WishCard = ({ wish }: { wish: typeof mockWishes[0] }) => {
    const isLiked = likedWishes.has(wish.id);
    const providerBadge = wish.provider ? getProviderBadge(wish.provider) : null;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="wish-card h-full">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(wish.type)}
                <span className="font-medium text-sm capitalize">{wish.type}</span>
                {providerBadge && (
                  <Badge className={`text-xs ${providerBadge.color}`}>
                    {providerBadge.text}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {wish.createdAt.toLocaleDateString()}
              </span>
            </div>

            {/* Content based on type */}
            {wish.type === "video" && (
              <div className="mb-4">
                <div className="aspect-video bg-surface rounded-lg flex items-center justify-center mb-3">
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            )}

            {(wish.type === "photo" || wish.type === "post") && (
              <div className="mb-4">
                <div className="aspect-square bg-surface rounded-lg flex items-center justify-center mb-3">
                  <Image className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
            )}

            {wish.type === "voice" && (
              <div className="mb-4">
                <div className="bg-surface rounded-lg p-4 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <Music className="h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Voice Message</span>
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="mb-4">
              <h4 className="font-outfit font-semibold mb-2">{wish.name}</h4>
              {wish.message && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {wish.message}
                </p>
              )}
            </div>

            {/* Meta info */}
            <div className="text-xs text-muted-foreground mb-4 space-y-1">
              {wish.org && <div>{wish.org}</div>}
              {wish.city && <div>{wish.city}</div>}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLike(wish.id)}
                className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{(wish.likes || 0) + (isLiked ? 1 : 0)}</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
                {wish.url && (
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <section id="wishes" className="py-20 bg-surface">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-outfit font-bold mb-6 text-primary">
            Birthday Wishes Wall
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Heartfelt messages, videos, photos, and voice notes from colleagues, 
            friends, and admirers celebrating our founder's special day.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search wishes by name, message, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filter:</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "bg-primary text-primary-foreground" : ""}
              >
                {filter}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Wishes Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {filteredWishes.map((wish, index) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <WishCard wish={wish} />
            </motion.div>
          ))}
        </motion.div>

        {filteredWishes.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-outfit font-semibold text-lg mb-2">No wishes found</h3>
                <p className="text-muted-foreground text-sm">
                  {searchTerm ? "Try adjusting your search terms or filters." : "Approved wishes will appear here soon."}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {filteredWishes.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" className="btn-hero-outline">
              Load More Wishes
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};