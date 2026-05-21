import { DAILY_REFERENCES } from "@/lib/constants";
import type { AnalysisResult, AttentionCategory, LabelInput, NutrientValues } from "@/types/label";

const round = (value: number) => Math.round(value * 10) / 10;
const total = (value: number | null, servings: number) => (value === null ? null : round(value * servings));
const percent = (value: number | null, reference: number) => (value === null ? null : round((value / reference) * 100));

const categoryFor = (percentage: number | null): AttentionCategory | null => {
  if (percentage === null) return null;
  if (percentage < 10) return "Rendah perhatian";
  if (percentage <= 25) return "Perlu diperhatikan";
  if (percentage <= 50) return "Cukup tinggi";
  return "Tinggi";
};

const format = (value: number | null, unit: string) => (value === null ? "Data belum tersedia" : `${value} ${unit}`);
const hasAny = (text: string, keywords: string[]) => keywords.some((keyword) => text.toLowerCase().includes(keyword));

const findKeywords = (text: string, groups: Record<string, string[]>) => {
  const normalized = text.toLowerCase();
  return Object.entries(groups).filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword))).map(([label]) => label);
};

const scoreLabelFor = (score: number) => {
  if (score >= 80) return "Label relatif mudah dipahami";
  if (score >= 60) return "Ada beberapa fakta yang perlu diperhatikan";
  if (score >= 40) return "Banyak informasi yang perlu dibaca lebih teliti";
  return "Perlu perhatian ekstra saat membaca label";
};

function hasSugarBreakdown(input: LabelInput) {
  return [input.sucrose, input.lactose, input.glucose, input.fructose, input.maltose].some((value) => value !== null);
}

function estimateSugarFromBreakdown(input: LabelInput) {
  const values = [input.sucrose, input.lactose, input.glucose, input.fructose, input.maltose].filter((value): value is number => value !== null);
  return values.length ? round(values.reduce((sum, value) => sum + value, 0)) : null;
}

