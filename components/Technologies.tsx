"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const technologies = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "HuggingFace",
  "React",
  "Node.js",
  "PostgreSQL",
  "Python",
  "OpenAI API"
];

export default function Technologies() {
  return (
    <section 
      className="py-12 sm:py-16 md:py-24 px-4" 
      id="tecnologias"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Title - Responsive */}
        <motion.h3 
          className="text-xl sm:text-2xl md:text-3xl font-black dark:text-white mb-8 sm:mb-10 md:mb-12 px-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          Stack Tecnológico de Vanguardia
        </motion.h3>

        {/* Tech Tags - Responsive gap and sizing */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto px-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {technologies.map((tech, index) => (
            <motion.span
              key={index}
              className="px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 text-xs sm:text-sm font-bold dark:text-white hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-default min-h-[44px] flex items-center justify-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

      </div>
    </section>
  );
}