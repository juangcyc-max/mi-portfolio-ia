"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function PageViewTracker() {
  useEffect(() => {
    const track = () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      supabase.from("page_views").insert({
        path: window.location.pathname,
        user_agent: navigator.userAgent,
      });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(track);
    } else {
      setTimeout(track, 2000);
    }
  }, []);

  return null;
}
