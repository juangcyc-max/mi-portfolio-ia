"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const accentMap: Record<string, { pill: string; dot: string; icon: string }> = {
  emerald: {
    pill: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 border-emerald-500/20 dark:border-emerald-400/20",
    dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
    icon: "bg-emerald-500/10 dark:bg-white/5 border-emerald-500/20 dark:border-white/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-slate-950",
  },
  sky: {
    pill: "text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-400/10 border-sky-500/20 dark:border-sky-400/20",
    dot: "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]",
    icon: "bg-sky-500/10 dark:bg-white/5 border-sky-500/20 dark:border-white/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white dark:group-hover:text-slate-950",
  },
  violet: {
    pill: "text-violet-600 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-400/10 border-violet-500/20 dark:border-violet-400/20",
    dot: "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]",
    icon: "bg-violet-500/10 dark:bg-white/5 border-violet-500/20 dark:border-white/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white dark:group-hover:text-slate-950",
  },
};

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      tag: t('s1_tag'),
      title: t('s1_title'),
      description: t('s1_desc'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      features: [t('s1_f1'), t('s1_f2'), t('s1_f3'), t('s1_f4')],
      color: "from-emerald-500/20 to-teal-500/20",
      border: "group-hover:border-emerald-500/50 dark:group-hover:border-emerald-400/50",
      accent: "emerald",
    },
    {
      tag: t('s2_tag'),
      title: t('s2_title'),
      description: t('s2_desc'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      features: [t('s2_f1'), t('s2_f2'), t('s2_f3'), t('s2_f4')],
      color: "from-sky-500/20 to-indigo-500/20",
      border: "group-hover:border-sky-500/50 dark:group-hover:border-sky-400/50",
      accent: "sky",
    },
    {
      tag: t('s3_tag'),
      title: t('s3_title'),
      description: t('s3_desc'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      features: [t('s3_f1'), t('s3_f2'), t('s3_f3'), t('s3_f4')],
      color: "from-violet-500/20 to-purple-500/20",
      border: "group-hover:border-violet-500/50 dark:group-hover:border-violet-400/50",
      accent: "violet",
    },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-transparent" id="servicios">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto mb-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.span
            className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full border border-emerald-500/20 dark:border-emerald-400/20 backdrop-blur-md"
            variants={fadeInUp}
          >
            {t('services_badge')}
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1] drop-shadow-sm dark:drop-shadow-lg"
            variants={fadeInUp}
          >
            {t('services_title1')}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 drop-shadow-sm">
              {t('services_title2')}
            </span>
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            {t('services_subtitle')}
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const colors = accentMap[service.accent];
            return (
              <motion.div
                key={index}
                className={`group relative p-10 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 transition-all duration-500 hover:bg-white/80 dark:hover:bg-white/[0.08] shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ${service.border} text-center`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                {/* Inner Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none`} />

                <div className="relative z-10 flex flex-col items-center">
                  {/* Tag */}
                  <span className={`inline-block px-3 py-1 mb-6 text-[10px] font-black tracking-[0.15em] uppercase rounded-full border backdrop-blur-md ${colors.pill}`}>
                    {service.tag}
                  </span>

                  {/* Icon */}
                  <div className={`size-16 rounded-2xl border flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 shadow-md dark:shadow-xl backdrop-blur-md ${colors.icon}`}>
                    {service.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight text-center">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 font-medium text-center max-w-sm mx-auto">
                    {service.description}
                  </p>

                  {/* Feature list */}
                  <ul className="flex flex-col gap-2 w-full text-left">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-slate-200/40 dark:border-white/5 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                        <div className={`size-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow */}
                <div className="absolute top-8 right-8 text-slate-300/40 dark:text-white/10 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* What's included callout */}
        <motion.div
          className="mt-16 p-8 rounded-3xl bg-white/50 dark:bg-slate-900/30 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mb-3">
            {t('services_included')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-slate-600 dark:text-slate-300 text-sm font-medium">
            {[
              t('services_inc1'),
              t('services_inc2'),
              t('services_inc3'),
              t('services_inc4'),
              t('services_inc5'),
              t('services_inc6'),
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => scrollToSection("planes")}
            className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-black rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            {t('services_cta1').toUpperCase()}
          </button>
          <button
            onClick={() => scrollToSection("contacto")}
            className="px-8 py-4 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold rounded-2xl border border-slate-200 dark:border-white/10 transition-all duration-300 backdrop-blur-md"
          >
            {t('services_cta2')}
          </button>
        </motion.div>

      </div>
    </section>
  );
}
