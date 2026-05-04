"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PortfolioBreadcrumb({ page }: { page: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 py-2">
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-emerald-400 transition-colors">
          Mindbridge IA
        </Link>
        <ChevronRight size={12} className="shrink-0" />
        <Link href="/#portfolio" className="hover:text-emerald-400 transition-colors">
          Portfolio
        </Link>
        <ChevronRight size={12} className="shrink-0" />
        <span className="text-emerald-400 font-semibold">{page}</span>
      </nav>
    </div>
  );
}
