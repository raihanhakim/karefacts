"use client";

import { useEffect, useState } from "react";
import AnalysisResult from "@/components/AnalysisResult";
import FormAccordion from "@/components/FormAccordion";
import ImageUpload from "@/components/ImageUpload";
import PackagingShell from "@/components/PackagingShell";
import StickerBadge from "@/components/StickerBadge";
import { PRODUCT_TYPES } from "@/lib/constants";
import { analyzeLabel } from "@/lib/analyzer";
import { emptyLabelInput, sampleLabelInput } from "@/lib/sampleData";
import type { AnalysisResult as AnalysisResultType, LabelInput } from "@/types/label";
import type { NutritionPatch } from "@/types/nutritionOcr";

const numericFields = ["servingsPerPackage", "calories", "energyKj", "energyFromFat", "sugar", "sucrose", "lactose", "glucose", "fructose", "maltose", "sodium", "totalFat", "saturatedFat", "transFat", "cholesterol", "protein", "fiber", "carbohydrate", "calcium", "iron"] as const;
type NumericField = (typeof numericFields)[number];

export default function LabelForm({ sampleRequest }: { sampleRequest: number }) {
  const [input, setInput] = useState<LabelInput>(emptyLabelInput);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [inputMode, setInputMode] = useState<"scan" | "manual" | "review">("scan");

  const setSample = () => {
    setInput(sampleLabelInput);
    setResult(null);
    setError("");
    setStep(1);
    setInputMode("manual");
    document.getElementById("analisis")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (sampleRequest > 0) setSample();
  }, [sampleRequest]);

  const update = <K extends keyof LabelInput>(key: K, value: LabelInput[K]) => setInput((current) => ({ ...current, [key]: value }));

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!input.productName.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }
    if (input.servingsPerPackage !== null && input.servingsPerPackage < 1) {
      setError("Jumlah sajian per kemasan minimal 1.");
      return;
    }
    if (numericFields.some((field) => input[field] !== null && input[field] < 0)) {
      setError("Angka nilai gizi tidak boleh negatif.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setResult(analyzeLabel(input));
      setLoading(false);
      setStep(2);
      document.getElementById("analisis")?.scrollIntoView({ behavior: "smooth" });
    }, 450);
  };

  const reset = () => {
    setInput(emptyLabelInput);
    setResult(null);
    setError("");
    setStep(1);
    setInputMode("scan");
  };

  const useDetectedNutrition = (values: NutritionPatch) => {
    setInput((current) => ({ ...current, ...values }));
    setResult(null);
    setError("Hasil bacaan otomatis dipakai sebagai saran isi. Mohon cek ulang karena angka bisa saja salah terbaca.");
    setInputMode("review");
    document.getElementById("analisis")?.scrollIntoView({ behavior: "smooth" });
  };

  const NumberInput = ({ field, label, unit }: { field: NumericField; label: string; unit?: string }) => (
    <label className="block text-sm font-bold text-slate-800">
      {label}
      <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-white focus-within:ring-4 focus-within:ring-emerald-100">
        <input type="number" min={field === "servingsPerPackage" ? 1 : 0} step="any" value={input[field] ?? ""} onChange={(event) => update(field, event.target.value === "" ? null : Number(event.target.value))} className="h-12 w-full rounded-2xl px-4 outline-none" />
        {unit ? <span className="pr-4 text-sm text-slate-500">{unit}</span> : null}
      </div>
    </label>
  );

  return (
    <section id="analisis" className="space-y-6">
      {step === 2 && result ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => setStep(1)} className="rounded-2xl border-2 border-emerald-900 bg-white px-5 py-3 font-black text-emerald-900 shadow-sm">← Edit Label</button>
            <button type="button" onClick={reset} className="rounded-2xl bg-orange-400 px-5 py-3 font-black text-white shadow-md shadow-orange-200">Cek Produk Baru</button>
          </div>
          <AnalysisResult input={input} result={result} />
        </div>
      ) : (
      <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-5">
        {inputMode === "scan" ? <PackagingShell>
        <div>
          <div className="flex flex-wrap gap-2"><StickerBadge tone="yellow">Step 1</StickerBadge><StickerBadge tone="mint" rotate="right">Label Reader</StickerBadge></div>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Input Label</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Scan dulu labelnya</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Paling gampang: upload foto tabel gizi, biar KareFacts bantu baca dulu.</p>
        </div>
        <ImageUpload onUseDetectedNutrition={useDetectedNutrition} />
        <button type="button" onClick={() => setInputMode("manual")} className="mt-4 w-full rounded-2xl bg-white/80 px-4 py-3 text-sm font-black text-emerald-900 ring-1 ring-emerald-200">Tidak punya foto label? Isi manual</button>
        </PackagingShell> : null}

        {inputMode === "review" ? <ReviewScan input={input} onEdit={() => setInputMode("manual")} onScanAgain={() => setInputMode("scan")} loading={loading} /> : null}

        {inputMode === "manual" ? <PackagingShell className="bg-white">
        <div>
          <StickerBadge tone="white">Atau isi manual dari kemasan</StickerBadge>
          <h3 className="mt-4 text-2xl font-black text-slate-950">Isi dari label kemasan</h3>
          <p className="mt-1 text-sm text-slate-600">Isi bagian penting dulu. Detail tambahan boleh dibuka kalau ada di label.</p>
        </div>
        <div id="manual-nutrition-fields" className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold text-slate-800">Nama produk<input value={input.productName} onChange={(event) => update("productName", event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-4 focus:ring-emerald-100" /></label>
          <label className="block text-sm font-bold text-slate-800">Merek produk<input value={input.brandName} onChange={(event) => update("brandName", event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-4 focus:ring-emerald-100" /></label>
        </div>
        <label className="block text-sm font-bold text-slate-800">Jenis produk<select value={input.productType} onChange={(event) => update("productType", event.target.value as LabelInput["productType"])} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-4 focus:ring-emerald-100">{PRODUCT_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-bold text-slate-800">Takaran saji dari label<input placeholder="78 g atau 250 ml" value={input.servingSize} onChange={(event) => update("servingSize", event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-4 focus:ring-emerald-100" /><span className="mt-1 block text-xs font-medium text-slate-500">Contoh: 78 g. Ini ukuran 1 porsi menurut label.</span></label>
          <NumberInput field="servingsPerPackage" label="Jumlah sajian dalam 1 kemasan" />
          <label className="block text-sm font-bold text-slate-800">Biasanya 1 kemasan dihabiskan sekali makan?<select value={input.usuallyConsumedAllAtOnce ? "yes" : "no"} onChange={(event) => update("usuallyConsumedAllAtOnce", event.target.value === "yes")} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-4 focus:ring-emerald-100"><option value="no">Tidak</option><option value="yes">Ya</option></select><span className="mt-1 block text-xs font-medium text-slate-500">Pilih Ya kalau biasanya produk ini dimakan/minum sampai habis dalam sekali konsumsi.</span></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput field="calories" label="Energi/kalori" unit="kkal" />
          <NumberInput field="sugar" label="Gula total / total sugars" unit="g" />
          <NumberInput field="sodium" label="Natrium" unit="mg" />
          <NumberInput field="totalFat" label="Lemak total" unit="g" />
        </div>
        <div className="space-y-3">
          <FormAccordion title="Protein, karbohidrat, dan serat" subtitle="Isi kalau datanya ada di label. Bagian ini bantu konteks gizi, tapi bukan kategori utama GGL." filled={[input.protein, input.carbohydrate, input.fiber].some((value) => value !== null)}>
            <div className="grid gap-4 sm:grid-cols-2"><NumberInput field="protein" label="Protein" unit="g" /><NumberInput field="carbohydrate" label="Karbohidrat total" unit="g" /><NumberInput field="fiber" label="Serat pangan" unit="g" /></div>
          </FormAccordion>
          <FormAccordion title="Detail lemak" subtitle="Isi jika label menampilkan lemak jenuh, lemak trans, atau kolesterol." filled={[input.energyFromFat, input.saturatedFat, input.transFat, input.cholesterol].some((value) => value !== null)}>
            <div className="grid gap-4 sm:grid-cols-2"><NumberInput field="energyKj" label="Energy" unit="kJ" /><NumberInput field="energyFromFat" label="Energi dari lemak" unit="kkal" /><NumberInput field="saturatedFat" label="Lemak jenuh" unit="g" /><NumberInput field="transFat" label="Lemak trans" unit="g" /><NumberInput field="cholesterol" label="Kolesterol" unit="mg" /></div>
          </FormAccordion>
          <FormAccordion title="Detail jenis gula" subtitle="Gula total tetap jadi angka utama. Sukrosa, laktosa, dan lainnya hanya membantu menjelaskan jenis gulanya." filled={[input.sucrose, input.lactose, input.glucose, input.fructose, input.maltose].some((value) => value !== null)}>
            <div className="grid gap-4 sm:grid-cols-2"><NumberInput field="sucrose" label="Sukrosa" unit="g" /><NumberInput field="lactose" label="Laktosa" unit="g" /><NumberInput field="glucose" label="Glukosa" unit="g" /><NumberInput field="fructose" label="Fruktosa" unit="g" /><NumberInput field="maltose" label="Maltosa" unit="g" /></div>
          </FormAccordion>
          <FormAccordion title="Vitamin & mineral" subtitle="Isi kalau datanya ada di label. Kalau tidak ada, boleh dikosongkan." filled={[input.calcium, input.iron].some((value) => value !== null) || Boolean(input.vitaminA || input.vitaminC || input.vitaminD || input.micronutrients)}>
            <div className="grid gap-4 sm:grid-cols-2"><NumberInput field="calcium" label="Kalsium" unit="mg" /><NumberInput field="iron" label="Zat besi" unit="mg" /><label className="block text-sm font-bold text-slate-800">Vitamin A<input value={input.vitaminA ?? ""} onChange={(event) => update("vitaminA", event.target.value || null)} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-4 focus:ring-emerald-100" /></label><label className="block text-sm font-bold text-slate-800">Vitamin C<input value={input.vitaminC ?? ""} onChange={(event) => update("vitaminC", event.target.value || null)} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-4 focus:ring-emerald-100" /></label><label className="block text-sm font-bold text-slate-800">Vitamin D<input value={input.vitaminD ?? ""} onChange={(event) => update("vitaminD", event.target.value || null)} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:ring-4 focus:ring-emerald-100" /></label></div>
            <label className="mt-4 block text-sm font-bold text-slate-800">Vitamin/mineral lain<textarea value={input.micronutrients} onChange={(event) => update("micronutrients", event.target.value)} rows={2} placeholder="Vitamin B1 15% AKG; Zinc 2 mg" className="mt-2 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-4 focus:ring-emerald-100" /></label>
          </FormAccordion>
        </div>
          <FormAccordion title="Komposisi & klaim" subtitle="Isi kalau ingin KareFacts bantu cek alergen, bahan tambahan, dan klaim marketing." filled={Boolean(input.ingredients || input.allergenText || input.claims)}>
            <div className="space-y-4"><label className="block text-sm font-bold text-slate-800">Komposisi<textarea value={input.ingredients} onChange={(event) => update("ingredients", event.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-4 focus:ring-emerald-100" /></label><label className="block text-sm font-bold text-slate-800">Info alergen pada kemasan<textarea value={input.allergenText} onChange={(event) => update("allergenText", event.target.value)} rows={2} placeholder="Mengandung susu, kedelai, gluten..." className="mt-2 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-4 focus:ring-emerald-100" /></label><label className="block text-sm font-bold text-slate-800">Klaim pada kemasan<textarea value={input.claims} onChange={(event) => update("claims", event.target.value)} rows={3} placeholder="low sugar, tinggi protein, natural" className="mt-2 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-4 focus:ring-emerald-100" /></label></div>
          </FormAccordion>
        {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
        <div className="sticky bottom-3 z-20 grid gap-3 rounded-2xl bg-[#FFF8E7]/90 p-2 backdrop-blur sm:static sm:grid-cols-3 sm:bg-transparent sm:p-0">
          <button disabled={loading} className="rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-70">{loading ? "Menganalisis..." : "Analisis Label"}</button>
          <button type="button" onClick={setSample} className="rounded-2xl bg-lime-100 px-5 py-4 font-bold text-lime-900 hover:bg-lime-200 focus:outline-none focus:ring-4 focus:ring-lime-200">Isi Contoh Produk</button>
          <button type="button" onClick={reset} className="rounded-2xl bg-slate-100 px-5 py-4 font-bold text-slate-800 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200">Reset Form</button>
        </div>
        </PackagingShell> : null}
      </form>
      )}
    </section>
  );
}

function ReviewScan({ input, onEdit, onScanAgain, loading }: { input: LabelInput; onEdit: () => void; onScanAgain: () => void; loading: boolean }) {
  const items = [
    ["Nama produk", input.productName || "Belum diisi"],
    ["Takaran saji", input.servingSize || "Belum terbaca"],
    ["Jumlah sajian", input.servingsPerPackage ?? "Belum terbaca"],
    ["Kalori", input.calories === null ? "Belum terbaca" : `${input.calories} kkal`],
    ["Gula total", input.sugar === null ? "Belum terbaca" : `${input.sugar} g`],
    ["Natrium", input.sodium === null ? "Belum terbaca" : `${input.sodium} mg`],
    ["Lemak total", input.totalFat === null ? "Belum terbaca" : `${input.totalFat} g`],
    ["Protein", input.protein === null ? "Belum terbaca" : `${input.protein} g`],
    ["Serat", input.fiber === null ? "Belum terbaca" : `${input.fiber} g`],
  ];
  return (
    <PackagingShell>
      <div className="flex flex-wrap gap-2"><StickerBadge tone="emerald">Review scan</StickerBadge><StickerBadge tone="yellow" rotate="right">Perlu dicek</StickerBadge></div>
      <h2 className="mt-4 text-2xl font-black text-slate-950">Ini hasil yang kebaca dari label</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Cek dulu angkanya, lalu lanjut analisis. Beberapa angka perlu dicek ulang kalau hasil bacaan kurang jelas.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map(([label, value]) => <div key={label} className="rounded-2xl bg-white p-3 ring-1 ring-slate-100"><p className="text-xs font-black uppercase tracking-wide text-emerald-700">{label}</p><p className="mt-1 font-black text-slate-950">{String(value)}</p></div>)}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={onEdit} className="rounded-2xl bg-white px-4 py-3 font-black text-emerald-900 ring-1 ring-emerald-200">Edit hasil scan</button>
        <button disabled={loading} className="rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white shadow-lg shadow-emerald-200">{loading ? "Menganalisis..." : "Analisis Label"}</button>
        <button type="button" onClick={onScanAgain} className="rounded-2xl bg-yellow-300 px-4 py-3 font-black text-slate-950 ring-1 ring-yellow-400">Scan ulang</button>
      </div>
    </PackagingShell>
  );
}
