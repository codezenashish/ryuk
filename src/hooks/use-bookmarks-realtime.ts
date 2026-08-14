"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getBookmarksQueryKey } from "./use-bookmarks";

/**
 * Real-Time Multi-Device Sync Hook (PC ↔ Mobile)
 * Listens to Supabase Realtime Channel (`postgres_changes`) on the `bookmark` table
 * filtered by the user's `userId`. On INSERT, UPDATE, or DELETE, invalidates
 * the TanStack query cache for instantaneous live sync across all devices.
 */
export function useBookmarksRealtime(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channelName = `realtime-bookmark-sync-${userId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmark",
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          console.log(
            `[Supabase Realtime] DB event '${payload.eventType}' detected on bookmark table:`,
            payload
          );

          // Invalidate TanStack Query cache so active devices update in real-time
          queryClient.invalidateQueries({
            queryKey: getBookmarksQueryKey(userId),
          });
          queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(
            `[Supabase Realtime] Successfully subscribed to bookmark changes for userId: ${userId}`
          );
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}
