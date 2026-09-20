'use client';

import React, { useState } from 'react';
import { X, Gift, Loader2, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Wish } from '@/lib/types';

interface ReserveModalProps {
  wish: Wish | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReservation: (
    wishId: string,
    name: string,
    email?: string,
    notes?: string
  ) => Promise<void>;
}

export function ReserveModal({
  wish,
  isOpen,
  onClose,
  onConfirmReservation,
}: ReserveModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !wish) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirmReservation(wish.id, name.trim(), email.trim() || undefined, notes.trim() || undefined);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if canvas not supported
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName('');
        setEmail('');
        setNotes('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Reservation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-modal border border-stone-100">
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Gaven er reserveret!</h3>
            <p className="text-sm text-stone-600">
              Tak! Andre gæster kan nu se, at denne gave er taget, så der ikke bliver købt det samme.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-800 rounded-xl">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Reserver gave</h2>
                  <p className="text-xs text-stone-500">Undgå at andre køber det samme</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item preview */}
            <div className="mt-3 p-3 bg-stone-50 rounded-2xl flex items-center gap-3 border border-stone-200/60">
              {wish.image_url ? (
                <img
                  src={wish.image_url}
                  alt={wish.title}
                  className="w-14 h-14 object-cover rounded-xl border border-stone-200 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-stone-200 flex items-center justify-center text-stone-400 flex-shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-stone-900 truncate">
                  {wish.title}
                </h4>
                {wish.price && (
                  <p className="text-xs font-medium text-stone-600">
                    Ca. {wish.price} {wish.currency}
                  </p>
                )}
                {wish.store_name && (
                  <p className="text-xs text-stone-400 truncate">
                    Fra {wish.store_name}
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 pt-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Dit navn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="F.eks. Tante Birthe eller Peter"
                  className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  E-mail (valgfri)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Hvis du vil modtage en bekræftelse"
                  className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Privat bemærkning (valgfri)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="F.eks. Køber sammen med onkel Lars"
                  className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/50 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Modtageren kan ikke se hvem der har reserveret gaven, så overraskelsen ikke bliver ødelagt!
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 px-4 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="flex-1 py-2.5 px-4 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Reserverer...</span>
                    </>
                  ) : (
                    <span>Bekræft reservation</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
