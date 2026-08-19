---
title: "Aksesibilitas"
description: "Apa yang dituju situs ini, apa yang diuji secara otomatis, dan apa yang harus dilakukan bila sesuatu tidak bekerja untuk Anda."
order: 6
updatedAt: '2026-01-15'
---

Situs ini menuju **WCAG 2.2 tingkat AA**. Bagian-bagian yang dapat diuji secara otomatis diuji pada setiap pembangunan, dan pembangunan gagal bila ada kemunduran.

## Apa yang ditegakkan oleh pembangunan

- **Kontras warna.** Setiap pasangan teks diperiksa terhadap rasio 4,5:1 dan setiap penanda fokus terhadap 3:1, baik pada tema terang maupun gelap. Palet dibaca dari lembar gaya alih-alih digandakan di dalam uji, jadi mengubah sebuah warna dengan sendirinya menjalankan pemeriksaan.
- **Semantik markah.** Linter menjalankan aturan aksesibilitas atas setiap komponen: label yang hilang, ARIA yang tidak sah, dan elemen non-interaktif yang membawa penangan akan menggagalkan pembangunan.
- **Tanpa luapan mendatar**, termasuk pada tata letak kanan-ke-kiri bahasa Arab, diperiksa di peramban sungguhan.

## Keputusan perancangan

- **Warna tidak pernah menjadi satu-satunya isyarat.** Jam kerja di perencana rapat membawa garis tepi selain isian; peringatan waktu musim panas berupa kata, bukan sekadar rona kuning.
- **Hasil mengumumkan dirinya sendiri.** Setiap area hasil bersifat `aria-live="polite"`, sehingga sebuah konversi dibacakan ketika berubah alih-alih harus dicari.
- **Setiap isian punya label sungguhan.** Tidak ada tempat di mana teks contoh berperan sebagai label.
- **Gerak menghormati preferensi Anda.** Dengan `prefers-reduced-motion` aktif, animasi dan penggeseran halus dimatikan.
- **Ia bekerja tanpa JavaScript.** Setiap selisih, tanggal pergantian, tabel rujukan, dan penjelasan ada di halaman yang sudah dibuat lebih dulu. Hanya jam langsung dan perkakas interaktif yang butuh skrip, dan kendali yang tidak akan bekerja tanpanya disembunyikan alih-alih ditampilkan mati.
- **Waktu ditulis dengan huruf berjarak tetap dan angka tabular**, supaya kolom sejajar dan digit yang berdetak tidak pernah menggeser teks di sebelahnya.

## Batasan yang diketahui

- Pita 24 jam di perencana rapat adalah tabel yang lebar. Ia bergeser mendatar di dalam wadahnya sendiri alih-alih ditata ulang, sebab pita yang ditata ulang berhenti terbaca sebagai bentuk. Informasi yang sama tersedia sebagai teks pada ringkasan di atasnya.
- Pengujian otomatis hanya menangkap sebagian kecil masalah aksesibilitas. Kalau ada yang tidak bekerja untuk Anda di sini, itu cacat dan kami ingin tahu.

## Memberi tahu kami

Kirim surel ke alamat di [halaman kontak](/id/contact/) dengan menyebut halamannya dan apa yang gagal. Laporan tentang teknologi bantu sangat berguna, karena itulah hal yang paling sulit diuji tanpa teknologinya ada di hadapan kami.
