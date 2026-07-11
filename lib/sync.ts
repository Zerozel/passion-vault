import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/storage";

export async function syncPendingMemories() {
  const supabase = createClient();
  const pending = await db.memories.where("syncStatus").equals("pending").toArray();

  for (const memory of pending) {
    try {
      let imageUrl = memory.imageUrl;
      let voiceUrl = memory.voiceUrl;

      // Upload files if they exist
      if (memory.imageFile && !imageUrl) {
        imageUrl = await uploadMedia(memory.imageFile, memory.userId, "images");
      }
      if (memory.voiceFile && !voiceUrl) {
        voiceUrl = await uploadMedia(memory.voiceFile, memory.userId, "voice");
      }

      // Insert into Supabase
      const { data: remote, error } = await supabase
        .from("memories")
        .insert({
          vault_id: memory.vaultId,
          user_id: memory.userId,
          title: memory.title,
          content: memory.content,
          emotion: memory.emotion,
          image_url: imageUrl,
          voice_url: voiceUrl,
        })
        .select("id")
        .single();

      if (error) throw error;

      // Mark as synced
      await db.memories.update(memory.id!, {
        syncStatus: "synced",
        remoteId: remote.id,
        imageUrl,
        voiceUrl,
      });

      // Queue AI reflection for the synced memory
      await db.pendingReflections.add({
        localId: memory.localId,
        memoryId: remote.id,
      });

      // Trigger reflection
      await fetch("/api/ai/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memoryId: remote.id }),
      });
    } catch {
      await db.memories.update(memory.id!, { syncStatus: "failed" });
    }
  }
}

export async function getLocalMemories(vaultId: string) {
  return db.memories
    .where("vaultId")
    .equals(vaultId)
    .reverse()
    .sortBy("createdAt");
}

export async function getPendingCount(): Promise<number> {
  return db.memories.where("syncStatus").equals("pending").count();
}
