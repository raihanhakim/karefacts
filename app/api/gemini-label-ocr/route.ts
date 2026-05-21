import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";
import type { ExtractedNutrition, NutritionConfidence } from "@/types/nutritionOcr";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"] as const;
const RETRY_DELAYS = [1000, 2500, 5000] as const;
const REQUEST_TIMEOUT_MS = 25000;

const confidenceValues: NutritionConfidence[] = ["high", "medium", "low"];

const fieldSchema = (valueType: Type, unit?: string) => ({
  type: Type.OBJECT,
  properties: {
    value: { type: valueType, nullable: true },
    unit: { type: Type.STRING, nullable: true, ...(unit ? { enum: [unit] } : {}) },
    confidence: { type: Type.STRING, enum: confidenceValues },
    sourceText: { type: Type.STRING, nullable: true },
  },
  required: ["value", "confidence", "sourceText"],
});

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    servingSize: fieldSchema(Type.STRING),
    servingsPerPackage: fieldSchema(Type.NUMBER),
    calories: fieldSchema(Type.NUMBER, "kcal"),
    energyKj: fieldSchema(Type.NUMBER, "kJ"),
    energyFromFat: fieldSchema(Type.NUMBER, "kcal"),
    protein: fieldSchema(Type.NUMBER, "g"),
    totalFat: fieldSchema(Type.NUMBER, "g"),
    saturatedFat: fieldSchema(Type.NUMBER, "g"),
    transFat: fieldSchema(Type.NUMBER, "g"),
    cholesterol: fieldSchema(Type.NUMBER, "mg"),
    carbohydrate: fieldSchema(Type.NUMBER, "g"),
    sugar: fieldSchema(Type.NUMBER, "g"),
    sugarBreakdown: { type: Type.OBJECT, properties: { sucrose: fieldSchema(Type.NUMBER, "g"), lactose: fieldSchema(Type.NUMBER, "g"), glucose: fieldSchema(Type.NUMBER, "g"), fructose: fieldSchema(Type.NUMBER, "g"), maltose: fieldSchema(Type.NUMBER, "g") }, required: ["sucrose", "lactose", "glucose", "fructose", "maltose"] },
    fiber: fieldSchema(Type.NUMBER, "g"),
    sodium: fieldSchema(Type.NUMBER, "mg"),
    calcium: fieldSchema(Type.NUMBER),
    iron: fieldSchema(Type.NUMBER),
    vitaminA: fieldSchema(Type.STRING),
    vitaminC: fieldSchema(Type.STRING),
    vitaminD: fieldSchema(Type.STRING),
    micronutrients: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.STRING, nullable: true }, unit: { type: Type.STRING, nullable: true }, confidence: { type: Type.STRING, enum: confidenceValues }, sourceText: { type: Type.STRING, nullable: true } }, required: ["name", "value", "confidence", "sourceText"] } },
    ingredientsText: { type: Type.STRING, nullable: true },
    allergenText: { type: Type.STRING, nullable: true },
    claimsText: { type: Type.STRING, nullable: true },
    rawTextSummary: { type: Type.STRING },
    warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["servingSize", "servingsPerPackage", "calories", "energyKj", "energyFromFat", "protein", "totalFat", "saturatedFat", "transFat", "cholesterol", "carbohydrate", "sugar", "sugarBreakdown", "fiber", "sodium", "calcium", "iron", "vitaminA", "vitaminC", "vitaminD", "micronutrients", "ingredientsText", "allergenText", "claimsText", "rawTextSummary", "warnings"],
};

const prompt = `You are a food label nutrition table extraction assistant.

Read the uploaded food label image and extract nutrition label data only.

The label may be in Indonesian, English, or Malay.
Possible titles:
- Informasi Nilai Gizi
- Nutrition Facts
- Nutrition Information
- Maklumat Pemakanan

Important rules:
1. Extract values per serving, not per 100g, unless only per 100g is available.
2. If the table has two columns, usually "Per Serving" and "Per 100g", choose the Per Serving column.
3. Do not guess values that are not visible.
4. If a value is unclear, return null or use low confidence.
5. Preserve source text for each extracted value.
6. Return valid JSON only.
7. Do not include markdown.
8. Do not provide health advice.
9. Do not analyze whether the product is healthy.
10. Only extract label facts.

Fields to extract:
- serving size
- servings per package/container
- calories in kcal
- energy in kJ
- energy from fat in kcal
- protein in g
- total fat in g
- saturated fat in g
- trans fat in g
- cholesterol in mg
- carbohydrate in g
- total sugar / gula total / jumlah gula / total sugars in g
- sucrose / sukrosa in g
- lactose / laktosa in g
- glucose / glukosa in g
- fructose / fruktosa in g
- maltose / maltosa in g
- fiber/fibre/serat in g
- sodium/natrium in mg
- calcium if available
- iron if available
- vitamins if available
- any other vitamins/minerals as micronutrients array if available
- ingredients/komposisi text if visible
- allergen statement if visible
- product claims if visible

Sugar rules:
If the label shows both total sugar and sugar breakdown, use total sugar as the main sugar value.
Do not replace total sugar with sucrose.
Do not add sucrose and lactose to total sugar if total sugar is already available.

Special interpretation:
- "84g" near Protein may mean 8.4 g if the label visually shows decimal.
- "143g" near Fat may mean 14.3 g.
- "36g" near Total Sugars may mean 3.6 g.
- "1539 mg" or "1538 mg" near Sodium/Natrium should be sodium.
- If uncertain, set confidence to low and add a warning.

Return JSON exactly in the requested schema.`;

