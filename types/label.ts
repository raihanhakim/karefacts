export type ProductType =
  | "snack"
  | "minuman"
  | "susu"
  | "roti_bakery"
  | "frozen_food"
  | "saus_sambal"
  | "makanan_instan"
  | "sereal"
  | "biskuit"
  | "permen_cokelat"
  | "produk_susu"
  | "lainnya";

export type LabelInput = {
  productName: string;
  brandName: string;
  productType: ProductType;
  servingSize: string;
  servingsPerPackage: number | null;
  usuallyConsumedAllAtOnce: boolean;
  calories: number | null;
  energyKj: number | null;
  energyFromFat: number | null;
  sugar: number | null;
  sucrose: number | null;
  lactose: number | null;
  glucose: number | null;
  fructose: number | null;
  maltose: number | null;
  sodium: number | null;
  totalFat: number | null;
  saturatedFat: number | null;
  transFat: number | null;
  cholesterol: number | null;
  protein: number | null;
  fiber: number | null;
  carbohydrate: number | null;
  calcium: number | null;
  iron: number | null;
  vitaminA: string | null;
  vitaminC: string | null;
  vitaminD: string | null;
  micronutrients: string;
  ingredients: string;
  allergenText: string;
  claims: string;
};

export type AttentionCategory = "Rendah perhatian" | "Perlu diperhatikan" | "Cukup tinggi" | "Tinggi";

export type NutrientValues = {
  calories: number | null;
  energyKj: number | null;
  energyFromFat: number | null;
  sugar: number | null;
  sucrose: number | null;
  lactose: number | null;
  glucose: number | null;
  fructose: number | null;
  maltose: number | null;
  sodium: number | null;
  totalFat: number | null;
  saturatedFat: number | null;
  transFat: number | null;
  cholesterol: number | null;
  protein: number | null;
  fiber: number | null;
  carbohydrate: number | null;
  calcium: number | null;
  iron: number | null;
};

export type AnalysisResult = {
  totals: NutrientValues;
  dailyPercentages: {
    perServing: { sugar: number | null; sodium: number | null; totalFat: number | null };
    perPackage: { sugar: number | null; sodium: number | null; totalFat: number | null };
  };
  categories: { sugar: AttentionCategory | null; sodium: AttentionCategory | null; totalFat: AttentionCategory | null };
  saturatedFatNote: string;
  proteinNote: string;
  fiberNote: string;
  allergens: string[];
  allergenNote: string;
  additives: string[];
  additiveNote: string;
  claimNotes: string[];
  consumptionNotes: string[];
  score: number;
  scoreLabel: string;
  conclusion: string;
};
