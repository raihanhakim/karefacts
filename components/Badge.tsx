import type { AttentionCategory } from "@/types/label";

type BadgeTone = AttentionCategory | "Edukasi" | "Klaim" | "Netral";

const toneClass: Record<BadgeTone, string> = {
  "Rendah perhatian": "bg-emerald-100 text-emerald-800 ring-emerald-200",
  "Perlu diperhatikan": "bg-yellow-100 text-yellow-800 ring-yellow-200",
  "Cukup tinggi": "bg-orange-100 text-orange-800 ring-orange-200",
  Tinggi: "bg-red-100 text-red-800 ring-red-200",
  Edukasi: "bg-sky-100 text-sky-800 ring-sky-200",
  Klaim: "bg-purple-100 text-purple-800 ring-purple-200",
  Netral: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function Badge({ children, tone = "Netral" }: { children: React.ReactNode; tone?: BadgeTone }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${toneClass[tone]}`}>{children}</span>;
}
