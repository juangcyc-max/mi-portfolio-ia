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
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width;
    const H = canvas.height;
    const groundY = H * 0.82;
    const ex = W / 2;

    const rr = (min: number, max: number) => Math.random() * (max - min) + min;
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    type Ring = { x: number; y: number; radius: number; thickness: number; alpha: number; speed: number; };
    type P = {
      x: number; y: number; vx: number; vy: number; originX: number;
      type: string; life: number; color: string; size: number;
      friction: number; decay: number; growth: number;
    };

    const mkRing = (x: number, y: number): Ring => ({
      x, y, radius: 10, thickness: 40, alpha: 0.8, speed: rr(15, 30),
    });

    const mkParticle = (x: number, y: number, type: string): P => {
      const angle = rr(0, Math.PI * 2);
      if (type === 'CORE') {
        const s = rr(2, 35);
        return { x, y, vx: Math.cos(angle)*s, vy: Math.sin(angle)*s, originX: x,
          type, life: 1, color: Math.random() < 0.5 ? '#ffffff' : '#ffffee',
          size: rr(2, 6), friction: 0.85, decay: rr(0.02, 0.05), growth: 0 };
      }
      if (type === 'TOROIDAL_FIRE') {
        const s = Math.pow(Math.random(), 2) * 20 + 5;
        return { x, y, vx: Math.cos(angle)*s, vy: Math.sin(angle)*s, originX: x,
          type, life: 1, color: pick(['#ff8c00','#ff2a00','#ffcc00']),
          size: rr(3, 8), friction: 0.92, decay: rr(0.003, 0.01), growth: 0 };
      }
      if (type === 'MUSHROOM_SMOKE') {
        const s = rr(2, 12);
        return { x, y, vx: Math.cos(angle)*s*0.5, vy: Math.sin(angle)*s, originX: x,
          type, life: 1, color: pick(['#0a0a0a','#111111','#1a1a1a','#221100']),
          size: rr(15, 50), friction: 0.94, decay: rr(0.001, 0.004), growth: rr(0.1, 0.4) };
      }
      // BASE_SURGE
      const dir = Math.random() > 0.5 ? 1 : -1;
      return { x, y, vx: rr(10, 40)*dir, vy: rr(-2, 0), originX: x,
        type, life: 1, color: pick(['#2a2a2a','#332a2a','#1a1a1a']),
        size: rr(20, 60), friction: 0.96, decay: rr(0.002, 0.006), growth: rr(0.2, 0.6) };
    };

    const updateP = (p: P) => {
      p.vx *= p.friction;
      p.vy *= p.friction;
      // Toroidal vortex: upward draft in stem, outward push at cap, downward curl closing the torus
      if (p.type === 'TOROIDAL_FIRE' || p.type === 'MUSHROOM_SMOKE') {
        const d = p.x - p.originX;
        const pull = Math.max(0, 1 - Math.abs(d) / 150);
        p.vy -= pull * 0.6;
        if (p.y < groundY - 200) {
          p.vx += d > 0 ? 0.2 : -0.2;
          if (Math.abs(d) > 80) p.vy += 0.3;
        }
      }
      p.x += p.vx; p.y += p.vy;
      if (p.y > groundY && p.type !== 'BASE_SURGE') { p.y = groundY; p.vy *= -0.3; p.vx *= 0.5; }
      p.size += p.growth;
      p.life -= p.decay;
    };

    let rings: Ring[] = [mkRing(ex, groundY - 70)];
    let particles: P[] = [];
    let globalIllumination = 1.0;
    let cameraShake = 60;

    const t2 = setTimeout(() => rings.push(mkRing(ex, groundY - 200)), 200);

    for (let i = 0; i < 200; i++) particles.push(mkParticle(ex, groundY, 'BASE_SURGE'));
    for (let i = 0; i < 400; i++) particles.push(mkParticle(ex, groundY - 20, 'MUSHROOM_SMOKE'));
    for (let i = 0; i < 1200; i++) particles.push(mkParticle(ex, groundY - 20, 'TOROIDAL_FIRE'));
    for (let i = 0; i < 300; i++) particles.push(mkParticle(ex, groundY - 20, 'CORE'));

    function loop() {
      const c = ctx!;

      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;
      c.fillStyle = '#050505';
      c.fillRect(0, 0, W, H);

      // Atmospheric sky glow
      if (globalIllumination > 0) {
        const grd = c.createRadialGradient(W/2, groundY, 10, W/2, groundY, W);
        grd.addColorStop(0, `rgba(255,200,150,${globalIllumination * 0.5})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = grd;
        c.fillRect(0, 0, W, H);
        globalIllumination -= 0.005;
      }

      c.save();

      if (cameraShake > 0.5) {
        c.translate(rr(-cameraShake, cameraShake), rr(-cameraShake, cameraShake));
        cameraShake *= 0.92;
      }

      // Ground horizon
      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;
      c.fillStyle = '#020202';
      c.fillRect(0, groundY, W, H - groundY);
      if (globalIllumination > 0.1) {
        c.fillStyle = `rgba(255,100,50,${globalIllumination * 0.3})`;
        c.beginPath();
        c.ellipse(W/2, groundY, 400, 20, 0, 0, Math.PI * 2);
        c.fill();
      }

      // Wilson condensation rings
      rings = rings.filter(r => r.alpha > 0);
      for (const r of rings) {
        r.radius += r.speed; r.thickness *= 0.95; r.alpha -= 0.015;
        c.beginPath();
        c.ellipse(r.x, r.y - r.radius * 0.2, r.radius, r.radius * 0.15, 0, 0, Math.PI * 2);
        c.strokeStyle = `rgba(200,220,255,${Math.max(0, r.alpha)})`;
        c.lineWidth = r.thickness;
        c.stroke();
      }

      particles = particles.filter(p => p.life > 0);

      // Smoke + ground surge (back layer)
      c.globalCompositeOperation = 'source-over';
      for (const p of particles) {
        if (p.type !== 'MUSHROOM_SMOKE' && p.type !== 'BASE_SURGE') continue;
        updateP(p);
        c.globalAlpha = Math.max(0, p.life);
        c.fillStyle = p.color;
        c.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
      }

      // Fire + plasma (front layer, additive light)
      c.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        if (p.type !== 'TOROIDAL_FIRE' && p.type !== 'CORE') continue;
        updateP(p);
        c.globalAlpha = Math.max(0, p.life);
        c.fillStyle = p.color;
        c.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
      }

      // Initial flashbang
      if (globalIllumination > 0.8) {
        c.globalCompositeOperation = 'source-over';
        c.globalAlpha = (globalIllumination - 0.8) * 5;
        c.fillStyle = 'white';
        c.fillRect(0, 0, W, H);
      }

      c.restore();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t2);
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
      setTimeout(() => { window.location.href = '/admin/login'; }, 1200);
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
        const y = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: y, behavior: "smooth" });
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

              {/* Desktop App */}
              <Link
                href="/desktop"
                className="hidden md:inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-500 px-3 py-2 rounded-xl text-xs font-bold transition"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                </svg>
                {t("nav_desktop")}
              </Link>

              {/* App móvil */}
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
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
                  href="/desktop"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3.5 rounded-xl text-center font-bold text-base"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                  </svg>
                  {t("nav_desktop")}
                </Link>
                <Link
                  href="/descargar"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3.5 rounded-xl text-center font-bold text-base"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.463 11.463 0 0 0-8.94 0L5.65 5.67a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 0 0 1 18h22a10.78 10.78 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
                  </svg>
                  App
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
