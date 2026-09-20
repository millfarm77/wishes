'use client';

import React, { useState } from 'react';
import { X, Sparkles, Loader2, Link2, DollarSign, Image as ImageIcon, Store } from 'lucide-react';
import { Wish, WishPriority } from '@/lib/types';

interface AddWishModalProps {
  wishlistId: string;
  isOpen: boolean;
  onClose: () => void;
  onAddWish: (wish: Partial<Wish>) => Promise<void>;
}

export function AddWishModal({ wishlistId, isOpen, onClose, onAddWish }: AddWishModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState('DKK');
  const [imageUrl, setImageUrl] = useState('');
  const [storeName, setStoreName] = useState('');
  const [priority, setPriority] = useState<WishPriority>('normal');

  const [isScraping, setIsScraping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchMetadata = async (targetUrl?: string) => {
    const urlToScrape = targetUrl || url;
    if (!urlToScrape || !urlToScrape.includes('.')) return;

    setIsScraping(true);
    setScrapeError(null);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToScrape }),
      });

      if (!res.ok) throw new Error('Kunne ikke hente link');

      const data = await res.json();
      if (data.title && !title) setTitle(data.title);
      if (data.image && !imageUrl) setImageUrl(data.image);
      if (data.price !== undefined && data.price !== null && !price) setPrice(String(data.price));
      if (data.currency) setCurrency(data.currency);
      if (data.storeName && !storeName) setStoreName(data.storeName);
      if (data.description && !description) setDescription(data.description);
    } catch (err) {
      setScrapeError('Kunne ikke hente information automatisk. Du kan udfylde felterne manuelt.');
    } finally {
      setIsScraping(false);
    }
  };

  const handlePasteUrl = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.startsWith('http://') || pasted.startsWith('https://')) {
      setUrl(pasted);
      setTimeout(() => handleFetchMetadata(pasted), 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddWish({
        wishlist_id: wishlistId,
        title: title.trim(),
        description: description.trim() || null,
        price: price ? parseFloat(price) : null,
        currency,
        url: url.trim() || null,
        image_url: imageUrl.trim() || null,
        store_name: storeName.trim() || null,
        priority,
      });

      // Reset
      setUrl('');
      setTitle('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setStoreName('');
      setPriority('normal');
      onClose();
    } catch (err) {
      console.error('Failed to add wish:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-modal border border-stone-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Tilføj nyt ønske</h2>
            <p className="text-xs text-stone-500">Sæt et link ind, så udfylder vi automatisk detaljerne</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Smart Link Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Link til butik / produkt (valgfri)
            </label>
            <div className="relative flex items-center">
              <Link2 className="absolute left-3.5 w-4 h-4 text-stone-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onPaste={handlePasteUrl}
                placeholder="https://elgiganten.dk/produkt/..."
                className="w-full pl-10 pr-24 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
              />
              <button
                type="button"
                onClick={() => handleFetchMetadata()}
                disabled={!url || isScraping}
                className="absolute right-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
              >
                {isScraping ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Henter...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Hent info</span>
                  </>
                )}
              </button>
            </div>
            {scrapeError && (
              <p className="text-xs text-amber-600 pt-0.5">{scrapeError}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Hvad ønsker du dig? <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="F.eks. Trådløse høretelefoner eller Kähler vase"
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
            />
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Pris (ca.)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2499"
                  className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Valuta
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
              >
                <option value="DKK">DKK</option>
                <option value="EUR">EUR</option>
                <option value="SEK">SEK</option>
                <option value="NOK">NOK</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Image URL & Preview */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Billede-URL (valgfri)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://.../billede.jpg"
                className="flex-1 px-3.5 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
              />
              {imageUrl && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200 bg-stone-50 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Store Name & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Butiksnavn
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="F.eks. Magasin, Elgiganten"
                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Prioritet
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as WishPriority)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
              >
                <option value="normal">Normalt ønske</option>
                <option value="must_have">Stort ønske / Favorit ⭐</option>
                <option value="nice_to_have">Hyggeligt hvis der er plads</option>
              </select>
            </div>
          </div>

          {/* Description & Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Noter (størrelse, farve, model osv.)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="F.eks. str. 42 eller farve Space Grey"
              className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all resize-none"
            />
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
              className="flex-1 py-2.5 px-4 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemmer ønske...</span>
                </>
              ) : (
                <span>Tilføj ønske</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
