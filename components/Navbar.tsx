"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInDown } from "@/lib/animations";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const COLORS = {
  CORE: ['#ffffff', '#ffffe0', '#ffff99'],
  FIRE: ['#ff8c00', '#ff4500', '#ff0000', '#b22222'],
  SMOKE: ['#2a2a2a', '#111111', '#4d4d4d', '#331100'],
};

const SHOCKWAVE = Array.from({ length: 60 }, (_, i) => {
  const angle = (i / 60) * 360 + randomRange(-3, 3);
  const rad = (angle * Math.PI) / 180;
  const dist = randomRange(300, 500);
  return {
    id: `shock-${i}`,
    x: Math.cos(rad) * dist,
    y: Math.sin(rad) * dist * 0.15,
    color: COLORS.CORE[Math.floor(Math.random() * COLORS.CORE.length)],
    width: randomRange(2, 8),
    len: randomRange(60, 150),
    opacity: randomRange(0.2, 0.7),
    delay: 0,
  };
});

const NUCLEAR_FIRE = Array.from({ length: 120 }, (_, i) => {
  const distanceFactor = Math.pow(Math.random(), 2);
  const dist = 30 + distanceFactor * 350;
  const angle = randomRange(0, 360);
  const rad = (angle * Math.PI) / 180;
  const upwardPull = randomRange(50, 200) * distanceFactor;
  return {
    id: `fire-${i}`,
    x: Math.cos(rad) * dist,
    y: (Math.sin(rad) * dist) - upwardPull,
    color: COLORS.FIRE[Math.floor(Math.random() * COLORS.FIRE.length)],
    size: randomRange(4, 18),
    rotate: randomRange(0, 360),
    opacity: randomRange(0.7, 1),
    delay: randomRange(0.02, 0.2),
  };
});

const SMOKE_CLOUDS = Array.from({ length: 50 }, (_, i) => {
  const angle = randomRange(0, 360);
  const rad = (angle * Math.PI) / 180;
  const dist = randomRange(50, 250);
  const upwardPull = randomRange(100, 350);
  return {
    id: `smoke-${i}`,
    x: Math.cos(rad) * dist * 0.6,
    y: (Math.sin(rad) * dist) - upwardPull,
    color: COLORS.SMOKE[Math.floor(Math.random() * COLORS.SMOKE.length)],
    scale: randomRange(3, 8),
    opacity: randomRange(0.5, 0.9),
    delay: randomRange(0.15, 0.5),
  };
});

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [adminClicks, setAdminClicks] = useState(0);
  const [exploding, setExploding] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      <AnimatePresence>
        {exploding && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, delay: 1.2 } }}
          >
            {/* White flash */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.35, times: [0, 0.15, 1] }}
            />
            {/* Dark bg */}
            <motion.div
              className="absolute inset-0 bg-slate-950"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.75, 0.5] }}
              transition={{ duration: 1.4, times: [0, 0.2, 0.4, 1] }}
            />

            {/* Shockwave SVG */}
            <svg className="absolute w-full h-full" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMidYMid meet">
              {SHOCKWAVE.map(s => (
                <motion.line
                  key={s.id}
                  x1={0} y1={0}
                  initial={{ x2: 0, y2: 0, opacity: s.opacity }}
                  animate={{ x2: s.x, y2: s.y, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: s.delay }}
                  stroke={s.color}
                  strokeWidth={s.width}
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {/* Nuclear fire */}
            {NUCLEAR_FIRE.map(f => (
              <motion.div
                key={f.id}
                className="absolute rounded-full"
                style={{ width: f.size, height: f.size, backgroundColor: f.color }}
                initial={{ x: 0, y: 0, opacity: f.opacity, scale: 0, rotate: f.rotate }}
                animate={{ x: f.x, y: f.y, opacity: 0, scale: 1.5, rotate: f.rotate + 180 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: f.delay }}
              />
            ))}

            {/* Smoke clouds */}
            {SMOKE_CLOUDS.map(sm => (
              <motion.div
                key={sm.id}
                className="absolute rounded-full blur-md"
                style={{ width: 40, height: 40, backgroundColor: sm.color }}
                initial={{ x: 0, y: 0, scale: 0, opacity: sm.opacity }}
                animate={{ x: sm.x, y: sm.y, scale: sm.scale, opacity: 0 }}
                transition={{ duration: 1.8, ease: 'easeOut', delay: sm.delay }}
              />
            ))}

            {/* Core glow */}
            <motion.div
              className="absolute rounded-full"
              style={{ background: 'radial-gradient(circle, #fff 0%, #ffd700 30%, #ff4500 65%, transparent 100%)' }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: 320, height: 320, opacity: [1, 0.8, 0] }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
            {/* Inner bright core */}
            <motion.div
              className="absolute rounded-full bg-white"
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: 100, height: 100, opacity: [1, 0] }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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