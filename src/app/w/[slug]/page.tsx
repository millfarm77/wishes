'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Gift, Calendar, Sparkles, Filter, CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { WishStore } from '@/lib/store';
import { Wishlist, Wish } from '@/lib/types';
import { WishCard } from '@/components/wishlist/WishCard';
import { ReserveModal } from '@/components/wishlist/ReserveModal';

export default function PublicWishlistView() {
  const params = useParams();
  const slug = params.slug as string;

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'must_have'>('all');
  const [selectedWishForReserve, setSelectedWishForReserve] = useState<Wish | null>(null);
  const [sessionToken, setSessionToken] = useState<string>('');

  // Get or create guest session token in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('wishes_guest_token');
      if (!token) {
        token = 'guest_' + Math.random().toString(36).substring(2, 12);
        localStorage.setItem('wishes_guest_token', token);
      }
      setSessionToken(token);
    }
  }, []);

  const loadData = async () => {
    try {
      const data = await WishStore.getWishlistBySlug(slug);
      if (data) {
        setWishlist(data.wishlist);
        setWishes(data.wishes);
      }
    } catch (err) {
      console.error('Failed to load shared wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) loadData();
  }, [slug]);

  const handleConfirmReservation = async (
    wishId: string,
    name: string,
    email?: string,
    notes?: string
  ) => {
    await WishStore.reserveWish(wishId, name, email, notes, sessionToken);
    await loadData();
  };

  const handleCancelReservation = async (wishId: string) => {
    if (confirm('Vil du annullere din reservation af denne gave?')) {
      await WishStore.cancelReservation(wishId, sessionToken);
      await loadData();
    }
  };

  // Filtered wishes
  const filteredWishes = wishes.filter((wish) => {
    if (filter === 'available') return !wish.is_reserved;
    if (filter === 'must_have') return wish.priority === 'must_have';
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-40 bg-stone-200/60 rounded-3xl" />
        <div className="grid sm:grid-cols-3 gap-6 pt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-stone-200/60 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 text-center bg-white rounded-3xl border border-stone-200 shadow-soft">
        <Gift className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-stone-900">Ønskelisten findes ikke</h2>
        <p className="text-stone-500 text-sm mt-1 mb-6">
          Tjek venligst om linket er stavet rigtigt, eller spørg personen der sendte det.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium"
        >
          <span>Gå til forsiden</span>
        </Link>
      </div>
    );
  }

  const reservedCount = wishes.filter((w) => w.is_reserved).length;
  const totalCount = wishes.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* List Header */}
      <div className={`p-6 sm:p-10 rounded-3xl border theme-${wishlist.cover_theme || 'nordic'} shadow-soft`}>
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-xs font-semibold text-stone-700 border border-stone-200/60 shadow-xs">
              Ønskeliste
            </span>

            {wishlist.event_date && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 backdrop-blur rounded-full text-xs font-semibold text-stone-700 border border-stone-200/60 shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                {new Date(wishlist.event_date).toLocaleDateString('da-DK', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            {wishlist.title}
          </h1>

          {wishlist.description && (
            <p className="text-stone-700 sm:text-lg leading-relaxed pt-1">
              {wishlist.description}
            </p>
          )}

          <div className="pt-2 flex items-center gap-4 text-xs font-medium text-stone-600">
            <span>🎁 {totalCount} ønsker i alt</span>
            <span>•</span>
            <span>✓ {reservedCount} gaver reserveret</span>
          </div>
        </div>
      </div>

      {/* Guest Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-amber-900">
        <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <strong>Sådan virker det:</strong> Tryk &quot;Reserver&quot; på den gave du ønsker at give. Så ved de andre gæster, at den er taget, mens modtageren stadig bliver overrasket på dagen!
        </div>
      </div>

      {/* Filters & Wishes Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200/70 text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Alle ({wishes.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'available'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Kun ledige ({wishes.filter((w) => !w.is_reserved).length})
            </button>
            <button
              onClick={() => setFilter('must_have')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'must_have'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Favoritter ({wishes.filter((w) => w.priority === 'must_have').length})
            </button>
          </div>
        </div>

        {filteredWishes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <p className="text-stone-600 text-sm font-medium">Ingen ønsker matchede filteret.</p>
            <button
              onClick={() => setFilter('all')}
              className="text-xs text-stone-900 underline font-semibold"
            >
              Vis alle ønsker
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredWishes.map((wish) => (
              <WishCard
                key={wish.id}
                wish={wish}
                isOwner={false}
                currentSessionToken={sessionToken}
                onReserveClick={(w) => setSelectedWishForReserve(w)}
                onCancelReservation={handleCancelReservation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      <ReserveModal
        wish={selectedWishForReserve}
        isOpen={Boolean(selectedWishForReserve)}
        onClose={() => setSelectedWishForReserve(null)}
        onConfirmReservation={handleConfirmReservation}
      />

      {/* Footer Callout */}
      <div className="mt-16 p-8 bg-white border border-stone-200 rounded-3xl text-center max-w-xl mx-auto shadow-xs space-y-3">
        <h3 className="text-base font-bold text-stone-900">Vil du også lave din egen ønskeliste?</h3>
        <p className="text-xs text-stone-500">
          Wishes er 100% gratis, super hurtig og helt fri for reklamer.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <span>Opret din egen ønskeliste</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
