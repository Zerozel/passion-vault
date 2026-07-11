"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const vaultSchema = z.object({
  display_name: z.string().min(1, "What should we call you?"),
  dream_title: z.string().min(3, "Title must be at least 3 characters"),
  mission: z.string().min(10, "Mission must be at least 10 characters"),
  why_i_started: z.string().min(10, "Tell us why you started"),
});

type VaultFormData = z.infer<typeof vaultSchema>;

export function CreateVaultForm({ userId }: { userId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VaultFormData>({
    resolver: zodResolver(vaultSchema),
  });

  async function onSubmit(data: VaultFormData) {
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("vaults").insert({
      user_id: userId,
      display_name: data.display_name,
      dream_title: data.dream_title,
      mission: data.mission,
      why_i_started: data.why_i_started,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="border-border-subtle bg-surface/50 backdrop-blur-sm rounded-xl">
      <CardContent className="p-5 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="display_name" className="text-foreground text-sm">
              What should we call you?
            </Label>
            <Input
              id="display_name"
              placeholder="Your name"
              {...register("display_name")}
              className="border-border-subtle bg-background text-foreground rounded-xl h-11"
            />
            {errors.display_name && (
              <p className="text-sm text-red-400">{errors.display_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dream_title" className="text-foreground text-sm">
              Dream Title
            </Label>
            <Input
              id="dream_title"
              placeholder="e.g. Build something that matters"
              {...register("dream_title")}
              className="border-border-subtle bg-background text-foreground rounded-xl h-11"
            />
            {errors.dream_title && (
              <p className="text-sm text-red-400">{errors.dream_title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mission" className="text-foreground text-sm">
              Mission
            </Label>
            <Textarea
              id="mission"
              placeholder="What are you building toward?"
              rows={3}
              {...register("mission")}
              className="border-border-subtle bg-background text-foreground resize-none rounded-xl"
            />
            {errors.mission && (
              <p className="text-sm text-red-400">{errors.mission.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="why_i_started" className="text-foreground text-sm">
              Why I Started
            </Label>
            <Textarea
              id="why_i_started"
              placeholder="What made you unable to sleep that night?"
              rows={4}
              {...register("why_i_started")}
              className="border-border-subtle bg-background text-foreground resize-none rounded-xl"
            />
            {errors.why_i_started && (
              <p className="text-sm text-red-400">{errors.why_i_started.message}</p>
            )}
          </div>

          {error && (
            <div className="border border-red-500/20 rounded-lg bg-red-500/5 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-12 text-base shadow-lg shadow-accent/10"
          >
            {loading ? "Creating your vault..." : "Create Vault"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
