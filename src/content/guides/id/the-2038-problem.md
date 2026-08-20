---
title: 'Masalah 2038, dijelaskan sebagaimana mestinya'
description: 'Pada 03:14:07 UTC, 19 Januari 2038, waktu Unix 32 bit bertanda meluap. Inilah yang benar-benar rusak dan apa yang sudah diperbaiki.'
summary: 'Sistem yang menyimpan waktu sebagai hitungan detik 32 bit bertanda kehabisan ruang pada Januari 2038 dan melompat ke Desember 1901. Hampir semua platform modern sudah memperbaikinya bertahun-tahun lalu; paparan yang tersisa ada pada perangkat tertanam, sistem lama, dan data terserialisasi.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 6
keywords: ['masalah 2038', 'bug tahun 2038', 'luapan stempel waktu unix', 'y2038']
related: ['time-zones-in-code', 'iso-8601-explained', 'what-utc-really-is']
---

Pada 03:14:07 UTC, 19 Januari 2038, jumlah detik sejak 1 Januari 1970 mencapai 2.147.483.647. Itulah nilai terbesar yang dapat ditampung bilangan bulat 32 bit bertanda. Satu detik kemudian nilainya berbalik menjadi −2.147.483.648, yang dibaca sistem tersebut sebagai 13 Desember 1901.

Ini masalah nyata dengan tanggal yang pasti, dan justru itulah yang membuatnya tidak lazim di antara masalah perangkat lunak.

## Mengapa 32 bit

Waktu Unix dirancang pada awal 1970-an, ketika bilangan bulat 32 bit adalah ukuran kata yang wajar dan kelonggaran 68 tahun terasa berlimpah. Tipe `time_t` pada sistem itu adalah bilangan bulat 32 bit bertanda, dan pilihan tersebut menyebar ke bahasa C, ke setiap bahasa yang membungkus C, ke format berkas, ke protokol jaringan, dan ke skema basis data.

Tandanya itulah yang memberi luapan gejala khasnya. Hitungan 32 bit tanpa tanda akan bertahan sampai 2106; yang bertanda membelah jangkauannya di sekitar 1970, sehingga luapan mendarat di 1901, bukan di nol.

## Apa yang sudah terjadi

Masalah 2038 sudah bertahun-tahun menimbulkan kegagalan di lingkungan produksi, karena perangkat lunak rutin menghitung tanggal di masa depan.

- Perhitungan kredit rumah tiga puluh tahun mulai melewati batas itu pada 2008.
- Tanggal kedaluwarsa sertifikat, masa hidup singgahan, dan tugas terjadwal berulang kali menabraknya.
- Pada 2006 sebuah kutu pada batas waktu basis data bawaan AOLserver — disetel ke satu miliar detik, yang baik-baik saja sampai tidak lagi — menjatuhkan perangkat lunak itu ketika waktu kedaluwarsa hasil hitungan meluap.

Polanya: kegagalan datang jauh sebelum tanggalnya, di bagian kode mana pun yang memandang paling jauh ke depan.

## Apa yang sudah diperbaiki

Keadaannya jauh lebih baik daripada yang disiratkan kepanikan.

- **Sistem 64 bit**: `time_t` berukuran 64 bit di hampir setiap platform 64 bit. Itu habis dalam kira-kira 292 miliar tahun.
- **Linux di 32 bit**: kernel 5.6 (Maret 2020) memperkenalkan `time_t` 64 bit pada arsitektur 32 bit, dan distribusi besar telah merilis ruang pengguna yang bersesuaian.
- **JavaScript**: memakai bilangan pecahan presisi ganda untuk milidetik, sahih sekitar 275.000 tahun di kedua sisi 1970. Bahasa ini tidak pernah punya masalah tersebut.
- **Java**: `Instant` memakai hitungan detik 64 bit ditambah nanodetik.
- **Python**: bilangan bulatnya berpresisi sembarang; kendalanya ada pada pustaka C platform.
- **PostgreSQL, MySQL 8.0.28+, SQL Server**: penyimpanan stempel waktu 64 bit.

## Di mana paparannya masih ada

**Sistem tertanam.** Pengendali industri, alat kesehatan, elektronik kendaraan, meteran dan sensor — banyak dirancang untuk masa pakai dua puluh atau tiga puluh tahun, banyak tanpa jalur pembaruan, banyak sudah terpasang. Di sinilah bagian terbesar risiko sesungguhnya, dan tidak ada pendataan terpusat untuknya.

**Tipe `TIMESTAMP` MySQL sebelum 8.0.28.** Ia hitungan detik 32 bit dan batas maksimum terdokumentasinya adalah 2038-01-19 03:14:07. `DATETIME` tidak pernah terpengaruh. Sangat banyak data produksi berada di tipe kolom yang terpapar itu.

