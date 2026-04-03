/**
 * Shipping utility functions
 */

/**
 * Parse weight string to grams
 * Supports formats: "200g", "1kg", "1.5kg", "500 g", "1 kg"
 */
export function parseWeightToGrams(weight: string | null | undefined): number {
  if (!weight) return 0;

  const cleaned = weight.toLowerCase().trim().replace(/\s+/g, "");

  // Match patterns like "200g", "1kg", "1.5kg"
  const kgMatch = cleaned.match(/^([\d.]+)kg$/);
  if (kgMatch) {
    return Math.round(Number.parseFloat(kgMatch[1]) * 1000);
  }

  const gMatch = cleaned.match(/^([\d.]+)g$/);
  if (gMatch) {
    return Math.round(Number.parseFloat(gMatch[1]));
  }

  // If no match, try to extract any number and assume grams
  const numberMatch = cleaned.match(/([\d.]+)/);
  if (numberMatch) {
    const value = Number.parseFloat(numberMatch[1]);
    // If value is less than 10, assume kg, otherwise assume grams
    return value < 10 ? Math.round(value * 1000) : Math.round(value);
  }

  return 0;
}

/**
 * Format grams to readable weight string
 */
export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg.toFixed(kg % 1 === 0 ? 0 : 1)}kg`;
  }
  return `${grams}g`;
}

/**
 * Calculate total weight from cart items
 */
export function calculateTotalWeight(items: Array<{ weight?: string | null; quantity: number }>): number {
  return items.reduce((total, item) => {
    const itemWeight = parseWeightToGrams(item.weight);
    return total + itemWeight * item.quantity;
  }, 0);
}

/**
 * Get region display name
 */
export function getRegionDisplayName(region: string): string {
  const regionMap: Record<string, string> = {
    tamil_nadu: "Tamil Nadu",
    other_states: "Other States",
  };
  return regionMap[region] || region;
}

/**
 * Indian states list with unique values
 * Each state has a unique value for proper selection
 * Sorted alphabetically by label for better user experience
 */
export const INDIAN_STATES = [
  { value: "andaman_nicobar", label: "Andaman and Nicobar Islands", region: "other_states" },
  { value: "andhra_pradesh", label: "Andhra Pradesh", region: "other_states" },
  { value: "arunachal_pradesh", label: "Arunachal Pradesh", region: "other_states" },
  { value: "assam", label: "Assam", region: "other_states" },
  { value: "bihar", label: "Bihar", region: "other_states" },
  { value: "chandigarh", label: "Chandigarh", region: "other_states" },
  { value: "chhattisgarh", label: "Chhattisgarh", region: "other_states" },
  { value: "dadra_nagar_haveli", label: "Dadra and Nagar Haveli and Daman and Diu", region: "other_states" },
  { value: "delhi", label: "Delhi", region: "other_states" },
  { value: "goa", label: "Goa", region: "other_states" },
  { value: "gujarat", label: "Gujarat", region: "other_states" },
  { value: "haryana", label: "Haryana", region: "other_states" },
  { value: "himachal_pradesh", label: "Himachal Pradesh", region: "other_states" },
  { value: "jammu_kashmir", label: "Jammu and Kashmir", region: "other_states" },
  { value: "jharkhand", label: "Jharkhand", region: "other_states" },
  { value: "karnataka", label: "Karnataka", region: "other_states" },
  { value: "kerala", label: "Kerala", region: "other_states" },
  { value: "ladakh", label: "Ladakh", region: "other_states" },
  { value: "lakshadweep", label: "Lakshadweep", region: "other_states" },
  { value: "madhya_pradesh", label: "Madhya Pradesh", region: "other_states" },
  { value: "maharashtra", label: "Maharashtra", region: "other_states" },
  { value: "manipur", label: "Manipur", region: "other_states" },
  { value: "meghalaya", label: "Meghalaya", region: "other_states" },
  { value: "mizoram", label: "Mizoram", region: "other_states" },
  { value: "nagaland", label: "Nagaland", region: "other_states" },
  { value: "odisha", label: "Odisha", region: "other_states" },
  { value: "puducherry", label: "Puducherry", region: "other_states" },
  { value: "punjab", label: "Punjab", region: "other_states" },
  { value: "rajasthan", label: "Rajasthan", region: "other_states" },
  { value: "sikkim", label: "Sikkim", region: "other_states" },
  { value: "tamil_nadu", label: "Tamil Nadu", region: "tamil_nadu" },
  { value: "telangana", label: "Telangana", region: "other_states" },
  { value: "tripura", label: "Tripura", region: "other_states" },
  { value: "uttar_pradesh", label: "Uttar Pradesh", region: "other_states" },
  { value: "uttarakhand", label: "Uttarakhand", region: "other_states" },
  { value: "west_bengal", label: "West Bengal", region: "other_states" },
];

/**
 * Get shipping region from state value
 */
export function getShippingRegion(stateValue: string): string {
  const state = INDIAN_STATES.find((s) => s.value === stateValue);
  return state?.region || "other_states";
}
