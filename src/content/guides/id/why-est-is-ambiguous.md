---
title: "Mengapa EST bermakna ganda, dan apa penggantinya"
description: "IST berarti tiga hal berbeda. CST empat. Singkatan zona waktu bukan pengenal, dan memperlakukannya begitu menimbulkan cacat yang nyata."
summary: "Singkatan zona waktu adalah label tidak resmi, tanpa badan yang mengaturnya dan tanpa jaminan keunikan. IST berarti India, Irlandia, dan Israel; CST berarti Amerika, Tiongkok, dan Kuba. Pakailah pengenal IANA."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 10
keywords: ['est bermakna ganda', 'singkatan zona waktu', 'arti ist', 'zona waktu cst']
related: ['how-time-zones-work', 'time-zones-in-code', 'what-utc-really-is']
---

Sebuah undangan kalender berbunyi “14.00 IST”. Bergantung pada siapa yang mengirimnya, itu berarti 08.30 UTC, 13.00 UTC, atau 12.00 UTC. Tidak ada apa pun dalam untaian itu yang memberi tahu yang mana, dan ketiga pembacaan itu adalah pemakaian yang benar.

Singkatan zona waktu bersifat tidak resmi. Tidak ada badan standar yang menetapkannya, tidak ada yang menjamin keunikannya, dan beberapa di antaranya masih diperebutkan. Ia memadai dalam percakapan antarorang yang berbagi konteks, dan tidak aman di tempat lain mana pun.

## Tabrakan yang penting

**IST** — tiga makna, ketiganya masih dipakai:

| Makna                | Selisih   | Zona                            |
| -------------------- | --------- | ------------------------------- |
| Indian Standard Time | UTC+05:30 | `Asia/Kolkata`                  |
| Irish Standard Time  | UTC+01:00 | `Europe/Dublin` (musim panas)   |
| Israel Standard Time | UTC+02:00 | `Asia/Jerusalem`                |

India dan Irlandia terpaut empat setengah jam. Rapat yang dipesan pada IST yang keliru bukan sekadar terlalu pagi; ia meleset hampir satu hari kerja penuh.

**CST** — empat makna:

| Makna                                  | Selisih   | Zona                 |
| -------------------------------------- | --------- | -------------------- |
| Central Standard Time (Amerika Utara)  | UTC-06:00 | `America/Chicago`    |
| China Standard Time                    | UTC+08:00 | `Asia/Shanghai`      |
| Cuba Standard Time                     | UTC-05:00 | `America/Havana`     |
| Central Standard Time (Australia)      | UTC+09:30 | `Australia/Adelaide` |

Chicago dan Shanghai terpaut empat belas jam.

**PST** — Pacific Standard Time di UTC-08:00, dan Philippine Standard Time di UTC+08:00. Terpaut tepat enam belas jam, yang berarti sebuah kekeliruan mendarat di hari kalender yang berbeda.

**BST** — British Summer Time di UTC+01:00, dan Bangladesh Standard Time di UTC+06:00.

**EST** — Eastern Standard Time di Amerika Utara pada UTC-05:00, dan secara historis singkatan yang dipakai Australia untuk negara-negara bagian timurnya pada UTC+10:00 sebelum AEST mengambil alih. Dokumen Australia yang lebih tua masih memakai bentuk telanjangnya.

## Masalah yang lain: singkatan itu musiman

Bahkan di tempat sebuah singkatan bersifat unik, ia hanya menamai separuh tahun.

`America/New_York` adalah EST dari November sampai Maret dan EDT dari Maret sampai November. Jadi “EST” pada bulan Juli tidak menggambarkan jam mana pun yang ada — zona itu sedang di EDT. Orang tetap menulisnya, maksudnya “waktu New York”, dan sistem yang menerimanya secara harfiah menghitung meleset satu jam selama tujuh bulan.

Inilah sebabnya “EST” menjadi singkatan yang paling sering disalahgunakan di internet: ia dipakai sebagai nama sebuah tempat, padahal ia nama sebuah musim di tempat itu.

## Kebanyakan zona sama sekali tidak punya singkatan

Zona-zona dunia berbahasa Inggris kebanyakan punya singkatan huruf. Kebanyakan zona tidak.

Tokyo, Shanghai, dan São Paulo tidak punya singkatan huruf dalam data ICU yang dipakai lokal bahasa Inggris mana pun — ketiganya dilaporkan sebagai “GMT+9”, “GMT+8”, dan “GMT-3”. Anda akan melihat “JST” ditulis untuk Jepang, dan itu dipahami, tetapi ia kelaziman, bukan data.

