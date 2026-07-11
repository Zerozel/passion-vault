import Dexie, { type Table } from "dexie";

export interface LocalMemory {
  id?: number;
  localId: string;
  vaultId: string;
  userId: string;
  title: string;
  content: string;
  emotion: string | null;
  imageFile: File | null;
  voiceFile: File | null;
  imageUrl: string | null;
  voiceUrl: string | null;
  syncStatus: "pending" | "synced" | "failed";
  remoteId: string | null;
  createdAt: string;
}

export class PassionVaultDB extends Dexie {
  memories!: Table<LocalMemory>;
  pendingReflections!: Table<{ localId: string; memoryId: string }>;

  constructor() {
    super("passion-vault");
    this.version(1).stores({
      memories: "++id, localId, syncStatus, createdAt",
      pendingReflections: "++id, localId, memoryId",
    });
  }
}

export const db = new PassionVaultDB();
