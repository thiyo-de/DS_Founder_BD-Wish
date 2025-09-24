import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Video, 
  Image, 
  Music, 
  MessageSquare, 
  Search, 
  Filter, 
  ExternalLink, 
  Play, 
  X, 
  Calendar, 
  MapPin, 
  Users,
  Star,
  Heart,
  FileText,
  Mic,
  Film,
  Zap,
  Loader
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Submission = {
  id: string;
  type: 'video' | 'photo' | 'post' | 'voice' | 'text' | 'image' | 'audio';
  name: string;
  message: string | null;
  url: string | null;
  provider: string | null;
  org: string | null;
  city: string | null;
  created_at: string;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  duration: number | null;
  thumbnail_url: string | null;
};

// Design Tokens
const DESIGN_TOKENS = {
  colors: {
    brandBlue: '#0606bc',
    brandYellow: '#faf200',
    coralAccent: '#FF6B6B',
    lightGray: '#F5F5F5',
    deepNavy: '#0A0A2E',
    coolGray: '#E8E8ED',
    offWhite: '#FEFDF8',
    darkCharcoal: '#333333',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #FEFDF8 0%, #E8E8ED 100%)',
    cardHover: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    accent: 'linear-gradient(135deg, #0606bc 0%, #0A0A2E 100%)',
  }
} as const;

const filters = [
  { key: "all", label: "All", icon: Zap, count: 0 },
  { key: "video", label: "Video", icon: Film, count: 0 },
  { key: "photo", label: "Photo", icon: Image, count: 0 },
  { key: "audio", label: "Audio", icon: Mic, count: 0 },
  { key: "text", label: "Text", icon: FileText, count: 0 },
  { key: "latest", label: "Latest", icon: Star, count: 0 }
];

