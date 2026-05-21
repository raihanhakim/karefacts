"use client";

import { useState } from "react";

export default function ResultAccordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-900/20 bg-[#FFFDF5] shadow-sm">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-black text-slate-950 focus:outline-none focus:ring-4 focus:ring-emerald-100">
        <span>{title}</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">{open ? "Tutup" : "Buka"}</span>
      </button>
      {open ? <div className="border-t border-slate-100 px-4 py-4 text-sm leading-6 text-slate-600">{children}</div> : null}
    </section>
  );
}
