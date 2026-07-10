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
    <Card className="border-border-subtle bg-surface">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dream_title" className="text-foreground">
              Dream Title
            </Label>
            <Input
              id="dream_title"
              placeholder="e.g. Build something that matters"
              {...register("dream_title")}
              className="border-border-subtle bg-background text-foreground"
            />
            {errors.dream_title && (
              <p className="text-sm text-red-400">{errors.dream_title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mission" className="text-foreground">
              Mission
            </Label>
            <Textarea
              id="mission"
              placeholder="What are you building toward?"
              rows={3}
              {...register("mission")}
              className="border-border-subtle bg-background text-foreground resize-none"
            />
            {errors.mission && (
              <p className="text-sm text-red-400">{errors.mission.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="why_i_started" className="text-foreground">
              Why I Started
            </Label>
            <Textarea
              id="why_i_started"
              placeholder="What made you unable to sleep that night?"
              rows={4}
              {...register("why_i_started")}
              className="border-border-subtle bg-background text-foreground resize-none"
            />
            {errors.why_i_started && (
              <p className="text-sm text-red-400">{errors.why_i_started.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {loading ? "Creating your vault..." : "Create Vault"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
