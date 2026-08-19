---
title: "Bagaimana zona waktu sebenarnya bekerja"
description: "Zona waktu adalah bangunan politik yang dihamparkan di atas persoalan geografis. Inilah mekanismenya, dan di mana perangkat lunak keliru."
summary: "Zona waktu bukan irisan bola bumi, melainkan seperangkat aturan bernama tentang apa yang pernah, sedang, dan dijadwalkan ditunjukkan sebuah jam di suatu tempat. Pembedaan itulah seluruh pokok persoalannya."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 1
keywords:
  ['bagaimana zona waktu bekerja', 'apa itu zona waktu', 'penjelasan zona waktu', 'basis data zona waktu iana']
related: ['what-utc-really-is', 'why-est-is-ambiguous', 'time-zones-in-code']
---

Tanyalah hampir siapa pun apa itu zona waktu, dan ia akan menggambarkan sebuah pita tegak di peta: dunia dibagi menjadi dua puluh empat irisan sama besar, berjarak satu jam, ditentukan oleh garis bujur. Model itu rapi, mudah diingat, dan keliru dengan cara yang cepat atau lambat akan merenggut satu rapat dari tangan Anda.

Zona waktu adalah **seperangkat aturan bernama**, yang dipelihara sebuah pemerintahan, tentang apa yang ditunjukkan jam-jam di suatu wilayah. Aturan itu bisa berubah. Ia berubah karena alasan politik, karena alasan ekonomi, dan sesekali dengan pemberitahuan dua pekan. Garis bujur adalah tempat gagasan ini bermula; bukan tempat ia berakhir.

## Dari mana gagasan ini datang

Sebelum tahun 1880-an setiap kota memelihara waktunya sendiri, ditetapkan menurut tengah hari setempat — saat matahari melintasi meridian di atas kepala. Bristol tertinggal sepuluh menit dari London, dan tidak ada yang mempersoalkannya, sebab tak ada yang bergerak cukup cepat sehingga sepuluh menit menjadi penting.

Kereta api mengubah itu. Jadwal yang menyebut kereta berangkat pukul 10.15 tidak berguna bila 10.15 berarti hal berbeda di kedua ujung jalur, dan pada tahun 1840-an perusahaan-perusahaan kereta Britania sudah memaksakan waktu London begitu saja ke seluruh jaringan mereka. Amerika Serikat menyusul pada 1883, ketika perusahaan kereta memotong negara itu menjadi empat zona atas kehendak sendiri. Konferensi Meridian Internasional pada 1884 menjadikan Greenwich sebagai meridian utama dan memberi dunia satu acuan bersama.

Yang penting dari sejarah itu: zona waktu diciptakan untuk memecahkan persoalan koordinasi, oleh organisasi-organisasi yang menghadapi persoalan itu. Ia tidak pernah menjadi gambaran tentang di mana matahari berada.

## Apa yang sebenarnya dikandung sebuah zona

Catatan yang berwenang adalah **basis data zona waktu IANA**, disebut juga tzdata atau basis data Olson. Ia sebuah berkas teks, diperbarui beberapa kali setahun, dan setiap sistem operasi, peramban, serta bahasa pemrograman yang Anda pakai sedang membaca salah satu versinya.

Untuk tiap zona ia mencatat:

- sebuah pengenal, seperti `America/New_York` atau `Asia/Kathmandu`
- selisih terhadap UTC yang berlaku pada tiap kurun dalam sejarah zona itu
- aturan kapan selisih itu berubah, bila memang berubah
- singkatan untuk tiap kurun, di mana ada

Pengenalnya mengikuti pola `Wilayah/Tempat`, dan tempat itu adalah kota yang mewakili, bukan negara — sebab negara pecah, bergabung, dan mengubah aturannya lepas dari batas-batasnya. `America/Argentina/Buenos_Aires` ada karena provinsi-provinsi Argentina pernah memelihara waktu yang berbeda satu sama lain.

Perhatikan apa yang bukan sebuah zona: ia bukan selisih. `America/New_York` bukan “UTC-5”. Ia zona yang selisihnya UTC-5 pada sebagian tahun dan UTC-4 pada sisanya, yang tetap di UTC-5 sepanjang tahun selama Perang Dunia II, dan yang memakai perangkat aturan berbeda sebelum 1966. Menyimpan “UTC-5” lalu menyebutnya New York adalah cacat zona waktu yang paling lazim dalam perangkat lunak.