export function analyzeLabel(input: LabelInput): AnalysisResult {
  const servings = input.servingsPerPackage && input.servingsPerPackage > 0 ? input.servingsPerPackage : null;
  const sugarForAnalysis = input.sugar ?? estimateSugarFromBreakdown(input);
  const totals: NutrientValues = {
    calories: servings === null ? null : total(input.calories, servings),
    energyKj: servings === null ? null : total(input.energyKj, servings),
    energyFromFat: servings === null ? null : total(input.energyFromFat, servings),
    sugar: servings === null ? null : total(sugarForAnalysis, servings),
    sucrose: servings === null ? null : total(input.sucrose, servings),
    lactose: servings === null ? null : total(input.lactose, servings),
    glucose: servings === null ? null : total(input.glucose, servings),
    fructose: servings === null ? null : total(input.fructose, servings),
    maltose: servings === null ? null : total(input.maltose, servings),
    sodium: servings === null ? null : total(input.sodium, servings),
    totalFat: servings === null ? null : total(input.totalFat, servings),
    saturatedFat: servings === null ? null : total(input.saturatedFat, servings),
    transFat: servings === null ? null : total(input.transFat, servings),
    cholesterol: servings === null ? null : total(input.cholesterol, servings),
    protein: servings === null ? null : total(input.protein, servings),
    fiber: servings === null ? null : total(input.fiber, servings),
    carbohydrate: servings === null ? null : total(input.carbohydrate, servings),
    calcium: servings === null ? null : total(input.calcium, servings),
    iron: servings === null ? null : total(input.iron, servings),
  };

  const dailyPercentages = {
    perServing: {
      sugar: percent(sugarForAnalysis, DAILY_REFERENCES.sugar),
      sodium: percent(input.sodium, DAILY_REFERENCES.sodium),
      totalFat: percent(input.totalFat, DAILY_REFERENCES.totalFat),
    },
    perPackage: {
      sugar: percent(totals.sugar, DAILY_REFERENCES.sugar),
      sodium: percent(totals.sodium, DAILY_REFERENCES.sodium),
      totalFat: percent(totals.totalFat, DAILY_REFERENCES.totalFat),
    },
  };

  const categories = {
    sugar: categoryFor(dailyPercentages.perServing.sugar),
    sodium: categoryFor(dailyPercentages.perServing.sodium),
    totalFat: categoryFor(dailyPercentages.perServing.totalFat),
  };

  const saturatedFatNote = input.saturatedFat === null
    ? "Data lemak jenuh belum tersedia."
    : input.saturatedFat >= 5
      ? "Lemak jenuhnya lumayan perlu dicek. Bukan berarti nggak boleh, tapi lebih baik jangan sering digabung dengan makanan berminyak lain."
      : "Lemak jenuh tidak terlalu menonjol berdasarkan data yang diinput.";
  const proteinNote = input.protein === null ? "Data protein belum tersedia." : input.protein >= 10 ? "Protein produk ini cukup oke per sajian. Ini bisa jadi nilai plus, tapi tetap lihat juga natrium, gula, dan lemak." : input.protein >= 5 ? "Protein di produk ini lumayan sebagai tambahan, tapi bukan yang paling dominan." : "Protein di produk ini nggak terlalu menonjol. Kalau butuh protein, bisa dibantu dari lauk, telur, tahu, tempe, ayam, ikan, atau sumber lain.";
  const fiberNote = input.fiber === null ? "Data serat belum tersedia." : input.fiber >= 3 ? "Seratnya lumayan oke. Serat bisa bantu pola makan terasa lebih balance." : "Seratnya belum terlalu menonjol. Bisa diimbangi dengan buah, sayur, oat, atau kacang-kacangan.";

  const combinedIngredientText = `${input.ingredients} ${input.allergenText}`.trim();
  const hasIngredients = combinedIngredientText.length > 0;
  const allergens = hasIngredients ? findKeywords(combinedIngredientText, {
    susu: ["susu", "milk", "whey", "casein", "kasein", "milk protein", "protein susu", "skim milk", "susu bubuk", "keju", "cheese", "cream", "butter", "yoghurt", "yogurt"],
    telur: ["telur", "egg"],
    kacang: ["kacang", "kacang tanah", "almond", "mede", "hazelnut", "peanut"],
    kedelai: ["kedelai", "soy", "soya", "soybean"],
    gluten: ["gandum", "gluten", "tepung terigu", "wheat"],
    ikan: ["ikan", "fish"],
    "krustasea/seafood": ["udang", "kepiting", "kerang", "shrimp", "crab", "shellfish"],
  }) : [];
  const additives = input.ingredients.trim() ? findKeywords(input.ingredients, {
    pengawet: ["pengawet"], pewarna: ["pewarna"], "pemanis buatan": ["pemanis buatan"], perisa: ["perisa"], pengemulsi: ["pengemulsi"], penstabil: ["penstabil"], antioksidan: ["antioksidan"], "pengatur keasaman": ["pengatur keasaman"], pengental: ["pengental"],
  }) : [];

  const allergenNote = !hasIngredients ? "Komposisinya belum diisi, jadi KareFacts belum bisa bantu cek potensi alergen. Kalau kamu punya alergi tertentu, tetap cek label asli produk ya." : allergens.length ? `KareFacts nemuin potensi alergen dari label: ${allergens.join(", ")}. Kalau kamu sensitif atau punya alergi, bagian ini wajib banget dicek ulang di label asli.` : "Tidak ada potensi alergen yang terdeteksi dari kata kunci sederhana. Tetap cek label resmi produk.";
  const additiveNote = !input.ingredients.trim() ? "Komposisinya belum diisi, jadi bahan tambahan pangan belum bisa dicek." : additives.length ? `Ada beberapa istilah bahan tambahan pangan yang kebaca: ${additives.join(", ")}. Ini nggak otomatis buruk, ya. Yang penting adalah jenisnya, jumlahnya, dan apakah sesuai regulasi.` : "Tidak ada istilah bahan tambahan pangan utama yang terdeteksi dari kata kunci sederhana.";

  const claimText = input.claims.toLowerCase();
  const claimNotes: string[] = [];
  let detectedClaimNeedsVerification = false;
  if (!claimText.trim()) claimNotes.push("Tidak ada klaim produk yang diinput.");
  if (hasAny(claimText, ["rendah gula", "low sugar", "less sugar"])) { detectedClaimNeedsVerification = true; claimNotes.push("Klaim rendah gula perlu dibandingkan dengan persyaratan regulasi dan produk pembanding."); }
  if (hasAny(claimText, ["tinggi protein", "high protein"])) { detectedClaimNeedsVerification = true; claimNotes.push(input.protein !== null && input.protein >= 10 ? "Protein cukup menonjol per sajian, tetapi klaim resmi tetap perlu merujuk regulasi." : "Protein belum terlalu menonjol atau datanya belum tersedia. Klaim tinggi protein perlu dicek kembali."); }
  if (hasAny(claimText, ["natural", "alami"])) { detectedClaimNeedsVerification = true; claimNotes.push("Istilah natural/alami dapat bermakna luas. Perlu melihat komposisi, proses, dan ketentuan label yang berlaku."); }
  if (hasAny(claimText, ["tanpa pengawet", "no preservatives"])) { detectedClaimNeedsVerification = true; claimNotes.push(input.ingredients.toLowerCase().includes("pengawet") ? "Terdapat kata 'pengawet' pada komposisi, sehingga klaim tanpa pengawet perlu dicek kembali." : "Tidak terdeteksi kata 'pengawet' pada komposisi, tetapi klaim tetap perlu merujuk label resmi dan regulasi."); }
  if (hasAny(claimText, ["rendah lemak", "less fat", "low fat"])) { detectedClaimNeedsVerification = true; claimNotes.push("Klaim rendah lemak perlu dibandingkan dengan persyaratan regulasi dan produk pembanding."); }
  if (hasAny(claimText, ["sumber serat", "tinggi serat", "high fiber"])) { detectedClaimNeedsVerification = true; claimNotes.push(input.fiber !== null && input.fiber >= 3 ? "Serat cukup baik per sajian, tetapi klaim resmi tetap perlu merujuk regulasi." : "Serat belum terlalu menonjol atau datanya belum tersedia. Klaim serat perlu dicek kembali."); }

  const sugarNote = input.sugar === null && sugarForAnalysis !== null ? `Gula: ${sugarForAnalysis} g estimasi dari jenis gula yang kebaca. Gula total tidak terbaca, jadi angka ini perlu dicek ulang.` : input.sugar === null ? "Gula: data belum tersedia." : `Gula: ${input.sugar} g per sajian, sekitar ${dailyPercentages.perServing.sugar}% dari acuan harian. Tetap cek asupan manis lain hari ini.`;
  const consumptionNotes = [
    sugarNote,
    input.sodium === null ? "Natrium: data belum tersedia." : `Natrium: ${input.sodium} mg per sajian, sekitar ${dailyPercentages.perServing.sodium}% dari acuan harian. Angka ini bisa cepat numpuk kalau kamu juga makan makanan asin lain.`,
    input.totalFat === null ? "Lemak: data belum tersedia." : `Lemak: ${input.totalFat} g per sajian, sekitar ${dailyPercentages.perServing.totalFat}% dari acuan harian. Bukan berarti buruk, tapi coba imbangi dengan makanan yang lebih ringan.`,
  ];
  if (servings !== null && servings > 1) consumptionNotes.push("Total per kemasan dihitung dari nilai per sajian dikalikan jumlah sajian per kemasan. Pastikan jumlah sajian sudah sesuai label.");
  if (input.usuallyConsumedAllAtOnce) consumptionNotes.push("Karena biasanya 1 kemasan dihabiskan, total per kemasan jadi penting buat kamu notice.");
  if (!input.usuallyConsumedAllAtOnce) consumptionNotes.push("Kalau kamu cuma konsumsi 1 sajian, fokus utama tetap di angka per sajian.");
  if (input.sugar !== null && hasSugarBreakdown(input)) consumptionNotes.push("Gula total tetap jadi angka utama buat analisis. Detail seperti sukrosa/laktosa cuma bantu kamu tahu jenis gulanya.");
  if (input.sucrose === 0 && input.lactose !== null && input.lactose > 0) consumptionNotes.push("Sukrosanya 0 g, tapi bukan berarti gulanya nol ya. Di produk ini gulanya berasal dari laktosa, yaitu gula alami yang ada di susu.");
  if (input.cholesterol !== null) consumptionNotes.push("Kolesterol terbaca di label. Ini info tambahan yang bisa kamu notice kalau memang sedang memantau asupan harian.");

  let score = 100;
  if (dailyPercentages.perServing.sugar !== null && dailyPercentages.perServing.sugar > 25) score -= 15;
  if (dailyPercentages.perServing.sodium !== null && dailyPercentages.perServing.sodium > 25) score -= 15;
  if (dailyPercentages.perServing.totalFat !== null && dailyPercentages.perServing.totalFat > 25) score -= 10;
  if (input.saturatedFat !== null && input.saturatedFat >= 5) score -= 10;
  if (servings !== null && servings > 1) score -= 5;
  if (detectedClaimNeedsVerification) score -= 5;
  if (allergens.length) score -= 5;
  score = Math.max(0, Math.min(100, score));

  const highlights = [
    categories.sugar ? `gula berada pada kategori ${categories.sugar.toLowerCase()}` : null,
    categories.sodium ? `natrium berada pada kategori ${categories.sodium.toLowerCase()}` : null,
    categories.totalFat ? `lemak total berada pada kategori ${categories.totalFat.toLowerCase()}` : null,
  ].filter(Boolean) as string[];
  if (input.saturatedFat === null) highlights.push("data lemak jenuh belum tersedia");
  if (detectedClaimNeedsVerification) highlights.push("klaim produk perlu dicek dengan acuan regulasi");
  const conclusion = highlights.length
    ? `Yang perlu kamu notice: ${highlights.slice(0, 3).join(", ")}. Bukan berarti nggak boleh dikonsumsi, tapi lebih baik dinikmati dengan porsi yang mindful dan tetap lihat makanan lain hari ini.`
    : "Data nilai gizi utama belum tersedia. Lengkapi input label agar analisis edukatif bisa dibuat.";

  return { totals, dailyPercentages, categories, saturatedFatNote, proteinNote, fiberNote, allergens, allergenNote, additives, additiveNote, claimNotes, consumptionNotes, score, scoreLabel: scoreLabelFor(score), conclusion };
}

export { format };
