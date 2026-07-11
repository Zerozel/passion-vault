"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/storage";
import { EMOTION_TAGS, type EmotionTag } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ImagePlus, Mic, X } from "lucide-react";

const memorySchema = z.object({
  title: z.string().min(3, "Title is required"),
  content: z.string().min(10, "Share more about this moment"),
  emotion: z.enum(EMOTION_TAGS as [string, ...string[]]).optional(),
});

type MemoryFormData = z.infer<typeof memorySchema>;

export function MemoryForm({ vaultId, userId }: { vaultId: string; userId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
  });

  const selectedEmotion = watch("emotion");

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        setVoiceFile(file);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("Microphone access denied");
    }
  }

  function stopRecording() {
    mediaRecorder?.stop();
    setIsRecording(false);
  }

  async function onSubmit(data: MemoryFormData) {
    setLoading(true);
    setError(null);

    let imageUrl: string | null = null;
    let voiceUrl: string | null = null;

    if (imageFile) {
      imageUrl = await uploadMedia(imageFile, userId, "images");
    }

    if (voiceFile) {
      voiceUrl = await uploadMedia(voiceFile, userId, "voice");
    }

    const { data: memory, error: insertError } = await supabase
      .from("memories")
      .insert({
        vault_id: vaultId,
        user_id: userId,
        title: data.title,
        content: data.content,
        emotion: data.emotion || null,
        image_url: imageUrl,
        voice_url: voiceUrl,
      })
      .select()
      .single();

    if (insertError || !memory) {
      setError(insertError?.message || "Failed to save memory");
      setLoading(false);
      return;
    }

    // Trigger AI reflection
    fetch("/api/ai/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memoryId: memory.id }),
    }).catch(console.error);

    router.push(`/dashboard/memories/${memory.id}`);
  }

  return (
    <Card className="border-border-subtle bg-surface/50 backdrop-blur-sm rounded-xl">
      <CardContent className="p-5 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground text-sm">
              What happened that your future self should never forget?
            </Label>
            <Input
              id="title"
              placeholder="Name this moment — you'll search for it someday"
              {...register("title")}
              className="border-border-subtle bg-background text-foreground rounded-xl h-11"
            />
            {errors.title && (
              <p className="text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Story */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-foreground text-sm">
              Tell the story exactly as you lived it
            </Label>
            <Textarea
              id="content"
              placeholder="Write as though you're leaving evidence for someone who needs it. That someone is you."
              rows={5}
              {...register("content")}
              className="border-border-subtle bg-background text-foreground resize-none rounded-xl"
            />
            {errors.content && (
              <p className="text-sm text-red-400">{errors.content.message}</p>
            )}
          </div>

          {/* Emotion tags */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm">How do you feel?</Label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => setValue("emotion", emotion as EmotionTag)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-all capitalize",
                    selectedEmotion === emotion
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border-subtle text-muted hover:border-muted hover:text-foreground"
                  )}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          {/* Media buttons */}
          <div className="flex flex-wrap gap-3">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-subtle text-muted hover:text-foreground hover:border-muted cursor-pointer transition-all text-sm"
              >
                <ImagePlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add image</span>
              </Label>
            </div>

            <div>
              {!isRecording ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={startRecording}
                  className="inline-flex items-center gap-2 border-border-subtle text-muted hover:text-foreground rounded-xl h-10"
                >
                  <Mic className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {voiceFile ? "Recorded ✓" : "Record voice"}
                  </span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={stopRecording}
                  className="inline-flex items-center gap-2 border-red-500/50 text-red-400 hover:text-red-300 rounded-xl h-10 animate-pulse"
                >
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Stop
                </Button>
              )}
            </div>
          </div>

          {/* Image preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-xl border border-border-subtle"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-surface border border-border-subtle text-muted hover:text-foreground hover:border-muted transition-all"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="border border-red-500/20 rounded-lg bg-red-500/5 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-12 text-base shadow-lg shadow-accent/10 hover:shadow-accent/20 transition-all"
          >
            {loading ? "Preserving your evidence..." : "Preserve this moment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
