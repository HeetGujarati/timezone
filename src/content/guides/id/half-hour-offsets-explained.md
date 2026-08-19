---
title: "Mengapa India berjalan setengah jam dari UTC"
description: "Selisih setengah jam dan 45 menit bukan kebetulan geografis: itu kompromi, pernyataan kemerdekaan, dan satu lelucon birokrasi."
summary: "India berada di UTC+05:30 karena membelah selisih antara dua zona yang diusulkan. Nepal berada di UTC+05:45 sebagian agar tidak menjadi India. Setiap selisih yang tak lazim punya kisah, dan hampir semuanya politis."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 12
keywords: ['mengapa india setengah jam', 'nepal 45 menit', 'zona waktu setengah jam', 'sejarah waktu standar india']
related: ['offsets-that-are-not-whole-hours', 'how-time-zones-work', 'the-international-date-line']
---

Pertanyaan yang jelas tentang waktu standar India adalah mengapa ia tidak berjarak bilangan jam bulat dari apa pun. Jawabannya: zona waktu ditetapkan oleh pemerintah, dan pemerintah tidak mengoptimalkan kenyamanan pustaka tanggal Anda.

## India: satu negara, dua zona alami, satu kompromi

India membentang sekitar 29 derajat bujur — dari Gujarat di barat sampai Arunachal Pradesh di timur. Itu cukup untuk kira-kira dua jam waktu surya. Menurut nalar biasa zona waktu, India semestinya punya dua.

Di bawah pemerintahan Britania, praktisnya memang begitu. Waktu Bombay dan waktu Kalkuta terpisah, berjarak kira-kira 39 menit, dan waktu Madras berada di antaranya sebagai patokan perkeretaapian. Ketika India menyeragamkan waktunya setelah kemerdekaan pada 1947, ia memilih satu zona di UTC+05:30 — 82,5° bujur timur, meridian yang lewat dekat Mirzapur, hampir persis di tengah kedua patokan lama itu.

Alasannya adalah persatuan nasional dan kesederhanaan tata usaha, dan ongkosnya nyata. Pada musim panas, matahari terbit di Arunachal Pradesh sekitar pukul 04:00 dan terbenam sekitar 16:00, sementara kantor mengikuti jam kerja yang ditetapkan untuk Delhi. Industri teh Assam sudah lebih dari seabad memakai «waktu bagan» tak resmi yang lebih cepat satu jam, justru karena jam nasional tidak cocok. Usulan zona India kedua muncul tiap beberapa tahun dan ditolak dengan alasan yang sama setiap kali.

## Nepal: empat puluh lima menit kedaulatan

Nepal berada di UTC+05:45. Lima belas menit di depan India, dan satu-satunya zona di dunia pada selisih itu.

Pembenaran geografisnya adalah Gaurishankar, gunung di timur Kathmandu yang dipakai sebagai acuan meridian nasional. Pembenaran politisnya adalah bahwa Nepal bukan India, dan lima belas menit merupakan cara murah dan permanen untuk menyatakannya. Nepal berpindah dari UTC+05:30 ke UTC+05:45 pada 1986.

Kedua kisah itu benar, dan penduduk setempat akan menuturkan salah satunya bergantung pada bagaimana pertanyaannya diajukan. Yang penting dalam praktik: selisihnya tepat dan permanen — Nepal tidak menerapkan waktu musim panas — dan banyak sekali perangkat lunak keliru dengan membulatkannya ke +05:30 atau +06:00.

## Kepulauan Chatham: 45 menit berikut waktu musim panas

Kepulauan Chatham, sekitar 800 kilometer di timur Selandia Baru, berada di UTC+12:45 pada musim dingin dan UTC+13:45 pada musim panas. Sekitar 600 orang tinggal di sana.

Selisihnya kira-kira mengikuti matahari: kepulauan itu cukup jauh di timur daratan utama Selandia Baru untuk membenarkan tambahan 45 menit tersebut. Waktu musim panasnya warisan dari Selandia Baru, yang menjadikan kepulauan ini satu dari hanya dua tempat di bumi yang punya selisih seperempat jam sekaligus pergeseran musiman.

## Pulau Lord Howe: pergeseran musiman 30 menit

Pulau Lord Howe, di lepas pantai timur Australia, berpenduduk sekitar 380 jiwa, berada di UTC+10:30 pada musim dingin dan UTC+11:00 pada musim panas. Ia bergeser **tiga puluh menit**, dan itulah satu-satunya tempat di bumi yang melakukannya.

