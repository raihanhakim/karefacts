import type { LabelInput } from "@/types/label";

export type NutritionConfidence = "high" | "medium" | "low";

export type ExtractedField<T> = {
  value: T | null;
  unit?: string;
  confidence: NutritionConfidence;
  sourceText: string | null;
};

export type SugarBreakdown = {
  sucrose: ExtractedField<number>;
  lactose: ExtractedField<number>;
  glucose: ExtractedField<number>;
  fructose: ExtractedField<number>;
  maltose: ExtractedField<number>;
};

export type ExtractedMicronutrient = {
  name: string;
  value: string | number | null;
  unit?: string;
  confidence: NutritionConfidence;
  sourceText: string | null;
};

export type ExtractedNutrition = {
  servingSize: ExtractedField<string>;
  servingsPerPackage: ExtractedField<number>;
  calories: ExtractedField<number>;
  energyKj: ExtractedField<number>;
  energyFromFat: ExtractedField<number>;
  protein: ExtractedField<number>;
  totalFat: ExtractedField<number>;
  saturatedFat: ExtractedField<number>;
  transFat: ExtractedField<number>;
  cholesterol: ExtractedField<number>;
  carbohydrate: ExtractedField<number>;
  sugar: ExtractedField<number>;
  sugarBreakdown: SugarBreakdown;
  fiber: ExtractedField<number>;
  sodium: ExtractedField<number>;
  calcium: ExtractedField<number>;
  iron: ExtractedField<number>;
  vitaminA: ExtractedField<string>;
  vitaminC: ExtractedField<string>;
  vitaminD: ExtractedField<string>;
  micronutrients: ExtractedMicronutrient[];
  ingredientsText: string | null;
  allergenText: string | null;
  claimsText: string | null;
  rawTextSummary: string;
  warnings: string[];
};

export type GeminiOcrResponse = {
  success: true;
  modelUsed: string;
  data: ExtractedNutrition;
};

export type GeminiOcrError = {
  success: false;
  error: string;
  code?: "GEMINI_OVERLOADED" | "GEMINI_OCR_FAILED";
};

export type NutritionPatch = Partial<
  Pick<LabelInput, "servingSize" | "servingsPerPackage" | "calories" | "energyKj" | "energyFromFat" | "protein" | "totalFat" | "saturatedFat" | "transFat" | "cholesterol" | "carbohydrate" | "sugar" | "sucrose" | "lactose" | "glucose" | "fructose" | "maltose" | "fiber" | "sodium" | "calcium" | "iron" | "vitaminA" | "vitaminC" | "vitaminD" | "micronutrients" | "ingredients" | "allergenText" | "claims">
>;
