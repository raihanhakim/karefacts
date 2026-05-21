import Badge from "@/components/Badge";
import type { AttentionCategory } from "@/types/label";

const explanations: Record<string, string> = {
  Gula: "Gula total adalah semua jenis gula yang terbaca di label, bukan cuma gula pasir.",
  Natrium: "Natrium itu bagian dari garam. Biasanya banyak muncul di snack gurih, makanan instan, saus, dan frozen food.",
  Lemak: "Lemak total adalah jumlah semua lemak dalam produk. Tetap lihat juga lemak jenuh kalau datanya ada.",
};

export default function MetricCard({ title, value, unit, percent, category, note }: { title: string; value: number | null; unit: string; percent: number | null; category: AttentionCategory | null; note: string }) {
  return (
    <section className="w-full min-w-0 break-words rounded-[1.75rem] border-2 border-emerald-900 bg-white p-4 shadow-lg shadow-emerald-900/10">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-black text-slate-950">{title}</h3>
        {category ? <Badge tone={category}>{category}</Badge> : <Badge>Belum ada data</Badge>}
      </div>
      <p className="mt-4 text-4xl font-black text-slate-950">{value === null ? "-" : value}<span className="ml-1 text-base font-bold text-slate-500">{value === null ? "" : unit}</span></p>
      <p className="mt-1 text-sm font-semibold text-emerald-700">{percent === null ? "Persentase belum tersedia" : `${percent}% dari acuan harian`}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{note}</p>
      {explanations[title] ? <details className="mt-3 rounded-2xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-950"><summary className="cursor-pointer font-black">Artinya apa?</summary><p className="mt-2">{explanations[title]}</p></details> : null}
    </section>
  );
}
