---
title: 'Tentang YourWorldTime'
description: 'Mengapa situs ini ada, bagaimana ia menghitung apa yang ditampilkannya, dan apa yang sengaja tidak dilakukannya.'
order: 1
updatedAt: '2026-01-15'
---

YourWorldTime adalah sekumpulan perkakas zona waktu yang dibangun di atas satu prinsip: jangan pernah menyatakan fakta waktu yang tidak dihitung dari basis data IANA pada saat fakta itu diperlukan.

## Mengapa ia ada

Kebanyakan perkakas zona waktu bersandar pada tabel selisih yang tersimpan. Tabel itu benar sampai sebuah pemerintahan berubah pikiran — yang terjadi beberapa kali setahun — dan sesudah itu ia salah tanpa suara, dengan cara yang tampak seperti kekeliruan manusia dalam menjadwal, bukan seperti cacat perangkat lunak.

Setiap selisih, setiap tanggal pergantian, dan setiap konversi di situs ini berasal dari salinan basis data IANA yang dibawa lingkungan jalannya, lewat antarmuka `Intl`. Tidak ada tabel selisih di dalam kode ini. Ketika basis data diperbarui, sebuah pembangunan ulang mengambilnya dan situs kembali benar tanpa satu baris pun berubah.

## Bagaimana ia dibangun

- Setiap halaman dibuat lebih dulu. Tidak ada server, tidak ada basis data, tidak ada antarmuka pemrograman.
- Waktu terkini yang mutlak dirender di peramban Anda, bukan di halaman. Halaman yang sudah dibuat lebih dulu tidak dapat dengan jujur mengaku tahu sekarang pukul berapa, jadi ia tidak mencobanya.
- Fakta yang bertahan lama — selisih, tanggal pergantian, jendela irisan — dihitung saat pembangunan dan dinyatakan per tanggal pembangunan itu.
- Situs dibangun ulang tiap bulan, dan juga pada 1 Maret, 1 April, 1 Oktober, dan 1 November, supaya pembaruan basis data mendarat sebelum tanggal yang terpengaruh.

## Apa yang ada di sini

Sepuluh perkakas, 80 halaman kota, 1.448 konversi antarpasangan kota, 240 konversi singkatan, dan dua belas panduan. Setiap halaman yang dihasilkan membawa fakta yang dihitung untuk pasangan itu sendiri: tabel jam, tanggal waktu musim panas kedua kota, dan jam-jam yang benar-benar dibagi keduanya.

## Apa yang sengaja tidak dilakukannya

- **Tanpa pelacakan.** Tanpa analitik, tanpa kuki, tanpa skrip pihak ketiga.
- **Tanpa akun.** Hitung mundur dan rencana rapat hidup di alamat halaman, jadi membagikan tautan adalah keseluruhan fiturnya.
- **Tanpa data karangan.** Bila sebuah zona tidak punya singkatan dalam data IANA, yang ditampilkan adalah selisihnya, bukan tebakan yang tampak masuk akal. Bila tidak ada data ulasan, tidak ada peringkat yang diklaim.
- **Tanpa panggilan jaringan saat berjalan.** Matahari terbit dan terbenam dihitung dari lintang dan bujur dengan algoritma posisi matahari NOAA, bukan diambil dari mana pun.

## Koreksi

Kalau ada yang salah di sini, itu penting: seluruh nilai sebuah rujukan terletak pada kebenarannya. Rincian kontak ada di [halaman kontak](/id/contact/).
