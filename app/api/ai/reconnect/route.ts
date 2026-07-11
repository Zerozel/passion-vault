import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const RECONNECT_PROMPT = `You are helping someone reconnect with a forgotten version of themselves.

Below is a memory they wrote months ago, during a moment of clarity or conviction. They are now in a difficult season — tired, doubtful, disconnected from why they started.

Your job: Write a short message (3-4 sentences) that reconnects them with the person who wrote this memory.

Rules:
- Reference specific details from their memory
- Use second person ("You...")
- Never use generic motivation ("Keep going", "You've got this", "Believe in yourself")
- Never use exclamation marks
- Be quiet, observant, honest
- If the memory reveals fear, uncertainty, or struggle, do not minimize it. Acknowledge it honestly. The goal is not to make them feel better — it is to help them see themselves clearly.
- Help them see that the person who wrote this is still inside them

The tone should feel like a letter from their past self, not a coach.`;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all memories with content, ordered by creation date
    const { data: memories } = await supabase
      .from("memories")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: true });

    if (!memories || memories.length === 0) {
      return NextResponse.json({ error: "No memories found" }, { status: 404 });
    }

    // Age-weighted random selection: older memories get higher probability
    // First 40% of memories get 70% of the selection probability
    const cutoff = Math.max(1, Math.floor(memories.length * 0.4));
    const olderPool = memories.slice(0, cutoff);
    const newerPool = memories.slice(cutoff);

    const pool = Math.random() < 0.7 ? olderPool : newerPool;
    const memory = pool[Math.floor(Math.random() * pool.length)];

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    const prompt = `${RECONNECT_PROMPT}\n\nMemory title: ${memory.title}\nMemory content: ${memory.content}\nEmotion: ${memory.emotion || "not specified"}`;

    const result = await model.generateContent(prompt);
    const reconnectionText = result.response.text().trim();

    return NextResponse.json({
      reconnection: reconnectionText,
      memory: {
        id: memory.id,
        title: memory.title,
        content: memory.content,
        emotion: memory.emotion,
        image_url: memory.image_url,
        voice_url: memory.voice_url,
        created_at: memory.created_at,
      },
    });
  } catch (error) {
    console.error("Reconnect error:", error);
    return NextResponse.json(
      { error: "Failed to generate reconnection" },
      { status: 500 }
    );
  }
}
