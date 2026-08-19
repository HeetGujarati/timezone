---
title: "ISO 8601, dan cara menulis tanggal tanpa makna ganda"
description: "03/04/2026 berarti dua tanggal berbeda tergantung siapa yang membacanya. ISO 8601 membereskannya, dan aturannya layak diketahui persis."
summary: "ISO 8601 ada karena 03/04/2026 berarti Maret di Amerika dan April di tempat lain. Menulis 2026-04-03 menghapus makna gandanya, terurut benar sebagai teks, dan itulah yang seharusnya diterima setiap antarmuka."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 7
keywords: ['iso 8601', 'standar format tanggal', 'format cap waktu', 'rfc 3339']
related: ['what-utc-really-is', 'time-zones-in-code', 'the-2038-problem']
---

`03/04/2026` adalah 3 April di sebagian besar dunia dan 4 Maret di Amerika Serikat. Tidak ada cara mengetahui mana yang dimaksud hanya dari untaian itu, dan kedua pembacaan sama-sama masuk akal. Setiap tahun makna ganda ini menghasilkan tenggat yang terlewat, pemesanan ganda, dan setidaknya satu gangguan yang membekas.

ISO 8601 adalah standar internasional yang menghapusnya.

## Bentuk intinya

```
2026-04-03T14:30:00Z
```

Dibaca dari kiri ke kanan, dari satuan terbesar ke terkecil:

- `2026-04-03` — tahun, bulan, hari, masing-masing berimbuhan nol, selalu dalam urutan itu
- `T` — pemisah antara tanggal dan waktu, wajib dalam bentuk ketatnya
- `14:30:00` — jam, menit, detik pada jam 24 jam
- `Z` — penanda zona. `Z` berarti UTC persis

Urutannya itulah pokoknya. Karena komponennya berjalan dari yang paling berarti ke yang paling tidak, **untaian ISO 8601 terurut dengan benar sebagai teks biasa**. `2026-04-03` mendahului `2026-04-10` dalam perbandingan untaian sederhana, sesuatu yang tak dicapai bentuk umum mana pun. Sifat itu saja sudah membenarkan keberadaan standarnya.

## Penanda zona

Tiga bentuk sah, dan ketiganya berarti hal yang berbeda:

| Bentuk                      | Arti                                                                   |
| --------------------------- | ---------------------------------------------------------------------- |
| `2026-04-03T14:30:00Z`      | 14.30 UTC. Tanpa makna ganda                                            |
| `2026-04-03T14:30:00+05:45` | 14.30 waktu setempat di zona 5 jam 45 menit di depan UTC. Tanpa makna ganda |
| `2026-04-03T14:30:00`       | 14.30 di zona yang tidak disebut. **Bukan cap waktu**                   |

Bentuk ketiga itulah yang menimbulkan masalah. Ia adalah _tanggal-waktu setempat_: bacaan jam dinding tanpa cara apa pun untuk menempatkannya pada sebuah garis waktu. Mengoperkannya melewati batas sistem sambil berharap pihak seberang menganggap zona yang sama dengan Anda adalah cacat yang sedang menunggu penggelaran di wilayah lain.

Perhatikan juga apa yang bukan selisih: `+05:45` memberi tahu Anda selisih Nepal, bukan bahwa cap waktunya berasal dari Nepal. Selisih bukan zona — selisih yang sama dipakai bersama oleh beberapa zona, dan selisih sebuah zona berubah. Bawalah pengenalnya di sebelahnya bila Anda perlu tahu di mana.

## RFC 3339, profil yang mungkin Anda inginkan

ISO 8601 itu luas. Ia mengizinkan tanggal pekan (`2026-W14-5`), tanggal ordinal (`2026-093`), satuan pecahan, dan bentuk terpotong yang membuang abadnya. Hampir semua itu bukan yang Anda inginkan dalam sebuah antarmuka.

RFC 3339 adalah profil yang diperketat untuk protokol internet. Ia mensyaratkan tanggal lengkap, mensyaratkan penanda zona, dan mengizinkan `T` maupun spasi sebagai pemisah. Ketika orang berkata “format ISO” dalam konteks API, hampir selalu yang dimaksud adalah RFC 3339.

**Kaidah yang berguna:** terimalah apa pun yang bisa ditelan pengurai yang baik; keluarkan hanya RFC 3339 yang ketat dengan `Z`.

## Durasi dan selang

Lebih jarang dipakai, dan baik diketahui saat Anda menjumpainya.

**Durasi** diawali `P` dari «period», dan `T` memisahkan bagian tanggal dari bagian waktu:

- `P3Y6M4D` — tiga tahun, enam bulan, empat hari
- `PT1H30M` — satu jam tiga puluh menit
- `P1DT12H` — satu hari dua belas jam

