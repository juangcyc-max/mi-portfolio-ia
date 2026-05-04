"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInDown } from "@/lib/animations";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [adminClicks, setAdminClicks] = useState(0);
  const [exploding, setExploding] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!exploding) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rr = (min: number, max: number) => Math.random() * (max - min) + min;
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 80;
    const startTime = performance.now();
    const maxDim = Math.max(canvas.width, canvas.height);

    // 4 shockwave rings + 1 ground dust ring
    const rings = [
      { r: 0, maxR: maxDim * 1.1, speed: 28, alpha: 1.0,  lineW: 5,  color: '#ffffff', scaleY: 0.4,  delay: 0   },
      { r: 0, maxR: maxDim * 0.9, speed: 18, alpha: 0.7,  lineW: 3,  color: '#ffeeaa', scaleY: 0.38, delay: 40  },
      { r: 0, maxR: maxDim * 0.7, speed: 11, alpha: 0.5,  lineW: 2,  color: '#ff8800', scaleY: 0.35, delay: 100 },
      { r: 0, maxR: maxDim * 0.5, speed: 7,  alpha: 0.35, lineW: 1.5,color: '#ff4400', scaleY: 0.32, delay: 180 },
      // Ground dust
      { r: 0, maxR: maxDim * 0.7, speed: 20, alpha: 0.55, lineW: 8,  color: '#8b6914', scaleY: 0.08, delay: 20  },
    ];

    type P = {
      x: number; y: number; vx: number; vy: number;
      color: string; color2: string;
      size: number; alpha: number; initAlpha: number;
      friction: number; decay: number; gravity: number;
      upwardDraft: number; growth: number; glow: number;
      rot: number; rotSpeed: number; w: number; h: number;
      type: string; spawnAt: number;
    };

    const mk = (o: Partial<P> & { type: string; spawnAt: number }): P => ({
      x: cx, y: cy, vx: 0, vy: 0,
      color: '#fff', color2: '',
      size: 6, alpha: 1, initAlpha: 1,
      friction: 0.93, decay: 0.01, gravity: 0,
      upwardDraft: 0, growth: 0, glow: 0,
      rot: 0, rotSpeed: 0, w: 0, h: 0,
      ...o,
    });

    const particles: P[] = [];

    // Fase 0 — fuego + shock inmediato (250 partículas)
    for (let i = 0; i < 250; i++) {
      const a = rr(0, Math.PI * 2);
      const s = Math.pow(Math.random(), 1.4) * 20 + 1;
      const isFire = i < 200;
      particles.push(mk({
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - rr(0.5, 5),
        color: isFire ? pick(['#ff8c00','#ff4500','#ff2200','#ff6000','#ffbb00','#fff']) : pick(['#fff','#ffffe0']),
        color2: isFire ? pick(['#ff2200','#ff0000','#b22222']) : '',
        size: isFire ? rr(4, 20) : rr(1.5, 5),
        alpha: 1, initAlpha: 1,
        friction: isFire ? 0.90 : 0.94,
        decay: isFire ? rr(0.005, 0.016) : rr(0.012, 0.028),
        gravity: isFire ? rr(0.02, 0.07) : 0,
        upwardDraft: isFire ? rr(0.12, 0.55) : 0,
        glow: isFire ? rr(15, 40) : rr(5, 12),
        type: isFire ? 'FIRE' : 'SHOCK', spawnAt: 0,
      }));
    }

    // Fase 1 — brasas con arco balístico (spawnAt 120ms)
    for (let i = 0; i < 120; i++) {
      const a = rr(-Math.PI * 0.95, -Math.PI * 0.05);
      const s = rr(5, 22);
      particles.push(mk({
        vx: Math.cos(a) * s + rr(-4, 4), vy: Math.sin(a) * s - rr(0, 3),
        color: pick(['#ff4500','#ff8c00','#ffd700','#fff','#ffaa00']),
        color2: pick(['#ff2200','#ff6600','']),
        size: rr(1.5, 4.5), alpha: 1, initAlpha: 1,
        friction: 0.975, decay: rr(0.003, 0.009),
        gravity: rr(0.07, 0.2), upwardDraft: 0,
        glow: rr(8, 20), type: 'EMBER', spawnAt: 120,
      }));
    }

    // Fase 2 — escombros rotativos (spawnAt 80ms)
    for (let i = 0; i < 30; i++) {
      const a = rr(-Math.PI, 0);
      const s = rr(4, 14);
      particles.push(mk({
        vx: Math.cos(a) * s + rr(-3, 3), vy: Math.sin(a) * s - rr(1, 4),
        color: pick(['#4a3000','#2a1a00','#6b4500','#333']),
        color2: '',
        size: 0, alpha: 1, initAlpha: 1,
        w: rr(6, 22), h: rr(3, 8),
        friction: 0.97, decay: rr(0.004, 0.01),
        gravity: rr(0.1, 0.25), upwardDraft: 0,
        rot: rr(0, Math.PI * 2), rotSpeed: rr(-0.15, 0.15),
        glow: 0, type: 'DEBRIS', spawnAt: 80,
      }));
    }

    // Fase 3 — humo columna (spawnAt 250ms, más denso)
    for (let i = 0; i < 140; i++) {
      const spread = rr(-50, 50);
      const upStr = rr(1.2, 4.5);
      particles.push(mk({
        x: cx + spread, y: cy + rr(-10, 20),
        vx: rr(-0.8, 0.8), vy: -upStr,
        color: pick(['#111','#1c1c1c','#222','#2a2a2a','#0a0a0a','#181818']),
        color2: '',
        size: rr(20, 55), alpha: rr(0.4, 0.8), initAlpha: rr(0.4, 0.8),
        friction: 0.985, decay: rr(0.0015, 0.005),
        gravity: 0, upwardDraft: rr(0.04, 0.18),
        growth: rr(0.3, 1.2), glow: 0,
        type: 'SMOKE', spawnAt: rr(250, 600),
      }));
    }

    // Explosiones secundarias (spawnAt 350ms y 600ms)
    const secondaryData = [
      { dx: rr(-80, 80), dy: rr(-60, 20), t: 350 },
      { dx: rr(-100, 100), dy: rr(-80, 10), t: 580 },
      { dx: rr(-60, 60), dy: rr(-40, 30), t: 750 },
    ];
    for (const sd of secondaryData) {
      for (let i = 0; i < 40; i++) {
        const a = rr(0, Math.PI * 2);
        const s = rr(2, 10);
        particles.push(mk({
          x: cx + sd.dx, y: cy + sd.dy,
          vx: Math.cos(a) * s, vy: Math.sin(a) * s - rr(0.5, 3),
          color: pick(['#ff8c00','#ff4500','#ffd700','#fff']),
          color2: '',
          size: rr(3, 12), alpha: 1, initAlpha: 1,
          friction: 0.91, decay: rr(0.01, 0.025),
          gravity: 0.05, upwardDraft: rr(0.1, 0.4),
          glow: rr(8, 20), type: 'FIRE', spawnAt: sd.t,
        }));
      }
    }

    let shakeFrames = 25;

    function drawParticle(c: CanvasRenderingContext2D, p: P) {
      c.save();
      c.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'SMOKE') {
        c.globalCompositeOperation = 'source-over';
        c.fillStyle = p.color;
        c.beginPath();
        c.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        c.fill();
      } else if (p.type === 'DEBRIS') {
        c.globalCompositeOperation = 'source-over';
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.fillStyle = p.color;
        c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        c.globalCompositeOperation = 'lighter';
        // Color aging: interpolar a rojo al final de vida
        const lifeRatio = p.alpha / p.initAlpha;
        c.fillStyle = lifeRatio > 0.4 ? p.color : (p.color2 || p.color);
        if (p.glow > 0) {
          c.shadowColor = p.color;
          c.shadowBlur = p.glow * lifeRatio;
        }
        c.beginPath();
        c.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    }

    function loop() {
      const elapsed = performance.now() - startTime;
      const c = ctx!;
      const cv = canvas!;

      // Screen shake decreciente
      if (shakeFrames > 0) {
        const mag = Math.pow(shakeFrames / 25, 2) * 18;
        c.setTransform(1, 0, 0, 1, rr(-mag, mag), rr(-mag, mag));
        shakeFrames--;
      } else {
        c.setTransform(1, 0, 0, 1, 0, 0);
      }

      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;
      c.fillStyle = 'rgba(4,4,4,0.22)';
      c.fillRect(-50, -50, cv.width + 100, cv.height + 100);

      // Shockwave rings
      for (const ring of rings) {
        if (elapsed < ring.delay) continue;
        ring.r += ring.speed;
        ring.speed *= 0.92;
        ring.alpha *= 0.87;
        if (ring.r < ring.maxR && ring.alpha > 0.008) {
          c.save();
          c.globalCompositeOperation = 'lighter';
          c.globalAlpha = ring.alpha;
          c.strokeStyle = ring.color;
          c.lineWidth = ring.lineW;
          c.shadowColor = ring.color;
          c.shadowBlur = ring.lineW * 4;
          c.beginPath();
          c.ellipse(cx, cy, ring.r, ring.r * ring.scaleY, 0, 0, Math.PI * 2);
          c.stroke();
          c.restore();
        }
      }

      // Smoke first (back layer)
      for (const p of particles) {
        if (p.type !== 'SMOKE' || elapsed < p.spawnAt) continue;
        p.vx += rr(-0.1, 0.1);
        p.vy += rr(-0.05, 0.05) - p.upwardDraft;
        p.x += p.vx; p.y += p.vy;
        if (p.growth) p.size += p.growth;
        p.alpha -= p.decay;
        if (p.alpha > 0) drawParticle(c, p);
      }

      // Fire, shock, ember, debris (front layers)
      for (const p of particles) {
        if (p.type === 'SMOKE' || elapsed < p.spawnAt) continue;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity - p.upwardDraft;
        p.vx += rr(-0.12, 0.12);
        p.x += p.vx; p.y += p.vy;
        if (p.rot !== undefined) p.rot += p.rotSpeed;
        p.alpha -= p.decay;
        if (p.alpha > 0) drawParticle(c, p);
      }

      // Fireball core radial gradient
      const t = elapsed / 1000;
      if (t < 1.0) {
        const coreR = Math.max(0, 150 * Math.pow(1 - t * 1.0, 1.2));
        const ca = Math.max(0, 1 - t * 1.1);
        c.save();
        c.globalCompositeOperation = 'lighter';
        c.globalAlpha = 1;
        const g = c.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        g.addColorStop(0,   `rgba(255,255,255,${ca})`);
        g.addColorStop(0.2, `rgba(255,240,100,${ca * 0.9})`);
        g.addColorStop(0.5, `rgba(255,120,0,${ca * 0.6})`);
        g.addColorStop(0.8, `rgba(200,30,0,${ca * 0.25})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        c.fillStyle = g;
        c.beginPath();
        c.arc(cx, cy, coreR, 0, Math.PI * 2);
        c.fill();
        // segundo halo exterior
        if (t < 0.5) {
          const g2 = c.createRadialGradient(cx, cy, coreR * 0.8, cx, cy, coreR * 2.5);
          g2.addColorStop(0, `rgba(255,80,0,${ca * 0.15})`);
          g2.addColorStop(1, 'rgba(0,0,0,0)');
          c.fillStyle = g2;
          c.beginPath();
          c.arc(cx, cy, coreR * 2.5, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      }

      // Vignette oscuro gradual
      if (t > 0.3) {
        const vigA = Math.min(0.7, (t - 0.3) * 0.5);
        c.save();
        c.globalCompositeOperation = 'source-over';
        const vg = c.createRadialGradient(cx, cy, 0, cx, cy, maxDim * 0.7);
        vg.addColorStop(0, 'rgba(0,0,0,0)');
        vg.addColorStop(1, `rgba(0,0,0,${vigA})`);
        c.fillStyle = vg;
        c.globalAlpha = 1;
        c.fillRect(0, 0, cv.width, cv.height);
        c.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    // Flash inicial blanco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx?.setTransform(1, 0, 0, 1, 0, 0);
    };
  }, [exploding]);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll + focus trap + Escape cuando menú abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      // Focus al primer elemento del menú
      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.[0]?.focus();
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!menuOpen) return;
      if (e.key === "Escape") { setMenuOpen(false); return; }
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  function handleLogoClick(e: React.MouseEvent) {
    if (exploding) { e.preventDefault(); return; }
    const next = adminClicks + 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (next >= 5) {
      e.preventDefault();
      setAdminClicks(0);
      setExploding(true);
      setTimeout(() => { window.location.href = '/admin/login'; }, 1600);
    } else {
      setAdminClicks(next);
      clickTimer.current = setTimeout(() => setAdminClicks(0), 2500);
    }
    setMenuOpen(false);
  }

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();

      const element = document.querySelector(href);

      if (element) {
        const navbarHeight = 80;
        const y =
          element.getBoundingClientRect().top +
          window.scrollY -
          navbarHeight;

        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }

      setMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeInDown}
        className={`sticky top-0 z-50 transition-all duration-500 border-b ${
          scrolled || menuOpen
            ? "bg-white/80 dark:bg-slate-900/90 backdrop-blur-lg shadow-sm border-slate-200/50 dark:border-slate-700/50"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center h-16 sm:h-20 w-full">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={handleLogoClick}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Image
                  src="/logo.svg"
                  alt="Mindbridge IA"
                  width={40}
                  height={40}
                  priority
                />
              </div>

              <span className="font-black text-lg text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-emerald-400 dark:to-emerald-500">
                Mindbridge IA
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {[
                { href: "#servicios", label: t("nav_services") },
                { href: "#planes",    label: t("nav_plans") },
                { href: "#demo",      label: t("nav_chat") },
                { href: "#portfolio", label: t("nav_portfolio") },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2">

              <LanguageSwitcher />
              <ThemeToggle />

              {/* App Download */}
              <Link
                href="/descargar"
                className="hidden md:inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-500 px-3 py-2 rounded-xl text-xs font-bold transition"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.463 11.463 0 0 0-8.94 0L5.65 5.67a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 0 0 1 18h22a10.78 10.78 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
                </svg>
                App
              </Link>

              {/* CTA Desktop */}
              <a
                href="#contacto"
                onClick={(e) => handleAnchorClick(e, "#contacto")}
                className="hidden md:inline-flex bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition shadow-lg shadow-emerald-500/20"
              >
                {t("nav_contact")}
              </a>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {menuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Admin Easter Egg Explosion */}
      {exploding && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-[999] pointer-events-none"
          style={{ width: '100vw', height: '100vh' }}
        />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              ref={menuRef}
              id="mobile-menu"
              role="dialog"
              aria-label="Menú de navegación"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 w-full h-full bg-white dark:bg-slate-900 z-40 md:hidden p-8"
            >
              <div className="flex flex-col gap-6 mt-20">

                {[
                  { href: "#servicios", label: t("nav_services") },
                  { href: "#planes",    label: t("nav_plans") },
                  { href: "#demo",      label: t("nav_chat") },
                  { href: "#portfolio", label: t("nav_portfolio") },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                    className="text-xl font-bold text-slate-800 dark:text-slate-200"
                  >
                    {item.label}
                  </a>
                ))}

                <Link
                  href="/descargar"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3.5 rounded-xl text-center font-bold text-base"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.463 11.463 0 0 0-8.94 0L5.65 5.67a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 0 0 1 18h22a10.78 10.78 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
                  </svg>
                  Descargar app
                </Link>

                <a
                  href="#contacto"
                  onClick={(e) => handleAnchorClick(e, "#contacto")}
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white py-4 rounded-xl text-center font-bold text-lg"
                >
                  {t("nav_contact")}
                </a>

              </div>
            </motion.div>

            {/* Overlay */}
            <motion.div
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}