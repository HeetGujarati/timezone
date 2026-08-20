---
title: 'Apa itu UTC sebenarnya, dan bedanya dengan GMT'
description: 'UTC adalah standar waktu yang dijaga jam-jam atom. GMT adalah zona waktu yang dijaga Bumi. Keduanya biasanya sama, dan bedanya tetap penting.'
summary: 'UTC bukan zona waktu. Ia standar rujukan yang menjadi dasar definisi setiap zona, dijaga sekitar 450 jam atom, dan tidak pernah bergeser karena waktu musim panas — persis itulah alasan sistem memakainya.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 2
keywords: ['apa itu utc', 'beda utc dan gmt', 'waktu universal terkoordinasi', 'penjelasan utc']
related: ['how-time-zones-work', 'iso-8601-explained', 'time-zones-in-code']
---

Orang memakai “UTC” dan “GMT” seolah keduanya hal yang sama. Sebagian besar waktu tidak ada yang keliru, sebab sebagian besar waktu keduanya menunjukkan bacaan yang sama. Tetapi keduanya jenis benda yang berbeda, dan perbedaan itu menjelaskan mengapa yang satu pantas disimpan di basis data Anda dan yang lain tidak.

## UTC adalah standar, bukan tempat

Waktu universal terkoordinasi dijaga oleh Biro Internasional Timbangan dan Ukuran dari rata-rata terbobot sekitar 450 jam atom di kira-kira 85 lembaga di seluruh dunia. Jam-jam itu mengukur frekuensi resonansi atom sesium-133, yang stabil pada kisaran satu detik dalam 100 juta tahun.

Waktu setempat siapa pun bukan UTC menurut hukum. Bahkan Britania, yang duduk di atas meridian utama, berada di UTC+1 selama tujuh bulan setiap tahun. UTC adalah titik tetap tempat setiap waktu setempat dijelaskan — angka nol pada penggaris, bukan tanda pada peta.

Sifat terpentingnya bagi siapa pun yang membangun perangkat lunak: **UTC tidak pernah bergeser karena waktu musim panas.** Ia tidak punya ragam musiman, tidak punya riwayat politik, dan tidak punya perkecualian. Itulah seluruh alasan penerbangan, pelayaran, penyelesaian keuangan, dan setiap sistem tersebar yang ada memakainya.

## GMT adalah zona waktu dengan riwayat pekerjaan

Waktu Rata-rata Greenwich adalah waktu matahari rata-rata di Observatorium Kerajaan di Greenwich. Ia ditetapkan oleh rotasi Bumi, dan Bumi bukan alat presisi: planet ini bergoyang, melambat tidak merata, dan sesekali malah mempercepat.

Dari 1884 sampai 1972, GMT adalah standar waktu dunia. Ia digantikan UTC justru karena jam atom ternyata rujukan yang lebih baik daripada sebuah planet. GMT bertahan sebagai nama sebuah zona waktu — yang dipakai Britania pada musim dingin, dan yang dipakai beberapa negara Afrika Barat sepanjang tahun.

Jadi: **UTC tidak pernah menerapkan waktu musim panas. GMT, sebagaimana dipakai di Britania, menerapkannya** — Britania meninggalkannya setiap Maret menuju British Summer Time dan kembali setiap Oktober. Kalau rekan dari Britania berkata “pukul 15.00 GMT” di bulan Juli, hampir pasti yang dimaksud pukul 15.00 BST, yakni pukul 14.00 UTC. Kekeliruan ini cukup sering terjadi sehingga lebih baik bertanya daripada menduga.

## Mengapa disingkat UTC

Tidak ada akronim yang menang, baik yang Inggris maupun yang Prancis. Penutur Inggris mengusulkan CUT untuk “coordinated universal time”. Penutur Prancis mengusulkan TUC untuk “temps universel coordonné”. Persatuan Telekomunikasi Internasional memutuskan UTC, yang tidak cocok dengan bahasa mana pun sehingga menyinggung keduanya sama rata. Dengan caranya sendiri, sebuah hasil diplomatik yang sempurna.

## Detik kabisat, dan penghapusannya yang akan datang

Bumi tidak berputar pada laju tetap. Untuk menahan UTC agar tidak menjauh dari waktu matahari, detik tambahan sesekali disisipkan: 27 buah antara 1972 dan 2016. Selama satu detik kabisat, jam UTC menunjukkan 23:59:60 — waktu yang sungguh ada dan tidak bisa diwakili oleh kebanyakan perangkat lunak.