const defaultField = <T,>(value: T | null, unit?: string, confidence: NutritionConfidence = "low", sourceText: string | null = null) => ({ value, unit, confidence, sourceText });

function normalizeResponse(value: Partial<ExtractedNutrition>): ExtractedNutrition {
  return {
    servingSize: value.servingSize ?? defaultField<string>(null),
    servingsPerPackage: value.servingsPerPackage ?? defaultField<number>(null),
    calories: value.calories ?? defaultField<number>(null, "kcal"),
    energyKj: value.energyKj ?? defaultField<number>(null, "kJ"),
    energyFromFat: value.energyFromFat ?? defaultField<number>(null, "kcal"),
    protein: value.protein ?? defaultField<number>(null, "g"),
    totalFat: value.totalFat ?? defaultField<number>(null, "g"),
    saturatedFat: value.saturatedFat ?? defaultField<number>(null, "g"),
    transFat: value.transFat ?? defaultField<number>(null, "g"),
    cholesterol: value.cholesterol ?? defaultField<number>(null, "mg"),
    carbohydrate: value.carbohydrate ?? defaultField<number>(null, "g"),
    sugar: value.sugar ?? defaultField<number>(null, "g"),
    sugarBreakdown: value.sugarBreakdown ?? { sucrose: defaultField<number>(null, "g"), lactose: defaultField<number>(null, "g"), glucose: defaultField<number>(null, "g"), fructose: defaultField<number>(null, "g"), maltose: defaultField<number>(null, "g") },
    fiber: value.fiber ?? defaultField<number>(null, "g"),
    sodium: value.sodium ?? defaultField<number>(null, "mg"),
    calcium: value.calcium ?? defaultField<number>(null),
    iron: value.iron ?? defaultField<number>(null),
    vitaminA: value.vitaminA ?? defaultField<string>(null),
    vitaminC: value.vitaminC ?? defaultField<string>(null),
    vitaminD: value.vitaminD ?? defaultField<string>(null),
    micronutrients: Array.isArray(value.micronutrients) ? value.micronutrients : [],
    ingredientsText: value.ingredientsText ?? null,
    allergenText: value.allergenText ?? null,
    claimsText: value.claimsText ?? null,
    rawTextSummary: value.rawTextSummary ?? "",
    warnings: Array.isArray(value.warnings) ? value.warnings : [],
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null) {
    const candidate = error as { status?: unknown; code?: unknown };
    if (typeof candidate.status === "number") return candidate.status;
    if (typeof candidate.code === "number") return candidate.code;
  }
  return undefined;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
}

function isRetryableGeminiError(error: unknown): boolean {
  const status = errorStatus(error);
  const message = errorMessage(error);
  return (
    status === 503 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 504 ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("unavailable") ||
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("abort")
  );
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Gemini request timeout")), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

type GeminiGenerateArgs = Parameters<GoogleGenAI["models"]["generateContent"]>[0];

async function generateWithRetry(ai: GoogleGenAI, baseArgs: Omit<GeminiGenerateArgs, "model">) {
  let lastRetryableError: unknown;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < RETRY_DELAYS.length; attempt += 1) {
      try {
        const response = await withTimeout(ai.models.generateContent({ ...baseArgs, model }), REQUEST_TIMEOUT_MS);
        return { response, modelUsed: model };
      } catch (error) {
        if (!isRetryableGeminiError(error)) throw error;
        lastRetryableError = error;
        if (attempt < RETRY_DELAYS.length - 1) await sleep(RETRY_DELAYS[attempt]);
      }
    }
  }
  throw lastRetryableError ?? new Error("Gemini overloaded");
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, error: "Fitur baca label belum aktif. Isi manual dulu ya.", code: "GEMINI_OCR_FAILED" }, { status: 500 });

    const formData = await request.formData();
    const image = formData.get("image");
    if (!(image instanceof File)) return NextResponse.json({ error: "Gambar wajib dikirim dengan field 'image'." }, { status: 400 });
    if (image.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Ukuran gambar maksimal 5 MB." }, { status: 413 });

    const bytes = Buffer.from(await image.arrayBuffer());
    const ai = new GoogleGenAI({ apiKey });
    const { response, modelUsed } = await generateWithRetry(ai, {
      contents: [
        { text: prompt },
        { inlineData: { mimeType: image.type || "image/jpeg", data: bytes.toString("base64") } },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Gemini tidak mengembalikan teks JSON.");
    const parsed = JSON.parse(text) as Partial<ExtractedNutrition>;
    return NextResponse.json({ success: true, modelUsed, data: normalizeResponse(parsed) });
  } catch (error) {
    console.error("Gemini label OCR failed", error);
    if (isRetryableGeminiError(error)) {
      return NextResponse.json(
        { success: false, error: "Fitur baca label sedang ramai. Coba lagi beberapa saat lagi, atau isi manual dulu.", code: "GEMINI_OVERLOADED" },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Gagal membaca label. Coba gambar lain atau isi manual.", code: "GEMINI_OCR_FAILED" },
      { status: 500 },
    );
  }
}
