"use client";

import { useOffline } from "@/components/providers/offline-provider";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineBanner() {
  const { isOnline, pendingCount } = useOffline();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!isOnline && (
        <div className="bg-surface-elevated/90 backdrop-blur-md border-b border-border-subtle px-4 py-2 flex items-center justify-center gap-2 text-sm text-muted">
          <WifiOff className="h-3.5 w-3.5" />
          <span>You're offline. Your vault is still open.</span>
        </div>
      )}
      {isOnline && pendingCount > 0 && (
        <div className="bg-accent/10 backdrop-blur-md border-b border-accent/20 px-4 py-2 flex items-center justify-center gap-2 text-sm text-accent">
          <Wifi className="h-3.5 w-3.5" />
          <span>
            {pendingCount} memory syncing...
          </span>
        </div>
      )}
    </div>
  );
}
