import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Video, Image, Music, MessageSquare, Send, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WishFormData {
  name: string;
  message?: string;
  url?: string;
  org?: string;
  city?: string;
  contact?: string;
  consent: boolean;
}

export const ShareWish = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("video");
  const [formData, setFormData] = useState<WishFormData>({
    name: "",
    message: "",
    url: "",
    org: "",
    city: "",
    contact: "",
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detectProvider = (url: string) => {
    if (!url) return "unknown";
    
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("vimeo.com")) return "vimeo";
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("facebook.com")) return "facebook";
    if (url.includes("drive.google.com")) return "drive";
    if (url.includes("soundcloud.com")) return "soundcloud";
    if (url.includes("vocaroo.com")) return "vocaroo";
    if (url.match(/\.(mp3|m4a|wav)$/i)) return "direct";
    
    return "other";
  };

  const handleSubmit = async (type: string) => {
    if (!formData.name || !formData.consent) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and accept the consent terms.",
        variant: "destructive"
      });
      return;
    }

    if ((type !== "text") && !formData.url) {
      toast({
        title: "URL required",
        description: "Please provide a valid URL for your media.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const submission = {
        type,
        name: formData.name,
        message: formData.message,
        url: formData.url,
        provider: detectProvider(formData.url || ""),
        org: formData.org,
        city: formData.city,
        contact: formData.contact,
        status: "pending"
      };

      console.log("Submitting:", submission);

      toast({
        title: "Wish submitted successfully! 🎉",
        description: "Thank you! Your wish has been submitted for review and will appear on the wall once approved."
      });

      // Reset form
      setFormData({
        name: "",
        message: "",
        url: "",
        org: "",
        city: "",
        contact: "",
        consent: false
      });

    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPreviewInfo = (url: string) => {
    const provider = detectProvider(url);
    
    switch (provider) {
      case "youtube":
        return { provider: "YouTube", icon: "🎥", color: "bg-red-100 text-red-800" };
      case "vimeo":
        return { provider: "Vimeo", icon: "🎬", color: "bg-blue-100 text-blue-800" };
      case "instagram":
        return { provider: "Instagram", icon: "📸", color: "bg-pink-100 text-pink-800" };
      case "facebook":
        return { provider: "Facebook", icon: "📱", color: "bg-blue-100 text-blue-800" };
      case "drive":
        return { provider: "Google Drive", icon: "☁️", color: "bg-green-100 text-green-800" };
      case "soundcloud":
        return { provider: "SoundCloud", icon: "🎵", color: "bg-orange-100 text-orange-800" };
      case "direct":
        return { provider: "Audio File", icon: "🎧", color: "bg-purple-100 text-purple-800" };
      default:
        return { provider: "External Link", icon: "🔗", color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <section id="share" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-outfit font-bold mb-6 text-primary">
            Share Your Birthday Wish
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Send your heartfelt message through video, photo, voice recording, or text. 
            Your wishes will be reviewed and featured on our celebration wall.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl font-outfit text-center">
                Choose Your Wish Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="photo" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Photo/Post
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Voice
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="video" className="space-y-6">
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-semibold mb-2">📹 Video Message</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Share a YouTube, Vimeo, Instagram, or Facebook video link
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="video-url">Video URL *</Label>
                        <Input
                          id="video-url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={formData.url}
                          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                        />
                        {formData.url && (
                          <div className="mt-2">
                            {(() => {
                              const info = getPreviewInfo(formData.url);
                              return (
                                <Badge className={info.color}>
                                  {info.icon} {info.provider} detected
                                </Badge>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="photo" className="space-y-6">
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-semibold mb-2">📸 Photo or Post</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Share an Instagram post, Facebook post, or public Google Drive image link
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="photo-url">Photo/Post URL *</Label>
                        <Input
                          id="photo-url"
                          placeholder="https://www.instagram.com/p/... or https://drive.google.com/..."
                          value={formData.url}
                          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                        />
                        {formData.url && (
                          <div className="mt-2">
                            {(() => {
                              const info = getPreviewInfo(formData.url);
                              return (
                                <Badge className={info.color}>
                                  {info.icon} {info.provider} detected
                                </Badge>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="space-y-6">
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-semibold mb-2">🎤 Voice Message</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Share a SoundCloud track, Google Drive audio file, or direct audio link
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="voice-url">Audio URL *</Label>
                        <Input
                          id="voice-url"
                          placeholder="https://soundcloud.com/... or https://drive.google.com/..."
                          value={formData.url}
                          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                        />
                        {formData.url && (
                          <div className="mt-2">
                            {(() => {
                              const info = getPreviewInfo(formData.url);
                              return (
                                <Badge className={info.color}>
                                  {info.icon} {info.provider} detected
                                </Badge>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                      <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">
                          💡 <strong>Tip:</strong> You can record audio on your phone and upload to 
                          SoundCloud (free) or Google Drive, then share the public link here.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-6">
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-semibold mb-2">💌 Text Message</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Write your heartfelt birthday message
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="text-message">Your Message *</Label>
                        <Textarea
                          id="text-message"
                          placeholder="Write your birthday wishes here... (max 500 characters)"
                          maxLength={500}
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          rows={6}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {formData.message?.length || 0}/500 characters
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Common fields */}
                <div className="space-y-6 pt-6 border-t">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    {activeTab !== "text" && (
                      <div>
                        <Label htmlFor="message">Optional Message</Label>
                        <Input
                          id="message"
                          placeholder="Add a personal note..."
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="org">Organization/Company</Label>
                      <Input
                        id="org"
                        placeholder="Your organization"
                        value={formData.org}
                        onChange={(e) => setFormData(prev => ({ ...prev, org: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Your city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact">Contact (optional)</Label>
                      <Input
                        id="contact"
                        placeholder="Email or phone"
                        value={formData.contact}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: !!checked }))}
                    />
                    <Label htmlFor="consent" className="text-sm leading-5">
                      I consent to sharing my birthday wish publicly on this celebration page and 
                      understand that it will be reviewed before appearing on the wishes wall. *
                    </Label>
                  </div>

                  <Button
                    onClick={() => handleSubmit(activeTab)}
                    disabled={isSubmitting || !formData.name || !formData.consent}
                    className="btn-hero w-full"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Your Wish
                      </>
                    )}
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};