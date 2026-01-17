export type PricingType = "free" | "paid" | "freemium" | "contact";

export interface Seller {
  id: string;
  clerk_user_id: string;
  username: string;
  display_name: string;
  company_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  twitter_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  pricing_type: PricingType;
  price_info: string | null;
  logo_url: string | null;
  screenshots: string[];
  website_url: string | null;
  is_published: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  seller?: Seller;
}

export interface Inquiry {
  id: string;
  product_id: string;
  sender_name: string;
  sender_email: string;
  sender_company: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  // Joined data
  product?: Product;
}

export interface Category {
  id: string;
  name_ja: string;
  name_en: string;
  display_order: number;
}

// Supabase Insert types
export type SellerInsert = Omit<Seller, "id" | "created_at" | "updated_at">;
export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at" | "seller">;
export type InquiryInsert = Omit<Inquiry, "id" | "created_at" | "product">;

// Database schema for Supabase
export interface Database {
  public: {
    Tables: {
      sellers: {
        Row: Seller;
        Insert: SellerInsert;
        Update: Partial<SellerInsert>;
      };
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: Partial<ProductInsert>;
      };
      inquiries: {
        Row: Inquiry;
        Insert: InquiryInsert;
        Update: Partial<InquiryInsert>;
      };
      categories: {
        Row: Category;
        Insert: Category;
        Update: Partial<Category>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      pricing_type: PricingType;
    };
    CompositeTypes: Record<string, never>;
  };
}
