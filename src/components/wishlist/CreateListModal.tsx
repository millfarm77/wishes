'use client';

import React, { useState } from 'react';
import { X, Calendar, Sparkles, Loader2, EyeOff } from 'lucide-react';
import { CoverTheme, Wishlist } from '@/lib/types';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Wishlist>) => Promise<Wishlist>;
}

const THEMES: { id: CoverTheme; name: string; bgClass: string; borderClass: string }[] = [
  { id: 'nordic', name: 'Klassisk', bgClass: 'bg-stone-100', borderClass: 'border-stone-300' },
  { id: 'sage', name: 'Salvie', bgClass: 'bg-emerald-100', borderClass: 'border-emerald-300' },
  { id: 'rose', name: 'Varm Rosa', bgClass: 'bg-rose-100', borderClass: 'border-rose-300' },
  { id: 'sky', name: 'Himmelblå', bgClass: 'bg-sky-100', borderClass: 'border-sky-300' },
  { id: 'sunset', name: 'Solnedgang', bgClass: 'bg-amber-100', borderClass: 'border-amber-300' },
  { id: 'amber', name: 'Gylden', bgClass: 'bg-orange-100', borderClass: 'border-orange-300' },
];

export function CreateListModal({ isOpen, onClose, onCreate }: CreateListModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [theme, setTheme] = useState<CoverTheme>('sage');
  const [hideReservations, setHideReservations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await onCreate({
        title: title.trim(),
        description: description.trim() || null,
        event_date: eventDate || null,
        cover_theme: theme,
        hide_reservations_from_owner: hideReservations,
        is_public: true,
      });

      setTitle('');
      setDescription('');
      setEventDate('');
      onClose();

      // Navigate to new list
      if (typeof window !== 'undefined') {
        window.location.href = `/lists/${created.id}`;
      }
    } catch (err) {
      console.error('Failed to create list:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-modal border border-stone-100">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Opret ny ønskeliste</h2>
            <p className="text-xs text-stone-500">Gør klar til fødselsdag, jul eller fest</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">
              Listenavn <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="F.eks. Min Fødselsdag 2026 eller Juleaften"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">
              Dato for anledningen (valgfri)
            </label>
            <div className="relative flex items-center">
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
              />
            </div>
          </div>

          {/* Color theme selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Vælg farvetema
            </label>
            <div className="grid grid-cols-6 gap-2">
              {THEMES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`h-9 rounded-xl border-2 transition-all ${t.bgClass} ${
                    theme === t.id ? `${t.borderClass} scale-105 shadow-sm` : 'border-transparent hover:scale-105'
                  }`}
                  title={t.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700">
              Beskrivelse eller velkomsthilsen
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Skriv en kort besked til dem, der kigger med på listen..."
              className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all resize-none"
            />
          </div>

          {/* Surprise Mode Setting */}
          <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-2xl flex items-start gap-3">
            <input
              type="checkbox"
              id="surprise-toggle"
              checked={hideReservations}
              onChange={(e) => setHideReservations(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-stone-900 focus:ring-stone-900 accent-stone-900"
            />
            <label htmlFor="surprise-toggle" className="text-xs text-stone-700 cursor-pointer select-none">
              <span className="font-semibold block text-stone-900">Overraskelses-tilstand (anbefalet)</span>
              Skjul hvem der har reserveret hvad for dig, så gaven forbliver en overraskelse på dagen!
            </label>
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
              disabled={isSubmitting || !title.trim()}
              className="flex-1 py-2.5 px-4 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Opretter...</span>
                </>
              ) : (
                <span>Opret ønskeliste</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
