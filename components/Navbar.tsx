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

    // Shockwave rings state
    const rings = [
      { r: 0, maxR: Math.max(canvas.width, canvas.height) * 0.9, speed: 22, alpha: 0.9, delay: 0 },
      { r: 0, maxR: Math.max(canvas.width, canvas.height) * 0.6, speed: 14, alpha: 0.6, delay: 60 },
    ];

    type P = {
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; alpha: number;
      friction: number; decay: number; gravity: number;
      upwardDraft: number; growth: number; glow: number;
      type: string; spawnAt: number;
    };

    const particles: P[] = [];

    // Fase 1 — shockwave + fuego inmediato
    for (let i = 0; i < 180; i++) {
      const a = rr(0, Math.PI * 2);
      const s = Math.pow(Math.random(), 1.5) * 18 + 2;
      const isFire = i < 140;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - rr(1, 4),
        color: isFire ? pick(['#ff8c00','#ff4500','#ff0000','#ff6000','#ffaa00']) : pick(['#fff','#ffffe0','#ffff99']),
        size: isFire ? rr(5, 18) : rr(2, 6),
        alpha: 1, friction: isFire ? 0.91 : 0.95,
        decay: isFire ? rr(0.006, 0.018) : rr(0.015, 0.03),
        gravity: isFire ? 0.04 : 0,
        upwardDraft: isFire ? rr(0.15, 0.5) : 0,
        growth: 0, glow: isFire ? rr(12, 30) : rr(4, 10),
        type: isFire ? 'FIRE' : 'SHOCK', spawnAt: 0,
      });
    }

    // Fase 2 — brasas con gravedad (spawnAt 150ms)
    for (let i = 0; i < 80; i++) {
      const a = rr(-Math.PI * 0.8, -Math.PI * 0.2);
      const s = rr(6, 20);
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(a) * s + rr(-3, 3), vy: Math.sin(a) * s,
        color: pick(['#ff4500','#ff8c00','#ffd700','#fff']),
        size: rr(2, 5), alpha: 1, friction: 0.97,
        decay: rr(0.004, 0.01), gravity: rr(0.08, 0.18),
        upwardDraft: 0, growth: 0, glow: rr(6, 14),
        type: 'EMBER', spawnAt: 150,
      });
    }

    // Fase 3 — humo denso (spawnAt 300ms)
    for (let i = 0; i < 90; i++) {
      const a = rr(0, Math.PI * 2);
      const s = rr(1, 5);
      particles.push({
        x: cx + rr(-30, 30), y: cy,
        vx: Math.cos(a) * s * 0.4, vy: Math.sin(a) * s - rr(0.5, 2),
        color: pick(['#1a1a1a','#2a2a2a','#111','#333','#0a0a0a']),
        size: rr(15, 40), alpha: rr(0.5, 0.85), friction: 0.97,
        decay: rr(0.002, 0.006), gravity: -0.02,
        upwardDraft: rr(0.08, 0.25), growth: rr(0.2, 0.8), glow: 0,
        type: 'SMOKE', spawnAt: 300,
      });
    }

    // Screen shake
    let shakeFrames = 18;

    function loop() {
      const elapsed = performance.now() - startTime;
      const c = ctx!;
      const cv = canvas!;

      // Screen shake
      if (shakeFrames > 0) {
        const mag = shakeFrames * 1.2;
        c.setTransform(1, 0, 0, 1, rr(-mag, mag), rr(-mag, mag));
        shakeFrames--;
      } else {
        c.setTransform(1, 0, 0, 1, 0, 0);
      }

      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;
      c.fillStyle = 'rgba(5,5,5,0.25)';
      c.fillRect(-50, -50, cv.width + 100, cv.height + 100);

      // Shockwave rings
      for (const ring of rings) {
        if (elapsed < ring.delay) continue;
        ring.r += ring.speed;
        ring.speed *= 0.93;
        ring.alpha *= 0.88;
        if (ring.r < ring.maxR && ring.alpha > 0.01) {
          c.save();
          c.globalCompositeOperation = 'lighter';
          c.globalAlpha = ring.alpha;
          c.strokeStyle = '#ffeeaa';
          c.lineWidth = 3;
          c.beginPath();
          c.ellipse(cx, cy, ring.r, ring.r * 0.35, 0, 0, Math.PI * 2);
          c.stroke();
          c.restore();
        }
      }

      // Particles
      for (const p of particles) {
        if (elapsed < p.spawnAt) continue;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity - p.upwardDraft;
        p.vx += rr(-0.15, 0.15); // turbulencia
        p.x += p.vx;
        p.y += p.vy;
        if (p.growth) p.size += p.growth;
        p.alpha -= p.decay;
        if (p.alpha <= 0) continue;

        c.save();
        c.globalAlpha = Math.max(0, p.alpha);
        if (p.type === 'SMOKE') {
          c.globalCompositeOperation = 'source-over';
        } else {
          c.globalCompositeOperation = 'lighter';
          if (p.glow > 0) {
            c.shadowColor = p.color;
            c.shadowBlur = p.glow;
          }
        }
        c.fillStyle = p.color;
        c.beginPath();
        c.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        c.fill();
        c.restore();
      }

      // Fireball core
      const coreAge = elapsed / 1000;
      if (coreAge < 0.8) {
        const coreR = Math.max(0, 120 * (1 - coreAge * 1.2));
        const coreAlpha = Math.max(0, 1 - coreAge * 1.4);
        c.save();
        c.globalCompositeOperation = 'lighter';
        const grad = c.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        grad.addColorStop(0, `rgba(255,255,255,${coreAlpha})`);
        grad.addColorStop(0.3, `rgba(255,220,50,${coreAlpha * 0.8})`);
        grad.addColorStop(0.7, `rgba(255,80,0,${coreAlpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = grad;
        c.beginPath();
        c.arc(cx, cy, coreR, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    // Flash inicial
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
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