Alasannya adalah kesederhanaan takaran. Pulau itu ingin waktu musim panasnya selaras dengan daratan Wales Selatan Baru, tetapi menganggap satu jam penuh berlebihan bagi tempat sekecil itu, maka pada 1981 ia membelah selisihnya. Hasilnya adalah kasus uji terbaik di dunia bagi kode penanganan tanggal: pustaka mana pun yang menanamkan pergeseran musiman 60 menit akan keliru di Pulau Lord Howe dan benar di mana-mana lainnya, artinya ia akan lulus setiap pengujian yang Anda tulis kecuali yang satu itu.

## Yang sudah tiada

**Belanda: UTC+00:19:32,13.** Dari 1909 sampai 1937 Belanda memakai waktu rata-rata setempat Amsterdam, ditetapkan sampai ke detik. Angka itu dibulatkan menjadi +00:20 pada 1937 dan ditinggalkan demi waktu Eropa Tengah pada 1940. Basis data IANA masih memuatnya, dan itulah sebabnya selisih dalam mesin situs ini dihitung dalam detik, bukan menit: lingkungan jalan yang ditanyai tentang tanggal Belanda tahun 1920 akan menjawab dengan nilai itu, dan membulatkannya akan menjadi dusta kecil.

**Liberia: UTC-00:44:30.** Sampai 1972 Liberia berjalan 44 menit 30 detik di belakang Greenwich, negara terakhir di bumi dengan selisih yang bukan bilangan menit bulat.

**Singapura: lima kali berubah.** Singapura pernah berada di +06:55:25, +07:00, +07:20, +07:30, +09:00, dan kini +08:00. Letaknya di barat meridian yang akan membenarkan +08:00, dan ia bertahan di sana demi selaras dengan Malaysia, yang berpindah pada 1982.

## Polanya

Tak satu pun selisih ini soal matahari. India membelah selisih politik. Nepal menegaskan kemerdekaan. Singapura mengikuti mitra dagang. Lord Howe berkompromi dengan dirinya sendiri.

Itulah argumen bagi keputusan rancangan yang mendasari setiap halaman di situs ini: **jangan pernah menghitung selisih dari bujur, dan jangan pernah menyimpannya di tabel yang Anda rawat sendiri**. Tanyakan kepada basis data IANA, yang mencatat apa yang benar-benar diputuskan tiap pemerintah, termasuk keputusan yang sama sekali tak masuk akal secara astronomi — sebab justru di dalam keputusan itulah pengguna Anda hidup.

## Pernyataan tiga puluh menit Korea Utara

Pada Agustus 2015, Korea Utara memundurkan jamnya 30 menit, dari UTC+09:00 ke UTC+08:30, dan menamai hasilnya waktu Pyongyang. Alasan yang dinyatakan adalah membatalkan perubahan yang dipaksakan pada masa pendudukan Jepang, yang telah menyelaraskan Korea dengan Tokyo.

Akibat praktisnya, Korea Utara dan Korea Selatan, yang berbagi jam sejak 1961, kini terpisah 30 menit.

Pada Mei 2018, setelah pertemuan puncak antar-Korea di Panmunjom, Korea Utara kembali ke UTC+09:00. Pengumumannya menyebut hal itu langkah nyata pertama menuju penyatuan, dan selama perundingan jam-jam di Wisma Perdamaian menampilkan kedua waktu berdampingan.

Dua rilis tzdata berselang tiga tahun, untuk perubahan yang tak ada sangkut pautnya dengan matahari dan sepenuhnya bersangkutan dengan politik. Itulah keadaan yang biasa, bukan kekecualian.

## Setengah jam Venezuela, dan pembalikannya

Pada Desember 2007 Venezuela berpindah dari UTC-04:00 ke UTC-04:30, pergeseran setengah jam yang disajikan pemerintah sebagai cara memberi anak-anak lebih banyak cahaya siang dalam perjalanan ke sekolah. Pada Mei 2016 ia kembali, kali ini dibingkai sebagai langkah penghematan energi selama krisis kelistrikan yang berat.

Sembilan tahun pada selisih yang tak lazim, lalu kembali. Setiap sistem yang menanamkan selisih Venezuela sebagai tetapan harus diubah dua kali.

## Pelajaran bagi siapa pun yang menyimpan waktu

Ini bukan kasus tepi dalam arti jarang. Secara keseluruhan, panduan ini telah memaparkan perubahan selisih di Nepal, Samoa, Tokelau, Korea Utara, Venezuela, Turki, Rusia, Iran, Meksiko, Brasil, dan Mesir — semuanya dalam ingatan orang yang masih hidup, sebagian besar dalam dua dasawarsa terakhir.

Basis data IANA menyerap tiap satu di antaranya dalam sebuah rilis. Tabel yang ditanam dalam kode tidak menyerap satu pun, gagal tanpa suara, dan kegagalannya tampak seperti kekeliruan penjadwalan oleh seseorang alih-alih cacat pada perangkat lunak.
