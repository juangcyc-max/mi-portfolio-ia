"use client";

import { useEffect, useRef, useState } from "react";

export default function OpeningVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});

    const fadeTimer = setTimeout(() => setFadeOut(true), 8000);
    const hideTimer = setTimeout(() => setVisible(false), 8600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{ transition: "opacity 0.6s ease" }}
      className={`fixed inset-0 z-[9999] bg-black ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <video
        ref={videoRef}
        src="/video/videoopen.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}
