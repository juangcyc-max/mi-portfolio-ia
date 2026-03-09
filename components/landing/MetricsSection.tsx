// components/landing/MetricsSection.tsx

"use client";

import { motion } from 'framer-motion';
import { LANDING_CONTENT } from '@/lib/landing/data';

export default function MetricsSection() {
  return (
    <section className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {LANDING_CONTENT.metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center"
            >
              {/* Value with gradient */}
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                className={`text-3xl md:text-4xl lg:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r ${
                  index === 0 ? 'from-emerald-500 to-cyan-500' :
                  index === 1 ? 'from-cyan-500 to-blue-500' :
                  index === 2 ? 'from-blue-500 to-slate-600' :
                  'from-slate-600 to-emerald-500'
                }`}
              >
                {metric.value}
              </motion.div>
              
              {/* Label */}
              <p className="text-sm md:text-base text-slate-600 font-medium">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}