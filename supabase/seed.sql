-- Seed script for wishes database
-- Run this in your Supabase SQL Editor after running schema.sql if you want sample data

-- Insert demo wishlist (slug: 'madss-foedselsdag')
DO $$
DECLARE
  demo_user_id uuid;
  demo_list_id uuid;
BEGIN
  -- Get the first registered user or create a demo placeholder if none
  SELECT id INTO demo_user_id FROM auth.users LIMIT 1;

  IF demo_user_id IS NOT NULL THEN
    INSERT INTO public.wishlists (id, user_id, title, description, slug, event_date, cover_theme, is_public, hide_reservations_from_owner)
    VALUES (
      gen_random_uuid(),
      demo_user_id,
      'Min Fødselsdagsønskeliste 🎂',
      'Her er et par ting jeg ønsker mig til min fødselsdag! I kan reservere gaverne her så ingen køber det samme.',
      'min-foedselsdag',
      CURRENT_DATE + INTERVAL '30 days',
      'sage',
      true,
      true
    )
    RETURNING id INTO demo_list_id;

    -- Wishes
    INSERT INTO public.wishes (wishlist_id, title, description, price, currency, url, image_url, store_name, priority, order_index)
    VALUES
      (
        demo_list_id,
        'Sony WH-1000XM5 Trådløse Hovedtelefoner',
        'Sort farve foretrækkes! Fantastisk støjreduktion til kontoret.',
        2499.00,
        'DKK',
        'https://www.elgiganten.dk',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
        'Elgiganten',
        'must_have',
        0
      ),
      (
        demo_list_id,
        'Moccamaster KBG Select Kaffemaskine',
        'Mat sort eller børstet stål.',
        1699.00,
        'DKK',
        'https://www.magasin.dk',
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=60',
        'Magasin',
        'normal',
        1
      ),
      (
        demo_list_id,
        'Kähler Hammershøi Vase (21 cm)',
        'Hvid keramik til spisebordet.',
        399.95,
        'DKK',
        'https://www.imerco.dk',
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=60',
        'Imerco',
        'nice_to_have',
        2
      ),
      (
        demo_list_id,
        'Gavekort til Restaurant Barr',
        'En hyggelig middagsoplevelse ved vandet.',
        800.00,
        'DKK',
        'https://restaurantbarr.com',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
        'Restaurant Barr',
        'normal',
        3
      );
  END IF;
END $$;
