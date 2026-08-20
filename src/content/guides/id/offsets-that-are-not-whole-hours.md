---
title: 'Selisih UTC yang bukan jam bulat'
description: 'India, Nepal, Newfoundland, dan Kepulauan Chatham berjalan pada setengah dan seperempat jam. Inilah daftar lengkapnya dan apa yang rusak karenanya.'
summary: 'Sekitar seperlima penduduk dunia hidup pada selisih yang bukan bilangan jam bulat dari UTC. Perangkat lunak yang menganggap sebaliknya tidak keliru sedikit bagi mereka — ia keliru 30 atau 45 menit, dan itu lebih buruk.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 5
keywords:
  [
    'zona waktu setengah jam',
    'selisih utc 45 menit',
    'selisih zona waktu india',
    'zona waktu nepal',
  ]
related: ['half-hour-offsets-explained', 'time-zones-in-code', 'how-time-zones-work']
---

Bayangan tentang dua puluh empat zona berjarak satu jam itu keliru dengan cara yang mahal: ia melahirkan kode yang dengan penuh percaya diri meleset 30 atau 45 menit bagi jauh lebih dari satu miliar orang. Kekeliruan satu jam penuh setidaknya tampak seperti kekeliruan. Kekeliruan 45 menit tampak seperti salah ketik, lalu ikut terkirim.

## Daftar lengkap

**Selisih pada :30**

| Selisih   | Di mana                                             |
| --------- | --------------------------------------------------- |
| UTC-09:30 | Kepulauan Marquesas                                 |
| UTC-03:30 | Newfoundland dan Labrador                           |
| UTC+03:30 | Iran                                                |
| UTC+04:30 | Afghanistan                                         |
| UTC+05:30 | India, Sri Lanka                                    |
| UTC+06:30 | Myanmar, Kepulauan Cocos                            |
| UTC+09:30 | Australia tengah — Wilayah Utara, Australia Selatan |
| UTC+10:30 | Pulau Lord Howe (waktu baku)                        |

**Selisih pada :45**

| Selisih   | Di mana                                       |
| --------- | --------------------------------------------- |
| UTC+05:45 | Nepal                                         |
| UTC+08:45 | Tenggara Australia Barat (Eucla, tidak resmi) |
| UTC+12:45 | Kepulauan Chatham (waktu baku)                |

India sendiri berpenduduk 1,4 miliar jiwa. Tambahkan Iran, Afghanistan, Myanmar, Sri Lanka, dan Nepal, maka Anda sudah melewati seperlima penduduk bumi, bahkan sebelum menghitung Australia atau Kanada.

## Jenis selisih tak lazim yang lain

Selisih yang bukan jam bulat adalah keganjilan yang terkenal. Dua hal lain sama pentingnya.

**Rentangnya 26 jam, bukan 24.** Kiritimati di Kiribati berada di UTC+14; Pulau Baker dan Pulau Howland di UTC-12. Itu rentang 26 jam, yang berarti ada saat-saat ketika tiga tanggal kalender berbeda berlaku serentak di suatu tempat di bumi. Kode apa pun yang mengandaikan jendela dua hari mencakup semua zona akan keliru dua kali sehari.

**Waktu musim panas tak selalu satu jam.** Pulau Lord Howe, pulau kecil Australia dengan penduduk tetap sekitar 380 jiwa, bergeser 30 menit: UTC+10:30 pada musim dingin, UTC+11:00 pada musim panas. Itu satu-satunya tempat di bumi yang berbuat demikian, dan kasus uji terbaik bagi sebuah pustaka tanggal — penerapan mana pun yang menanam pergeseran 60 menit akan keliru di sana dan tidak di tempat lain, artinya ia lulus setiap pengujian lain yang Anda tulis.

## Apa yang rusak

**Membulatkan ke jam terdekat.** Kegagalan yang paling umum. Kode yang menghitung selisih dalam jam sebagai bilangan bulat diam-diam memangkas India menjadi +5, dan itu keliru 30 menit bagi setiap pengguna di negeri itu.

**Menyimpan selisih sebagai bilangan bulat.** Kolom skema yang dinyatakan sebagai hitungan jam tak sanggup mewakili Kathmandu. Ini biasanya baru ketahuan setelah datanya masuk.

