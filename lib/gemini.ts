import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const REFLECTION_PROMPT = `You are an AI that helps people understand their own passion and identity through their writing.

Analyze the following memory entry. It was written by someone documenting a meaningful moment in their journey.

Return ONLY valid JSON. No markdown, no explanation. Use this exact structure:

{
  "emotional_summary": "A 2-3 sentence summary of the emotional tone and what this moment reveals about their state of mind.",
  "lesson_learned": "A single sentence capturing the deeper insight or lesson embedded in this experience.",
  "identity_statement": "A single sentence in second person ('You...') that articulates what this moment says about who they are, what they value, or what they're becoming."
}

Be specific. Reference details from their writing. Never use generic motivational language. Never say 'You've got this' or 'Keep going.' This is about understanding identity through evidence, not generating motivation.`;

export async function generateReflection(content: string): Promise<{
  emotional_summary: string;
  lesson_learned: string;
  identity_statement: string;
} | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `${REFLECTION_PROMPT}\n\nMemory entry:\n${content}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean the response — remove any markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini reflection failed:", error);
    return null;
  }
}
