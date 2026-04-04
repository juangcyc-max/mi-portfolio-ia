"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function PageViewTracker() {
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.from("page_views").insert({
      path: window.location.pathname,
      user_agent: navigator.userAgent,
    });
  }, []);

  return null;
}