Detik kabisat pernah menyebabkan gangguan nyata. Pada 2012 sebuah detik kabisat menumbangkan Reddit, layanan-layanan Mozilla, dan beberapa sistem pemesanan maskapai, semuanya lewat cacat kernel Linux yang sama. Pada 2017 DNS Cloudflare rusak karena perhitungan durasi menjadi negatif saat melintasi penyisipan itu.

Pada November 2022, Konferensi Umum Timbangan dan Ukuran memilih untuk berhenti menambahkan detik kabisat paling lambat 2035. UTC lalu dibolehkan menjauh dari waktu matahari, dan persoalannya akan ditinjau lagi ketika selisihnya menjadi merepotkan — kemungkinan sekitar seabad lagi.

Peramban Anda tidak mengeluarkan detik kabisat. Jam JavaScript berpura-pura detik itu tidak pernah ada, sehingga rentang yang melintasinya dilaporkan kurang satu detik. Untuk hampir semua keperluan inilah pertukaran yang tepat; kalau Anda menggarap navigasi satelit, Anda sudah tahu.

## Apa yang sebaiknya dilakukan

**Simpan cap waktu dalam UTC.** Bukan di zona pengguna, bukan di zona peladen, bukan pula di zona tempat kantor pusat kebetulan berada. Sebuah saat dalam UTC tidak bermakna ganda, bisa diurutkan, dan kebal terhadap pemerintah yang berubah pikiran.

**Konversikan ke waktu setempat pada saat menampilkan**, memakai zona pembaca dan salinan basis data IANA milik lingkungan jalannya.

**Katakan UTC bila yang Anda maksud UTC.** Menulis “GMT” dalam sebuah spesifikasi mengundang orang menafsirkannya sebagai waktu setempat Britania, dan pada musim panas itu meleset satu jam. “12:00 UTC” punya tepat satu makna pada setiap hari sepanjang tahun.

**Pakai akhiran Z dari ISO 8601.** `2026-03-08T14:30:00Z` adalah UTC dan tidak bisa dibaca sebagai apa pun yang lain. `2026-03-08T14:30:00` adalah waktu setempat di zona yang tidak disebutkan, artinya ia sama sekali bukan cap waktu.

## Keluarga skala waktu

UTC adalah satu dari beberapa skala yang bersaudara, dan perbedaannya sesekali berarti.

**TAI** — Waktu Atom Internasional. Skala atom yang mentah, tanpa detik kabisat. TAI kini 37 detik lebih awal daripada UTC, dan selisihnya tumbuh setiap kali detik kabisat ditambahkan. Satelit GPS berjalan pada skala yang bergeser dari TAI.

**UT1** — rotasi Bumi yang sesungguhnya, diukur terhadap kuasar-kuasar jauh. Inilah yang dikejar detik-detik kabisat UTC. UTC dijaga dalam 0,9 detik dari UT1 — atau begitulah, sampai keputusan 2035.

**Waktu GPS** — mulai sejajar dengan UTC pada Januari 1980 dan sejak itu mengabaikan detik kabisat. Kini ia 18 detik lebih awal daripada UTC. Penerima mengoreksinya; sistem yang membaca waktu GPS mentah kadang tidak.

**Waktu Unix** — hitungan detik sejak 1970, yang berpura-pura detik kabisat tidak ada dengan mengulang satu detik alih-alih menghitungnya. Itu membuatnya bukan benar-benar hitungan detik yang berlalu, sebuah kehalusan yang sudah menggigit orang-orang yang mengukur durasi melintasi sebuah penyisipan.

Untuk hampir semua perangkat lunak, UTC adalah jawaban yang benar dan sisanya sekadar pengetahuan sampingan. Untuk apa pun yang melibatkan satelit, cap waktu perdagangan frekuensi tinggi, atau instrumentasi ilmiah, pembedaan itu menanggung beban.

## Mengapa “waktu UTC” mubazir, dan mengapa kami tetap menulisnya

Huruf T berarti waktu, jadi “waktu UTC” sama dengan “waktu waktu universal terkoordinasi”. Kaum puris keberatan.

Halaman-halaman di situs ini tetap menulis “waktu UTC” pada judul dan tajuk, karena itulah yang dicari orang dan itulah yang mereka ketik. Ada satu versi kebenaran yang membuat Anda kehilangan pembaca, dan kecerewetan soal akronim jatuh tepat di dalamnya. Di tubuh tulisan, ketika pembaca sudah sampai di sini, cukup UTC saja.
