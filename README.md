# Wishes 🎁

> En enkel, smuk og lynhurtig digital ønskeliste – det moderne alternativ til Ønskeskyen (GoWish), helt uden reklamer og sponsoreret støj.

Bygget med **Next.js 15 (App Router)**, **Tailwind CSS**, **Supabase** (PostgreSQL + RLS) og klar til direkte udrulning på **Vercel**.

---

## 🌟 Nøglefunktioner (Inspireret af Ønskeskyen, men enklere)

1. **Lynhurtig Link-Scraper**: Sæt et link ind fra en vilkårlig webshop (f.eks. Matas, Elgiganten, Magasin, Zalando, Amazon, m.fl.), og appen henter automatisk titel, billede, pris og butiksnavn.
2. **Hemmelig Gave-Reservation**: Gæster kan med ét klik reservere en gave, så ingen køber det samme. Modtageren kan *ikke* se reservationerne (medmindre de vælger det), så overraskelsen på dagen bevares!
3. **Ingen Bruger/App-krav for Gæster**: Familie og venner behøver ikke oprette en konto eller hente en app. De åbner blot linket i browseren på telefonen eller computeren.
4. **QR-kode og Nem Deling**: Generer direkte printbare QR-koder til fysiske invitationer eller del via WhatsApp, iMessage og e-mail.
5. **100% Fri for Reklamer**: Ingen affiliate-bannere, popups eller påtrængende sponsorerede produkter.
6. **Out-of-the-box Demo Mode**: Appen virker lokalt med det samme med en indbygget demo-tilstand, så du kan teste hele oplevelsen uden at skulle oprette en database først.

---

## 🚀 Hurtig Start (Lokal kørsel)

### 1. Klon eller åbn mappen
```bash
npm install
```

### 2. Start udviklingsserveren
```bash
npm run dev
```
Åbn [http://localhost:3000](http://localhost:3000) i din browser.

---

## 🗄️ Forbind til Supabase

Når du er klar til at bruge en rigtig database i produktion:

1. Opret et gratis projekt på [Supabase](https://supabase.com).
2. Gå til **SQL Editor** i Supabase dashboardet.
3. Kopiér indholdet af `supabase/schema.sql` og kør det for at oprette tabellerne (`wishlists`, `wishes`, `reservations`, `profiles`) og Row Level Security (RLS) politikkerne.
4. *(Valgfrit)* Kør `supabase/seed.sql` hvis du ønsker eksempeldata.
5. Kopier dine API nøgler fra **Project Settings -> API** og tilføj dem i `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dit-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-supabase-anon-key
```

---

## ☁️ Udrulning til Vercel

Dette projekt er optimeret til Vercel:

1. Push dit repository til GitHub.
2. Gå til [Vercel](https://vercel.com) og importér dit repository.
3. Tilføj følgende Environment Variables under projektindstillingerne i Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy**!

---

## 📁 Projektstruktur

```
wishes/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx      # Oversigt over brugerens lister
│   │   │   └── lists/[id]/page.tsx     # Ejerens visning og redigering af en liste
│   │   ├── w/[slug]/page.tsx           # Offentlig gæstevisning med reservationsflow
│   │   ├── api/scrape/route.ts         # Server-side OpenGraph metadata scraper
│   │   ├── globals.css                 # Nordisk styling & temaer
│   │   ├── layout.tsx                  # Root layout med navigation
│   │   └── page.tsx                    # Landing page
│   ├── components/
│   │   ├── wishlist/
│   │   │   ├── WishCard.tsx            # Ønske-kort med priser, butikker og status
│   │   │   ├── AddWishModal.tsx        # Smart link-import & manuel oprettelse
│   │   │   ├── ReserveModal.tsx        # Gæstereservation med konfetti
│   │   │   ├── ShareModal.tsx          # QR-kode, kopier link & Web Share
│   │   │   └── CreateListModal.tsx     # Opret ny liste med dato og tema
│   │   └── Navbar.tsx                  # Header med Supabase/Demo indikator
│   └── lib/
│       ├── store.ts                    # Universal data layer (Supabase + Demo)
│       ├── scraper.ts                  # Web scraping logik for webshops
│       ├── types.ts                    # TypeScript modeller
│       └── supabase/client.ts          # Supabase browser klient
├── supabase/
│   ├── schema.sql                      # Komplet PostgreSQL schema & RLS
│   └── seed.sql                        # Testdata
├── vercel.json                         # Vercel konfiguration
└── package.json
```

---

## 📄 Licens
MIT
