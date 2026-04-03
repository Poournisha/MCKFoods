import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/db/api";

type Language = "en" | "ta" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const defaultTranslations: Record<string, string> = {
  "nav.home": "Home",
  "nav.products": "Products",
  "nav.recipes": "Recipes",
  "nav.about": "About Us",
  "nav.contact": "Contact",
  "nav.cart": "Cart",
  "product.add_to_cart": "Add to Cart",
  "product.out_of_stock": "Out of Stock",
  "product.in_stock": "In Stock",
  "product.price": "Price",
  "product.weight": "Weight",
  "product.reviews": "Reviews",
  "product.write_review": "Write a Review",
  "cart.your_cart": "Your Cart",
  "cart.empty": "Your cart is empty",
  "cart.subtotal": "Subtotal",
  "cart.checkout": "Proceed to Checkout",
  "filter.price_range": "Price Range",
  "filter.dietary": "Dietary Preferences",
  "filter.apply": "Apply Filters",
  "filter.clear": "Clear Filters",
  "recipe.prep_time": "Prep Time",
  "recipe.cook_time": "Cook Time",
  "recipe.servings": "Servings",
  "recipe.difficulty": "Difficulty",
  "recipe.ingredients": "Ingredients",
  "recipe.instructions": "Instructions",
  "sale.flash_sale": "Flash Sale",
  "sale.off": "OFF",
  "sale.ends_in": "Ends in",
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });
  
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const data = await api.getTranslations(language);
        setTranslations({ ...defaultTranslations, ...data });
      } catch (error) {
        console.error("Failed to load translations:", error);
        setTranslations(defaultTranslations);
      }
    };

    loadTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}