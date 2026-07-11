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
import { Hourglass } from "lucide-react";

const capsuleSchema = z.object({
  title: z.string().min(3, "Give your capsule a name"),
  letter: z.string().min(20, "Write at least a few sentences to your future self"),
  unlock_date: z.string().min(1, "Choose when this should open"),
});

type CapsuleFormData = z.infer<typeof capsuleSchema>;

export function CreateCapsuleForm({ userId }: { userId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CapsuleFormData>({
    resolver: zodResolver(capsuleSchema),
  });

  async function onSubmit(data: CapsuleFormData) {
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("time_capsules").insert({
      user_id: userId,
      title: data.title,
      letter: data.letter,
      unlock_date: data.unlock_date,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  // Get today's date and max date (2 years from now)
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <Card className="border-border-subtle bg-surface/50 backdrop-blur-sm rounded-xl">
      <CardContent className="p-5 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground text-sm">
              What truth deserves to survive time?
            </Label>
            <Input
              id="title"
              placeholder="Name this letter"
              {...register("title")}
              className="border-border-subtle bg-background text-foreground rounded-xl h-11"
            />
            {errors.title && (
              <p className="text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="letter" className="text-foreground text-sm">
              What would you say if this were the only letter they could read?
            </Label>
            <Textarea
              id="letter"
              placeholder="Write to the person you're becoming. Be honest. Be hopeful. Be real."
              rows={8}
              {...register("letter")}
              className="border-border-subtle bg-background text-foreground resize-none rounded-xl"
            />
            {errors.letter && (
              <p className="text-sm text-red-400">{errors.letter.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unlock_date" className="text-foreground text-sm">
              When should this open?
            </Label>
            <Input
              id="unlock_date"
              type="date"
              min={today}
              max={maxDateStr}
              {...register("unlock_date")}
              className="border-border-subtle bg-background text-foreground rounded-xl h-11"
            />
            {errors.unlock_date && (
              <p className="text-sm text-red-400">{errors.unlock_date.message}</p>
            )}
            <p className="text-xs text-muted/60">
              Choose a date up to 2 years from now. You won't be able to open it until then.
            </p>
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
            <Hourglass className="h-4 w-4 mr-2" />
            {loading ? "Sealing your capsule..." : "Seal this capsule"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
