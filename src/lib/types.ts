export type CoverTheme = 'nordic' | 'rose' | 'sage' | 'sky' | 'sunset' | 'amber';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  slug: string;
  event_date: string | null;
  cover_theme: CoverTheme;
  is_public: boolean;
  hide_reservations_from_owner: boolean;
  created_at: string;
  updated_at: string;
  // Computed fields
  wishes_count?: number;
  reserved_count?: number;
  owner_name?: string;
}

export type WishPriority = 'must_have' | 'normal' | 'nice_to_have';

export interface Reservation {
  id: string;
  wish_id: string;
  reserver_name: string;
  reserver_email: string | null;
  session_token: string;
  notes: string | null;
  created_at: string;
}

export interface Wish {
  id: string;
  wishlist_id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  url: string | null;
  image_url: string | null;
  store_name: string | null;
  priority: WishPriority;
  order_index: number;
  created_at: string;
  updated_at: string;
  // Computed or joined
  reservation?: Reservation | null;
  is_reserved?: boolean;
}

export interface ScrapedMetadata {
  title?: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  storeName?: string;
  url?: string;
}
