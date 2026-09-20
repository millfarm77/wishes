'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Share2,
  Calendar,
  Eye,
  EyeOff,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { WishStore } from '@/lib/store';
import { Wishlist, Wish } from '@/lib/types';
import { WishCard } from '@/components/wishlist/WishCard';
import { AddWishModal } from '@/components/wishlist/AddWishModal';
import { ShareModal } from '@/components/wishlist/ShareModal';

export default function WishlistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [hideReservations, setHideReservations] = useState(true);

  const loadData = async () => {
    try {
      const data = await WishStore.getWishlistById(listId);
      if (data) {
        setWishlist(data.wishlist);
        setWishes(data.wishes);
        setHideReservations(data.wishlist.hide_reservations_from_owner);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listId) loadData();
  }, [listId]);

  const handleAddWish = async (wishData: Partial<Wish>) => {
    await WishStore.createWish(wishData);
    await loadData();
  };

  const handleDeleteWish = async (wishId: string) => {
    if (confirm('Er du sikker på, at du vil fjerne dette ønske?')) {
      await WishStore.deleteWish(wishId);
      await loadData();
    }
  };

  const handleToggleSurprise = async () => {
    const nextState = !hideReservations;
    setHideReservations(nextState);
    if (wishlist) {
      await WishStore.updateWishlist(wishlist.id, {
        hide_reservations_from_owner: nextState,
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-stone-200 w-48 rounded-xl" />
        <div className="h-32 bg-stone-200 rounded-3xl" />
        <div className="grid sm:grid-cols-3 gap-6 pt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-stone-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-stone-200">
        <Gift className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-stone-900">Ønskelisten blev ikke fundet</h2>
        <p className="text-stone-500 text-sm mt-1 mb-6">Listen er muligvis blevet slettet eller findes ikke.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tilbage til oversigten</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Tilbage til alle lister</span>
      </Link>

      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border theme-${wishlist.cover_theme || 'nordic'} shadow-soft`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {wishlist.title}
              </h1>
              {wishlist.event_date && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-white/90 backdrop-blur rounded-full text-stone-800 shadow-xs border border-stone-200/50">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  {new Date(wishlist.event_date).toLocaleDateString('da-DK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>

            {wishlist.description && (
              <p className="text-sm sm:text-base text-stone-700 max-w-2xl leading-relaxed">
                {wishlist.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsShareOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/90 hover:bg-white text-stone-800 text-sm font-semibold rounded-xl border border-stone-200 shadow-xs hover:border-stone-300 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Del liste</span>
            </button>

            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tilføj ønske</span>
            </button>
          </div>
        </div>

        {/* Surprise Mode Bar */}
        <div className="mt-6 pt-4 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-700">
            {hideReservations ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Overraskelses-tilstand er slået til:</strong> Reservationer er skjult for dig så gaven forbliver hemmelig!
                </span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Overraskelses-tilstand er slået fra:</strong> Du kan se hvem der har reserveret dine ønsker.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSurprise}
              className="underline text-stone-600 hover:text-stone-900 font-medium"
            >
              {hideReservations ? 'Afslør reservationer' : 'Skjul reservationer igen'}
            </button>

            <Link
              href={`/w/${wishlist.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-stone-700 hover:text-stone-900 font-semibold underline"
            >
              <span>Gæstevisning</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Wishes Section */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>Ønsker</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
              {wishes.length}
            </span>
          </h2>
        </div>

        {wishes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-200 p-8 space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-stone-900 text-lg">Ingen ønsker tilføjet endnu</h3>
            <p className="text-stone-500 text-sm max-w-sm mx-auto">
              Kopier et link fra din favoritbutik og indsæt det, så henter vi automatisk billede og pris!
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-stone-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tilføj første ønske</span>
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishes.map((wish) => (
              <WishCard
                key={wish.id}
                wish={wish}
                isOwner={true}
                hideReservations={hideReservations}
                onDeleteWish={handleDeleteWish}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddWishModal
        wishlistId={wishlist.id}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddWish={handleAddWish}
      />

      <ShareModal
        slug={wishlist.slug}
        title={wishlist.title}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
