-- SaaS Marketplace Database Schema
-- Run this in Supabase SQL Editor to create the tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pricing_type enum
CREATE TYPE pricing_type AS ENUM ('free', 'paid', 'freemium', 'contact');

-- Sellers table (extends Clerk user)
CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  company_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  twitter_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  pricing_type pricing_type NOT NULL DEFAULT 'contact',
  price_info TEXT,
  logo_url TEXT,
  screenshots JSONB DEFAULT '[]'::jsonb,
  website_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_company TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories reference table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_ja TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- Insert default categories
INSERT INTO categories (id, name_ja, name_en, display_order) VALUES
  ('marketing', 'マーケティング', 'Marketing', 1),
  ('sales', '営業・CRM', 'Sales & CRM', 2),
  ('finance', '経理・財務', 'Finance', 3),
  ('hr', '人事・労務', 'HR', 4),
  ('productivity', '業務効率化', 'Productivity', 5),
  ('communication', 'コミュニケーション', 'Communication', 6),
  ('development', '開発・エンジニアリング', 'Development', 7),
  ('design', 'デザイン', 'Design', 8),
  ('other', 'その他', 'Other', 9);

-- Create indexes for better query performance
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_published ON products(is_published);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_inquiries_product_id ON inquiries(product_id);
CREATE INDEX idx_inquiries_is_read ON inquiries(is_read);
CREATE INDEX idx_sellers_clerk_user_id ON sellers(clerk_user_id);
CREATE INDEX idx_sellers_username ON sellers(username);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to sellers and products
CREATE TRIGGER update_sellers_updated_at
  BEFORE UPDATE ON sellers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Sellers policies
CREATE POLICY "Sellers are viewable by everyone" ON sellers
  FOR SELECT USING (true);

CREATE POLICY "Users can update own seller profile" ON sellers
  FOR UPDATE USING (auth.uid()::text = clerk_user_id);

-- Products policies
CREATE POLICY "Published products are viewable by everyone" ON products
  FOR SELECT USING (is_published = true);

CREATE POLICY "Sellers can view own products" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = products.seller_id
      AND sellers.clerk_user_id = auth.uid()::text
    )
  );

CREATE POLICY "Sellers can insert own products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = seller_id
      AND sellers.clerk_user_id = auth.uid()::text
    )
  );

CREATE POLICY "Sellers can update own products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = products.seller_id
      AND sellers.clerk_user_id = auth.uid()::text
    )
  );

CREATE POLICY "Sellers can delete own products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM sellers
      WHERE sellers.id = products.seller_id
      AND sellers.clerk_user_id = auth.uid()::text
    )
  );

-- Inquiries policies
CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Sellers can view inquiries for their products" ON inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN sellers ON sellers.id = products.seller_id
      WHERE products.id = inquiries.product_id
      AND sellers.clerk_user_id = auth.uid()::text
    )
  );

CREATE POLICY "Sellers can update inquiries for their products" ON inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN sellers ON sellers.id = products.seller_id
      WHERE products.id = inquiries.product_id
      AND sellers.clerk_user_id = auth.uid()::text
    )
  );

-- Categories are read-only for everyone
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);
