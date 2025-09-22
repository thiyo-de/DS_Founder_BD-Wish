import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Video, Image, Music, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { VideoRecorder } from "@/components/media/VideoRecorder";
import { AudioRecorder } from "@/components/media/AudioRecorder";
import { FileUploader } from "@/components/media/FileUploader";

interface WishFormData {
  name: string;
  message?: string;
  org?: string;
  city?: string;
  contact?: string;
  consent: boolean;
  // File upload fields
  file_url?: string;
  file_type?: string;
  file_size?: number;
  duration?: number;
  thumbnail_url?: string;
}

export const ShareWish = () => {
  const { toast } = useToast();
  const { uploadFile } = useFileUpload();
  const [activeTab, setActiveTab] = useState("video");
  const [formData, setFormData] = useState<WishFormData>({
    name: "",
    message: "",
    org: "",
    city: "",
    contact: "",
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  const handleMediaUpload = (uploadResult: {
    file_url: string;
    file_type: string;
    file_size: number;
    duration?: number;
    thumbnail_url?: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      file_url: uploadResult.file_url,
      file_type: uploadResult.file_type,
      file_size: uploadResult.file_size,
      duration: uploadResult.duration,
      thumbnail_url: uploadResult.thumbnail_url,
    }));
    setMediaReady(true);
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

    // Check for media requirements
    if (type !== "text" && !mediaReady && !formData.file_url) {
      toast({
        title: "Media required",
        description: `Please record or upload your ${type} before submitting.`,
        variant: "destructive"
      });
      return;
    }

    if (type === "text" && !formData.message) {
      toast({
        title: "Message required",
        description: "Please write your birthday wish.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedType = type === 'photo' ? 'image' : type === 'voice' ? 'audio' : type;
      const submissionData = {
        type: normalizedType as 'video' | 'image' | 'audio' | 'text',
        name: formData.name.trim(),
        message: formData.message?.trim() || null,
        org: formData.org?.trim() || null,
        city: formData.city?.trim() || null,
        contact: formData.contact?.trim() || null,
        status: 'pending',
        // File-based fields
        file_url: formData.file_url || null,
        file_type: formData.file_type || null,
        file_size: formData.file_size || null,
        duration: formData.duration ? Math.round(formData.duration) : null,
        thumbnail_url: formData.thumbnail_url || null,
      };

      const { error } = await supabase
        .from('submissions')
        .insert([submissionData]);

      if (error) throw error;

      toast({
        title: "Wish submitted successfully! 🎉",
        description: "Thank you! Your wish has been submitted and is awaiting admin approval before appearing on the wall."
      });

      // Reset form
      setFormData({
        name: "",
        message: "",
        org: "",
        city: "",
        contact: "",
        consent: false
      });
      setMediaReady(false);

    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setMediaReady(false);
    // Clear media data when switching tabs
    setFormData(prev => ({
      ...prev,
      file_url: undefined,
      file_type: undefined,
      file_size: undefined,
      duration: undefined,
      thumbnail_url: undefined,
    }));
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
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="photo" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Photo
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
                    <h3 className="font-semibold mb-4">📹 Record or Upload Video</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Record a video message up to 60 seconds or upload a video file (max 50MB)
                    </p>
                    
                    <Tabs defaultValue="record" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="record">Record Video</TabsTrigger>
                        <TabsTrigger value="upload">Upload Video</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="record">
                        <VideoRecorder 
                          onRecordingComplete={async (blob) => {
                            // Convert blob to file and upload
                            const file = new File([blob], `video-${Date.now()}.webm`, { type: blob.type });
                            const result = await uploadFile(file, 'video');
                            if (result) {
                              handleMediaUpload(result);
                            }
                          }}
                          maxDuration={60}
                        />
                      </TabsContent>
                      
                      <TabsContent value="upload">
                        <FileUploader
                          onUploadComplete={handleMediaUpload}
                          fileType="video"
                          maxSize={50}
                          acceptedTypes={['video/mp4', 'video/webm', 'video/quicktime', 'video/avi']}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>

                <TabsContent value="photo" className="space-y-6">
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-semibold mb-4">📸 Upload Image</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Upload your photo or image to share (max 5MB)
                    </p>
                    
                    <FileUploader
                      onUploadComplete={handleMediaUpload}
                      fileType="image"
                      maxSize={5}
                      acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="space-y-6">
                  <div className="bg-surface rounded-lg p-4">
                    <h3 className="font-semibold mb-4">🎤 Record or Upload Audio</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Record a voice message up to 30 seconds or upload an audio file (max 10MB)
                    </p>
                    
                    <Tabs defaultValue="record" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="record">Record Audio</TabsTrigger>
                        <TabsTrigger value="upload">Upload Audio</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="record">
                        <AudioRecorder 
                          onRecordingComplete={async (blob) => {
                            // Convert blob to file and upload
                            const file = new File([blob], `audio-${Date.now()}.webm`, { type: blob.type });
                            const result = await uploadFile(file, 'audio');
                            if (result) {
                              handleMediaUpload(result);
                            }
                          }}
                          maxDuration={30}
                        />
                      </TabsContent>
                      
                      <TabsContent value="upload">
                        <FileUploader
                          onUploadComplete={handleMediaUpload}
                          fileType="audio"
                          maxSize={10}
                          acceptedTypes={['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/webm']}
                        />
                      </TabsContent>
                    </Tabs>
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
                    disabled={isSubmitting || !formData.name || !formData.consent || (activeTab !== "text" && !mediaReady)}
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