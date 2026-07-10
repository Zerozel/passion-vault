import { createClient } from "@/lib/supabase/client";

export async function uploadMedia(
  file: File,
  userId: string,
  type: "images" | "voice" | "video"
): Promise<string | null> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${type}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error, data } = await supabase.storage
    .from("memories")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("memories")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
