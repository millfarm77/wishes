import { createClient, isSupabaseConfigured } from './supabase/client';
import { Wishlist, Wish, Reservation } from './types';

const INITIAL_DEMO_WISHLISTS: Wishlist[] = [
  {
    id: 'demo-list-1',
    user_id: 'demo-user-id',
    title: 'Min Fødselsdag 2026 🇩🇰',
    description: 'Her er min ønskeliste! Tryk "Reserver" hvis du køber en af gaverne, så vi undgår dubletter.',
    slug: 'min-foedselsdag',
    event_date: '2026-11-24',
    cover_theme: 'sage',
    is_public: true,
    hide_reservations_from_owner: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    wishes_count: 4,
    reserved_count: 1,
    owner_name: 'Mads',
  },
  {
    id: 'demo-list-2',
    user_id: 'demo-user-id',
    title: 'Juleaften 2026 🎄',
    description: 'Ønsker til årets juleaften. Både store og små ønsker!',
    slug: 'jul-2026',
    event_date: '2026-12-24',
    cover_theme: 'rose',
    is_public: true,
    hide_reservations_from_owner: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    wishes_count: 3,
    reserved_count: 0,
    owner_name: 'Mads',
  },
];

const INITIAL_DEMO_WISHES: Wish[] = [
  {
    id: 'demo-wish-1',
    wishlist_id: 'demo-list-1',
    title: 'Sony WH-1000XM5 Trådløse Hovedtelefoner',
    description: 'Sort farve foretrækkes! Fantastisk aktiv støjreduktion til kontor og rejser.',
    price: 2499,
    currency: 'DKK',
    url: 'https://www.elgiganten.dk',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    store_name: 'Elgiganten',
    priority: 'must_have',
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_reserved: true,
    reservation: {
      id: 'demo-res-1',
      wish_id: 'demo-wish-1',
      reserver_name: 'Tante Birthe',
      reserver_email: null,
      session_token: 'demo-token',
      notes: 'Køber den sammen med onkel Jens!',
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'demo-wish-2',
    wishlist_id: 'demo-list-1',
    title: 'Moccamaster KBG Select Kaffemaskine',
    description: 'Mat sort eller børstet stål. 10 kopper.',
    price: 1699,
    currency: 'DKK',
    url: 'https://www.magasin.dk',
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    store_name: 'Magasin',
    priority: 'normal',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_reserved: false,
    reservation: null,
  },
  {
    id: 'demo-wish-3',
    wishlist_id: 'demo-list-1',
    title: 'Kähler Hammershøi Vase (21 cm)',
    description: 'Hvid keramik med de klassiske riller.',
    price: 399,
    currency: 'DKK',
    url: 'https://www.imerco.dk',
    image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    store_name: 'Imerco',
    priority: 'nice_to_have',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_reserved: false,
    reservation: null,
  },
  {
    id: 'demo-wish-4',
    wishlist_id: 'demo-list-1',
    title: 'Gavekort til Restaurant Barr',
    description: 'En hyggelig middag ved vandet i København.',
    price: 800,
    currency: 'DKK',
    url: 'https://restaurantbarr.com',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    store_name: 'Restaurant Barr',
    priority: 'normal',
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_reserved: false,
    reservation: null,
  },
  {
    id: 'demo-wish-5',
    wishlist_id: 'demo-list-2',
    title: 'Uldtrøje i Merinould',
    description: 'Størrelse L. Marineblå eller koksgrå.',
    price: 899,
    currency: 'DKK',
    url: 'https://www.arket.com',
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
    store_name: 'Arket',
    priority: 'normal',
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_reserved: false,
    reservation: null,
  },
];

// Helper to access LocalStorage demo state safely
function getLocalData(): { wishlists: Wishlist[]; wishes: Wish[] } {
  if (typeof window === 'undefined') {
    return { wishlists: INITIAL_DEMO_WISHLISTS, wishes: INITIAL_DEMO_WISHES };
  }
  const savedLists = localStorage.getItem('wishlists_data');
  const savedWishes = localStorage.getItem('wishes_data');
  return {
    wishlists: savedLists ? (JSON.parse(savedLists) as Wishlist[]) : INITIAL_DEMO_WISHLISTS,
    wishes: savedWishes ? (JSON.parse(savedWishes) as Wish[]) : INITIAL_DEMO_WISHES,
  };
}

function saveLocalData(wishlists: Wishlist[], wishes: Wish[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('wishlists_data', JSON.stringify(wishlists));
  localStorage.setItem('wishes_data', JSON.stringify(wishes));
}

export const WishStore = {
  isConfigured: isSupabaseConfigured,

  async getWishlists(): Promise<Wishlist[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: wishlists, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          wishes:wishes(id, reservations(id))
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading wishlists:', error);
        return [];
      }

      return (wishlists || []).map((w: any) => {
        const totalWishes = w.wishes?.length || 0;
        const totalReserved = w.wishes?.filter((wish: any) => wish.reservations?.length > 0).length || 0;
        return {
          ...w,
          wishes_count: totalWishes,
          reserved_count: totalReserved,
        };
      });
    }

    // Local / Demo Mode
    const { wishlists, wishes } = getLocalData();
    return wishlists.map(list => {
      const listWishes = wishes.filter(w => w.wishlist_id === list.id);
      return {
        ...list,
        wishes_count: listWishes.length,
        reserved_count: listWishes.filter(w => w.is_reserved).length,
      };
    });
  },

  async getWishlistBySlug(slug: string): Promise<{ wishlist: Wishlist; wishes: Wish[] } | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: wishlist, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          profiles:user_id(full_name)
        `)
        .eq('slug', slug)
        .single();

      if (error || !wishlist) return null;

      const { data: wishes } = await supabase
        .from('wishes')
        .select(`
          *,
          reservations(*)
        `)
        .eq('wishlist_id', wishlist.id)
        .order('order_index', { ascending: true });

      const mappedWishes: Wish[] = (wishes || []).map((w: any) => ({
        ...w,
        is_reserved: Boolean(w.reservations && w.reservations.length > 0),
        reservation: w.reservations?.[0] || null,
      }));

      return {
        wishlist: {
          ...wishlist,
          owner_name: (wishlist as any).profiles?.full_name || 'En ønskesky bruger',
        },
        wishes: mappedWishes,
      };
    }

    // Demo Mode
    const { wishlists, wishes } = getLocalData();
    const foundList = wishlists.find(l => l.slug === slug);
    if (!foundList) return null;

    const listWishes = wishes
      .filter(w => w.wishlist_id === foundList.id)
      .sort((a, b) => a.order_index - b.order_index);

    return {
      wishlist: foundList,
      wishes: listWishes,
    };
  },

  async getWishlistById(id: string): Promise<{ wishlist: Wishlist; wishes: Wish[] } | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: wishlist, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !wishlist) return null;

      const { data: wishes } = await supabase
        .from('wishes')
        .select(`
          *,
          reservations(*)
        `)
        .eq('wishlist_id', wishlist.id)
        .order('order_index', { ascending: true });

      const mappedWishes: Wish[] = (wishes || []).map((w: any) => ({
        ...w,
        is_reserved: Boolean(w.reservations && w.reservations.length > 0),
        reservation: w.reservations?.[0] || null,
      }));

      return { wishlist, wishes: mappedWishes };
    }

    // Demo Mode
    const { wishlists, wishes } = getLocalData();
    const foundList = wishlists.find(l => l.id === id);
    if (!foundList) return null;

    const listWishes = wishes
      .filter(w => w.wishlist_id === foundList.id)
      .sort((a, b) => a.order_index - b.order_index);

    return { wishlist: foundList, wishes: listWishes };
  },

  async createWishlist(data: Partial<Wishlist>): Promise<Wishlist> {
    const slug = (data.title || 'onskeliste')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const newRecord = {
        user_id: user?.id,
        title: data.title || 'Ny Ønskeliste',
        description: data.description || '',
        slug,
        event_date: data.event_date || null,
        cover_theme: data.cover_theme || 'nordic',
        is_public: data.is_public ?? true,
        hide_reservations_from_owner: data.hide_reservations_from_owner ?? true,
      };

      const { data: created, error } = await supabase
        .from('wishlists')
        .insert(newRecord)
        .select()
        .single();

      if (error) throw error;
      return created;
    }

    // Demo Mode
    const { wishlists, wishes } = getLocalData();
    const newList: Wishlist = {
      id: 'list-' + Date.now(),
      user_id: 'demo-user-id',
      title: data.title || 'Ny Ønskeliste',
      description: data.description || '',
      slug,
      event_date: data.event_date || null,
      cover_theme: data.cover_theme || 'nordic',
      is_public: data.is_public ?? true,
      hide_reservations_from_owner: data.hide_reservations_from_owner ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      wishes_count: 0,
      reserved_count: 0,
      owner_name: 'Mads',
    };

    saveLocalData([newList, ...wishlists], wishes);
    return newList;
  },

  async updateWishlist(id: string, updates: Partial<Wishlist>): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase
        .from('wishlists')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return;
    }

    // Demo Mode
    const { wishlists, wishes } = getLocalData();
    const updated = wishlists.map(w => (w.id === id ? { ...w, ...updates, updated_at: new Date().toISOString() } : w));
    saveLocalData(updated, wishes);
  },

  async deleteWishlist(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from('wishlists').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    // Demo Mode
    const { wishlists, wishes } = getLocalData();
    const filteredLists = wishlists.filter(w => w.id !== id);
    const filteredWishes = wishes.filter(w => w.wishlist_id !== id);
    saveLocalData(filteredLists, filteredWishes);
  },

  async createWish(wishData: Partial<Wish>): Promise<Wish> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: created, error } = await supabase
        .from('wishes')
        .insert({
          wishlist_id: wishData.wishlist_id,
          title: wishData.title,
          description: wishData.description || null,
          price: wishData.price || null,
          currency: wishData.currency || 'DKK',
          url: wishData.url || null,
          image_url: wishData.image_url || null,
          store_name: wishData.store_name || null,
          priority: wishData.priority || 'normal',
          order_index: wishData.order_index || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return created;
    }

    // Demo Mode
    const { wishlists, wishes } = getLocalData();
    const newWish: Wish = {
      id: 'wish-' + Date.now(),
      wishlist_id: wishData.wishlist_id!,
      title: wishData.title || 'Uden titel',
      description: wishData.description || null,
      price: wishData.price || null,
      currency: wishData.currency || 'DKK',
      url: wishData.url || null,
      image_url: wishData.image_url || null,
      store_name: wishData.store_name || null,
      priority: wishData.priority || 'normal',
      order_index: wishes.filter(w => w.wishlist_id === wishData.wishlist_id).length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_reserved: false,
      reservation: null,
    };

    saveLocalData(wishlists, [...wishes, newWish]);
    return newWish;
  },

  async updateWish(id: string, updates: Partial<Wish>): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase
        .from('wishes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return;
    }

    // Demo Mode
    const { wishlists, wishes } = getLocalData();
    const updated = wishes.map(w => (w.id === id ? { ...w, ...updates, updated_at: new Date().toISOString() } : w));
    saveLocalData(wishlists, updated);
  },

  async deleteWish(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from('wishes').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    // Demo Mode
    const { wishlists, wishes } = getLocalData();
    const filteredWishes = wishes.filter(w => w.id !== id);
    saveLocalData(wishlists, filteredWishes);
  },

  async reserveWish(
    wishId: string,
    reserverName: string,
    email?: string,
    notes?: string,
    sessionToken?: string
  ): Promise<Reservation> {
    const token = sessionToken || 'guest-' + Math.random().toString(36).substring(2);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          wish_id: wishId,
          reserver_name: reserverName,
          reserver_email: email || null,
          session_token: token,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Demo Mode
    const { wishlists, wishes } = getLocalData();
    const reservation: Reservation = {
      id: 'res-' + Date.now(),
      wish_id: wishId,
      reserver_name: reserverName,
      reserver_email: email || null,
      session_token: token,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    const updatedWishes = wishes.map(w => {
      if (w.id === wishId) {
        return {
          ...w,
          is_reserved: true,
          reservation,
        };
      }
      return w;
    });

    saveLocalData(wishlists, updatedWishes);
    return reservation;
  },

  async cancelReservation(wishId: string, sessionToken: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('wish_id', wishId)
        .eq('session_token', sessionToken);

      if (error) throw error;
      return;
    }

    // Demo Mode
    const { wishlists, wishes } = getLocalData();
    const updatedWishes = wishes.map(w => {
      if (w.id === wishId) {
        return {
          ...w,
          is_reserved: false,
          reservation: null,
        };
      }
      return w;
    });

    saveLocalData(wishlists, updatedWishes);
  },
};
