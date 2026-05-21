"use client";

import { useEffect, useState } from "react";
import ImageCropper from "@/components/ImageCropper";
import type { ExtractedNutrition, GeminiOcrError, GeminiOcrResponse, NutritionConfidence, NutritionPatch } from "@/types/nutritionOcr";

type Props = {
  onUseDetectedNutrition: (values: NutritionPatch) => void;
};

type Row = {
  key: string;
  label: string;
  unit: string;
};

const rows: Row[] = [
  { key: "servingSize", label: "Takaran saji", unit: "" },
  { key: "servingsPerPackage", label: "Jumlah sajian", unit: "" },
  { key: "calories", label: "Kalori", unit: "kcal" },
  { key: "energyKj", label: "Energi", unit: "kJ" },
  { key: "energyFromFat", label: "Energi dari lemak", unit: "kkal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "totalFat", label: "Lemak total", unit: "g" },
  { key: "saturatedFat", label: "Lemak jenuh", unit: "g" },
  { key: "transFat", label: "Lemak trans", unit: "g" },
  { key: "cholesterol", label: "Kolesterol", unit: "mg" },
  { key: "carbohydrate", label: "Karbohidrat", unit: "g" },
  { key: "sugar", label: "Gula total", unit: "g" },
  { key: "sugarBreakdown.sucrose", label: "Sukrosa", unit: "g" },
  { key: "sugarBreakdown.lactose", label: "Laktosa", unit: "g" },
  { key: "sugarBreakdown.glucose", label: "Glukosa", unit: "g" },
  { key: "sugarBreakdown.fructose", label: "Fruktosa", unit: "g" },
  { key: "sugarBreakdown.maltose", label: "Maltosa", unit: "g" },
  { key: "fiber", label: "Serat", unit: "g" },
  { key: "sodium", label: "Natrium", unit: "mg" },
  { key: "calcium", label: "Kalsium", unit: "mg / %AKG" },
  { key: "iron", label: "Zat besi", unit: "mg / %AKG" },
  { key: "vitaminA", label: "Vitamin A", unit: "" },
  { key: "vitaminC", label: "Vitamin C", unit: "" },
  { key: "vitaminD", label: "Vitamin D", unit: "" },
];

const confidenceClass: Record<NutritionConfidence, string> = {
  high: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  medium: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  low: "bg-red-100 text-red-800 ring-red-200",
};

const getField = (result: ExtractedNutrition, key: string) => key.startsWith("sugarBreakdown.") ? result.sugarBreakdown[key.split(".")[1] as keyof ExtractedNutrition["sugarBreakdown"]] : result[key as keyof Omit<ExtractedNutrition, "rawTextSummary" | "warnings" | "sugarBreakdown" | "micronutrients" | "ingredientsText" | "allergenText" | "claimsText">];

export default function NutritionGeminiReader({ onUseDetectedNutrition }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExtractedNutrition | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
    if (croppedPreview) URL.revokeObjectURL(croppedPreview);
  }, [preview]);

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (croppedPreview) URL.revokeObjectURL(croppedPreview);
    setCroppedBlob(null);
    setCroppedPreview(null);
    setResult(null);
    setError("");
  };

  const readWithGemini = async () => {
    if (!file) return;
    setLoading(true);
    setError(croppedBlob ? "" : "Untuk hasil lebih jelas, crop dulu bagian tabel gizi.");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", croppedBlob ? new File([croppedBlob], "karefacts-crop.jpg", { type: croppedBlob.type || "image/jpeg" }) : file);
      const response = await fetch("/api/gemini-label-ocr", { method: "POST", body: formData });
      const payload = (await response.json()) as GeminiOcrResponse | GeminiOcrError;
      if (!response.ok || !payload.success) {
        if (response.status === 503 || (!payload.success && payload.code === "GEMINI_OVERLOADED")) {
          throw new Error("Fitur baca label sedang ramai. Coba lagi beberapa saat lagi, atau isi manual dulu.");
        }
        throw new Error(!payload.success ? payload.error : "Label belum bisa dibaca. Coba foto lain, crop tabel gizi, atau isi manual dulu.");
      }
      setResult(payload.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Label belum bisa dibaca. Coba foto lain, crop tabel gizi, atau isi manual dulu.");
    } finally {
      setLoading(false);
    }
  };

  const onCropReady = (blob: Blob) => {
    if (croppedPreview) URL.revokeObjectURL(croppedPreview);
    setCroppedBlob(blob);
    setCroppedPreview(URL.createObjectURL(blob));
    setError("");
  };

  const updateValue = (key: Row["key"], value: string) => {
    if (!result) return;
    setResult((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      const field = getField(next, key);
      if (key === "servingSize" || key.startsWith("vitamin")) field.value = value || null;
      else field.value = value === "" ? null : Number(value);
      return next;
    });
  };

  const toPatch = (): NutritionPatch => {
    if (!result) return {};
    const patch: NutritionPatch = {};
    if (result.servingSize.value) patch.servingSize = result.servingSize.value;
    if (result.servingsPerPackage.value !== null) patch.servingsPerPackage = result.servingsPerPackage.value;
    if (result.calories.value !== null) patch.calories = result.calories.value;
    if (result.energyKj.value !== null) patch.energyKj = result.energyKj.value;
    if (result.energyFromFat.value !== null) patch.energyFromFat = result.energyFromFat.value;
    if (result.protein.value !== null) patch.protein = result.protein.value;
    if (result.totalFat.value !== null) patch.totalFat = result.totalFat.value;
    if (result.saturatedFat.value !== null) patch.saturatedFat = result.saturatedFat.value;
    if (result.transFat.value !== null) patch.transFat = result.transFat.value;
    if (result.cholesterol.value !== null) patch.cholesterol = result.cholesterol.value;
    if (result.carbohydrate.value !== null) patch.carbohydrate = result.carbohydrate.value;
    if (result.sugar.value !== null) patch.sugar = result.sugar.value;
    if (result.sugarBreakdown.sucrose.value !== null) patch.sucrose = result.sugarBreakdown.sucrose.value;
    if (result.sugarBreakdown.lactose.value !== null) patch.lactose = result.sugarBreakdown.lactose.value;
    if (result.sugarBreakdown.glucose.value !== null) patch.glucose = result.sugarBreakdown.glucose.value;
    if (result.sugarBreakdown.fructose.value !== null) patch.fructose = result.sugarBreakdown.fructose.value;
    if (result.sugarBreakdown.maltose.value !== null) patch.maltose = result.sugarBreakdown.maltose.value;
    if (result.fiber.value !== null) patch.fiber = result.fiber.value;
    if (result.sodium.value !== null) patch.sodium = result.sodium.value;
    if (result.calcium.value !== null) patch.calcium = result.calcium.value;
    if (result.iron.value !== null) patch.iron = result.iron.value;
    if (result.vitaminA.value !== null) patch.vitaminA = result.vitaminA.value;
    if (result.vitaminC.value !== null) patch.vitaminC = result.vitaminC.value;
    if (result.vitaminD.value !== null) patch.vitaminD = result.vitaminD.value;
    if (result.micronutrients.length) patch.micronutrients = result.micronutrients.map((item) => `${item.name}: ${item.value ?? "?"}${item.unit ? ` ${item.unit}` : ""}`).join("; ");
    if (result.ingredientsText) patch.ingredients = result.ingredientsText;
    if (result.allergenText) patch.allergenText = result.allergenText;
    if (result.claimsText) patch.claims = result.claimsText;
    return patch;
  };

  const nullCount = result ? rows.filter((row) => getField(result, row.key).value === null).length : 0;
  const hasLowConfidence = result ? rows.some((row) => getField(result, row.key).confidence === "low" && getField(result, row.key).value !== null) : false;

  return (
    <section className="rounded-[1.75rem] border-2 border-dashed border-emerald-800 bg-white/80 p-4 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-950">Scan label gizinya</h3>
          <p className="mt-1 text-sm text-slate-600">Upload foto tabel gizi, lalu KareFacts bantu baca angka penting dari label.</p>
        </div>
        {preview ? <button type="button" onClick={removeImage} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-slate-300">Hapus gambar</button> : null}
      </div>
      <label className="mt-4 block text-sm font-bold text-slate-800" htmlFor="gemini-label-image">Upload foto tabel gizi</label>
      <input
        id="gemini-label-image"
        type="file"
        accept="image/*"
        onChange={(event) => {
          const nextFile = event.target.files?.[0];
          if (!nextFile) return;
          if (preview) URL.revokeObjectURL(preview);
          setFile(nextFile);
          setPreview(URL.createObjectURL(nextFile));
          if (croppedPreview) URL.revokeObjectURL(croppedPreview);
          setCroppedBlob(null);
          setCroppedPreview(null);
          setResult(null);
          setError("");
        }}
        className="mt-3 w-full rounded-2xl bg-white p-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:font-bold file:text-white focus:outline-none focus:ring-4 focus:ring-emerald-200"
      />
      <p className="mt-3 rounded-2xl bg-yellow-50 p-3 text-sm font-bold leading-6 text-yellow-900">Hasil bacaan otomatis bisa salah membaca angka. Cek ulang dengan label asli sebelum dipakai.</p>
      {preview ? (
        <div className="mt-4 space-y-3">
          <ImageCropper imageSrc={preview} onCropReady={onCropReady} onChangeImage={removeImage} />
          {croppedPreview ? <div className="rounded-2xl bg-emerald-50 p-3"><p className="text-sm font-black text-emerald-900">Hasil crop yang akan dibaca</p><img src={croppedPreview} alt="Hasil crop tabel gizi" className="mt-2 max-h-72 w-full rounded-2xl bg-white object-contain" /></div> : <p className="rounded-2xl bg-yellow-50 p-3 text-sm font-bold text-yellow-900">Untuk hasil lebih jelas, crop dulu bagian tabel gizi.</p>}
        </div>
      ) : null}
      <button type="button" onClick={readWithGemini} disabled={!file || loading} className="mt-4 w-full rounded-2xl bg-emerald-600 px-5 py-4 font-bold text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-60">{loading ? "KareFacts lagi baca labelnya..." : "Baca Tabel Gizi"}</button>
      {error ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      {result ? (
        <div className="mt-5 space-y-4">
          {hasLowConfidence ? <p className="rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-900">Beberapa angka perlu dicek ulang.</p> : null}
          {nullCount >= 6 ? <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">Label belum terbaca jelas. Coba crop bagian tabel gizi, pakai foto yang lebih terang, atau isi manual.</p> : null}
          {result.rawTextSummary ? <div className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-slate-900">Ringkasan teks</p><p className="mt-2 text-sm leading-6 text-slate-600">{result.rawTextSummary}</p></div> : null}
          {result.warnings.length ? <div className="rounded-2xl bg-yellow-50 p-4"><p className="text-sm font-black text-yellow-950">Catatan hasil scan</p><div className="mt-2 space-y-1 text-sm text-yellow-900">{result.warnings.map((warning) => <p key={warning}>{warning}</p>)}</div></div> : null}
          {result.micronutrients.length ? <div className="rounded-2xl bg-cyan-50 p-4"><p className="text-sm font-black text-cyan-950">Vitamin/mineral lain yang kebaca</p><div className="mt-2 flex flex-wrap gap-2">{result.micronutrients.map((item) => <span key={`${item.name}-${item.sourceText}`} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-cyan-900 ring-1 ring-cyan-100">{item.name}: {item.value ?? "?"}{item.unit ? ` ${item.unit}` : ""}</span>)}</div></div> : null}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Komponen</th><th className="p-3">Nilai</th><th className="p-3">Satuan</th><th className="p-3">Confidence</th><th className="p-3">Source text</th></tr></thead>
                <tbody>
                  {rows.map((row) => {
                    const item = getField(result, row.key);
                    return (
                      <tr key={row.key} className="border-t border-slate-100">
                        <td className="p-3 font-bold text-slate-800">{row.label}</td>
                        <td className="p-3"><input value={item.value ?? ""} onChange={(event) => updateValue(row.key, event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 outline-none focus:ring-4 focus:ring-emerald-100" /></td>
                        <td className="p-3 text-slate-600">{row.unit}</td>
                        <td className="p-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${confidenceClass[item.confidence]}`}>{item.confidence}</span></td>
                        <td className="p-3 text-slate-500">{item.sourceText ?? "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 border-t border-slate-100 p-3 sm:grid-cols-2">
              <button type="button" onClick={() => onUseDetectedNutrition(toPatch())} className="rounded-2xl bg-purple-600 px-4 py-3 font-bold text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200">Gunakan hasil bacaan</button>
              <button type="button" onClick={() => document.getElementById("manual-nutrition-fields")?.scrollIntoView({ behavior: "smooth" })} className="rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-800 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200">Edit manual</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
