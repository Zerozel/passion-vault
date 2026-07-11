import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Shield, Archive, Sparkles } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background selection:bg-accent/20">
      {/* Hero */}
      <section className="relative px-6 pt-36 pb-28 max-w-4xl mx-auto text-center">
        {/* Subtle ambient glow behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative">
          <h1 className="text-5xl sm:text-6xl font-semibold text-foreground tracking-tight leading-[1.1]">
            Remember why
            <br />
            <span className="text-accent">you started.</span>
          </h1>
          <p className="mt-8 text-lg text-muted max-w-xl mx-auto leading-relaxed">
            Passion doesn&apos;t disappear overnight. It fades when we lose
            touch with the version of ourselves who first believed. Passion
            Vault preserves those moments — so when doubt arrives, your own
            memories can bring you home.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-all shadow-lg shadow-accent/10 hover:shadow-accent/20 hover:-translate-y-0.5"
            >
              Start Your Vault
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border-subtle text-muted hover:text-foreground hover:border-muted/50 transition-all font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-8 text-center h-full">
              <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Capture
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Every journey has moments that change us. Capture them while
                they are still vivid, before memory begins rewriting the story.
              </p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-8 text-center h-full">
              <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/10 flex items-center justify-center mx-auto mb-6">
                <Archive className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Preserve
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Memories change. Evidence doesn&apos;t. Every entry is
                preserved exactly as you lived it, becoming proof of the person
                you were.
              </p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm p-8 text-center h-full">
              <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Reconnect
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                When life gets loud, your vault quietly reminds you. Not with
                motivation. With evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deep truth */}
      <section className="px-6 py-16 max-w-3xl mx-auto text-center">
        <p className="text-muted/50 text-sm italic leading-relaxed max-w-md mx-auto">
          The most important conversations you&apos;ll ever have are with the
          versions of yourself that time tried to erase.
        </p>
      </section>

      {/* Journey */}
      <section className="px-6 py-24 max-w-3xl mx-auto text-center">
        <p className="text-xs text-muted/60 uppercase tracking-[0.2em] mb-10">
          How it works
        </p>
        <div className="space-y-3">
          {[
            { step: "Capture a moment", desc: "What happened today that your future self should never forget?" },
            { step: "Find the truth beneath it", desc: "Gemini extracts the emotional truth and identity behind your words." },
            { step: "Build your evidence", desc: "Every memory becomes a permanent, uneditable record of your journey." },
            { step: "See who you're becoming", desc: "Patterns reveal what you value, what you've overcome, what still matters." },
            { step: "Return to yourself", desc: "On hard days, your vault resurfaces the version of you who believed." },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-5 border border-border-subtle rounded-xl bg-surface/50 backdrop-blur-sm px-6 py-5 text-left hover:border-muted/30 transition-all group"
            >
              <span className="text-xs text-accent/60 font-mono w-6 shrink-0 tabular-nums">
                {i + 1}
              </span>
              <div>
                <p className="text-foreground font-medium group-hover:text-accent transition-colors">
                  {item.step}
                </p>
                <p className="text-sm text-muted mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-28 pb-36 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-accent/3 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative">
          <p className="text-xl text-muted mb-8 max-w-md mx-auto leading-relaxed">
            One day you&apos;ll question yourself. Leave yourself something
            worth finding.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-all text-lg shadow-lg shadow-accent/10 hover:shadow-accent/20 hover:-translate-y-0.5"
          >
            Start Your Vault
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle px-6 py-10 text-center space-y-2">
        <p className="text-xs text-muted/40">
          Built for the days you forget who you are.
        </p>
        <p className="text-xs text-muted/30">
          Passion Vault — Remember why you started.
        </p>
      </footer>
    </div>
  );
}
