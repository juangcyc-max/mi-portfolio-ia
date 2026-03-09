"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import ChatBox from "./ChatBox";

export default function AIDemo() {
  return (
    <section className="py-24 bg-transparent" id="demo">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h3 
            className="text-3xl font-black dark:text-white mb-4" 
            variants={fadeInUp}
          >
            Prueba nuestra IA
          </motion.h3>
          <motion.p 
            className="text-slate-600 dark:text-slate-400" 
            variants={fadeInUp}
          >
            Interactúa con un prototipo de nuestro asistente inteligente.
          </motion.p>
        </motion.div>

        {/* Chat Component */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ChatBox />
        </motion.div>

      </div>
    </section>
  );
}