**Data terserialisasi dan format berkas.** Apa pun yang pernah menulis medan waktu 32 bit tetap menjadi medan waktu 32 bit, sebaru apa pun pembacanya. Format arsip lama, protokol biner, dan struktur di cakram membawa kendala itu terus maju.

**Bangunan 32 bit yang masih bertugas.** Sebagian perute, dekoder siaran, dan perangkat berumur panjang menjalankan ruang pengguna 32 bit di atas kernel yang belum ditambal.

## Apa yang harus dilakukan

**Audit tipe penyimpanan.** Cari kolom `int(11)` yang menyimpan stempel waktu, `TIMESTAMP` MySQL pada versi lama, dan format biner mana pun dengan medan waktu 32 bit. Di situlah data hidup lebih lama daripada kodenya.

**Uji dengan tanggal setelah 2038.** Setel sebuah perkakas uji ke 2040 lalu jalankan rangkaian pengujian. Hampir semua kutu 2038 mudah direproduksi begitu ada yang mencoba.

**Utamakan bilangan bulat 64 bit atau untai ISO 8601.** Sebuah `BIGINT` berisi milidetik atau kolom `TIMESTAMPTZ` tak punya cakrawala yang perlu dipikirkan. Untai ISO 8601 tak punya sama sekali, dengan ongkos ukuran dan kecepatan pembandingan.

**Jangan pernah lagi menyimpan tanggal dalam apa pun yang 32 bit.** Penghematan penyimpanannya tak berarti pada perangkat keras modern, dan cakrawalanya kini berada di dalam masa pakai perangkat lunak biasa.

## Cakrawala tanggal yang lain

2038 adalah yang terdekat, bukan satu-satunya.

- **2036**: medan era 32 bit pada NTP berguling pada 7 Februari. NTPv4 menanganinya, tetapi penerapannya beragam.
- **2106**: hitungan detik 32 bit tanpa tanda berbalik.
- **2262**: hitungan _nanodetik_ 64 bit meluap — itulah `time.Time` di bahasa Go dalam representasi nanodetiknya, dan datetime64[ns] bawaan pandas.

Yang terakhir lebih dekat daripada kedengarannya bagi siapa pun yang menulis kode pengolahan data, dan itu kesalahan yang sama pada skala berbeda: satuan yang cukup halus untuk berguna, dalam lebar yang saat itu terasa berlimpah.

## Cara memeriksa sistem Anda sendiri

Empat pemeriksaan, dari yang paling ringan.

**Periksa tipe kolom basis data Anda.** Di PostgreSQL, `SELECT column_name, data_type FROM information_schema.columns WHERE data_type LIKE '%timestamp%'` memberi tahu apa yang Anda punya; `timestamp with time zone` berukuran 64 bit dan aman. Di MySQL, cari kolom `TIMESTAMP` pada peladen sebelum 8.0.28 — itulah yang terpapar, sedangkan `DATETIME` tidak pernah.

**Majukan jam.** Di dalam kontainer sekali pakai, setel tanggal sistem ke 2040 lalu jalankan rangkaian pengujian. Cara ini kasar dan menemukan sangat banyak hal, karena hampir tidak ada kutu 2038 yang halus setelah tanggalnya melewati batas.

**Telusuri tipe waktu 32 bit.** Di C dan C++, setiap `int` atau `long` eksplisit yang menyimpan nilai waktu pada target 32 bit. Di skema serialisasi, setiap medan waktu 4 bita. Di kode aplikasi, setiap tempat stempel waktu dipaksa menjadi bilangan bulat 32 bit untuk disimpan atau dikirim.

**Uji masa depan yang jauh di perkakas uji, bukan hanya yang dekat.** Pengujian yang memakai «sekarang tambah satu hari» akan lulus sampai 2038 lalu gagal pada suatu hari Selasa. Pengujian yang memakai tanggal 2040 secara eksplisit gagal hari ini, ketika masih ada orang yang bisa memperbaikinya.

## Yang tidak boleh dilakukan

Jangan «menyelesaikan» ini dengan beralih ke bilangan bulat 32 bit tanpa tanda. Itu membeli 68 tahun, menghilangkan kemampuan menyatakan tanggal mana pun sebelum 1970, dan melempar percakapan yang sama kepada siapa pun yang merawat sistem itu pada 2106. Selisih antara 4 dan 8 bita tidak sepadan dengan migrasi kedua.

Jangan menganggap bahasa modern melindungi Anda. Kode aplikasi bisa saja sepenuhnya aman sementara data yang dibacanya ditulis oleh sesuatu yang tidak aman — format berkas dan protokol jaringan membawa kendala itu melintasi setiap penulisan ulang.
