'use client';

import React, { useState } from 'react';
import { ExternalLink, Check, Trash2, Heart, Gift, Sparkles, AlertCircle } from 'lucide-react';
import { Wish } from '@/lib/types';

interface WishCardProps {
  wish: Wish;
  isOwner?: boolean;
  hideReservations?: boolean;
  currentSessionToken?: string;
  onReserveClick?: (wish: Wish) => void;
  onCancelReservation?: (wishId: string) => void;
  onDeleteWish?: (wishId: string) => void;
}

export function WishCard({
  wish,
  isOwner = false,
  hideReservations = true,
  currentSessionToken,
  onReserveClick,
  onCancelReservation,
  onDeleteWish,
}: WishCardProps) {
  const [imageError, setImageError] = useState(false);
  const isReserved = wish.is_reserved;
  const isReservedByMe =
    isReserved &&
    wish.reservation &&
    currentSessionToken &&
    wish.reservation.session_token === currentSessionToken;

  const formattedPrice = wish.price !== null
    ? new Intl.NumberFormat('da-DK', {
        style: 'currency',
        currency: wish.currency || 'DKK',
        maximumFractionDigits: 0,
      }).format(wish.price)
    : null;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isReserved && !isOwner
          ? 'border-stone-200/60 bg-stone-50/50 opacity-80'
          : 'border-stone-200/90 shadow-soft hover:shadow-float hover:border-stone-300'
      }`}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        {wish.image_url && !imageError ? (
          <img
            src={wish.image_url}
            alt={wish.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-2 bg-gradient-to-br from-stone-50 to-stone-100">
            <Gift className="w-10 h-10 stroke-[1.5] text-stone-300" />
            <span className="text-xs font-medium text-stone-400">Intet billede</span>
          </div>
        )}

        {/* Priority Badge */}
        {wish.priority === 'must_have' && (
          <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stort ønske</span>
          </div>
        )}

        {/* Store badge */}
        {wish.store_name && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-stone-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-stone-200/60 shadow-xs">
            {wish.store_name}
          </div>
        )}

        {/* Owner Delete button */}
        {isOwner && onDeleteWish && (
          <button
            onClick={() => onDeleteWish(wish.id)}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-full shadow-sm transition-all"
            title="Slet ønske"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-semibold text-stone-900 text-base leading-snug line-clamp-2">
              {wish.title}
            </h3>
          </div>

          {formattedPrice && (
            <p className="text-stone-900 font-bold text-base">
              {formattedPrice}
            </p>
          )}

          {wish.description && (
            <p className="text-xs text-stone-500 line-clamp-2 pt-0.5">
              {wish.description}
            </p>
          )}
        </div>

        {/* Actions / Reservation state */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          {wish.url ? (
            <a
              href={wish.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 hover:underline transition-colors"
            >
              <span>Se i butik</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-xs text-stone-400">Ingen webbutik</span>
          )}

          {/* Guest Interaction */}
          {!isOwner && (
            <>
              {isReservedByMe ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    Reserveret af dig
                  </span>
                  {onCancelReservation && (
                    <button
                      onClick={() => onCancelReservation(wish.id)}
                      className="text-xs text-stone-500 hover:text-rose-600 underline ml-1"
                    >
                      Fortryd
                    </button>
                  )}
                </div>
              ) : isReserved ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-stone-400" />
                  <span>Reserveret</span>
                </span>
              ) : (
                <button
                  onClick={() => onReserveClick && onReserveClick(wish)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-200" />
                  <span>Reserver</span>
                </button>
              )}
            </>
          )}

          {/* Owner View */}
          {isOwner && (
            <div className="text-xs">
              {hideReservations ? (
                <span className="text-stone-400 italic flex items-center gap-1">
                  <span>🎁 Hemmeligt for dig</span>
                </span>
              ) : isReserved ? (
                <span className="text-emerald-700 bg-emerald-50 font-medium px-2 py-0.5 rounded border border-emerald-200">
                  Reserveret af {wish.reservation?.reserver_name || 'en gæst'}
                </span>
              ) : (
                <span className="text-stone-400">Ikke reserveret endnu</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
