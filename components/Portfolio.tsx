"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

type Metric = { label: string; value: number; suffix: string };
type Project = {
  title: string; category: string; description: string;
  features: string[]; color: string; logo: string; link: string; metrics: Metric[];
};

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    if (hasAnimated) return;
    let start = 0;
    const duration = 1200;
    const step = value / (duration / 16);
    let animationFrame: number;
    const animate = () => {
      start += step;
      if (Math.abs(start) >= Math.abs(value)) { setCount(value); setHasAnimated(true); }
      else { setCount(parseFloat(start.toFixed(1))); animationFrame = requestAnimationFrame(animate); }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, hasAnimated]);
  return <span>{count}{suffix}</span>;
}

export default function Portfolio() {
  const { t } = useTranslation();

  const projects: Project[] = [
    {
      title: t("port_p1_title"), category: t("port_p1_cat"), description: t("port_p1_desc"),
      features: [t("port_p1_f1"), t("port_p1_f2"), t("port_p1_f3")],
      color: "from-emerald-500 to-cyan-500", logo: "/logos/fashion-ia.png", link: "/portfolio/ecommerce",
      metrics: [
        { label: t("port_p1_m1"), value: 40, suffix: "%" },
        { label: t("port_p1_m2"), value: 65, suffix: "%" },
        { label: t("port_p1_m3"), value: 0.8, suffix: "s" },
      ],
    },
    {
      title: t("port_p2_title"), category: t("port_p2_cat"), description: t("port_p2_desc"),
      features: [t("port_p2_f1"), t("port_p2_f2"), t("port_p2_f3")],
      color: "from-blue-600 to-cyan-500", logo: "/logos/saaslogo.png", link: "/portfolio/dashboard",
      metrics: [
        { label: t("port_p2_m1"), value: 10000, suffix: "+" },
        { label: t("port_p2_m2"), value: 99.9, suffix: "%" },
        { label: t("port_p2_m3"), value: 50, suffix: "M" },
      ],
    },
    {
      title: t("port_p3_title"), category: t("port_p3_cat"), description: t("port_p3_desc"),
      features: [t("port_p3_f1"), t("port_p3_f2"), t("port_p3_f3")],
      color: "from-blue-500 to-purple-500", logo: "/logos/adlaunch-studio.png", link: "/portfolio/landing",
      metrics: [
        { label: t("port_p3_m1"), value: 12.5, suffix: "%" },
        { label: t("port_p3_m2"), value: -35, suffix: "%" },
        { label: t("port_p3_m3"), value: 200, suffix: "%" },
      ],
    },
  ];

  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 bg-transparent" id="portfolio" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto">

        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <motion.p variants={fadeInUp} className="text-emerald-500 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3">
            {t("port_badge")}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 dark:text-white leading-tight px-2">
            {t("port_title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              {t("port_title2")}
            </span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 px-2">
            {t("port_subtitle")}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => {
            const x = useMotionValue(0);
            const y = useMotionValue(0);
            const rotateX = useTransform(y, [-50, 50], [8, -8]);
            const rotateY = useTransform(x, [-50, 50], [-8, 8]);
            function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
              const rect = e.currentTarget.getBoundingClientRect();
              x.set(e.clientX - rect.left - rect.width / 2);
              y.set(e.clientY - rect.top - rect.height / 2);
            }
            return (
              <motion.div
                key={index}
                style={{ rotateX, rotateY }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { x.set(0); y.set(0); }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="group relative perspective-1000"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${project.color} opacity-20 sm:opacity-30 blur-lg sm:blur-xl rounded-2xl group-hover:opacity-50 sm:group-hover:opacity-60 transition duration-500`} />
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">
                  <Link href={project.link} className={`block w-full h-48 sm:h-56 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="rounded-xl p-6 sm:p-8 shadow-2xl transition-transform duration-500 group-hover:scale-95 bg-white">
                      <Image src={project.logo} alt={project.title} width={140} height={70} className="object-contain w-32 sm:w-44 md:w-[180px] h-auto" priority={index === 0} />
                    </div>
                  </Link>
                  <div className="p-4 sm:p-6">
                    <span className={`inline-block px-2 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full bg-gradient-to-r ${project.color} text-white mb-3 sm:mb-4 uppercase tracking-wide`}>
                      {project.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold dark:text-white mb-2 sm:mb-3 leading-tight">{project.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{project.description}</p>
                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-[11px] sm:text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                      {project.metrics.map((metric, i) => (
                        <div key={i} className="text-center p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <p className="font-black text-emerald-500 text-base sm:text-lg">
                            <CountUp value={metric.value} suffix={metric.suffix} />
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-tight">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="text-center mt-12 sm:mt-16 md:mt-20 px-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <p className="text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
            {t("port_subtitle")}
          </p>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 font-bold text-white rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 text-sm sm:text-base w-full sm:w-auto min-h-[48px]"
          >
            {t("port_cta")}
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
