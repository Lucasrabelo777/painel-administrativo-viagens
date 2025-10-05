export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface ExpertLibraryItem {
  id: string;
  name: string;
  icon: string;
  link: string;
}

export interface Trigger {
  id: string;
  icon: string;
  name: string;
  description: string;
  color: string;
  link: string;
}

export interface PricingByPerson {
  type: 'por-pessoa';
  pricePerPerson: number;
}

export interface PricingByVehicle {
  type: 'por-carro';
  vehicleCapacities: {
    capacity: number;
    price: number;
  }[];
}

export interface PricingFixed {
  type: 'valor-unico';
  fixedPrice: number;
}

export interface PricingByPackage {
  type: 'por-pacote';
  accommodationCategories: {
    name: string; // Padrão, Superior, Luxo
    lowSeason: {
      single: number;
      fromTwo: number;
    };
    highSeason: {
      single: number;
      fromTwo: number;
    };
  }[];
}

export type PricingType = PricingByPerson | PricingByVehicle | PricingFixed | PricingByPackage;

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  description: string;
  about: string;
  duration: string;
  included: string[];
  notIncluded: string[];
  highlights: string[];
  importantNotes: string[];
  rules: string[];
  expertLibrary: ExpertLibraryItem[];
  pricing: PricingType;
}

export interface DashboardStats {
  totalCategories: number;
  totalServices: number;
  totalTriggers: number;
  totalExpertLinks: number;
}