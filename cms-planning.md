# CMS Planning — Home, Hall of Fame, Activities

## Scope Tugas

Mengintegrasikan tiga halaman berikut agar data-nya bersumber dari Supabase (bukan hardcode) dan dapat dikelola admin melalui admin panel yang terhubung via tRPC:

| Halaman | Status Sekarang | Target |
|---|---|---|
| **Home** | Static di `src/data/landing-content.ts` | Dynamic via Supabase + tRPC |
| **Hall of Fame** | Static di `src/lib/hall-of-fame.ts` | Dynamic via Supabase + tRPC |
| **Activities** | File-based Markdown di `content/activities/` | Dynamic via Supabase + tRPC |

---

## 1. Database Schema (Supabase)

### Tabel `home_hero_slides`
> Mengelola foto background Hero section

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | auto-generated |
| `src` | `text` | URL gambar (dari Supabase Storage) |
| `alt` | `text` | Alt text gambar |
| `order` | `int2` | Urutan tampil slide |
| `created_at` | `timestamptz` | auto |

### Tabel `home_success_stats`
> Angka/teks di bagian "Our Success Stories"

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | auto-generated |
| `label` | `text` | e.g. "Departments", "Executive Members" |
| `value` | `text` | e.g. "9", "70", "5+" |
| `accent` | `text` | "black" atau "primary" |
| `order` | `int2` | Urutan tampil |

### Tabel `home_departments`
> Gambar + data tiap departemen di section departements

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | auto-generated |
| `title` | `text` | Nama departemen |
| `description` | `text` | Deskripsi departemen |
| `img` | `text` | URL gambar (Supabase Storage) |
| `order` | `int2` | Urutan tampil |

### Tabel `hall_of_fame`
> Pencapaian dikelompokkan per tahun

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | auto-generated |
| `year` | `text` | e.g. "2024", "2025" |
| `title` | `text` | Judul pencapaian e.g. "Juara 1" |
| `description` | `text` | Nama lomba / deskripsi pencapaian |
| `image` | `text` | URL gambar (Supabase Storage) |
| `created_at` | `timestamptz` | auto |

### Tabel `activities`
> Pengganti sistem markdown file

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` PK | auto-generated |
| `slug` | `text` UNIQUE | URL slug (generate dari title) |
| `title` | `text` | Judul aktivitas |
| `description` | `text` | Deskripsi singkat (excerpt) |
| `content` | `text` | Konten lengkap (rich text / markdown) |
| `cover_image` | `text` | URL gambar (Supabase Storage) |
| `category` | `text` | ENUM: `EVENT`, `INFORMATION`, `ARTICLE` |
| `created_at` | `timestamptz` | Auto-generated (tanggal upload) |

---

## 2. Supabase Storage Buckets

| Bucket | Konten |
|---|---|
| `hero-slides` | Foto slide hero home |
| `department-images` | Foto departemen home |
| `hall-of-fame` | Foto pencapaian |
| `activities` | Cover image aktivitas |

Semua bucket: **public read**, authenticated write.

---

## 3. tRPC Routers

### File Structure
```
src/trpc/routers/
  _app.ts           ← root router (update merge)
  home.ts           ← router untuk home
  hall-of-fame.ts   ← router untuk hall of fame
  activities.ts     ← router untuk activities
```

### `home.ts` — Procedures

| Procedure | Type | Keterangan |
|---|---|---|
| `getHeroSlides` | query | Ambil semua slide terurut |
| `getSuccessStats` | query | Ambil 4 stats |
| `getDepartments` | query | Ambil semua departemen |
| `updateHeroSlide` | mutation | Update/add/delete slide |
| `updateSuccessStat` | mutation | Update nilai stat |
| `updateDepartment` | mutation | Update data/gambar departemen |

### `hall-of-fame.ts` — Procedures

| Procedure | Type | Keterangan |
|---|---|---|
| `getYears` | query | Ambil list tahun unik |
| `getByYear` | query | Ambil entries berdasarkan `year` |
| `getAll` | query | Ambil semua entries (admin) |
| `create` | mutation | Tambah entry baru |
| `update` | mutation | Update entry |
| `delete` | mutation | Hapus entry |

### `activities.ts` — Procedures

| Procedure | Type | Keterangan |
|---|---|---|
| `getAll` | query | Ambil semua (support filter category + search) |
| `getBySlug` | query | Ambil satu aktivitas by slug |
| `getLatestByCategory` | query | Untuk section Updates di home |
| `create` | mutation | Buat aktivitas baru |
| `update` | mutation | Update aktivitas |
| `delete` | mutation | Hapus aktivitas |

---

## 4. File yang Perlu Dibuat / Diubah

### Baru (Create)
```
src/lib/supabase/
  client.ts             ← Supabase browser client
  server.ts             ← Supabase server client (SSR)

