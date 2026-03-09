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
    <section className="py-24" id="tecnologias">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.h3 
          className="text-2xl font-black dark:text-white mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          Stack Tecnológico de Vanguardia
        </motion.h3>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {technologies.map((tech, index) => (
            <motion.span
              key={index}
              className="px-6 py-3 rounded-xl bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 text-sm font-bold dark:text-white hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-default"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

      </div>
    </section>
  );
}