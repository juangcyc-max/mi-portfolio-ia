"use client";

import { useEffect } from "react";

export default function PageViewTracker() {
  useEffect(() => {
    const track = () => {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {});
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(track);
    } else {
      setTimeout(track, 2000);
    }
  }, []);

  return null;
}
