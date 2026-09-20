'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, Plus, Sparkles, Database, Check } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export function Navbar() {
  const [configured, setConfigured] = useState<boolean>(true);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    setConfigured(isSupabaseConfigured());
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5 text-amber-200" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-stone-900 flex items-center gap-1.5">
              Wishes <span className="text-xs font-normal text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">Enkel & fri for reklamer</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Supabase status badge */}
            <button
              onClick={() => setShowStatusModal(true)}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                configured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title="Database status"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{configured ? 'Supabase forbundet' : 'Lokal Demo Mode'}</span>
            </button>

            <Link
              href="/dashboard"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg transition-colors"
            >
              Mine Lister
            </Link>

            <Link
              href="/dashboard?create=true"
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 rounded-xl shadow-sm transition-all hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ny Ønskeliste</span>
              <span className="sm:hidden">Ny</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Supabase Connection Info Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-modal border border-stone-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-stone-700" />
                <h3 className="font-semibold text-stone-900 text-lg">
                  {configured ? 'Supabase er forbundet' : 'Databaseopsætning'}
                </h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                ✕
              </button>
            </div>

            {configured ? (
              <div className="text-sm text-stone-600 space-y-2">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Din app er forbundet direkte til Supabase PostgreSQL med Row Level Security!</span>
                </div>
                <p>Nye lister og reservationer gemmes direkte i din rigtige Supabase database.</p>
              </div>
            ) : (
              <div className="text-sm text-stone-600 space-y-3">
                <p>
                  Appen kører lige nu i <strong>Lokal Demo Mode</strong> via browseren, så du kan prøve hele oplevelsen (oprette lister, hente links med scraper og reservere gaver) med det samme!
                </p>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono space-y-1">
                  <p className="text-stone-500 font-sans font-medium mb-1">For at aktivere din Supabase database:</p>
                  <p>1. Opret gratis projekt på <span className="text-blue-600">supabase.com</span></p>
                  <p>2. Kør SQL fra <span className="text-amber-800">supabase/schema.sql</span></p>
                  <p>3. Indsæt URL og Anon Key i <span className="text-amber-800">.env.local</span></p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Luk
            </button>
          </div>
        </div>
      )}
    </>
  );
}
