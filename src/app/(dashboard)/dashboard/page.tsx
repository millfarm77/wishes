'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Calendar, Gift, Share2, Trash2, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { WishStore } from '@/lib/store';
import { Wishlist } from '@/lib/types';
import { CreateListModal } from '@/components/wishlist/CreateListModal';
import { ShareModal } from '@/components/wishlist/ShareModal';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [shareList, setShareList] = useState<Wishlist | null>(null);

  const loadLists = async () => {
    try {
      const data = await WishStore.getWishlists();
      setWishlists(data);
    } catch (err) {
      console.error('Failed to load wishlists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
    if (searchParams.get('create') === 'true') {
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  const handleCreate = async (data: Partial<Wishlist>) => {
    const created = await WishStore.createWishlist(data);
    await loadLists();
    return created;
  };

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Er du sikker på at du vil slette "${title}"?`)) {
      await WishStore.deleteWishlist(id);
      await loadLists();
    }
  };

  const calculateDaysLeft = (dateStr: string | null) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'I dag! 🎉';
    if (diffDays < 0) return 'Afholdt';
    if (diffDays === 1) return 'I morgen';
    return `Om ${diffDays} dage`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Mine Ønskelister
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Administrer dine lister, tilføj ønsker og del med familie og venner
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Opret ny ønskeliste</span>
        </button>
      </div>

      {/* Lists Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-stone-200/60 rounded-3xl" />
            ))}
          </div>
        ) : wishlists.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/70 p-8 space-y-4">
            <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-stone-400">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-stone-900 text-lg">Ingen ønskelister endnu</h3>
            <p className="text-stone-500 text-sm max-w-sm mx-auto">
              Opret din første liste til din fødselsdag, juleaften eller en særlig mærkedag.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Opret første liste</span>
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlists.map((list) => {
              const daysLeft = calculateDaysLeft(list.event_date);
              return (
                <div
                  key={list.id}
                  className="group relative bg-white rounded-3xl border border-stone-200/90 shadow-soft hover:shadow-float hover:border-stone-300 transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Top theme banner */}
                  <div className={`h-24 p-5 flex items-start justify-between theme-${list.cover_theme || 'nordic'}`}>
                    {daysLeft && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-stone-800 shadow-xs">
                        <Calendar className="w-3 h-3 text-stone-500" />
                        {daysLeft}
                      </span>
                    )}
                    <div className="ml-auto flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShareList(list);
                        }}
                        className="p-1.5 bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 rounded-xl shadow-xs transition-colors"
                        title="Del liste"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(list.id, list.title, e)}
                        className="p-1.5 bg-white/80 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-xl shadow-xs transition-colors"
                        title="Slet liste"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/lists/${list.id}`} className="block">
                        <h2 className="text-lg font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                          {list.title}
                        </h2>
                      </Link>
                      {list.description && (
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                          {list.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                        <Gift className="w-3.5 h-3.5 text-stone-400" />
                        <span>{list.wishes_count || 0} ønsker</span>
                      </div>

                      <Link
                        href={`/lists/${list.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:underline"
                      >
                        <span>Åbn liste</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateListModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />

      {/* Share Modal */}
      {shareList && (
        <ShareModal
          slug={shareList.slug}
          title={shareList.title}
          isOpen={Boolean(shareList)}
          onClose={() => setShareList(null)}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12 animate-pulse h-64 bg-stone-100 rounded-3xl" />}>
      <DashboardContent />
    </Suspense>
  );
}