Huruf `T` tidak boleh dilewat: `P1M` adalah satu bulan, `PT1M` adalah satu menit. Inilah cacat klasik durasi ISO 8601.

**Selang** menyambungkan dua titik dengan garis miring: `2026-04-03T14:00Z/2026-04-03T16:00Z`, atau sebuah titik dan sebuah durasi: `2026-04-03T14:00Z/PT2H`.

Data terstruktur `HowTo` di situs ini memakai sintaks durasi — `PT2M` untuk tugas dua menit — karena schema.org menetapkan durasi ISO 8601.

## Tanggal pekan, dan jebakan di dalamnya

`2026-W14-5` adalah Jumat pada pekan ISO keempat belas tahun 2026. Pekan ISO dimulai hari Senin, dan pekan 1 adalah pekan yang memuat Kamis pertama bulan Januari.

Akibat yang membuat orang tersandung: **tahun pekan ISO tidak selalu sama dengan tahun kalender.** 1 Januari 2027 jatuh pada pekan ISO ke-53 tahun 2026. Kode pemformatan yang memasangkan nomor pekan ISO dengan tahun kalender menghasilkan tanggal yang salah selama beberapa hari tiap tahun — dan di sebagian besar bahasa penanda formatnya nyaris serupa (`YYYY` lawan `GGGG`, atau `%Y` lawan `%G`).

## Kaidah praktis

1. **Simpan dalam UTC, keluarkan dengan `Z`.** `2026-04-03T14:30:00Z` punya tepat satu arti di mana pun.
2. **Jangan pernah mengeluarkan tanggal-waktu setempat telanjang melewati sebuah batas.** Kalau Anda tidak bisa melekatkan zona, Anda tidak punya cap waktu.
3. **Berimbuhan nol untuk semuanya.** `2026-4-3` bukan ISO 8601 yang sah, sekalipun kebanyakan pengurai menerimanya.
4. **Pakai pemisah `-` dan `:`.** Bentuk padatnya (`20260403T143000Z`) sah tetapi tidak ramah, dan sebagian pengurai menolaknya.
5. **Simpan pengenal zona secara terpisah** ketika Anda perlu tahu _di mana_, bukan sekadar _selisih berapa_. `Europe/London` selamat dari perubahan aturan; `+01:00` tidak.

## Jebakan saat mengurai

Bahkan dengan sebuah standar, penguraianlah tempat segalanya melenceng.

**Konstruktor `Date` JavaScript tidak konsisten untuk masukan non-ISO.** `new Date('2026-04-03')` diurai sebagai tengah malam UTC. `new Date('2026-04-03T00:00:00')` — tanpa penanda zona — diurai sebagai tengah malam _setempat_. Keduanya berbeda sebesar selisih Anda, artinya kode yang sama menghasilkan hari berbeda tergantung di mana ia berjalan. Selalu sertakan penanda zona.

**Tahun dua digit bermakna ganda dan seharusnya ditolak.** ISO 8601 mengizinkan bentuk terpotong; hampir tidak ada yang seharusnya menerimanya. `26-04-03` bisa 1926 bisa 2026, dan jendela geser yang memutuskannya adalah keputusan kebijakan yang bersembunyi di dalam sebuah pengurai.

**Ketelitian pecahan detik berbeda-beda.** `14:30:00.5`, `14:30:00.500`, dan `14:30:00.500000` semuanya sah dan semuanya saat yang sama. Pengurai yang membandingkan untaian alih-alih saat akan berselisih.

**Koma itu sah.** ISO 8601 mengizinkan `14:30:00,5` — koma desimal — dan bahkan lebih menyukainya. Kebanyakan pengurai menolaknya. Kalau Anda menyantap data dari sistem Eropa, bersiaplah.

**Tengah malam punya dua ejaan.** `24:00:00` pada satu hari adalah saat yang sama dengan `00:00:00` pada hari berikutnya, dan keduanya ISO 8601 yang sah. Keluarkan bentuk kedua; terima keduanya.

## Catatan tentang pengurutan

Keterurutan ISO 8601 hanya berlaku untuk untaian dengan perwakilan zona yang sama. `2026-04-03T14:00:00Z` dan `2026-04-03T10:00:00-05:00` adalah saat yang sama, tetapi sebagai untaian yang kedua terurut lebih dulu.

Kalau Anda mengurutkan cap waktu sebagai teks — dalam berkas log, dalam nama berkas, dalam kolom basis data bertipe teks — normalkan semuanya lebih dulu ke UTC dengan `Z`. Kalau tidak, urutannya menjadi sifat pemformatan, bukan sifat waktu.
