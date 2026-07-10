export interface Vault {
  id: string;
  user_id: string;
  dream_title: string;
  mission: string;
  why_i_started: string;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  vault_id: string;
  user_id: string;
  title: string;
  content: string;
  emotion: EmotionTag | null;
  image_url: string | null;
  voice_url: string | null;
  video_url: string | null;
  created_at: string;
}

export type EmotionTag =
  | "hope"
  | "gratitude"
  | "determination"
  | "wonder"
  | "vulnerability"
  | "joy"
  | "fear"
  | "love"
  | "pride"
  | "nostalgia";

export const EMOTION_TAGS: EmotionTag[] = [
  "hope",
  "gratitude",
  "determination",
  "wonder",
  "vulnerability",
  "joy",
  "fear",
  "love",
  "pride",
  "nostalgia",
];

export interface AIReflection {
  id: string;
  memory_id: string;
  user_id: string;
  emotional_summary: string;
  lesson_learned: string;
  identity_statement: string;
  created_at: string;
}

export interface MemoryWithReflection extends Memory {
  ai_reflection?: AIReflection | null;
}
