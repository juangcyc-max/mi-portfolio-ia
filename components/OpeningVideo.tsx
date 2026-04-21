"use client";

import { useEffect, useRef, useState } from "react";

export default function OpeningVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Solo mostrar una vez por sesión
  useEffect(() => {
    if (sessionStorage.getItem("opening_seen")) {
      setVisible(false);
      return;
    }
    videoRef.current?.play().catch(() => dismiss());
  }, []);

  function dismiss() {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("opening_seen", "1");
    }, 600);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-600 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src="/video/videoopen.mp4"
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        className="w-full h-full object-cover"
      />

      {/* Botón saltar */}
      <button
        onClick={dismiss}
        className="absolute bottom-8 right-8 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-semibold transition-all"
      >
        Saltar
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