Hal itu memunculkan godaan yang jelas bagi siapa pun yang membangun perkakas zona waktu: menambal kekosongan. Mengarang “JST” karena kelihatan masuk akal, “BRT” untuk Brasil, sesuatu untuk Kathmandu. Situs ini sengaja tidak melakukannya. Di mana tidak ada lokal yang punya huruf, ia menampilkan selisihnya — sebab satu-satunya janji yang dibuatnya adalah bahwa datanya datang dari basis data IANA, bukan dari terkaan, dan singkatan karangan justru jenis kepalsuan masuk akal yang membuat sebuah rujukan tak layak dipercaya.

## Apa penggantinya

**Pengenal IANA.** `America/New_York`, `Asia/Kolkata`, `Europe/Dublin`. Semuanya unik, mantap, dan menamai sebuah tempat berikut riwayat aturannya, bukan sebuah musim.

Pengenal itu juga selamat dari perubahan aturan. Ketika Turki menghapus waktu musim panas pada 2016, `Europe/Istanbul` tetap berarti Turki. Setiap kode yang bergantung pada “EET” atau “EEST” harus diubah.

**Saat menulis untuk manusia**, sebut kotanya dan selisihnya: “14.00 di Mumbai (UTC+05:30)”. Pembaca di mana pun bisa bertindak tanpa perlu tahu IST yang mana yang Anda maksud.

**Dalam undangan kalender**, biarkan kalender yang melekatkan zonanya. Setiap kalender modern menyimpan pengenal zona bersama acaranya dan mengonversinya untuk tiap peserta. Mengetik singkatan ke dalam judul justru menggagalkan itu.

**Dalam antarmuka dan data**, pakai ISO 8601 dengan selisih eksplisit atau `Z`, dan bawa pengenalnya terpisah bila Anda perlu tahu _di mana_, bukan sekadar _selisih berapa_.

## Kalau terpaksa harus membacanya

Bila sebuah singkatan sudah telanjur diterima dan Anda tak bisa bertanya, pakailah konteks:

- Siapa pengirimnya? Perusahaan India berarti India, perusahaan Irlandia berarti Irlandia.
- Selisih berapa yang membuat waktu yang diusulkan masuk akal bagi mereka? Tak ada yang menjadwalkan panggilan pukul 03.00.
- Adakah nama kota dalam percakapan itu? Sebuah kota menuntaskannya sepenuhnya.

Dan bila memang penting — panggilan dengan pelanggan, sebuah tenggat, sebuah jendela penggelaran — bertanyalah. Sepuluh detik “India atau Irlandia?” lebih murah daripada kebalikannya, dan orang yang Anda tanyai kemungkinan besar pernah bertanya-tanya hal yang sama.

## Singkatan yang aman

Tidak semua singkatan diperebutkan. Beberapa unik dalam praktiknya dan cukup aman dalam tulisan, walau tetap tidak aman di dalam kode:

- **UTC** — satu makna, menurut definisi
- **CEST** — Central European Summer Time, unik
- **AEDT** / **AEST** — Australian Eastern, tak bermakna ganda sejak awalan A dipakai
- **NZDT** / **NZST** — Selandia Baru
- **JST** — Jepang, karena kelaziman dan bukan karena data; ICU tidak memuatnya untuk lokal bahasa Inggris mana pun

Perhatikan polanya: yang aman adalah yang membawa awalan negara atau benua. “Eastern Standard Time” memang sudah pasti akan bertabrakan, sebab lebih dari satu benua punya sisi timur.

## Apa kata basis data IANA tentang singkatan

Basis data itu memang mencatat singkatan, dalam satu bidang untuk tiap kurun zona, tetapi memperlakukannya sebagai hal tidak resmi. Dokumentasinya sendiri mencatat bahwa singkatan itu tidak unik, tidak dibakukan, dan dalam beberapa kasus dikarang oleh para pemelihara basis data di tempat yang tidak punya singkatan setempat.

Beberapa dihapus seiring waktu justru karena merupakan karangan. Zona-zona yang dulu membawa kode tiga huruf karangan kini melaporkan bentuk angka seperti `+0545`, tepatnya karena singkatan buatan lebih buruk daripada selisih yang jujur.

Penilaian keredaksian itu — bahwa karangan yang masuk akal lebih buruk daripada mengakui ketiadaan — adalah penilaian yang sama yang dipakai situs ini. Itulah sebabnya kolom singkatan pada halaman Tokyo berbunyi UTC+9, bukan JST.
