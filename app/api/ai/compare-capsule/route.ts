import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const CAPSULE_COMPARE_PROMPT = `You are helping someone reconnect with who they were when they wrote a letter to their future self.

Below is a letter they wrote to themselves at an earlier point in their journey. They sealed it and set a date for it to open. That date has now arrived.

Your job: Write a short, observant narrative (3-4 sentences) comparing what they hoped for with who they appear to be now. Reference their recent memories to ground this in evidence.

Rules:
- Use second person ("You...")
- Reference specific hopes or fears from their letter
- Reference patterns from their recent memories
- Never use generic praise or motivation
- Never use exclamation marks
- Be honest — if they haven't lived up to their hopes, acknowledge that gently without judgment
- If they've grown in unexpected ways, honor that
- The goal is not to measure success. It is to witness change.
- If the letter reveals fear, uncertainty, or struggle, do not minimize it. Acknowledge it honestly. The goal is not to make them feel better — it is to help them see themselves clearly.

Sound like someone who has quietly read both the letter and their journey, and is now sharing what they noticed.`;

export async function POST(request: Request) {
  try {
    const { capsuleId } = await request.json();

    if (!capsuleId) {
      return NextResponse.json({ error: "Capsule ID required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the capsule
    const { data: capsule } = await supabase
      .from("time_capsules")
      .select("*")
      .eq("id", capsuleId)
      .eq("user_id", userData.user.id)
      .single();

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    if (capsule.opened) {
      return NextResponse.json({ error: "Already opened" }, { status: 400 });
    }

    // Check if it's time to open
    const today = new Date().toISOString().split("T")[0];
    if (capsule.unlock_date > today) {
      return NextResponse.json(
        { error: "This capsule is still sealed", unlock_date: capsule.unlock_date },
        { status: 403 }
      );
    }

    // Fetch some recent memories for context
    const { data: recentMemories } = await supabase
      .from("memories")
      .select("title, content, emotion")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    const recentContext = (recentMemories || [])
      .map((m) => `- ${m.title}: ${m.content.slice(0, 150)}`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    const prompt = `${CAPSULE_COMPARE_PROMPT}

LETTER TO FUTURE SELF:
Title: ${capsule.title}
Written on: ${capsule.created_at}
Letter: ${capsule.letter}

RECENT MEMORIES:
${recentContext || "No recent memories available."}`;

    const result = await model.generateContent(prompt);
    const reflection = result.response.text().trim();

    // Mark as opened and save reflection
    await supabase
      .from("time_capsules")
      .update({
        opened: true,
        opened_at: new Date().toISOString(),
        ai_reflection: reflection,
      })
      .eq("id", capsuleId);

    return NextResponse.json({
      reflection,
      capsule: {
        title: capsule.title,
        letter: capsule.letter,
        created_at: capsule.created_at,
        unlock_date: capsule.unlock_date,
      },
    });
  } catch (error) {
    console.error("Capsule compare error:", error);
    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }
}
