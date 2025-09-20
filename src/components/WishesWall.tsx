import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Image, Music, MessageSquare, Search, Filter, Heart, Share, ExternalLink, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Submission = {
  id: string;
  type: 'video' | 'photo' | 'post' | 'voice' | 'text';
  name: string;
  message: string | null;
  url: string | null;
  provider: string | null;
  org: string | null;
  city: string | null;
  created_at: string;
};

const filters = ["All", "Video", "Photo/Post", "Voice", "Text", "Latest"];

export const WishesWall = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [likedWishes, setLikedWishes] = useState<Set<string>>(new Set());

  const { data: wishes = [], isLoading } = useQuery({
    queryKey: ['approved-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Submission[];
    }
  });

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
      if (activeFilter === "Latest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const WishCard = ({ wish }: { wish: Submission }) => {
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
                {new Date(wish.created_at).toLocaleDateString()}
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
                <span className="text-xs">{isLiked ? 1 : 0}</span>
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
    <section id="wishes" className="py-16 lg:py-24 bg-neutral-50">
      <div className="container-modern">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-2xl sm:text-3xl font-outfit font-semibold text-[#0F0EB4] mb-3">
            Birthday Wishes Wall
          </h2>
          <span className="section-divider" />
          <p className="text-xl text-body max-w-3xl mx-auto mt-6">
            Heartfelt messages, videos, photos, and voice notes from colleagues, 
            friends, and admirers celebrating our founder's special day.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="filter-bar-sticky mb-12 py-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <Input
                placeholder="Search wishes by name, message, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-neutral-500" />
              <span className="text-sm font-medium text-neutral-700">Filter:</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "bg-[#0F0EB4] text-white" : "btn-secondary text-sm"}
              >
                {filter}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Wishes Grid */}
        {isLoading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <p className="text-muted-foreground">Loading wishes...</p>
          </motion.div>
        )}

        {!isLoading && (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {filteredWishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -2 }}
              >
                <WishCard wish={wish} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filteredWishes.length === 0 && (
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

        {!isLoading && filteredWishes.length > 0 && (
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