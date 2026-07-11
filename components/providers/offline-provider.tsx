"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { syncPendingMemories, getPendingCount } from "@/lib/sync";

interface OfflineContextType {
  isOnline: boolean;
  pendingCount: number;
  syncNow: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  pendingCount: 0,
  syncNow: async () => {},
});

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const updatePendingCount = useCallback(async () => {
    const count = await getPendingCount();
    setPendingCount(count);
  }, []);

  const syncNow = useCallback(async () => {
    await syncPendingMemories();
    await updatePendingCount();
  }, [updatePendingCount]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    updatePendingCount();

    const handleOnline = async () => {
      setIsOnline(true);
      await syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncNow, updatePendingCount]);

  return (
    <OfflineContext.Provider value={{ isOnline, pendingCount, syncNow }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  return useContext(OfflineContext);
}
