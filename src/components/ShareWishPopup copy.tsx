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
  User,
  Phone,
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
  contact: string;
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
    contact: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const firstFocusRef = useRef<HTMLButtonElement | null>(null);

  const digitsOnly = (v: string) => v.replace(/\D/g, "");
  const isValidPhone = (v: string) => /^\d{7,15}$/.test(v);

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
      if (!inDialog) e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.target as Node | null;
      const inDialog = dialogRef.current && t && dialogRef.current.contains(t);
      if (!inDialog) e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

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

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        message: "",
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
    if (
      !formData.name.trim() ||
      !isValidPhone(formData.contact) ||
      !formData.consent
    ) {
      toast({
        title: "Required fields missing",
        description:
          "Please enter your name, a valid contact number (digits only), and accept the consent terms.",
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
        message: type === "text" ? formData.message!.trim() : null,
        city: null,
        org: null,
        contact: formData.contact.trim(),
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

  const handlePhoneKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];
    if (allowedKeys.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const handlePhonePaste: React.ClipboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pasted)) {
      e.preventDefault();
      const cleaned = digitsOnly(pasted);
      if (cleaned) {
        const target = e.target as HTMLInputElement;
        const start = target.selectionStart ?? target.value.length;
        const end = target.selectionEnd ?? target.value.length;
        const next =
          target.value.slice(0, start) + cleaned + target.value.slice(end);
        setFormData((p) => ({ ...p, contact: digitsOnly(next).slice(0, 15) }));
      }
    }
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
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Share Your Birthday Wish"
            className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl max-h-[95vh] flex flex-col bg-white">
              <div className="h-2 bg-gradient-to-r from-blue-600 via-yellow-400 to-pink-500" />

              <CardHeader className="pb-4 pt-6 relative bg-white border-b border-gray-100">
                <Button
                  ref={firstFocusRef}
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                  aria-label="Close popup"
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardTitle className="flex items-center justify-center gap-3 text-xl sm:text-2xl font-bold text-gray-900">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="h-6 w-6 text-pink-500" aria-hidden />
                  </motion.div>
                  <span>Share Your Birthday Wish</span>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <Heart className="h-6 w-6 text-pink-500" aria-hidden />
                  </motion.div>
                </CardTitle>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Join the celebration! Share your heartfelt wishes for our
                  Founder.
                </p>
              </CardHeader>

              <CardContent
                ref={scrollAreaRef}
                className="flex-1 overflow-y-auto p-6 space-y-6"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <form onSubmit={onSubmit} className="space-y-6">
                  <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      Your Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700"
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
                          className="h-11 border-gray-300 focus:border-blue-500"
                          autoComplete="name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="contact"
                          className="text-sm font-medium text-gray-700"
                        >
                          Contact Number *
                        </Label>
                        <Input
                          id="contact"
                          placeholder="e.g., 9876543210"
                          value={formData.contact}
                          onKeyDown={handlePhoneKeyDown}
                          onPaste={handlePhonePaste}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              contact: digitsOnly(e.target.value).slice(0, 15),
                            }))
                          }
                          className="h-11 border-gray-300 focus:border-green-500"
                          inputMode="numeric"
                          pattern="\d{7,15}"
                          maxLength={15}
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Digits only, 7–15 characters
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="mt-8">
                    <Tabs
                      value={activeTab}
                      onValueChange={handleTabChange}
                      className="w-full"
                    >
                      <TabsList className="mb-6 grid w-full grid-cols-4 gap-2 rounded-lg bg-gray-100 p-1">
                        {[
                          { value: "video", icon: Video, label: "Video" },
                          { value: "photo", icon: ImageIcon, label: "Photo" },
                          { value: "voice", icon: Music, label: "Voice" },
                          { value: "text", icon: MessageSquare, label: "Text" },
                        ].map((tab) => (
                          <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex items-center justify-center gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium"
                          >
                            <tab.icon className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              {tab.label}
                            </span>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <TabsContent value="video" className="outline-none mt-0">
                        <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                          <header className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <Video className="h-5 w-5 text-blue-600" />
                              Record or Upload Video
                            </h3>
                            <p className="text-sm text-gray-600">
                              Up to 60 seconds • Max 50MB
                            </p>
                          </header>

                          <Tabs defaultValue="record" className="w-full">
                            <TabsList className="mb-4 grid w-full grid-cols-2 gap-2 rounded-lg bg-blue-100 p-1">
                              <TabsTrigger
                                value="record"
                                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600"
                              >
                                Record
                              </TabsTrigger>
                              <TabsTrigger
                                value="upload"
                                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600"
                              >
                                Upload
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent
                              value="record"
                              className="outline-none"
                            >
                              <VideoRecorder
                                onRecordingComplete={async (blob) => {
                                  const file = new File(
                                    [blob],
                                    `video-${Date.now()}.webm`,
                                    { type: blob.type }
                                  );
                                  const result = await uploadFile(
                                    file,
                                    "video"
                                  );
                                  if (result) handleMediaUpload(result);
                                }}
                                maxDuration={60}
                              />
                            </TabsContent>

                            <TabsContent
                              value="upload"
                              className="outline-none"
                            >
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

                      <TabsContent value="photo" className="outline-none mt-0">
                        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                          <header className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <ImageIcon className="h-5 w-5 text-amber-600" />
                              Upload Your Photo
                            </h3>
                            <p className="text-sm text-gray-600">
                              Max 5MB • JPEG, PNG, WebP
                            </p>
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

                      <TabsContent value="voice" className="outline-none mt-0">
                        <section className="rounded-xl border border-purple-200 bg-purple-50 p-6">
                          <header className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <Music className="h-5 w-5 text-purple-600" />
                              Record or Upload Audio
                            </h3>
                            <p className="text-sm text-gray-600">
                              Up to 30 seconds • Max 10MB
                            </p>
                          </header>

                          <Tabs defaultValue="record" className="w-full">
                            <TabsList className="mb-4 grid w-full grid-cols-2 gap-2 rounded-lg bg-purple-100 p-1">
                              <TabsTrigger
                                value="record"
                                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-purple-600"
                              >
                                Record
                              </TabsTrigger>
                              <TabsTrigger
                                value="upload"
                                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-purple-600"
                              >
                                Upload
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent
                              value="record"
                              className="outline-none"
                            >
                              <AudioRecorder
                                onRecordingComplete={async (blob) => {
                                  const file = new File(
                                    [blob],
                                    `audio-${Date.now()}.webm`,
                                    { type: blob.type }
                                  );
                                  const result = await uploadFile(
                                    file,
                                    "audio"
                                  );
                                  if (result) handleMediaUpload(result);
                                }}
                                maxDuration={30}
                              />
                            </TabsContent>

                            <TabsContent
                              value="upload"
                              className="outline-none"
                            >
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

                      <TabsContent value="text" className="outline-none mt-0">
                        <section className="rounded-xl border border-green-200 bg-green-50 p-6">
                          <header className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <MessageSquare className="h-5 w-5 text-green-600" />
                              Write Your Message
                            </h3>
                            <p className="text-sm text-gray-600">
                              Share your heartfelt birthday wishes
                            </p>
                          </header>

                          <div className="space-y-3">
                            <Label
                              htmlFor="text-message"
                              className="text-sm font-medium text-gray-700"
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
                              rows={5}
                              className="resize-none border-gray-300 focus:border-green-500"
                            />
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500">
                                Write from the heart
                              </p>
                              <p className="text-xs text-gray-600">
                                {formData.message?.length || 0}/500 characters
                              </p>
                            </div>
                          </div>
                        </section>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="space-y-6 border-t border-gray-200 pt-6 pb-4">
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
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
                          className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          aria-describedby="consent-desc"
                        />
                        <Label
                          htmlFor="consent"
                          className="cursor-pointer text-sm leading-5 text-gray-700"
                        >
                          <span className="text-blue-600 font-medium">
                            * Required:
                          </span>{" "}
                          I consent to sharing my birthday wish publicly on this
                          celebration page and understand that it will be
                          reviewed before appearing on the wishes wall.
                        </Label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !formData.name.trim() ||
                        !isValidPhone(formData.contact) ||
                        !formData.consent ||
                        (activeTab !== "text" && !mediaReady)
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Submitting Your Wish...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="h-4 w-4" />
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
