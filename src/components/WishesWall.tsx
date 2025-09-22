import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Image, Music, MessageSquare, Search, Filter, ExternalLink, Play } from "lucide-react";
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
  // New file-based fields
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  duration: number | null;
  thumbnail_url: string | null;
};

const filters = ["All", "Video", "Photo/Post", "Voice", "Text", "Latest"];

export const WishesWall = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

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
    const providerBadge = wish.provider ? getProviderBadge(wish.provider) : null;
    const isFileBased = !!wish.file_url;

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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
                {isFileBased && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    Uploaded
                  </Badge>
                )}
                {!isFileBased && providerBadge && (
                  <Badge className={`text-xs ${providerBadge.color}`}>
                    {providerBadge.text}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(wish.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Content based on type and whether it's file-based */}
            {wish.type === "video" && (
              <div className="mb-4">
                {isFileBased ? (
                  <div className="relative aspect-video bg-surface rounded-lg overflow-hidden">
                    {wish.thumbnail_url ? (
                      <img 
                        src={wish.thumbnail_url} 
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                    {wish.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(wish.duration)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-surface rounded-lg flex items-center justify-center mb-3">
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {(wish.type === "photo" || wish.type === "post") && (
              <div className="mb-4">
                {isFileBased ? (
                  <div className="relative aspect-square bg-surface rounded-lg overflow-hidden">
                    <img 
                      src={wish.file_url} 
                      alt="Uploaded image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-surface rounded-lg flex items-center justify-center mb-3">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            )}

            {wish.type === "voice" && (
              <div className="mb-4">
                {isFileBased ? (
                  <div className="bg-surface rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Music className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Voice Message</div>
                        <div className="text-xs text-muted-foreground">
                          {wish.duration && formatDuration(wish.duration)} • {wish.file_size && formatFileSize(wish.file_size)}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <audio 
                      controls 
                      className="w-full h-8"
                      src={wish.file_url}
                    />
                  </div>
                ) : (
                  <div className="bg-surface rounded-lg p-4 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                      <Music className="h-6 w-6 text-primary" />
                      <span className="text-sm text-muted-foreground">Voice Message</span>
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
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
              {isFileBased && wish.file_size && (
                <div>File size: {formatFileSize(wish.file_size)}</div>
              )}
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