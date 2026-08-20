---
title: 'Menjadwalkan rapat melintasi jurang dua belas jam'
description: 'Ketika dua tim sama sekali tak berbagi jam kerja, jalan keluarnya bersifat struktural, bukan kalender yang lebih cerdik. Inilah yang benar-benar berhasil.'
summary: 'Jurang dua belas jam tak punya waktu rapat yang baik, dan tak ada arsiran kisi yang mengubahnya. Tim yang mengelolanya dengan baik berhenti mencarinya dan justru mengubah cara kerja mereka.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 4
keywords:
  [
    'menjadwalkan lintas zona waktu',
    'tim jarak jauh zona waktu',
    'beda waktu dua belas jam',
    'kerja nirserentak',
  ]
related: ['how-to-run-a-global-standup', 'why-daylight-saving-exists', 'how-time-zones-work']
---

San Francisco dan Bengaluru terpaut dua belas setengah jam. Hari kerja 09:00–18:00 di satu tempat berakhir sebelum yang lain dimulai. Tak ada penataan kalender yang cerdik yang menghasilkan satu jam kerja bersama, karena memang tak ada jam bersama untuk ditemukan.

Kebanyakan tim menemukan hal ini dengan tetap mencoba, menyepakati pukul 21:00 bagi satu pihak, lalu diam-diam menyimpan kesal selama delapan belas bulan. Berikut ini yang dilakukan tim-tim yang menanganinya dengan baik.

## Pertama, jujurlah pada hitungannya

Sebelum berunding, hitunglah angka yang sebenarnya, sebab kerap kali lebih buruk daripada dugaan orang — dan sesekali lebih baik.

Selisihnya tidak tetap. New York dan Sydney terpaut 16 jam pada musim dingin belahan utara dan 14 jam pada musim panasnya, karena keduanya menerapkan waktu musim panas pada musim yang berlawanan. Ayunan dua jam itulah beda antara «satu jam bersama» dan «tak ada sama sekali», dan ia datang tanpa siapa pun mengubah apa pun.

Dua kota yang sama-sama mempertahankan selisih tetap sepanjang tahun — India dan Jepang, misalnya — punya selisih yang bisa dihafal. Dua kota yang hanya salah satunya menerapkan waktu musim panas punya selisih yang bergeser dua kali setahun. Dua kota yang sama-sama menerapkannya tetapi pada tanggal berbeda punya selisih yang keliru sekitar empat minggu setahun.

## Empat pilihan yang jujur

Hanya ada empat, dan setiap penataan yang berjalan merupakan gabungan darinya.

**1. Satu pihak bergeser secara tetap.** Hari kerja seseorang bergeser dua atau tiga jam. Cara ini berjalan, mantap, dan hanya adil jika disertai imbalan: hari inti yang lebih pendek, kompensasi, atau pilihan yang sungguh-sungguh. Memaksakannya kepada tim yang paling muda adalah awal dari orang-orang yang berhenti.

**2. Bergantian memikul rasa tak enaknya.** Panggilan yang canggung itu berputar: bulan ini pagi buta bagi Bengaluru, bulan depan larut bagi San Francisco. Lebih adil pada asasnya, lebih sukar pada praktiknya, sebab menuntut seseorang mencatat dan menegakkannya. Paling cocok untuk sedikit rapat bernilai tinggi.

**3. Bertumpang tindih dengan sengaja dan sempit.** Kedua pihak sepakat tersedia pada satu jam tertentu, dekat salah satu ujung hari mereka, dan tak ada lagi yang dijadwalkan melintasi jurang itu. Segala yang terjadi pada jam itu adalah keputusan; selebihnya ditulis.

**4. Berhenti berapat.** Jurang itu berubah menjadi keunggulan: pekerjaan diserahkan pada akhir tiap hari dan dilanjutkan pada awal hari pihak lain. Inilah satu-satunya pilihan yang tetap sanggup melampaui dua lokasi, dan yang paling banyak menuntut perubahan pada cara tim benar-benar bekerja.

## Apa yang dituntut oleh serah terima yang baik

