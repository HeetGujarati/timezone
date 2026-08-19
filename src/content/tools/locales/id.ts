import type { PageCopy } from '../types.ts';

/**
 * Teks bahasa Indonesia. Bahasa Inggris adalah kontraknya: pemeriksaan tipe gagal bila ada bidang yang hilang.
 */
export const copy: PageCopy = {
  tools: {
    converter: {
      title: 'Konverter zona waktu',
      metaTitle: 'Konverter zona waktu untuk tanggal apa pun',
      description:
        'Ubah zona waktu mana pun ke zona lain, untuk tanggal apa pun. Memperhitungkan waktu musim panas serta selisih setengah jam dan 45 menit.',
      summary:
        'Pilih dua zona dan satu tanggal, dan konversinya tepat — termasuk pada dua hari dalam setahun ketika pergantian jam membuat waktu setempat mustahil atau bermakna ganda.',
      faqs: [
        {
          question: 'Apakah konverter ini memperhitungkan waktu musim panas?',
          answer:
            'Ya, termasuk dua hari yang merepotkan itu. Selisih diambil dari basis data IANA lewat peramban, jadi konversi pada tanggal pergantian memakai selisih yang benar-benar berlaku saat itu, bukan selisih hari ini. Kalau Anda memasukkan waktu setempat yang tidak pernah ada, atau yang terjadi dua kali, konverter mengatakannya alih-alih diam-diam memilih salah satu.',
        },
        {
          question: 'Mengapa selisih waktu antara dua kota berubah sepanjang tahun?',
          answer:
            'Karena kedua tempat jarang mengubah jam pada tanggal yang sama, dan sebagian tidak pernah mengubahnya. New York tertinggal 5 jam dari London hampir sepanjang tahun, tetapi 4 jam selama dua pekan di bulan Maret, karena Amerika Serikat memajukan jam dua sampai tiga pekan lebih awal daripada Eropa. Selalu hitung terhadap tanggal tertentu, jangan terhadap selisih yang Anda ingat.',
        },
        {
          question: 'Antara zona waktu apa saja saya bisa mengonversi?',
          answer:
            'Semua zona dalam basis data IANA — lebih dari 400 — termasuk selisih setengah jam dan 45 menit yang membuat kebanyakan konverter tersandung. India di UTC+05:30, Nepal di UTC+05:45, dan Kepulauan Chatham di UTC+12:45 ditangani persis, tanpa dibulatkan ke jam terdekat.',
        },
        {
          question: 'Apakah saya butuh JavaScript?',
          answer:
            'Untuk konverter langsungnya, ya. Selebihnya — selisih, tanggal pergantian jam, tabel rujukan jam demi jam, dan semua penjelasan — adalah bagian dari halaman yang sudah dirender lebih dulu dan tetap bekerja meski JavaScript dimatikan.',
        },
        {
          question: 'Apakah yang saya ketik di sini dikirim ke suatu tempat?',
          answer:
            'Tidak. Semua perhitungan berjalan di peramban Anda. Tidak ada server, tidak ada analitik, tidak ada kuki, dan tidak ada skrip pihak ketiga. Zona yang Anda pilih muncul di alamat halaman agar sebuah konversi bisa dibagikan atau ditandai, dan hanya ke sana perginya.',
        },
      ],
      sections: [
        {
          heading: 'Mengapa konversi zona waktu bisa meleset',
          paragraphs: [
            'Hampir semua kesalahan penjadwalan berasal dari salah satu dari empat sebab, dan keempatnya ditangani di sini alih-alih dibulatkan begitu saja.',
            'Selisih bukan konstanta. “New York tertinggal lima jam dari London” benar selama kira-kira sepuluh bulan dalam setahun. Selama sekitar tiga pekan pada musim semi dan satu pekan pada musim gugur, selisihnya empat jam, karena kedua kawasan mengubah jam pada tanggal yang berbeda. Konverter yang menyimpan selisih tetap per kota akan salah tepat pada hari-hari itu — dan itulah persis hari-hari ketika orang menjadwalkan rapat yang kemudian disesalinya.',
            'Tidak semua selisih berupa jam bulat. India 5 jam 30 menit di depan UTC. Nepal 5 jam 45 menit. Kepulauan Chatham 12 jam 45 menit, dan Pulau Lord Howe hanya bergeser 30 menit saat waktu musim panasnya dimulai. Kira-kira seperlima penduduk dunia hidup dengan selisih yang bukan jam bulat.',
            'Sebagian waktu setempat tidak pernah ada. Ketika jam dimajukan, satu jam terhapus. Di New York pada tanggal pergantian, setelah 01:59:59 langsung datang 03:00:00 — jadi 02:30 tidak pernah terjadi. Minta hampir semua perkakas mengonversi 02:30, dan mereka tetap menjawab dengan yakin. Yang ini memberi tahu Anda apa yang dilakukannya.',
            'Sebagian waktu setempat terjadi dua kali. Ketika jam dimundurkan, satu jam terulang. Pukul 01:30 datang sekali pada waktu musim panas dan sekali lagi, satu jam kemudian, pada waktu standar. Konverter ini mengambil kemunculan pertama, menyebutkannya, lalu menunjukkan yang kedua.',
          ],
        },
      ],
    },

    meetingPlanner: {
      title: 'Perencana rapat',
      metaTitle: 'Perencana rapat lintas zona waktu',
      description:
        'Tambahkan dua sampai sepuluh zona dan lihat pita 24 jam dengan jam kerja diarsir. Temukan jam yang sama-sama dimiliki, atau ketahui tidak ada.',
      summary:
        'Tambahkan zona tempat tim Anda bekerja: pita di bawah menampilkan seluruh hari sekaligus, dengan jam kerja diarsir — irisannya menjadi bentuk yang terlihat, bukan hitungan yang harus dikerjakan.',
      faqs: [
        {
          question: 'Berapa banyak zona waktu yang bisa saya tambahkan?',
          answer:
            'Antara dua dan sepuluh. Lewat sepuluh, pita berhenti terbaca sekali lihat, padahal itulah seluruh alasan memakai pita alih-alih daftar angka — jadi batas ini keputusan desain, bukan keterbatasan teknis.',
        },
        {
          question: 'Apa yang dihitung sebagai jam kerja?',
          answer:
            'Apa pun yang Anda tetapkan. Bawaannya 09.00 sampai 18.00 waktu setempat di setiap zona, dan kedua ujungnya bisa diatur. Satu jam sebelum dan sesudah jam kerja diarsir lebih terang: masih terjangkau, tetapi Anda sedang meminta tolong.',
        },
        {
          question: 'Mengapa sebagian baris menampilkan waktu berakhiran :30 atau :45?',
          answer:
            'Karena zona-zona itu memang bergeser setengah atau tiga perempat jam. India UTC+05:30, Nepal UTC+05:45, Kepulauan Chatham UTC+12:45. Setiap kolom pita adalah saat yang sama, jadi baris-baris itu menunjukkan bacaan setempat yang sesungguhnya, bukan yang dibulatkan.',
        },
        {
          question: 'Bagaimana kalau tidak ada irisan sama sekali?',
          answer:
            'Perencana mengatakannya terus terang, alih-alih menyodorkan jalan tengah yang tak pernah disetujui siapa pun. Los Angeles dan Mumbai tidak berbagi satu menit pun dari hari kerja 09.00–18.00, dan arsiran apa pun tidak mengubahnya — seseorang harus bergeser. Melebarkan jam kerja atau memecah rapat menjadi dua adalah pilihan yang jujur.',
        },
        {
          question: 'Apakah rencananya bertahan setelah halaman dimuat ulang?',
          answer:
            'Ya. Zona, tanggal, dan jam kerja Anda ditulis ke alamat halaman, jadi rencana bisa ditandai atau dikirim ke orang lain, dan mereka melihat persis yang Anda lihat. Daftar zona juga disimpan di peramban Anda supaya perencana mengingat tim Anda lain kali.',
        },
        {
          question: 'Apakah ia memperhitungkan waktu musim panas?',
          answer:
            'Ya, pada tanggal yang Anda pilih. Pilih tanggal di bulan Maret atau Oktober dan Anda akan melihat baris-baris bergeser satu terhadap yang lain, karena begitulah kenyataannya: setiap zona mengubah jamnya pada hari yang berbeda.',
        },
      ],
      sections: [
        {
          heading: 'Cara membaca pita',
          paragraphs: [
            'Setiap kolom adalah satu saat. Baca satu kolom dari atas ke bawah dan Anda melihat apa yang ditunjukkan jam di tiap tempat pada saat yang sama — persis hal yang membuat daftar selisih memaksa orang menghitung di kepala, dan persis hal yang sering salah.',
            'Tiga gradasi: jam kerja mendapat garis tepi berwarna di atasnya, satu jam di kedua sisinya lebih terang, sisanya rata. Garis tepi sama pentingnya dengan isian — pembedaannya tidak pernah bergantung pada warna semata, jadi tetap terbaca meski Anda tidak bisa memisahkan kedua biru itu.',
          ],
        },
        {
          heading: 'Ketika tidak ada irisan',
          paragraphs: [
            'Sebagian tim memang benar-benar tidak punya. Hari kerja 09.00–18.00 di Los Angeles dan hari yang sama di Mumbai tidak berbagi apa pun — hari kerja Mumbai berakhir sebelum Los Angeles bangun. New York dan Sydney bahkan lebih ganjil: mereka berbagi tepat satu jam dari November sampai Maret, ketika jaraknya 16 jam, dan sama sekali tidak berbagi apa pun dari April sampai Oktober, ketika jaraknya menyempit jadi 14. Dua kota yang sama, jawaban yang berlawanan, dan yang berubah hanyalah tanggalnya.',
            'Ketika itu terjadi, perencana mengatakannya alih-alih mengarsir sesuatu sambil berharap. Pilihan yang realistis adalah melebarkan jam kerja di satu sisi, bergantian menanggung panggilan yang tidak nyaman, atau berhenti bertemu secara serentak. Berpura-pura pukul 22.00 itu baik-baik saja adalah cara orang diam-diam kehabisan tenaga.',
          ],
        },
      ],
    },

    worldClock: {
      title: 'Jam dunia',
      metaTitle: 'Jam dunia: waktu di 80 kota',
      description:
        'Waktu setempat langsung di 80 kota besar, diurutkan dari timur ke barat. Cari kota mana pun, sematkan yang penting, dan lihat tanggal berganti.',
      summary:
        'Waktu setempat langsung di 80 kota, dari jam paling awal di bumi sampai yang paling akhir — cari untuk menyaring, dan sematkan kota yang sering Anda tengok: mereka tetap di atas.',
      faqs: [
        {
          question: 'Seberapa akurat jam-jam ini?',
          answer:
            'Semuanya membaca jam perangkat Anda lalu menerapkan selisih yang diperoleh peramban dari basis data IANA, jadi seakurat mesin Anda sendiri. Kalau jam komputer Anda meleset, semua jam di sini meleset sebesar itu juga — tidak ada apa pun di halaman ini yang datang dari server.',
        },
        {
          question: 'Bisakah kota saya tetap di atas?',
          answer:
            'Bisa. Sematkan sebuah kota dan ia pindah ke awal kisi, lalu tetap di sana pada kunjungan berikutnya. Sematan hanya hidup di peramban Anda; tidak ada yang dikirim ke mana pun dan tidak ada kuki yang dipasang.',
        },
        {
          question: 'Mengapa sebagian kota menampilkan tanggal yang berbeda?',
          answer:
            'Karena memang berbeda. Saat Senin malam di New York, di Tokyo sudah Selasa pagi. Tanggal di bawah setiap jam adalah tanggal kalender setempat kota itu, bukan tanggal Anda.',
        },
        {
          question: 'Mengapa Mumbai dan Kathmandu menampilkan waktu berakhiran :30 dan :45?',
          answer:
            'India berjalan pada UTC+05:30 dan Nepal pada UTC+05:45. Itu selisih yang sebenarnya, bukan kesalahan pembulatan — kira-kira seperlima penduduk dunia hidup dengan selisih yang bukan jam bulat.',
        },
      ],
      sections: [],
    },

    timeDifference: {
      title: 'Selisih waktu',
      metaTitle: 'Selisih waktu antara dua zona waktu',
      description:
        'Selisih saat ini antara dua tempat, plus setiap tanggal dalam setahun ke depan ketika selisih itu berubah karena salah satunya menggeser jam.',
      summary:
        'Pilih dua tempat dan lihat berapa jauh jaraknya sekarang — plus tanggal-tanggal persis dalam setahun ke depan ketika jarak itu berubah, bagian yang justru ditinggalkan kebanyakan perkakas.',
      faqs: [
        {
          question: 'Mengapa selisihnya tidak sama sepanjang tahun?',
          answer:
            'Karena kedua tempat mengubah jam pada tanggal yang berbeda, atau salah satunya tidak mengubah sama sekali. New York dan London terpaut 5 jam hampir sepanjang tahun, 4 jam selama tiga pekan di bulan Maret setelah Amerika Serikat memajukan jam dan sebelum Eropa melakukannya, dan 4 jam lagi selama sepekan di akhir Oktober setelah Eropa memundurkan jam dan sebelum Amerika Serikat melakukannya.',
        },
        {
          question: 'Tempat mana yang selisihnya tidak pernah berubah?',
          answer:
            'Pasangan mana pun yang keduanya tidak menerapkan waktu musim panas — India dan Jepang, misalnya, terpaut tetap 3 jam 30 menit. Pasangan di dalam blok regulasi yang sama juga stabil: semua zona Uni Eropa berganti pada saat yang sama, jadi Lisabon dan Athena tetap terpaut persis 2 jam sepanjang tahun.',
        },
        {
          question: 'Bagaimana selisihnya dihitung?',
          answer:
            'Dengan menanyakan selisih tiap zona kepada peramban pada saat yang sama, lalu menguranginya. Artinya, selisih itu benar pada detik Anda melihatnya, termasuk di tengah pergantian jam, alih-alih membacakan angka tersimpan yang benar bulan lalu.',
        },
        {
          question: 'Apa arti selisih negatif?',
          answer:
            'Artinya tempat kedua tertinggal dari tempat pertama. Justru karena itu halaman ini menulis “lebih awal” atau “lebih lambat” dengan kata-kata: tanda minus pada selisih waktu dibaca terbalik oleh kira-kira separuh orang.',
        },
      ],
      sections: [],
    },

    workingHoursOverlap: {
      title: 'Irisan jam kerja',
      metaTitle: 'Jam kerja bersama untuk tim tersebar',
      description:
        'Temukan jam persis yang dibagi sebuah tim tersebar, ditampilkan pada jam setempat masing-masing — atau ketahui dengan jujur bahwa tidak ada.',
      summary:
        'Tambahkan zona tempat tim Anda bekerja, dan Anda mendapat jendela persis ketika semua orang tersedia, pada jam masing-masing — serta jawaban terus terang saat tidak ada satu pun.',
      faqs: [
        {
          question: 'Apa yang dihitung sebagai jam kerja?',
          answer:
            'Bawaannya 09.00 sampai 18.00 waktu setempat untuk semua orang, dengan kedua ujung bisa diatur. Setiap zona sengaja diperlakukan sama, alih-alih menanam anggapan tentang negara mana yang mulai lebih pagi — tim yang benar-benar bekerja 10.00 sampai 19.00 sebaiknya menyebutkannya.',
        },
        {
          question: 'Bagaimana kalau tidak ada irisan?',
          answer:
            'Anda diberi tahu, berikut jendela terdekat ketika paling banyak orang berada di dalam jam kerjanya. Los Angeles dan Mumbai tidak berbagi satu menit pun dari hari 09.00–18.00; susunan kisi apa pun tidak mengubahnya. Pilihan yang jujur adalah melebarkan hari kerja di satu sisi, bergantian menanggung panggilan yang tidak nyaman, atau bekerja secara asinkron.',
        },
        {
          question: 'Apa bedanya dengan perencana rapat?',
          answer:
            'Perencana menampilkan seluruh hari sebagai pita supaya Anda melihat bentuknya. Perkakas ini menjawab pertanyaan yang lebih sempit dengan persis: menit mana yang dibagi bersama, dan menit itu terbaca pukul berapa pada jam masing-masing orang. Pakai perencana untuk menjajaki, pakai ini untuk memutuskan.',
        },
        {
          question: 'Apakah ia memperhitungkan waktu musim panas?',
          answer:
            'Ya, untuk hari ini. Jendela irisan bergeser satu jam ketika satu pihak sudah mengubah jamnya dan pihak lain belum — itulah sebabnya tim yang sama punya empat jam bersama di bulan Februari dan tiga jam di bulan Maret.',
        },
      ],
      sections: [],
    },

    unixTimestamp: {
      title: 'Konverter stempel waktu Unix',
      metaTitle: 'Konverter stempel waktu Unix ke tanggal',
      description:
        'Ubah stempel waktu Unix menjadi tanggal yang terbaca dan sebaliknya, di zona mana pun. Mengenali detik atau milidetik dan menampilkan pencacah langsung.',
      summary:
        'Tempel sebuah stempel waktu Unix untuk membacanya sebagai tanggal, atau pilih tanggal untuk mendapat stempelnya — konverter mengenali apakah angka Anda dalam detik atau milidetik dan memberi tahu asumsinya.',
      faqs: [
        {
          question: 'Detik atau milidetik — bagaimana ia tahu?',
          answer:
            'Dari besarannya. Stempel bernilai 1e11 ke atas diperlakukan sebagai milidetik, karena 1e11 detik jatuh di tahun 5138 dan tidak ada hal nyata yang sampai ke sana. Satuan yang dikenali ditampilkan di samping hasil alih-alih diterapkan diam-diam, sebab salah menebak di sini adalah kekeliruan sebesar seribu kali lipat yang mendaratkan Anda di tahun 1970.',
        },
        {
          question: 'Apa itu stempel waktu Unix?',
          answer:
            'Jumlah detik sejak 1 Januari 1970 pukul 00.00.00 UTC, tanpa menghitung detik kabisat. Ia satu angka tunggal tanpa zona waktu yang menempel, dan justru karena itulah sistem memakainya: dua mesin di mana pun di bumi yang membaca stempel yang sama sepakat pada saat yang sama.',
        },
        {
          question: 'Bisakah stempel waktu bernilai negatif?',
          answer:
            'Bisa. Segala hal sebelum 1970 bernilai negatif. Pendaratan Apollo 11 kira-kira -14.182.940. Konverter ini menangani nilai negatif ke dua arah.',
        },
        {
          question: 'Apa yang terjadi pada 2038?',
          answer:
            'Sistem yang menyimpan cacahan dalam bilangan bulat 32 bit bertanda kehabisan ruang pada 03.14.07 UTC, 19 Januari 2038. Detik berikutnya meluap menjadi angka negatif, yang dibaca sistem itu sebagai Desember 1901. Sebagian besar platform modern pindah ke cacahan 64 bit bertahun-tahun lalu; yang masih terpapar adalah sistem tertanam dan sistem warisan.',
        },
        {
          question: 'Apakah zona waktu memengaruhi stempelnya?',
          answer:
            'Stempelnya sendiri tidak — ia selalu dihitung dari sebuah saat dalam UTC. Zona hanya menentukan bagaimana saat itu ditampilkan sebagai tanggal dan jam, serta bacaan setempat mana yang kembali ke angka mana.',
        },
      ],
      sections: [],
    },

    durationCalculator: {
      title: 'Kalkulator durasi',
      metaTitle: 'Kalkulator durasi lintas zona waktu',
      description:
        'Hitung waktu antara dua tanggal-jam, masing-masing di zonanya sendiri. Menangani waktu musim panas dengan benar: hari 23 jam dilaporkan 23 jam.',
      summary:
        'Tetapkan awal dan akhir — masing-masing di zonanya sendiri bila berbeda — dan Anda mendapat waktu yang benar-benar berlalu, termasuk hari-hari yang panjangnya 23 atau 25 jam.',
      faqs: [
        {
          question: 'Mengapa satu hari kadang keluar sebagai 23 atau 25 jam?',
          answer:
            'Karena memang begitu. Pada hari jam dimajukan, dari tengah malam ke tengah malam berlalu 23 jam; pada hari jam dimundurkan, 25 jam. Kalkulator ini menyelesaikan kedua ujung menjadi saat mutlak sebelum mengurangkan, jadi ia melaporkan waktu yang sungguh berlalu, bukan waktu yang disarankan kalender.',
        },
        {
          question: 'Bisakah kedua ujung berada di zona waktu berbeda?',
          answer:
            'Bisa, dan justru itu maksudnya. Penerbangan yang lepas landas dari Tokyo pukul 17.00 dan mendarat di San Francisco pukul 09.30 pagi yang sama memakan waktu sembilan setengah jam, bukan minus tujuh setengah. Tetapkan tiap ujung ke zonanya sendiri dan hitungannya beres.',
        },
        {
          question: 'Apakah detik kabisat ikut dihitung?',
          answer:
            'Tidak. Peramban tidak mengeluarkannya — jam JavaScript mengabaikan detik kabisat sepenuhnya, jadi rentang yang melintasinya dilaporkan kurang satu detik. Sepanjang sejarah UTC totalnya 27 detik, yang penting untuk navigasi satelit dan tidak penting untuk apa pun yang mungkin Anda ukur di sini.',
        },
        {
          question: 'Bagaimana kalau akhirnya lebih dulu daripada awalnya?',
          answer:
            'Kalkulator mengatakannya, dan tetap melaporkan besarannya. Durasi negatif biasanya salah ketik, dan membalik tandanya diam-diam justru akan menyembunyikannya.',
        },
      ],
      sections: [
        {
          heading: 'Mengapa aritmetika kalender bukan aritmetika jam',
          paragraphs: [
            '“Satu hari kemudian” dan “24 jam kemudian” adalah dua perintah berbeda, dan dua kali setahun keduanya memberi jawaban berbeda. Kalau sebuah tugas malam dijadwalkan pukul 02.30 waktu setempat, ia berjalan dua kali pada satu pagi musim gugur dan tidak berjalan sama sekali pada satu pagi musim semi. Kalau dijadwalkan setiap 86.400 detik, ia justru melenceng satu jam dari 02.30.',
            'Tidak ada satu pun dari keduanya yang merupakan kesalahan; mereka menjawab pertanyaan yang berbeda. Masalah muncul ketika kode melakukan yang satu sementara orangnya mengharapkan yang lain. Kalkulator ini selalu menjawab pertanyaan jam — berapa banyak waktu yang benar-benar berlalu — dan menampilkan hari kalender di sebelahnya.',
          ],
        },
      ],
    },

    countdown: {
      title: 'Hitung mundur',
      metaTitle: 'Hitung mundur ke tanggal dan zona mana pun',
      description:
        'Hitung mundur ke saat mana pun di zona mana pun, lalu bagikan sebagai tautan. Tanpa akun, tanpa penyimpanan — semuanya hidup di alamat halaman.',
      summary:
        'Pilih satu saat dan satu zona, dan hitung mundur di bawah berjalan menujunya — seluruhnya hidup di alamat halaman, jadi membagikannya berarti menyalin bilah alamat.',
      faqs: [
        {
          question: 'Bagaimana cara membagikan hitung mundur?',
          answer:
            'Siapkan lalu salin bilah alamat — setiap ruas ada di alamat itu. Siapa pun yang membukanya melihat hitung mundur yang sama menuju saat yang sama, dicacah oleh jam perangkatnya sendiri. Tidak ada akun, tidak ada catatan tersimpan, dan tidak ada apa pun di server, karena memang tidak ada server.',
        },
        {
          question: 'Apakah penerimanya melihatnya dalam zona waktunya sendiri?',
          answer:
            'Mereka melihat hitung mundur yang sama, karena hitung mundur mengukur jarak ke satu saat dan jarak itu sama di mana pun. Tanggal dan jam sasaran ditampilkan dalam zona yang Anda pilih, supaya semua orang tahu saat setempat mana yang dimaksud.',
        },
        {
          question: 'Apa yang terjadi ketika mencapai nol?',
          answer:
            'Ia menyatakan saat itu sudah lewat lalu berhenti. Ia tidak mulai menghitung maju — kalau Anda ingin waktu yang berlalu sejak sebuah peristiwa, kalkulator durasi menjawab itu dengan benar.',
        },
        {
          question: 'Bisakah saya menghitung mundur ke waktu yang tidak ada?',
          answer:
            'Kalau Anda memilih waktu setempat di dalam celah saat jam dimajukan, hitung mundur berpindah ke saat setara sesudah pergantian dan memberi tahu Anda. Itu kebijakan yang sama yang dipakai setiap perkakas di situs ini.',
        },
      ],
      sections: [
        {
          heading: 'Mengapa seluruh hitung mundur ada di tautannya',
          paragraphs: [
            'Kebanyakan perkakas hitung mundur meminta Anda membuat akun supaya mereka bisa menyimpan hitung mundur Anda di server mereka dan menaruh iklan di sebelahnya. Di sini tidak ada server, jadi keadaannya harus tinggal di tempat yang bisa dibawa tautan — dan itu ternyata lebih baik untuk semua orang. Tidak ada yang perlu didaftarkan, tidak ada yang perlu dihapus kemudian, tidak ada yang berhenti bekerja ketika sebuah perusahaan tutup.',
            'Satu hal yang perlu diketahui: karena judulnya ikut berjalan di alamat halaman, perlakukan tautan hitung mundur dari orang asing seperti Anda memperlakukan tautan mana pun. Judul dibersihkan dari segala yang bukan teks biasa dan selalu ditampilkan sebagai teks, tidak pernah sebagai markah.',
          ],
        },
      ],
    },

    utcTime: {
      title: 'Waktu UTC',
      metaTitle: 'Waktu UTC sekarang — waktu universal terkoordinasi',
      description:
        'Waktu UTC saat ini yang berdetak langsung, plus apa sebenarnya UTC itu, bedanya dengan GMT, dan terhadap apa selisih setiap zona diukur.',
      summary:
        'UTC adalah jam rujukan yang menjadi dasar definisi setiap zona waktu lain — ia tidak pernah bergeser untuk waktu musim panas, dan bacaan di bawah adalah jam perangkat Anda yang dinyatakan dalam UTC.',
      faqs: [
        {
          question: 'Apa itu UTC?',
          answer:
            'Waktu universal terkoordinasi adalah rujukan yang menjadi dasar definisi setiap zona waktu lain. Ia bukan zona yang dihuni siapa pun — ia garis dasarnya. Setiap selisih yang Anda lihat, dari UTC-12 sampai UTC+14, adalah jarak dari jam ini.',
        },
        {
          question: 'Apakah UTC sama dengan GMT?',
          answer:
            'Untuk keperluan sehari-hari keduanya menunjukkan bacaan yang sama, tetapi keduanya hal yang berbeda. GMT adalah zona waktu, ditetapkan oleh posisi matahari di meridian Greenwich, dan Britania meninggalkannya setiap musim panas. UTC adalah standar waktu, dijaga sekitar 450 jam atom dan tidak pernah disetel untuk waktu musim panas. Kalau maksud Anda “rujukannya”, sebut UTC.',
        },
        {
          question: 'Mengapa disingkat UTC dan bukan CUT?',
          answer:
            'Karena tidak ada akronim yang menang, baik yang Inggris maupun yang Prancis. Penutur Inggris ingin CUT untuk “coordinated universal time”, penutur Prancis ingin TUC untuk “temps universel coordonné”, dan Persatuan Telekomunikasi Internasional memutuskan UTC — yang tidak cocok dengan satu bahasa pun sehingga menyinggung keduanya sama rata.',
        },
        {
          question: 'Apakah UTC menerapkan waktu musim panas?',
          answer:
            'Tidak pernah. Justru itu seluruh maksudnya. UTC tidak bergeser, dan karena itulah server, penerbangan, pelayaran, serta setiap sistem tersebar yang menuntut dua mesin sepakat kapan sesuatu terjadi memakainya alih-alih zona setempat.',
        },
        {
          question: 'Bagaimana dengan detik kabisat?',
          answer:
            'UTC sesekali disisipi detik kabisat agar tetap dalam 0,9 detik dari rotasi bumi yang sebenarnya — 27 kali sejak 1972, yang terakhir pada akhir 2016. Pada 2022 Konferensi Umum Berat dan Ukuran memilih menghentikan penambahannya paling lambat 2035. Peramban Anda tidak mengeluarkan detik kabisat, jadi halaman ini pun tidak.',
        },
      ],
      sections: [
        {
          heading: 'Mengapa semuanya diukur dari sini',
          paragraphs: [
            'Sebelum 1884, setiap kota memelihara jamnya sendiri, disetel menurut tengah harinya sendiri. Itu berjalan baik sampai kereta api datang; pada titik itu dua kota berjarak enam puluh kilometer yang berselisih dua belas menit berhenti menjadi keanehan dan mulai menjadi risiko tabrakan. Konferensi Meridian Internasional memilih Greenwich sebagai meridian utama, dan sistem selisih modern lahir dari sana.',
            'UTC menggantikan Waktu Rata-rata Greenwich sebagai standar teknis pada 1972. Bedanya lebih berarti daripada kedengarannya: GMT ditetapkan oleh bumi, yang bergoyang, sedangkan UTC ditetapkan oleh atom sesium, yang tidak. Keduanya dijaga agar tidak terpaut lebih dari satu detik secara manual.',
            'Kalau Anda menyimpan stempel waktu di basis data, mencatat sebuah peristiwa, atau menjadwalkan apa pun yang harus disepakati dua mesin, simpanlah dalam UTC dan konversikan saat menampilkan. Menyimpan waktu setempat adalah cara sistem berakhir dengan satu jam yang muncul dua kali setahun dan sebuah tiket dukungan yang sepadan.',
          ],
        },
      ],
    },

    dstChanges: {
      title: 'Pergantian waktu musim panas',
      metaTitle: 'Pergantian waktu musim panas tahun ini dan depan',
      description:
        'Setiap pergantian jam terjadwal untuk tahun ini dan tahun depan, dengan tanggal persis, jam setempat pergantian, dan selisih sebelum serta sesudahnya.',
      summary:
        'Setiap tanggal di bawah berasal dari basis data IANA, lengkap dengan saat setempat persis ketika pergantian berlaku — dan kota-kota yang tidak pernah mengubah jamnya didaftar terpisah.',
      faqs: [
        {
          question: 'Negara mana saja yang sudah menghapus waktu musim panas?',
          answer:
            'Rusia berhenti pada 2014, Turki pada 2016, Iran pada 2022, dan Meksiko pada 2022 untuk sebagian besar wilayahnya; Brasil pada 2019 setelah puluhan tahun memakainya. Jepang, India, Tiongkok, serta hampir seluruh Afrika dan Asia Tenggara tidak pernah memakainya sama sekali. Kira-kira sepertiga dunia menerapkannya; sisanya menyimak perdebatan enam bulanan itu dengan penuh minat.',
        },
        {
          question: 'Apakah Uni Eropa masih berencana menghapusnya?',
          answer:
            'Parlemen Eropa memilih mengakhiri pergantian jam musiman pada 2019, tetapi arahannya mandek: negara-negara anggota tidak dapat sepakat antara waktu musim panas permanen atau waktu standar permanen, dan tambal sulam akan mengoyak zona waktu pasar tunggal. Sampai itu terselesaikan, tanggal-tanggal di halaman ini tetap berlaku.',
        },
        {
          question: 'Mengapa Pulau Lord Howe hanya bergeser 30 menit?',
          answer:
            'Karena mereka memutuskan satu jam terlalu banyak. Lord Howe, di lepas pantai timur Australia, berpindah dari UTC+10:30 ke UTC+11:00 — satu-satunya pergantian waktu musim panas setengah jam di dunia. Ia juga alasan mengapa pustaka waktu mana pun yang menganggap pergeserannya selalu satu jam diam-diam keliru untuk sekitar 380 orang.',
        },
        {
          question: 'Jam berapa sebenarnya jam-jam itu berganti?',
          answer:
            'Beragam. Amerika Serikat berganti pukul 02.00 waktu setempat, Uni Eropa pukul 01.00 UTC — artinya semua zona Uni Eropa berganti pada saat yang sama tetapi pada jam setempat yang berbeda. Australia berganti pukul 02.00 setempat, Chili pukul 24.00. Kolom jam setempat menampilkan bacaan terakhir sebelum tiap pergantian.',
        },
        {
          question: 'Seberapa sering halaman ini diperbarui?',
          answer:
            'Ia dibangun ulang setiap bulan, dan juga pada 1 Maret, 1 April, 1 Oktober, dan 1 November, supaya perubahan apa pun pada basis data IANA tertangkap sebelum tanggal yang terpengaruh. Pemerintah mengumumkan perubahan semacam ini dengan tenggang mulai dari setahun sampai dua pekan.',
        },
      ],
      sections: [],
    },
  },

  hubs: {
    convert: {
      title: 'Konversi zona waktu',
      metaTitle: 'Konversi zona waktu antarkota',
      description:
        'Semua konversi pasangan kota dan singkatan di situs ini, masing-masing dengan tabel jam demi jam, tanggal waktu musim panas, dan jam untuk menelepon.',
      summary:
        'Setiap konversi membawa tabel jam demi jam, tanggal waktu musim panas kedua kota, dan jam-jam ketika menelepon benar-benar memungkinkan.',
    },
    cities: {
      title: 'Waktu saat ini menurut kota',
      metaTitle: 'Waktu saat ini menurut kota di tiap benua',
      description:
        'Waktu setempat, selisih UTC, dan tanggal waktu musim panas untuk 80 kota di seluruh benua berpenghuni.',
      summary:
        'Setiap halaman membawa jam langsung, tanggal waktu musim panas yang persis untuk zona itu, matahari terbit dan terbenam yang dihitung dari koordinat kota, serta konversi ke pusat-pusat besar.',
    },
    guides: {
      title: 'Panduan',
      metaTitle: 'Panduan zona waktu, UTC, dan waktu musim panas',
      description:
        'Panduan tentang cara kerja zona waktu, apa itu UTC, mengapa ada waktu musim panas, dan cara menangani semuanya di dalam kode tanpa keliru.',
      summary:
        'Bagaimana zona waktu benar-benar bekerja — mekanismenya, sejarahnya, dan cara-cara khusus perangkat lunak salah menanganinya. Ditulis untuk dibaca sekali dan diingat, bukan untuk menaikkan peringkat.',
    },
  },

  generated: {
    hourByHour: 'Jam demi jam',
    daylightSaving: 'Waktu musim panas',
    whenYouCanTalk: 'Kapan Anda benar-benar bisa bicara',
    reference: 'Rujukan',
    zoneFacts: 'Fakta zona',
    sunriseSunset: 'Matahari terbit dan terbenam',
    againstHubs: 'Terhadap pusat-pusat besar',
    convertTo: 'Konversikan ke',
    exampleNote:
      'Selisih dan tanggal dihitung saat pembangunan situs dari basis data IANA. Waktu langsung dirender di peramban Anda.',
    sunNote:
      'Dihitung dari lintang dan bujur kota dengan algoritma posisi matahari NOAA — tanpa API, tanpa panggilan jaringan.',
    noDstNote:
      'Kota ini tidak menerapkan waktu musim panas. Selisihnya dari UTC sama pada setiap hari sepanjang tahun.',
    ambiguousPanelHeading: 'Huruf-huruf ini berarti lebih dari satu hal',
    ambiguousPanelBody:
      'Kalau yang Anda maksud salah satu yang lain, selisih di bawah keliru untuk Anda — dan persis begitulah rapat dijadwalkan pada jam yang salah.',
    abbreviationTableNote:
      'Dihitung pada tanggal ketika singkatan ini benar-benar berlaku — memakai hari ini akan keliru selama separuh tahun.',
  },
};

export default copy;
