import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Wishes — Enkel og smuk ønskeliste",
  description: "Opret og del dine ønskelister uden reklamer og besvær. Reserver gaver i hemmelighed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body className="min-h-screen flex flex-col bg-[#fafaf8] text-stone-900 antialiased selection:bg-amber-100 selection:text-stone-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200/60 py-8 bg-white/50 text-center text-xs text-stone-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Wishes. Bygget med Next.js, Supabase og Vercel.</p>
            <div className="flex items-center gap-6">
              <span>Ingen reklamer</span>
              <span>•</span>
              <span>Hemmelige reservationer</span>
              <span>•</span>
              <span>100% gratis</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
