import { references } from "@/lib/references";

export default function EvidenceSection() {
  return (
    <section className="space-y-3">
      <p>KareFacts memakai acuan resmi untuk angka edukatif dan memakai literatur ilmiah untuk menjelaskan kenapa label pangan penting dibaca. Analisis tetap bersifat edukatif, bukan diagnosis.</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl bg-emerald-50 p-3 font-bold text-emerald-900">Gula: 50 g/hari</div>
        <div className="rounded-2xl bg-lime-50 p-3 font-bold text-lime-900">Natrium: 2000 mg/hari</div>
        <div className="rounded-2xl bg-yellow-50 p-3 font-bold text-yellow-900">Lemak total: 67 g/hari</div>
      </div>
      <div className="space-y-2">
        {references.map((item) => <p key={item.title} className="rounded-2xl bg-white p-3 ring-1 ring-slate-100"><strong>{item.sourceName}</strong> - {item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="font-bold text-emerald-700 underline">{item.title}</a> : item.title}. <span className="text-slate-500">{item.note}</span></p>)}
      </div>
    </section>
  );
}
