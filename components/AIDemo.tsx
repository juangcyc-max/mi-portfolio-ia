"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import ChatBox from "./ChatBox";

export default function AIDemo() {
  return (
    <section 
      className="py-12 sm:py-16 md:py-24 px-4 bg-transparent" 
      id="demo"
      suppressHydrationWarning
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header - Responsive */}
        <motion.div 
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.p
            className="text-emerald-500 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3"
            variants={fadeInUp}
          >
            Demo Interactiva
          </motion.p>
          <motion.h3 
            className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white mb-3 sm:mb-4 px-2 leading-tight" 
            variants={fadeInUp}
          >
            Prueba nuestra IA
          </motion.h3>
          <motion.p 
            className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-2" 
            variants={fadeInUp}
          >
            Interactúa con un prototipo de nuestro asistente inteligente.
          </motion.p>
        </motion.div>

        {/* Chat Component - Responsive wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ChatBox />
        </motion.div>

      </div>
    </section>
  );
}