Pilihan keempat adalah tempat tim berjarak dua belas jam entah berkembang entah berantakan, dan bedanya nyaris seluruhnya terletak pada menulis.

**Keputusan ditulis, berikut alasannya.** Bukan «kami memutuskan memakai Postgres», melainkan «kami memilih Postgres ketimbang DynamoDB karena pola kuerinya relasional dan ongkos operasi gudang data kedua melebihi keluaran tulis yang akan kami peroleh». Versi kedua selamat melewati serah terima; yang pertama melahirkan rapat.

**Pertanyaan diajukan dengan cukup konteks agar bisa dijawab selagi Anda tidur.** «Bagaimana pendapatmu soal skema ini?» berbiaya perjalanan bolak-balik sehari penuh. «Skema harus mendukung X dan Y; pilihan A lebih baik untuk X, pilihan B lebih baik untuk Y; saya condong ke A karena Z — katakan sebelum pagimu jika tak setuju» tuntas dalam satu daur.

**Penghambat ditandai sebelum serah terima, bukan pada saatnya.** Pola terburuk pada tim nirserentak adalah mengetahui pukul 09:00 bahwa pihak seberang mentok kemarin pukul 17:00 dan tak berkata apa-apa selama sebelas jam.

**Keadaan terlihat tanpa perlu ditanyakan.** Sebuah papan, sebuah kanal, sebuah dokumen — apa saja yang menjawab «apa yang terjadi selagi saya tidur» tanpa menuntut siapa pun terjaga.

## Jebakan rapat berkala

Kalau Anda tetap menjadwalkan panggilan berkala melintasi jurang lebar, sadarilah bahwa ia akan hanyut. Ketika satu pihak mengubah jamnya dan yang lain tidak, rapat yang berjangkar pada satu kalender bergeser satu jam pada kalender yang lain. Dua kali setahun, selama beberapa pekan, ia mendarat di tempat yang tak pernah disepakati siapa pun.

Perangkat lunak kalender menanganinya dengan benar bila acaranya disimpan bersama sebuah zona — satu alasan lagi untuk memilih zona jangkar secara tegas, menyatakannya dalam undangan, dan membiarkan kalender orang lain melakukan konversinya.

Jebakan yang lain adalah rapat yang dijadwalkan sewaktu tim berada di tiga zona dan masih berjalan kini setelah timnya tersebar di enam zona. Rapat berjurang lebar mengumpulkan peserta yang bagi mereka waktunya jauh lebih buruk daripada bagi kelompok semula, dan tak pernah ada yang mengusulkan memindahkannya, sebab memindahkannya adalah ketidaknyamanan orang lain.

## Ketika benar-benar tak ada

Los Angeles dan Mumbai tak berbagi satu menit pun dari hari 09:00–18:00, pada musim mana pun. Jika tim Anda membentang di jurang itu dan memerlukan keputusan serentak, ada orang yang bekerja di luar harinya — satu-satunya pertanyaan adalah siapa, seberapa sering, dan apakah ia menyetujuinya.

Itu persoalan pengelolaan, bukan penjadwalan, dan perkakas tak dapat memecahkannya. Yang dapat dilakukan perkakas adalah mencegah Anda menemukannya di dalam undangan.

## Catatan tentang keadilan

Penataan yang akhirnya muncul biasanya yang cocok bagi siapa pun yang paling berkuasa dalam organisasi, dan biasanya muncul tanpa ada yang memutuskannya.

Awasi pola ketika tim yang paling baru, paling muda, atau paling jauh terus-menerus mendapat jam yang canggung. Itu jarang merupakan keputusan; itu penumpukan setelan bawaan kecil yang masing-masing masuk akal. Sekali mapan, ia tak tampak bagi mereka yang diuntungkan dan sangat tampak bagi semua orang lain.

Penangkal praktisnya adalah menuliskan siapa yang memikul ongkosnya, meninjaunya pada jadwal tetap, dan memperlakukannya sebagai pos anggaran sungguhan alih-alih sekadar niat baik. Tanggal pergantian waktu musim panas merupakan pengingat yang praktis untuk peninjauan itu, sebab angkanya toh bergeser pada saat tersebut.