src/trpc/routers/
  home.ts
  hall-of-fame.ts
  activities.ts

src/app/admin/
  layout.tsx            ← layout admin (sidebar + auth guard)
  page.tsx              ← redirect ke /admin/home
  home/page.tsx         ← CMS Home
  hall-of-fame/page.tsx ← CMS Hall of Fame
  activities/page.tsx   ← CMS Activities list
  activities/new/page.tsx  ← Form tambah aktivitas
  activities/[id]/page.tsx ← Form edit aktivitas
```

### Diubah (Modify)
```
src/trpc/routers/_app.ts      ← merge 3 router baru
src/trpc/init.ts              ← tambah Supabase ke context

src/lib/hall-of-fame.ts       ← hapus static data, ganti dengan tRPC call
src/lib/activities.ts         ← hapus file-based logic, ganti dengan tRPC call

src/app/hall-of-fame/page.tsx ← fetch dari tRPC bukan static
src/app/activities/page.tsx   ← fetch dari tRPC bukan static
src/app/activities/[slug]/page.tsx ← fetch dari tRPC

src/components/landing/sections/Hero.tsx       ← heroSlides dari tRPC
src/components/landing/sections/SuccessStats.tsx ← stats dari tRPC
src/components/landing/sections/Departements.tsx ← data dari tRPC
src/components/landing/sections/Updates.tsx    ← fetch dari tRPC activities
src/data/landing-content.ts  ← hapus heroSlides, successStats, departements
```

---

## 5. Urutan Pengerjaan

### Phase 1 — Setup Backend
1. [ ] Setup Supabase client (`src/lib/supabase/client.ts` & `server.ts`)
2. [ ] Buat tabel di Supabase (SQL migration)
3. [ ] Seed data awal dari static files ke Supabase
4. [ ] Update `src/trpc/init.ts` — inject Supabase ke context
5. [ ] Buat `src/trpc/routers/activities.ts` + merge ke `_app.ts`
6. [ ] Buat `src/trpc/routers/hall-of-fame.ts` + merge ke `_app.ts`
7. [ ] Buat `src/trpc/routers/home.ts` + merge ke `_app.ts`

### Phase 2 — Update Public Pages
8. [ ] Update `src/app/activities/page.tsx` — fetch dari tRPC
9. [ ] Update `src/app/activities/[slug]/page.tsx` — fetch dari tRPC
10. [ ] Update `src/app/hall-of-fame/page.tsx` — fetch dari tRPC
11. [ ] Update `src/components/landing/sections/Hero.tsx` — heroSlides dari tRPC
12. [ ] Update `src/components/landing/sections/SuccessStats.tsx` — stats dari tRPC
13. [ ] Update `src/components/landing/sections/Departements.tsx` — data dari tRPC
14. [ ] Update `src/components/landing/sections/Updates.tsx` — activities dari tRPC

### Phase 3 — Admin Panel
15. [ ] Buat layout admin (`src/app/admin/layout.tsx`) dengan sidebar
16. [ ] Buat halaman CMS Activities (list, form create, form edit)
17. [ ] Buat halaman CMS Hall of Fame (list per tahun, form create/edit)
18. [ ] Buat halaman CMS Home (hero slides, stats, departements)

---

## 6. Catatan Teknis

### Supabase Storage — Upload Flow (Admin)
1. Admin pilih file di form
2. Client upload langsung ke Supabase Storage (`supabase.storage.from(bucket).upload(...)`)
3. Ambil public URL dari response
4. URL disimpan ke field `image`/`cover_image`/`src` via tRPC mutation

### Slug Generation (Activities)
- Auto-generate dari `title` saat `create`
- Format: lowercase, spasi → `-`, strip karakter non-alphanumeric
- Contoh: `"Workshop UI/UX 2025"` → `"workshop-ui-ux-2025"`

### tRPC Context dengan Supabase
```ts
// src/trpc/init.ts
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const supabase = createServerClient(/* ... */);
  return { supabase };
};
```

### Protected Mutations (Admin Only)
- Semua procedure `create`, `update`, `delete` harus dicek auth via Supabase session
- Public query (`getAll`, `getBySlug`, dll) tidak perlu auth
- Buat `adminProcedure` yang extend `baseProcedure` dengan middleware auth check

### Env Variables yang Dibutuhkan
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   ← untuk server-side admin operations
```
