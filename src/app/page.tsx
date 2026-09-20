'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Gift, Sparkles, Share2, ShieldCheck, ArrowRight, CheckCircle2, Zap, Smartphone, QrCode } from 'lucide-react';
import { CreateListModal } from '@/components/wishlist/CreateListModal';
import { WishStore } from '@/lib/store';
import { Wishlist } from '@/lib/types';

export default function HomePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateList = async (data: Partial<Wishlist>) => {
    return await WishStore.createWishlist(data);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background subtle gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-50/50 via-stone-50/20 to-transparent pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700 mb-6 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Det enkle alternativ til tunge ønskeliste-apps</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 max-w-3xl mx-auto leading-[1.15]">
          Ønskelister gjort <span className="underline decoration-amber-300 underline-offset-4">enkelt</span>, smukt og helt uden støj.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Saml alle dine gaveønsker fra alle butikker på ét sted. Familie og venner kan reservere gaver med ét klik – hemmeligt for dig, så overraskelsen bevares.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <span>Opret din ønskeliste gratis</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <Link
            href="/w/min-foedselsdag"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 rounded-2xl font-semibold shadow-xs hover:border-stone-300 transition-all flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4 text-stone-500" />
            <span>Se eksempel-ønskeliste</span>
          </Link>
        </div>

        {/* Quick Highlights */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-4 bg-white/70 backdrop-blur rounded-2xl border border-stone-200/80 shadow-xs">
            <Zap className="w-5 h-5 text-amber-500 mb-2" />
            <h4 className="text-sm font-semibold text-stone-900">Lyn-import</h4>
            <p className="text-xs text-stone-500 mt-1">Sæt et link ind, så hentes billede, pris og titel automatisk.</p>
          </div>

          <div className="p-4 bg-white/70 backdrop-blur rounded-2xl border border-stone-200/80 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="text-sm font-semibold text-stone-900">Hemmelige gaver</h4>
            <p className="text-xs text-stone-500 mt-1">Gæster reserverer, men du kan ikke se hvad der er købt.</p>
          </div>

          <div className="p-4 bg-white/70 backdrop-blur rounded-2xl border border-stone-200/80 shadow-xs">
            <Smartphone className="w-5 h-5 text-sky-600 mb-2" />
            <h4 className="text-sm font-semibold text-stone-900">Intet app-krav</h4>
            <p className="text-xs text-stone-500 mt-1">Gæster behøver ingen bruger eller app for at se og reservere.</p>
          </div>

          <div className="p-4 bg-white/70 backdrop-blur rounded-2xl border border-stone-200/80 shadow-xs">
            <QrCode className="w-5 h-5 text-purple-600 mb-2" />
            <h4 className="text-sm font-semibold text-stone-900">QR-kode deling</h4>
            <p className="text-xs text-stone-500 mt-1">Download QR-kode direkte til dine fysiske invitationer.</p>
          </div>
        </div>
      </section>

      {/* Comparison: Why Wishes is better */}
      <section className="bg-white border-y border-stone-200/70 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Hvorfor et enklere alternativ til Ønskeskyen?
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2">
              Vi har fjernet alt det unødvendige og fokuseret 100% på det, der betyder noget: dine ønsker.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
              <h3 className="text-base font-bold text-stone-700 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                Klassiske ønskeliste-apps (Ønskeskyen m.fl.)
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Fyldt med sponsorerede affiliate-reklamer og brands</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Presser bedsteforældre og gæster til at oprette konti og hente apps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Tung og langsom indlæsning fyldt med bannere</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Uoverskueligt flow hvis man bare vil skrive et enkelt ønske</span>
                </li>
              </ul>
            </div>

            {/* Our Way */}
            <div className="p-6 rounded-3xl bg-amber-50/40 border border-amber-200/80 shadow-soft space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Vores Wishes Web App
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>100% fri for reklamer</strong> og sponsoreret støj</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Gæster klikker bare på et link</strong> og reserverer gaven på 2 sekunder</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Supabase & Vercel</strong> drevet for lynhurtig performance og sikkerhed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Smart link-scraper</strong> udfylder billede, pris og butik automatisk</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 hover:text-stone-700 underline underline-offset-4"
            >
              <span>Gå direkte til dine ønskelister</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Create Modal */}
      <CreateListModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateList}
      />
    </div>
  );
}
