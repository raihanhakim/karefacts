export default function StickerBadge({ children, tone = "emerald", rotate = "left" }: { children: React.ReactNode; tone?: "emerald" | "yellow" | "orange" | "mint" | "white"; rotate?: "left" | "right" | "none" }) {
  const tones = {
    emerald: "border-emerald-900 bg-emerald-500 text-white shadow-emerald-200",
    yellow: "border-yellow-900 bg-yellow-300 text-slate-950 shadow-yellow-200",
    orange: "border-orange-900 bg-orange-400 text-white shadow-orange-200",
    mint: "border-emerald-900 bg-cyan-100 text-emerald-950 shadow-cyan-100",
    white: "border-slate-900 bg-white text-slate-950 shadow-slate-200",
  };
  const rotation = rotate === "left" ? "-rotate-2" : rotate === "right" ? "rotate-2" : "rotate-0";
  return <span className={`inline-flex max-w-full items-center rounded-full border-2 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] shadow-md ${tones[tone]} ${rotation}`}>{children}</span>;
}
