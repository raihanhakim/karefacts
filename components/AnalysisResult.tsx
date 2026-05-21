import Badge from "@/components/Badge";
import PackagingShell from "@/components/PackagingShell";
import Disclaimer from "@/components/Disclaimer";
import EvidenceSection from "@/components/EvidenceSection";
import MetricCard from "@/components/MetricCard";
import ResultAccordion from "@/components/ResultAccordion";
import ScoreCard from "@/components/ScoreCard";
import { PRODUCT_TYPES } from "@/lib/constants";
import type { AnalysisResult as AnalysisResultType, LabelInput } from "@/types/label";

const display = (value: number | null, unit: string) => (value === null ? "Data belum tersedia" : `${value} ${unit}`);

export default function AnalysisResult({ input, result }: { input: LabelInput; result: AnalysisResultType }) {
  const typeLabel = PRODUCT_TYPES.find((item) => item.value === input.productType)?.label ?? "Lainnya";
  const highlights = [
    result.categories.sodium && input.sodium !== null ? `Natrium ${result.categories.sodium.toLowerCase()}: ${input.sodium} mg per sajian` : null,
    result.categories.totalFat && input.totalFat !== null ? `Lemak ${result.categories.totalFat.toLowerCase()}: ${input.totalFat} g per sajian` : null,
    result.categories.sugar && input.sugar !== null ? `Gula ${result.categories.sugar.toLowerCase()}: ${input.sugar} g per sajian` : null,
  ].filter(Boolean).slice(0, 3) as string[];

  return (
    <div className="space-y-4">
      <PackagingShell>
        <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
          <ScoreCard result={result} />
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Ringkasan Label</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{input.productName}</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <p><strong>Merek:</strong> {input.brandName || "Tidak diinput"}</p>
              <p><strong>Jenis:</strong> {typeLabel}</p>
              <p><strong>Takaran:</strong> {input.servingSize || "Tidak diinput"}</p>
            <p><strong>Sajian/kemasan:</strong> {input.servingsPerPackage ?? "Belum tersedia"}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {highlights.length ? highlights.map((item) => <Badge key={item} tone="Edukasi">{item}</Badge>) : <Badge>Lengkapi data gizi untuk highlight</Badge>}
            </div>
          </div>
        </div>
      </PackagingShell>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Gula" value={input.sugar} unit="g" percent={result.dailyPercentages.perServing.sugar} category={result.categories.sugar} note={input.sugar === null ? "Data gula belum tersedia." : "Masih bisa dicatat, apalagi kalau hari itu kamu juga minum minuman manis."} />
        <MetricCard title="Natrium" value={input.sodium} unit="mg" percent={result.dailyPercentages.perServing.sodium} category={result.categories.sodium} note={input.sodium === null ? "Data natrium belum tersedia." : "Kalau hari ini kamu juga makan makanan asin lain, total garam harian bisa cepat naik."} />
        <MetricCard title="Lemak" value={input.totalFat} unit="g" percent={result.dailyPercentages.perServing.totalFat} category={result.categories.totalFat} note={input.totalFat === null ? "Data lemak total belum tersedia." : "Bukan berarti buruk, tapi coba imbangi dengan makanan yang lebih ringan."} />
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h3 className="font-black text-slate-950">Kalau 1 kemasan dihabiskan</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniTotal label="Kalori" value={display(result.totals.calories, "kkal")} />
          <MiniTotal label="Gula" value={display(result.totals.sugar, "g")} />
          <MiniTotal label="Natrium" value={display(result.totals.sodium, "mg")} />
          <MiniTotal label="Lemak" value={display(result.totals.totalFat, "g")} />
        </div>
        <p className="mt-3 text-sm text-slate-500">Dihitung dari nilai per sajian x jumlah sajian per kemasan.</p>
      </section>

      <div className="space-y-3">
        <ResultAccordion title="Kalau kamu konsumsi, ini artinya" defaultOpen>
          <ul className="space-y-2">{result.consumptionNotes.map((note) => <li key={note}>- {note}</li>)}</ul>
        </ResultAccordion>
        <ResultAccordion title="Kesimpulan singkat buat kamu" defaultOpen><p>{result.conclusion}</p></ResultAccordion>
        <ResultAccordion title="Protein & serat: nilai plusnya ada?"><p>{result.proteinNote}</p><p className="mt-2">{result.fiberNote}</p><p className="mt-2">{result.saturatedFatNote}</p></ResultAccordion>
        <ResultAccordion title="Detail jenis gula"><SugarDetail input={input} /></ResultAccordion>
        <ResultAccordion title="Kolesterol & lemak jenuh"><FatDetail input={input} saturatedFatNote={result.saturatedFatNote} /></ResultAccordion>
        <ResultAccordion title="Vitamin & mineral tambahan"><MicronutrientDetail input={input} /></ResultAccordion>
        <ResultAccordion title="Alergen yang perlu dicek"><p>{result.allergenNote}</p></ResultAccordion>
        <ResultAccordion title="Sensitivitas tubuh yang perlu dicek"><SensitivityDetail input={input} /></ResultAccordion>
        <ResultAccordion title="Komposisi yang perlu kamu tahu"><p>{result.additiveNote}</p></ResultAccordion>
        <ResultAccordion title="Klaim kemasan: jangan langsung percaya"><div className="space-y-2">{result.claimNotes.map((note) => <p key={note}>{note}</p>)}</div></ResultAccordion>
        <ResultAccordion title="Disclaimer"><Disclaimer /></ResultAccordion>
        <ResultAccordion title="Acuan & Evidence"><EvidenceSection /></ResultAccordion>
      </div>
    </div>
  );
}

