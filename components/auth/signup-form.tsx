"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="border-border-subtle bg-surface/50 backdrop-blur-sm rounded-xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-semibold text-foreground tracking-tight">
          Create your Vault
        </CardTitle>
        <CardDescription className="text-muted">
          Start preserving your passion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-border-subtle bg-background text-foreground rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground text-sm">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-border-subtle bg-background text-foreground rounded-xl h-11"
            />
          </div>
          {error && (
            <div className="border border-red-500/20 rounded-lg bg-red-500/5 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-11 shadow-lg shadow-accent/10"
          >
            {loading ? "Creating vault..." : "Create vault"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Already have a vault?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
