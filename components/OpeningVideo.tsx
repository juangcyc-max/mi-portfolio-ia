"use client";

import { useEffect, useRef, useState } from "react";

export default function OpeningVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const fadeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const skip = () => {
    clearTimeout(fadeTimerRef.current);
    clearTimeout(hideTimerRef.current);
    setFadeOut(true);
    hideTimerRef.current = setTimeout(() => setVisible(false), 600);
  };

  useEffect(() => {
    videoRef.current?.play().catch(() => {});

    fadeTimerRef.current = setTimeout(() => setFadeOut(true), 8000);
    hideTimerRef.current = setTimeout(() => setVisible(false), 8600);

    return () => {
      clearTimeout(fadeTimerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={skip}
      style={{ transition: "opacity 0.6s ease", cursor: "pointer" }}
      className={`fixed inset-0 z-[9999] bg-black ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <video
        ref={videoRef}
        src="/video/videoopen.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
}
