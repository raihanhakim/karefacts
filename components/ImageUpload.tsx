"use client";

import NutritionGeminiReader from "@/components/NutritionGeminiReader";
import type { NutritionPatch } from "@/types/nutritionOcr";

type ImageUploadProps = {
  onUseDetectedNutrition: (values: NutritionPatch) => void;
};

export default function ImageUpload({ onUseDetectedNutrition }: ImageUploadProps) {
  return <NutritionGeminiReader onUseDetectedNutrition={onUseDetectedNutrition} />;
}