function SugarDetail({ input }: { input: LabelInput }) {
  const breakdown = [
    ["Sukrosa", input.sucrose], ["Laktosa", input.lactose], ["Glukosa", input.glucose], ["Fruktosa", input.fructose], ["Maltosa", input.maltose],
  ] as const;
  const hasBreakdown = breakdown.some(([, value]) => value !== null);
  return (
    <div className="space-y-3">
      <p>Gula total tetap jadi angka utama buat analisis. Sukrosa dan laktosa cuma bantu kamu tahu jenis gulanya.</p>
      {input.sugar !== null ? <p>Gula totalnya {input.sugar} g per sajian.</p> : <p>Gula total belum terbaca. Kalau ada breakdown, angkanya cuma estimasi dan perlu dicek ulang.</p>}
      {input.sucrose === 0 && input.lactose !== null && input.lactose > 0 ? <p>Sukrosanya 0 g, tapi bukan berarti gulanya nol ya. Di produk ini gulanya berasal dari laktosa, yaitu gula alami yang ada di susu. Laktosa bukan alergen, tapi bisa jadi perhatian kalau tubuh kamu intoleran laktosa.</p> : null}
      {hasBreakdown ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{breakdown.map(([label, value]) => <div key={label} className="rounded-2xl bg-yellow-50 p-3"><p className="text-xs font-bold text-yellow-800">{label}</p><p className="font-black text-slate-950">{value === null ? "-" : `${value} g`}</p></div>)}</div> : null}
    </div>
  );
}

function FatDetail({ input, saturatedFatNote }: { input: LabelInput; saturatedFatNote: string }) {
  return <div className="space-y-2"><p>{saturatedFatNote}</p><p>Lemak trans: {display(input.transFat, "g")}</p><p>Kolesterol: {display(input.cholesterol, "mg")}</p>{input.cholesterol !== null ? <p>Kolesterol terbaca di label. Ini jadi info tambahan yang bisa kamu notice, terutama kalau kamu sedang memantau asupan harian.</p> : null}</div>;
}

function MicronutrientDetail({ input }: { input: LabelInput }) {
  const basics = [["Kalsium", input.calcium === null ? null : `${input.calcium} mg`], ["Zat besi", input.iron === null ? null : `${input.iron} mg`], ["Vitamin A", input.vitaminA], ["Vitamin C", input.vitaminC], ["Vitamin D", input.vitaminD]];
  return <div className="space-y-3"><p>Bagian ini info tambahan dari label. KareFacts belum memberi kategori khusus untuk vitamin/mineral, jadi tetap cocokkan dengan kebutuhan harian dan acuan resmi.</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{basics.map(([label, value]) => <div key={label} className="rounded-2xl bg-cyan-50 p-3"><p className="text-xs font-bold text-cyan-800">{label}</p><p className="font-black text-slate-950">{value || "-"}</p></div>)}</div>{input.micronutrients ? <p className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">{input.micronutrients}</p> : null}</div>;
}

function SensitivityDetail({ input }: { input: LabelInput }) {
  const hasLactose = (input.lactose !== null && input.lactose > 0) || /laktosa|lactose/i.test(`${input.ingredients} ${input.allergenText}`);
  return <div className="space-y-2">{hasLactose ? <p>Produk ini mengandung laktosa. Laktosa bukan alergen, tapi bisa jadi perhatian kalau tubuh kamu sensitif atau intoleran terhadap laktosa.</p> : <p>Belum ada info sensitivitas khusus yang kebaca. Kalau tubuh kamu punya reaksi tertentu terhadap bahan tertentu, tetap cek label asli ya.</p>}<details className="rounded-2xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-950"><summary className="cursor-pointer font-black">Artinya apa?</summary><p className="mt-2">Laktosa adalah gula alami yang ada di susu. Ini beda dari alergi susu, yang biasanya terkait protein susu.</p></details></div>;
}

function MiniTotal({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-emerald-50 p-3"><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{label}</p><p className="mt-1 font-black text-slate-950">{value}</p></div>;
}
