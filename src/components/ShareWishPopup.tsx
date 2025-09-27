import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Video,
  Image as ImageIcon,
  Music,
  MessageSquare,
  Send,
  Heart,
  X,
} from "lucide-react";
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
  file_url?: string;
  file_type?: string;
  file_size?: number;
  duration?: number;
  thumbnail_url?: string;
}

interface ShareWishPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareWishPopup = ({ isOpen, onClose }: ShareWishPopupProps) => {
  const { toast } = useToast();
  const { uploadFile } = useFileUpload();

  const [activeTab, setActiveTab] = useState<
    "video" | "photo" | "voice" | "text"
  >("video");
  const [formData, setFormData] = useState<WishFormData>({
    name: "",
    message: "",
    org: "",
    city: "",
    contact: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  // Refs for focus and scroll-lock
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const firstFocusRef = useRef<HTMLButtonElement | null>(null);

  // Strong scroll lock for page, allow scroll inside popup (wheel/touch)
  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement as HTMLElement;
    const body = document.body as HTMLElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const onWheel = (e: WheelEvent) => {
      const t = e.target as Node | null;
      const inDialog = dialogRef.current && t && dialogRef.current.contains(t);
      if (!inDialog) {
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.target as Node | null;
      const inDialog = dialogRef.current && t && dialogRef.current.contains(t);
      if (!inDialog) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    // Focus close button for accessibility
    const t = setTimeout(() => {
      firstFocusRef.current?.focus();
    }, 0);

    return () => {
      clearTimeout(t);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [isOpen]);

  // Reset form when popup closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        message: "",
        org: "",
        city: "",
        contact: "",
        consent: false,
      });
      setMediaReady(false);
      setActiveTab("video");
    }
  }, [isOpen]);

  const handleMediaUpload = (uploadResult: {
    file_url: string;
    file_type: string;
    file_size: number;
    duration?: number;
    thumbnail_url?: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      file_url: uploadResult.file_url,
      file_type: uploadResult.file_type,
      file_size: uploadResult.file_size,
      duration: uploadResult.duration,
      thumbnail_url: uploadResult.thumbnail_url,
    }));
    setMediaReady(true);
  };

  const submitToSupabase = async (
    type: "video" | "image" | "audio" | "text"
  ) => {
    if (!formData.name.trim() || !formData.consent) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and accept the consent terms.",
        variant: "destructive",
      });
      return;
    }

    if (type !== "text" && !mediaReady && !formData.file_url) {
      toast({
        title: "Media required",
        description: `Please record or upload your ${type} before submitting.`,
        variant: "destructive",
      });
      return;
    }

    if (type === "text" && !formData.message?.trim()) {
      toast({
        title: "Message required",
        description: "Please write your birthday wish.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        type,
        name: formData.name.trim(),
        message: formData.message?.trim() || null,
        org: formData.org?.trim() || null,
        city: formData.city?.trim() || null,
        contact: formData.contact?.trim() || null,
        status: "pending" as const,
        file_url: formData.file_url || null,
        file_type: formData.file_type || null,
        file_size: formData.file_size || null,
        duration: formData.duration ? Math.round(formData.duration) : null,
        thumbnail_url: formData.thumbnail_url || null,
      };

      const { error } = await supabase
        .from("submissions")
        .insert([submissionData]);
      if (error) throw error;

      toast({
        title: "Wish submitted successfully! 🎉",
        description:
          "Thank you! Your wish has been submitted and is awaiting admin approval.",
      });

      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    const v = value as "video" | "photo" | "voice" | "text";
    setActiveTab(v);
    setMediaReady(false);
    setFormData((prev) => ({
      ...prev,
      file_url: undefined,
      file_type: undefined,
      file_size: undefined,
      duration: undefined,
      thumbnail_url: undefined,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedType =
      activeTab === "photo"
        ? "image"
        : activeTab === "voice"
        ? "audio"
        : activeTab;
    submitToSupabase(normalizedType);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={false}
        >
          {/* Backdrop (no click-to-close) */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Share Your Birthday Wish"
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl max-h-[90vh] flex flex-col">
              <div className="h-1.5 bg-gradient-to-r from-[#0606bc] via-[#faf200] to-[#FF6B6B]" />

              {/* Header with close button */}
              <CardHeader className="pb-3 pt-6 relative">
                <Button
                  ref={firstFocusRef}
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-gray-100"
                  onClick={onClose}
                  aria-label="Close popup"
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
                  <Heart className="h-5 w-5 text-[#FF6B6B]" aria-hidden />
                  <span>Share Your Birthday Wish</span>
                  <Heart className="h-5 w-5 text-[#FF6B6B]" aria-hidden />
                </CardTitle>
                <p className="text-center text-sm text-muted-foreground">
                  Join the celebration! Share your wishes for our Founder.
                </p>
              </CardHeader>

              {/* Scrollable content area */}
              <CardContent
                ref={scrollAreaRef}
                className="modal-scroll p-4 sm:p-6 flex-1 overflow-y-auto overscroll-contain"
                // Keep wheel/touch inside the scroll area, never bubble to window
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <form onSubmit={onSubmit} className="space-y-6">
                  <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="w-full"
                  >
                    <TabsList className="mb-4 grid w-full grid-cols-4 gap-2 rounded-xl bg-[#F5F5F5] p-1 sm:mb-6">
                      <TabsTrigger
                        value="video"
                        className="flex items-center justify-center gap-2 rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-[#0606bc] data-[state=active]:shadow-sm"
                      >
                        <Video className="h-4 w-4" />
                        <span className="hidden sm:inline">Video</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="photo"
                        className="flex items-center justify-center gap-2 rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-[#0606bc] data-[state=active]:shadow-sm"
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Photo</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="voice"
                        className="flex items-center justify-center gap-2 rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-[#0606bc] data-[state=active]:shadow-sm"
                      >
                        <Music className="h-4 w-4" />
                        <span className="hidden sm:inline">Voice</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="text"
                        className="flex items-center justify-center gap-2 rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-[#0606bc] data-[state=active]:shadow-sm"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Text</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Video */}
                    <TabsContent value="video" className="outline-none">
                      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5">
                        <header className="mb-3 flex items-center gap-3">
                          <div className="rounded-lg bg-[#0606bc] p-2">
                            <Video className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-[#0A0A2E] sm:text-lg">
                              Record or Upload Video
                            </h3>
                            <p className="text-xs text-[#333]/80 sm:text-sm">
                              Up to 60 seconds • Max 50MB
                            </p>
                          </div>
                        </header>

                        <Tabs defaultValue="record" className="w-full">
                          <TabsList className="mb-3 grid w-full grid-cols-2 gap-2 rounded-lg bg-[#E8E8ED] p-1">
                            <TabsTrigger
                              value="record"
                              className="rounded-md data-[state=active]:bg-white"
                            >
                              Record
                            </TabsTrigger>
                            <TabsTrigger
                              value="upload"
                              className="rounded-md data-[state=active]:bg-white"
                            >
                              Upload
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="record" className="outline-none">
                            <VideoRecorder
                              onRecordingComplete={async (blob) => {
                                const file = new File(
                                  [blob],
                                  `video-${Date.now()}.webm`,
                                  { type: blob.type }
                                );
                                const result = await uploadFile(file, "video");
                                if (result) handleMediaUpload(result);
                              }}
                              maxDuration={60}
                            />
                          </TabsContent>

                          <TabsContent value="upload" className="outline-none">
                            <FileUploader
                              onUploadComplete={handleMediaUpload}
                              fileType="video"
                              maxSize={50}
                              acceptedTypes={[
                                "video/mp4",
                                "video/webm",
                                "video/quicktime",
                                "video/avi",
                              ]}
                            />
                          </TabsContent>
                        </Tabs>
                      </section>
                    </TabsContent>

                    {/* Photo */}
                    <TabsContent value="photo" className="outline-none">
                      <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-5">
                        <header className="mb-3 flex items-center gap-3">
                          <div className="rounded-lg bg-[#faf200] p-2">
                            <ImageIcon className="h-5 w-5 text-[#0A0A2E]" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-[#0A0A2E] sm:text-lg">
                              Upload Your Photo
                            </h3>
                            <p className="text-xs text-[#333]/80 sm:text-sm">
                              Max 5MB • JPEG, PNG, WebP
                            </p>
                          </div>
                        </header>

                        <FileUploader
                          onUploadComplete={handleMediaUpload}
                          fileType="image"
                          maxSize={5}
                          acceptedTypes={[
                            "image/jpeg",
                            "image/jpg",
                            "image/png",
                            "image/webp",
                          ]}
                        />
                      </section>
                    </TabsContent>

                    {/* Voice */}
                    <TabsContent value="voice" className="outline-none">
                      <section className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-5">
                        <header className="mb-3 flex items-center gap-3">
                          <div className="rounded-lg bg-[#FF6B6B] p-2">
                            <Music className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-[#0A0A2E] sm:text-lg">
                              Record or Upload Audio
                            </h3>
                            <p className="text-xs text-[#333]/80 sm:text-sm">
                              Up to 30 seconds • Max 10MB
                            </p>
                          </div>
                        </header>

                        <Tabs defaultValue="record" className="w-full">
                          <TabsList className="mb-3 grid w-full grid-cols-2 gap-2 rounded-lg bg-[#E8E8ED] p-1">
                            <TabsTrigger
                              value="record"
                              className="rounded-md data-[state=active]:bg-white"
                            >
                              Record
                            </TabsTrigger>
                            <TabsTrigger
                              value="upload"
                              className="rounded-md data-[state=active]:bg-white"
                            >
                              Upload
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="record" className="outline-none">
                            <AudioRecorder
                              onRecordingComplete={async (blob) => {
                                const file = new File(
                                  [blob],
                                  `audio-${Date.now()}.webm`,
                                  { type: blob.type }
                                );
                                const result = await uploadFile(file, "audio");
                                if (result) handleMediaUpload(result);
                              }}
                              maxDuration={30}
                            />
                          </TabsContent>

                          <TabsContent value="upload" className="outline-none">
                            <FileUploader
                              onUploadComplete={handleMediaUpload}
                              fileType="audio"
                              maxSize={10}
                              acceptedTypes={[
                                "audio/mpeg",
                                "audio/mp3",
                                "audio/wav",
                                "audio/m4a",
                                "audio/webm",
                              ]}
                            />
                          </TabsContent>
                        </Tabs>
                      </section>
                    </TabsContent>

                    {/* Text */}
                    <TabsContent value="text" className="outline-none">
                      <section className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-teal-50 p-4 sm:p-5">
                        <header className="mb-3 flex items-center gap-3">
                          <div className="rounded-lg bg-[#0606bc] p-2">
                            <MessageSquare className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-[#0A0A2E] sm:text-lg">
                              Write Your Message
                            </h3>
                            <p className="text-xs text-[#333]/80 sm:text-sm">
                              Share your heartfelt birthday wishes
                            </p>
                          </div>
                        </header>

                        <div className="space-y-2">
                          <Label
                            htmlFor="text-message"
                            className="block text-sm font-medium text-[#0A0A2E]"
                          >
                            Your Message *
                          </Label>
                          <Textarea
                            id="text-message"
                            placeholder="Write your birthday wishes here... (max 500 characters)"
                            maxLength={500}
                            value={formData.message}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                message: e.target.value,
                              }))
                            }
                            rows={6}
                            className="resize-none border-2 border-[#E8E8ED] focus:border-[#0606bc] focus-visible:ring-0"
                          />
                          <p className="mt-1 text-right text-xs text-[#333]/60">
                            {formData.message?.length || 0}/500 characters
                          </p>
                        </div>
                      </section>
                    </TabsContent>
                  </Tabs>

                  {/* Common fields */}
                  <div className="space-y-5 border-t border-[#E8E8ED] pt-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="name"
                          className="mb-1.5 block text-sm font-medium text-[#0A0A2E]"
                        >
                          Your Name *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="h-11 border-2 border-[#E8E8ED] focus:border-[#0606bc] focus-visible:ring-0"
                          autoComplete="name"
                          required
                        />
                      </div>

                      {activeTab !== "text" && (
                        <div>
                          <Label
                            htmlFor="message"
                            className="mb-1.5 block text-sm font-medium text-[#0A0A2E]"
                          >
                            Optional Message
                          </Label>
                          <Input
                            id="message"
                            placeholder="Add a personal note…"
                            value={formData.message}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                message: e.target.value,
                              }))
                            }
                            className="h-11 border-2 border-[#E8E8ED] focus:border-[#0606bc] focus-visible:ring-0"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <Label
                          htmlFor="org"
                          className="mb-1.5 block text-sm font-medium text-[#0A0A2E]"
                        >
                          Organization/Company
                        </Label>
                        <Input
                          id="org"
                          placeholder="Your organization"
                          value={formData.org ?? ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              org: e.target.value,
                            }))
                          }
                          className="h-11 border-2 border-[#E8E8ED] focus:border-[#0606bc] focus-visible:ring-0"
                          autoComplete="organization"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="city"
                          className="mb-1.5 block text-sm font-medium text-[#0A0A2E]"
                        >
                          City
                        </Label>
                        <Input
                          id="city"
                          placeholder="Your city"
                          value={formData.city ?? ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          className="h-11 border-2 border-[#E8E8ED] focus:border-[#0606bc] focus-visible:ring-0"
                          autoComplete="address-level2"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="contact"
                          className="mb-1.5 block text-sm font-medium text-[#0A0A2E]"
                        >
                          Contact (optional)
                        </Label>
                        <Input
                          id="contact"
                          placeholder="Email or phone"
                          value={formData.contact ?? ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              contact: e.target.value,
                            }))
                          }
                          className="h-11 border-2 border-[#E8E8ED] focus:border-[#0606bc] focus-visible:ring-0"
                          autoComplete="email"
                          inputMode="email"
                        />
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#F5F5F5] p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consent"
                          checked={formData.consent}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              consent: !!checked,
                            }))
                          }
                          className="mt-0.5 data-[state=checked]:bg-[#0606bc]"
                          aria-describedby="consent-desc"
                        />
                        <Label
                          htmlFor="consent"
                          className="cursor-pointer text-sm leading-5 text-[#333]"
                        >
                          I consent to sharing my birthday wish publicly on this
                          celebration page and understand that it will be
                          reviewed before appearing on the wishes wall. *
                        </Label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !formData.name.trim() ||
                        !formData.consent ||
                        (activeTab !== "text" && !mediaReady)
                      }
                      className="w-full translate-y-0 bg-gradient-to-r from-[#0606bc] to-[#FF6B6B] py-3 text-lg font-semibold shadow-lg transition-all duration-300 hover:from-[#0505a5] hover:to-[#e55a5a] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Submitting…
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="h-5 w-5" />
                          Share Your Birthday Wish
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