**Antarmuka kisi yang dibangun di atas kolom jam.** Kalender atau perencana mana pun yang membentang sehari menjadi 24 sel sama besar dan mengandaikan jam setempat tiap zona jatuh pada batas sel akan salah menempatkan zona setengah jam dan 45 menit. Bilah pada perencana rapat di situs ini memakai saat sebagai kolom, bukan jam setempat, sehingga baris +05:45 menampilkan 09:45 pada kolom tempat baris UTC menampilkan 04:00 — itulah kebenarannya, bukan dusta yang lebih rapi.

**Aritmetika durasi yang melintasi pergantian 30 menit.** Mengandaikan sebuah peralihan waktu musim panas persis 3.600.000 milidetik memberi jawaban keliru di Pulau Lord Howe, dan hanya di sana.

## Melakukannya dengan benar

Perbaikannya sama dengan yang memperbaiki hampir semua kutu zona waktu: **jangan pernah menghitung sendiri sebuah selisih.** Tanyakan kepada platformnya.

Setiap lingkungan jalan modern membawa basis data IANA dan akan memberi tahu Anda selisih sebuah zona pada saat tertentu, dalam menit, dengan benar, termasuk untuk Kathmandu dan Lord Howe. Dalam JavaScript itu berarti `Intl.DateTimeFormat` dengan `timeZoneName: 'longOffset'`, atau membandingkan bacaan jam dinding zona itu terhadap UTC — pendekatan yang dipakai mesin situs ini, sebab ia tetap tepat bahkan untuk selisih waktu rata-rata setempat di bawah satu menit pada data sebelum 1900.

Lalu berpeganglah pada tiga kaidah:

1. **Selisih itu menit**, tak pernah jam. Jika sebuah peubah bernama `offsetHours`, ia sudah menjadi kutu.
2. **Ujilah terhadap Kathmandu dan Lord Howe.** Keduanya mematahkan dua andaian yang dibiarkan tetap utuh oleh segala hal lain.
3. **Jangan pernah membulatkan zona waktu.** Jika sebuah tampilan harus berupa perkiraan, katakanlah demikian; jangan diam-diam menggeser jam pengguna 30 menit demi memudahkan tata letak.

## Contoh yang dikerjakan: apa yang dilakukan 45 menit pada sebuah kisi

Bayangkan perencana rapat yang membentang sehari menjadi 24 kolom, satu per jam, dan mengarsir jam kerja tiap peserta. Penerapan yang naif menghitung tiap baris dengan menggeser baris dasar sebesar selisih zona dalam jam.

Untuk London melawan New York cara itu jalan: baris New York adalah baris London yang digeser lima sel ke kanan. Untuk London melawan Kathmandu tidak jalan. Kathmandu 5 jam 45 menit lebih dahulu, yaitu 5,75 sel, dan tiga perempat sel itu tidak ada. Penerapan tadi membulatkan — biasanya ke 6 — dan kini setiap bacaan pada baris itu 15 menit terlalu awal.

Kekeliruannya cukup kecil untuk lolos telaah dan cukup besar untuk berarti: rapat pukul 09:00 yang menurut kisi adalah 09:00 bagi Kathmandu sebenarnya 08:45 di sana, dan orang yang bergabung terlambat lima belas menit pada harinya sendiri.

Perbaikannya adalah berhenti memperlakukan kolom sebagai jam. Jadikan tiap kolom sebuah _saat_, lalu tanyakan kepada platform apa yang terbaca pada jam dinding setempat di tiap zona pada saat itu. Baris +05:45 lantas menampilkan 09:45 di tempat baris UTC menampilkan 04:00 — kasatmata tak sejajar dengan kisi, dan itulah penggambaran yang jujur. Perencana rapat di situs ini melakukan persis itu, dan tepi bergerigi pada baris Kathmandu adalah sebuah kelebihan.

## Selisih bersejarah bahkan lebih ganjil

Sebelum pembakuan, selisih adalah waktu surya rata-rata setempat dan tepat sampai ke detik. Basis data IANA mencatatnya.

Belanda berada di UTC+00:19:32,13 dari 1909 sampai 1937. Liberia di UTC-00:44:30 sampai 1972. Tanyakan kepada sebuah lingkungan jalan selisih `Europe/Amsterdam` pada tanggal tahun 1920, dan ia akan memberi Anda nilai persisnya, lengkap dengan detiknya.

Itulah sebabnya fungsi selisih di balik situs ini menghitung dalam detik dan baru membulatkan ke menit pada lapisan tampilan. Mesin yang menyimpan menit akan diam-diam kehilangan 32 detik sejarah Belanda — yang takkan disadari siapa pun, dan tetap saja keliru.
