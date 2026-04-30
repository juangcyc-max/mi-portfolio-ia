"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomScrollbar() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        setIsScrollingUp(scrollTop < lastScrollY.current);
        lastScrollY.current = scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollPercent(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed right-0 top-0 h-full w-8 z-[9999] pointer-events-none hidden md:block">
      {/* Track minimalista */}
      <div className="absolute right-3 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-slate-400/20 to-transparent" />
      
      {/* Contenedor de la Hormiga */}
      <div 
        className="absolute right-0 w-8 transition-all duration-300 ease-out flex justify-center"
        style={{ 
          top: `calc(${scrollPercent}% - 15px)`,
          transform: `rotate(${isScrollingUp ? '180deg' : '0deg'})`,
          transitionProperty: 'top, transform'
        }}
      >
        <svg viewBox="0 0 40 60" className="w-6 h-10 filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
          <defs>
            <radialGradient id="bodyGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#444" />
              <stop offset="100%" stopColor="#111" />
            </radialGradient>
          </defs>

          {/* Antenas ultra delgadas */}
          <g fill="none" stroke="#222" strokeWidth="0.5" className="antennas">
            <path d="M18 12 Q14 5 10 8" className="animate-antenna-l" />
            <path d="M22 12 Q26 5 30 8" className="animate-antenna-r" />
          </g>
          
          {/* Patas con articulaciones (Joints) */}
          <g fill="none" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round">
            {/* Frontal */}
            <path d="M17 20 L12 18 L8 22" className="leg-move-1" />
            <path d="M23 20 L28 18 L32 22" className="leg-move-2" />
            {/* Media */}
            <path d="M16 25 L10 25 L6 30" className="leg-move-2" />
            <path d="M24 25 L30 25 L34 30" className="leg-move-1" />
            {/* Trasera */}
            <path d="M17 30 L11 35 L7 42" className="leg-move-1" />
            <path d="M23 30 L29 35 L33 42" className="leg-move-2" />
          </g>

          {/* Cuerpo Segmentado */}
          {/* Cabeza */}
          <ellipse cx="20" cy="15" rx="3.5" ry="4.5" fill="url(#bodyGrad)" />
          {/* Tórax (Segmento medio) */}
          <ellipse cx="20" cy="24" rx="3" ry="5" fill="#1a1a1a" />
          {/* Abdomen (Gáster) */}
          <ellipse cx="20" cy="38" rx="5" ry="8" fill="url(#bodyGrad)" />
          
          {/* Brillo de elegancia en el caparazón */}
          <ellipse cx="18.5" cy="35" rx="1.5" ry="3" fill="white" fillOpacity="0.1" />
        </svg>
      </div>

      <style jsx>{`
        .leg-move-1 { animation: walk 0.4s infinite alternate; }
        .leg-move-2 { animation: walk 0.4s infinite alternate-reverse; }
        
        @keyframes walk {
          from { transform: translateY(-1px) translateX(0.5px); }
          to { transform: translateY(1px) translateX(-0.5px); }
        }

        .animate-antenna-l { animation: twitchL 1.5s infinite; transform-origin: 18px 12px; }
        .animate-antenna-r { animation: twitchR 1.7s infinite; transform-origin: 22px 12px; }

        @keyframes twitchL {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-10deg); }
        }
        @keyframes twitchR {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}