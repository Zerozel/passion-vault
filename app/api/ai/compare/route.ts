import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const COMPARE_PROMPT = `You are helping someone see how they've grown over time.

Below are two memories from different points in their journey, along with AI reflections on each. The first is from earlier in their journey. The second is more recent.

Your job: Write a short, observant narrative (3-4 sentences) comparing the two. What changed? What remained? How did they grow?

Rules:
- Use second person ("You...")
- Be specific — reference actual details from both memories
- Never use generic praise ("You're doing great")
- Never use percentages or metrics
- Be honest — if the earlier memory had more conviction, note that gently
- If their purpose evolved, acknowledge that evolution is valid, not failure
- If the writing reveals fear, uncertainty, or struggle, do not minimize it. Acknowledge it honestly. The goal is not to make them feel better — it is to help them see themselves clearly.
- Sound like someone who has been quietly watching their journey with respect`;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch memories that have reflections
    const { data: memories } = await supabase
      .from("memories")
      .select("*, ai_reflections(*)")
      .eq("user_id", userData.user.id)
      .not("ai_reflections", "is", null)
      .order("created_at", { ascending: true });

    if (!memories || memories.length < 2) {
      return NextResponse.json(
        { error: "Need at least two reflected memories to compare" },
        { status: 400 }
      );
    }

    const earliest = memories[0];
    const latest = memories[memories.length - 1];

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `${COMPARE_PROMPT}

EARLIER MEMORY (${earliest.created_at}):
Title: ${earliest.title}
Content: ${earliest.content}
Emotion: ${earliest.emotion || "not specified"}
Reflection: ${earliest.ai_reflections?.identity_statement || "No reflection available"}

LATER MEMORY (${latest.created_at}):
Title: ${latest.title}
Content: ${latest.content}
Emotion: ${latest.emotion || "not specified"}
Reflection: ${latest.ai_reflections?.identity_statement || "No reflection available"}`;

    const result = await model.generateContent(prompt);
    const narrative = result.response.text().trim();

    return NextResponse.json({
      narrative,
      earliest: {
        title: earliest.title,
        content: earliest.content,
        emotion: earliest.emotion,
        created_at: earliest.created_at,
        identity_statement: earliest.ai_reflections?.identity_statement,
      },
      latest: {
        title: latest.title,
        content: latest.content,
        emotion: latest.emotion,
        created_at: latest.created_at,
        identity_statement: latest.ai_reflections?.identity_statement,
      },
    });
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json(
      { error: "Failed to generate comparison" },
      { status: 500 }
    );
  }
}
