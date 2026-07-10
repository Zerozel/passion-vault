import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateReflection } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { memoryId } = await request.json();

    if (!memoryId) {
      return NextResponse.json({ error: "Memory ID required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: memory } = await supabase
      .from("memories")
      .select("*")
      .eq("id", memoryId)
      .eq("user_id", userData.user.id)
      .single();

    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    const { data: existing } = await supabase
      .from("ai_reflections")
      .select("id")
      .eq("memory_id", memoryId)
      .single();

    if (existing) {
      return NextResponse.json({ reflected: true });
    }

    const reflection = await generateReflection(memory.content);

    if (!reflection) {
      return NextResponse.json(
        { error: "Gemini API call failed", details: "Check GEMINI_API_KEY in Vercel env" },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabase.from("ai_reflections").insert({
      memory_id: memoryId,
      user_id: userData.user.id,
      emotional_summary: reflection.emotional_summary,
      lesson_learned: reflection.lesson_learned,
      identity_statement: reflection.identity_statement,
    });

    if (insertError) {
      console.error("Failed to save reflection:", insertError);
      return NextResponse.json(
        { error: "Failed to save reflection", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ reflected: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Reflect error:", message);
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}