// Extracted WishCard Component
const WishCard = ({ 
  wish, 
  onPreview 
}: { 
  wish: Submission; 
  onPreview: (wish: Submission) => void;
}) => {
  const isFileBased = !!wish.file_url;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" aria-hidden="true" />;
      case "photo": 
      case "image":
      case "post": return <Image className="h-4 w-4" aria-hidden="true" />;
      case "voice":
      case "audio": return <Mic className="h-4 w-4" aria-hidden="true" />;
      case "text": return <FileText className="h-4 w-4" aria-hidden="true" />;
      default: return <MessageSquare className="h-4 w-4" aria-hidden="true" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-red-50 text-red-700 border-red-200";
      case "photo": 
      case "image":
      case "post": return "bg-green-50 text-green-700 border-green-200";
      case "voice":
      case "audio": return "bg-purple-50 text-purple-700 border-purple-200";
      case "text": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case "video": return "from-red-50 to-orange-50";
      case "photo": 
      case "image":
      case "post": return "from-green-50 to-emerald-50";
      case "voice":
      case "audio": return "from-purple-50 to-pink-50";
      case "text": return "from-blue-50 to-cyan-50";
      default: return "from-gray-50 to-slate-50";
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        className="group relative bg-white border-2 border-cool-gray rounded-xl transition-all duration-300 hover:shadow-lg hover:border-brand-blue h-full flex flex-col"
        style={{ 
          '--brand-blue': DESIGN_TOKENS.colors.brandBlue,
          '--cool-gray': DESIGN_TOKENS.colors.coolGray,
        } as React.CSSProperties}
      >
        <CardContent className="p-4 flex flex-col h-full">
          {/* Header with type badge and date */}
          <div className="flex items-center justify-between mb-3">
            <Badge 
              className={`px-2 py-1 border text-xs font-semibold ${getTypeColor(wish.type)}`}
              aria-label={`Type: ${wish.type}`}
            >
              <div className="flex items-center gap-1.5">
                {getTypeIcon(wish.type)}
                <span className="capitalize">
                  {wish.type === 'voice' ? 'audio' : wish.type === 'photo' ? 'image' : wish.type}
                </span>
              </div>
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <time dateTime={wish.created_at}>
                {new Date(wish.created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </time>
            </div>
          </div>

          {/* Media Preview */}
          <div className="mb-3 flex-1">
            {wish.type === "video" && (
              <div 
                className={`relative aspect-video bg-gradient-to-br ${getTypeGradient(wish.type)} rounded-lg overflow-hidden mb-2`}
                role="img"
                aria-label="Video preview"
              >
                {isFileBased && wish.thumbnail_url ? (
                  <img 
                    src={wish.thumbnail_url} 
                    alt={`Video thumbnail for ${wish.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full w-10 h-10 p-0 shadow-md"
                    onClick={() => onPreview(wish)}
                    aria-label={`Play video from ${wish.name}`}
                  >
                    <Play className="h-4 w-4 ml-0.5" aria-hidden="true" />
                  </Button>
                </div>
                {wish.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(wish.duration)}
                  </div>
                )}
              </div>
            )}

            {(wish.type === "photo" || wish.type === "post" || wish.type === "image") && (
              <div 
                className={`relative aspect-square bg-gradient-to-br ${getTypeGradient(wish.type)} rounded-lg overflow-hidden cursor-pointer mb-2`}
                onClick={() => onPreview(wish)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onPreview(wish)}
                aria-label={`View image from ${wish.name}`}
              >
                {isFileBased && wish.file_url ? (
                  <img 
                    src={wish.file_url} 
                    alt={`Image submission from ${wish.name}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium shadow-lg">
                      View Image
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(wish.type === "voice" || wish.type === "audio") && (
              <div 
                className={`bg-gradient-to-br ${getTypeGradient(wish.type)} rounded-lg p-3 cursor-pointer mb-2`}
                onClick={() => onPreview(wish)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onPreview(wish)}
                aria-label={`Play audio message from ${wish.name}`}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-white/80 p-1.5 rounded-full">
                    <Mic className="h-4 w-4 text-gray-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">Audio Message</div>
                    <div className="text-xs text-gray-600">
                      {wish.duration && formatDuration(wish.duration)}
                      {wish.file_size && ` • ${formatFileSize(wish.file_size)}`}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="bg-white/80 shadow-sm h-8 w-8 p-0">
                    <Play className="h-3 w-3" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            )}

            {wish.type === "text" && (
              <div 
                className={`bg-gradient-to-br ${getTypeGradient(wish.type)} rounded-lg p-4 mb-2 min-h-[100px] flex items-center justify-center cursor-pointer`}
                onClick={() => onPreview(wish)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onPreview(wish)}
                aria-label={`Read text message from ${wish.name}`}
              >
                <div className="text-center">
                  <FileText className="h-6 w-6 text-gray-500 mx-auto mb-1" aria-hidden="true" />
                  <span className="text-xs text-gray-600">Text Message</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            <h3 className="font-semibold text-base mb-1.5 text-gray-900 line-clamp-2 leading-tight">
              {wish.name}
            </h3>
            
            {wish.message && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-2">
                {wish.message}
              </p>
            )}

            {/* Meta info */}
            <div className="space-y-1.5 mt-auto">
              {wish.org && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Users className="h-3 w-3" aria-hidden="true" />
                  <span className="line-clamp-1">{wish.org}</span>
                </div>
              )}
              
              {wish.city && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  <span>{wish.city}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-3 border-gray-300 text-gray-700 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition-colors"
            onClick={() => onPreview(wish)}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Extracted PreviewDialog Component
const PreviewDialog = ({ 
  wish, 
  open, 
  onClose 
}: { 
  wish: Submission | null; 
  open: boolean; 
  onClose: () => void;
}) => {
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-5 w-5" aria-hidden="true" />;
      case "photo": 
      case "image":
      case "post": return <Image className="h-5 w-5" aria-hidden="true" />;
      case "voice":
      case "audio": return <Mic className="h-5 w-5" aria-hidden="true" />;
      case "text": return <FileText className="h-5 w-5" aria-hidden="true" />;
      default: return <MessageSquare className="h-5 w-5" aria-hidden="true" />;
    }
  };

  if (!wish) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl w-full h-[90vh] sm:h-[80vh] p-0 overflow-hidden border-0 bg-white"
        aria-labelledby="preview-dialog-title"
      >
        <div className="flex flex-col h-full rounded-lg overflow-hidden shadow-2xl">
          <DialogHeader className="p-4 border-b bg-gradient-to-r from-brand-blue to-deep-navy text-white">
            <div className="flex items-center justify-between">
              <DialogTitle 
                id="preview-dialog-title"
                className="flex items-center gap-3 text-white"
              >
                <div className="bg-white/20 p-1.5 rounded-lg">
                  {getTypeIcon(wish.type)}
                </div>
                <div>
                  <div className="text-base font-semibold">{wish.name}</div>
                  {wish.message && (
                    <DialogDescription className="text-white/80 text-xs mt-0.5 line-clamp-1">
                      {wish.message}
                    </DialogDescription>
                  )}
                </div>
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 p-4 overflow-auto bg-gradient-to-br from-off-white to-cool-gray">
            {/* Video Preview */}
            {wish.type === "video" && wish.file_url && (
              <div className="w-full h-full flex items-center justify-center">
                <video
                  src={wish.file_url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg shadow-lg"
                  poster={wish.thumbnail_url || undefined}
                  aria-label={`Video from ${wish.name}`}
                />
              </div>
            )}
            
            {/* Audio Preview */}
            {(wish.type === "voice" || wish.type === "audio") && wish.file_url && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-sm w-full">
                  <div 
                    className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-lg"
                    aria-hidden="true"
                  >
                    <Mic className="h-8 w-8 text-white" aria-hidden="true" />
                  </div>
                  <audio
                    src={wish.file_url}
                    controls
                    autoPlay
                    className="w-full"
                    aria-label={`Audio message from ${wish.name}`}
                  />
                  <div className="text-xs text-gray-700 bg-white/90 backdrop-blur-sm rounded px-3 py-2">
                    {wish.duration && `Duration: ${formatDuration(wish.duration)}`}
                    {wish.file_size && ` • Size: ${formatFileSize(wish.file_size)}`}
                  </div>
                </div>
              </div>
            )}
            
            {/* Image Preview */}
            {(wish.type === "photo" || wish.type === "post" || wish.type === "image") && wish.file_url && (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={wish.file_url}
                  alt={`Image submission from ${wish.name}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
            
            {/* Text Preview */}
            {wish.type === "text" && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="max-w-2xl w-full text-center space-y-4 bg-white rounded-xl p-6 shadow-lg">
                  <FileText className="h-8 w-8 text-brand-blue mx-auto" aria-hidden="true" />
                  <div className="text-base leading-relaxed text-gray-700">
                    {wish.message}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Meta Information */}
          <div className="border-t bg-white p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" role="contentinfo">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                <span className="font-medium text-gray-700">Submitted by:</span>
                <span className="text-gray-900">{wish.name}</span>
              </div>
              {wish.org && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" aria-hidden="true" />
                  <span className="font-medium text-gray-700">Organization:</span>
                  <span className="text-gray-900">{wish.org}</span>
                </div>
              )}
              {wish.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" aria-hidden="true" />
                  <span className="font-medium text-gray-700">City:</span>
                  <span className="text-gray-900">{wish.city}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" aria-hidden="true" />
                <span className="font-medium text-gray-700">Date:</span>
                <time className="text-gray-900" dateTime={wish.created_at}>
                  {new Date(wish.created_at).toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export const WishesWall = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [previewWish, setPreviewWish] = useState<Submission | null>(null);
  const [loadMoreCount, setLoadMoreCount] = useState(9);

  const { data: wishes = [], isLoading, error } = useQuery({
    queryKey: ['approved-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Submission[];
    },
    retry: 3,
  });

  const handlePreview = useCallback((wish: Submission) => {
    setPreviewWish(wish);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewWish(null);
  }, []);

  const filteredWishes = useMemo(() => {
    const filtered = wishes.filter(wish => {
      const matchesSearch = wish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wish.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wish.org?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const normalizedType = wish.type === 'photo' ? 'image' : wish.type === 'voice' ? 'audio' : wish.type;

      const matchesFilter =
        activeFilter === "all" ||
        activeFilter === "latest" ||
        (activeFilter === "photo" && (normalizedType === "image" || wish.type === "post")) ||
        (activeFilter === "audio" && (normalizedType === "audio" || wish.type === "voice")) ||
        (activeFilter === "video" && normalizedType === "video") ||
        (activeFilter === "text" && normalizedType === "text");
      
      return matchesSearch && matchesFilter;
    });

    return activeFilter === "latest" 
      ? filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      : filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [wishes, searchTerm, activeFilter]);

  const displayedWishes = filteredWishes.slice(0, loadMoreCount);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setActiveFilter("all");
  }, []);

  return (
    <section 
      id="wishes" 
      className=" pb-20 pt-40"
      style={{ background: DESIGN_TOKENS.gradients.primary }}
      aria-labelledby="wishes-heading"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div 
            className="inline-flex items-center gap-2 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-3"
            style={{ background: DESIGN_TOKENS.gradients.accent }}
          >
            <Heart className="h-3 w-3" aria-hidden="true" />
            Birthday Wishes Wall
          </div>
          <h2 
            id="wishes-heading"
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ 
              background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.brandBlue} 0%, ${DESIGN_TOKENS.colors.deepNavy} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Heartfelt Messages & Wishes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Celebrating our founder's special day with love, memories, and heartfelt messages 
            from colleagues, friends, and admirers around the world.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between mb-4">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                placeholder="Search by name, message, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-brand-blue transition-colors"
                aria-label="Search wishes"
              />
            </div>
            
            <div className="flex items-center gap-2 self-start lg:self-auto">
              <Filter className="h-4 w-4 text-gray-600" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter options">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              const isActive = activeFilter === filter.key;
              return (
                <Button
                  key={filter.key}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`rounded-lg px-3 h-9 transition-all ${
                    isActive 
                      ? 'bg-brand-blue text-white border-brand-blue shadow-md' 
                      : 'border-gray-300 text-gray-700 hover:border-brand-blue hover:text-brand-blue'
                  }`}
                  aria-pressed={isActive}
                  style={isActive ? { backgroundColor: DESIGN_TOKENS.colors.brandBlue } : {}}
                >
                  <IconComponent className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  {filter.label}
                  {filter.count > 0 && (
                    <span className="ml-1.5 bg-white/20 px-1 py-0.5 rounded text-xs">
                      {filter.count}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="max-w-md mx-auto border-2 border-dashed border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <X className="h-5 w-5 text-red-600" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg mb-1 text-red-700">
                  Error Loading Wishes
                </h3>
                <p className="text-red-600 text-sm mb-3">
                  Unable to load wishes at this time. Please try again later.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="rounded-lg border-red-300 text-red-700"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <p className="text-sm text-gray-600" aria-live="polite">
              Showing {displayedWishes.length} of {filteredWishes.length} wishes
              {searchTerm && ` for "${searchTerm}"`}
              {activeFilter !== "all" && ` filtered by ${filters.find(f => f.key === activeFilter)?.label}`}
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center justify-center">
              <Loader className="h-8 w-8 text-brand-blue animate-spin mb-3" aria-hidden="true" />
              <p className="text-gray-600 text-sm">Loading heartfelt wishes...</p>
            </div>
          </motion.div>
        )}

        {/* Wishes Grid */}
        {!isLoading && !error && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {displayedWishes.map((wish) => (
                <WishCard 
                  key={wish.id} 
                  wish={wish} 
                  onPreview={handlePreview}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredWishes.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="max-w-md mx-auto border-2 border-dashed border-gray-300 bg-white/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg mb-1 text-gray-700">
                  No wishes found
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {searchTerm || activeFilter !== "all" 
                    ? "No results match your search criteria. Try adjusting your search or filters." 
                    : "Approved wishes will appear here soon. Check back later!"}
                </p>
                {(searchTerm || activeFilter !== "all") && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearFilters}
                    className="rounded-lg"
                  >
                    Clear filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Load More Button */}
        {!isLoading && !error && displayedWishes.length < filteredWishes.length && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              variant="outline"
              className="rounded-lg px-6 border-gray-300 text-gray-700 hover:border-brand-blue hover:text-brand-blue transition-colors"
              onClick={() => setLoadMoreCount(prev => prev + 9)}
            >
              Load More Wishes ({filteredWishes.length - displayedWishes.length} remaining)
            </Button>
          </motion.div>
        )}

        {/* Preview Dialog */}
        <PreviewDialog 
          wish={previewWish} 
          open={!!previewWish} 
          onClose={handleClosePreview}
        />
      </div>
    </section>
  );
};