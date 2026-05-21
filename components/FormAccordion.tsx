"use client";

import { useState } from "react";

export default function FormAccordion({ title, subtitle, children, filled = false }: { title: string; subtitle?: string; children: React.ReactNode; filled?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-900/20 bg-white/80 shadow-sm">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left focus:outline-none focus:ring-4 focus:ring-emerald-100">
        <span className="min-w-0">
          <span className="block font-black text-slate-950">{title}</span>
          {subtitle ? <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">{subtitle}</span> : null}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {filled ? <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-black uppercase text-purple-800">Sudah terisi</span> : null}
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{open ? "Tutup" : "Buka"}</span>
        </span>
      </button>
      {open ? <div className="border-t border-slate-100 p-4">{children}</div> : null}
    </section>
  );
}
