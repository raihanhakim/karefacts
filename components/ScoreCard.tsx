import type { AnalysisResult } from "@/types/label";

export default function ScoreCard({ result }: { result: AnalysisResult }) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-emerald-600 to-lime-500 p-4 text-white shadow-lg shadow-emerald-100">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-50">KareFacts Score</p>
      <div className="mt-3 flex items-end gap-2">
        <p className="text-5xl font-black">{result.score}</p>
        <p className="pb-2 text-xl font-black">/100</p>
      </div>
      <p className="mt-3 text-lg font-bold">{result.scoreLabel}</p>
      <p className="mt-2 text-sm leading-6 text-emerald-50">Bukan skor sehat/tidak sehat, tetapi sinyal seberapa teliti label perlu dibaca.</p>
    </section>
  );
}