## Aturan berubah, dan tidak berangsur-angsur

Pada 2016 Turki meninggalkan waktu musim panas dengan pemberitahuan sekitar tiga pekan, dan menetap permanen di UTC+3. Pada 2018 Korea Utara menggeser jamnya 30 menit untuk sejajar kembali dengan Selatan. Pada 2022 Iran menghapus waktu musim panas; tahun yang sama Meksiko meninggalkannya di sebagian besar wilayah. Mesir memberlakukannya lagi pada 2023 setelah menghapusnya pada 2014.

Masing-masing menjadi satu rilis tzdata, dan masing-masing merusak setiap sistem yang menanam tabel selisih di dalam kodenya. Itulah sebabnya mesin di balik tiap halaman situs ini membaca selisih dari salinan tzdata milik lingkungan jalannya, bukan dari apa pun yang disimpan di sini. Pembangunan ulang mengambil aturan yang baru; tidak ada yang perlu disunting.

## Mengapa selisih tidak semuanya jam bulat

Kira-kira seperlima penduduk dunia hidup dengan selisih yang bukan bilangan bulat jam dari UTC. India di UTC+05:30, dipilih sebagai satu zona kompromi bagi negara yang cukup lebar untuk dua. Nepal di UTC+05:45, dan empat puluh lima menit itu sebagian untuk menegaskan kemandirian dari waktu India. Kepulauan Chatham di UTC+12:45. Newfoundland di UTC-03:30.

Perangkat lunak yang menganggap selisih selalu jam bulat tidak sekadar membulatkan: ia menghasilkan jawaban yang meleset 30 atau 45 menit bagi ratusan juta orang — persis ukuran kesalahan yang ketahuan saat panggilan berlangsung, bukan sebelumnya.

## Dua hari dalam setahun ketika waktu setempat bukan sebuah fungsi

Waktu musim panas menciptakan dua keterputusan tiap tahun, dan itulah sebabnya “konversikan waktu setempat ini” lebih sulit daripada kelihatannya.

**Memajukan jam menghapus satu jam.** Di New York pada hari pergantian, sesudah 01.59.59 langsung datang 03.00.00. Waktu setempat 02.30 tidak pernah terjadi. Bila seseorang mengetiknya, tidak ada saat yang benar untuk dikembalikan — hanya ada kebijakan tentang apa yang dikembalikan sebagai gantinya.

**Memundurkan jam mengulang satu jam.** Pukul 01.30 terjadi dua kali, sekali pada waktu musim panas dan sekali lagi satu jam kemudian pada waktu standar. Waktu setempat sendirian benar-benar bermakna ganda; kita perlu tahu kemunculan mana yang dimaksud, dan hampir tidak ada antarmuka yang menanyakannya.

Setiap perkakas di situs ini menyelesaikan keduanya secara terbuka dan memberi tahu apa yang dilakukannya. Diam-diam memilih salah satu adalah cara sebuah entri kalender berakhir meleset satu jam tanpa ada yang menyadarinya sampai panggilan dimulai.

## Apa artinya dalam praktik

Tiga kaidah mengalir dari mekanisme ini, dan ketiganya menutup sebagian besar hal yang bisa salah:

1. **Simpan saat, bukan waktu setempat.** Cap waktu UTC tidak bermakna ganda. Waktu setempat adalah cap waktu ditambah zona ditambah kebijakan untuk dua hari yang merepotkan itu.
2. **Simpan pengenal zona, bukan selisihnya.** `Europe/London` selamat dari perubahan aturan; `UTC+0` tidak, dan lagi pula ia keliru separuh tahun.
3. **Konversikan pada saat menampilkan, dengan tzdata milik lingkungan.** Bukan pada saat menyimpan, dan jangan pernah dari tabel yang Anda pelihara sendiri.

Alasan situs ini terus menulis “per pembangunan terakhir” di samping selisih, dan menghitung waktu kini di peramban Anda, persis sama. Aturan itu bukan milik kami untuk dibekukan.
