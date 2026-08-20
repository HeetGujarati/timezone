---
title: 'Zona waktu di dalam kode, panduan praktis'
description: 'Simpan UTC, pertahankan pengenal zona, konversikan saat ditampilkan, jangan pernah membuat tabel selisih. Kaidahnya dan alasan di balik tiap kaidah.'
summary: 'Hampir semua kutu zona waktu berpangkal pada salah satu dari empat kekeliruan. Inilah yang seharusnya dilakukan, dalam JavaScript, Python, Java, Go, dan SQL, lengkap dengan alasannya.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords:
  [
    'zona waktu di kode',
    'praktik baik tanggal dan waktu',
    'menyimpan stempel waktu',
    'utc di basis data',
  ]
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

Hampir semua kutu zona waktu di lingkungan produksi berpangkal pada salah satu dari empat kekeliruan: menyimpan waktu setempat, menyimpan selisih alih-alih zona, mengonversi di lapisan yang keliru, atau membangun tabel selisih dengan tangan. Semua yang berikut ini mengalir dari upaya menghindarinya.

## Kaidah 1: simpan saat dalam UTC

Sebuah saat adalah titik pada garis waktu. Waktu setempat adalah bacaan jam dinding, yang memerlukan sebuah zona dan sebuah kebijakan penjernihan sebelum ia bermakna apa pun.

```sql
-- Baik: sebuah saat
created_at TIMESTAMPTZ NOT NULL

-- Buruk: bacaan jam dinding tanpa zona
created_at TIMESTAMP NOT NULL
```

`TIMESTAMPTZ` pada PostgreSQL tidak menyimpan zona — ia menormalkan ke UTC saat menulis dan mengonversi saat membaca. Itu persis yang Anda inginkan untuk «kapan ini terjadi».

## Kaidah 2: simpan pengenal zona, bukan selisihnya

Kalau Anda perlu tahu _di mana_ — untuk acara berulang, preferensi pengguna, jam buka sebuah usaha — simpanlah `Europe/London`, bukan `+01:00`.

Selisih adalah fakta tentang satu saat. Zona adalah seperangkat kaidah yang selamat meski suatu pemerintah berubah pikiran. Britania berada di `+00:00` pada Januari dan `+01:00` pada Juli; menyimpan salah satunya lalu menyebutnya «zona pengguna» keliru selama separuh tahun.

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- waktu jam dinding yang mereka pilih
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- saat yang telah diselesaikan, dihitung ulang bila kaidah berubah
```

Untuk acara berulang, waktu setempat dan zonanya adalah sumber kebenaran; saat dalam UTC hanyalah indeks turunan. Bila tzdata berubah — dan itu terjadi beberapa kali setahun — kolom turunan dibangkitkan ulang dan pukul 09:00 milik pengguna tetap 09:00.

## Kaidah 3: konversikan di tepi

Nalar bisnis bekerja dengan saat. Konversi menjadi waktu setempat yang terbaca manusia terjadi pada momen selambat mungkin, di lapisan yang tahu siapa pembacanya.

Akibat lanjutannya lebih penting: **jangan pernah biarkan zona milik peladen sendiri merembes ke dalam perilaku.** Setel `TZ=UTC` di lingkungan penggelaran Anda dan perlakukan setiap jalur kode yang hasilnya bergantung pada setelan lokal peladen sebagai kutu. Inilah golongan kegagalan yang baru muncul ketika seseorang menggelar ke wilayah kedua.

## Kaidah 4: jangan pernah membangun tabel selisih

Setiap lingkungan jalan membawa basis data IANA. Pakailah.

**JavaScript**

```js
// Memformat dalam sebuah zona
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// Memperoleh selisih tanpa pustaka: bandingkan jam dinding zona itu dengan UTC
function offsetMinutes(timeZone, instant) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return (asUtc - Math.floor(instant / 1000) * 1000) / 60000;
}
```

Setel `hourCycle: 'h23'` secara tegas. Beberapa versi ICU melaporkan tengah malam sebagai jam 24 di bawah `en-US`, yang menggeser tanggal sehari dan merupakan kutu yang sungguh menyiksa untuk ditemukan.

**Python**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # pustaka baku sejak 3.9

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

Jangan pernah memakai `datetime.utcnow()`. Ia mengembalikan tanggal naif yang _tampak_ seperti UTC tetapi tak membawa zona, dan mencampurnya dengan tanggal yang sadar zona akan melempar galat pada saat terburuk. `datetime.now(timezone.utc)` adalah panggilan yang benar.

**Java**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time` dirancang dengan baik: `Instant` untuk titik pada garis waktu, `LocalDateTime` untuk bacaan jam dinding tanpa zona, `ZonedDateTime` untuk keduanya sekaligus. Sistem tipenya menegakkan pembedaan yang terus ditekankan panduan ini.

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation` membaca tzdata sistem. Di dalam kontainer kosong tak ada berkas itu — impor `_ "time/tzdata"` untuk menanamkannya ke dalam biner, atau setiap pencarian zona diam-diam jatuh ke UTC.

## Dua hari dalam setahun

Memajukan jam menghapus satu jam; memundurkannya mengulang satu jam. Pilihlah satu kebijakan, terapkan secara ajek, dan beri tahu pengguna apa yang Anda lakukan:

- **Waktu setempat yang tak ada** (02:30 pada tanggal musim semi Amerika Serikat): majukan sebesar lebar jurangnya, sehingga 02:30 menjadi 03:30.
- **Waktu setempat yang bermakna ganda** (01:30 pada tanggal musim gugur Amerika Serikat): ambil kemunculan pertama, yang lebih awal.

Itulah kebijakan yang dipakai situs ini, dan keduanya cocok dengan setelan bawaan `disambiguation: 'compatible'` pada `Temporal` di ECMAScript — layak dicocokkan agar perilaku Anda sejalan dengan platformnya.

Jurang itu tak selalu satu jam. Pulau Lord Howe bergeser 30 menit, jadi bacalah lebarnya dari peralihannya alih-alih mengandaikannya.

## Pengujian

Empat kasus menangkap sebagian besarnya:

1. **Zona setengah jam** — `Asia/Kolkata` (+05:30). Menangkap andaian jam bulat.
2. **Zona 45 menit** — `Asia/Kathmandu` (+05:45). Menangkap andaian setengah jam.
3. **Zona belahan selatan** — `Australia/Sydney`. Menangkap anggapan «musim panas berarti Juni».
4. **Pulau Lord Howe** — `Australia/Lord_Howe`. Menangkap pergeseran 60 menit yang ditanam dalam kode, dan tak ada lagi yang bisa menangkapnya.

Tambahkan satu tanggal maju dan satu tanggal mundur untuk tiap zona tempat pengguna Anda benar-benar berada, lalu patok versi tzdata di jalur integrasi agar pembaruan basis data tak menggagalkan bangunan karena alasan yang keliru.

## Acara berulang adalah persoalan yang lain

Acara sekali jalan adalah sebuah saat. Acara berulang adalah sebuah kaidah, dan keduanya menuntut penyimpanan yang berbeda.

«Setiap Selasa pukul 09:00 di Europe/London» bukanlah «setiap 604800 detik terhitung dari saat ini». Keduanya berpisah begitu Britania mengubah jamnya: kaidah itu menahan rapat pada pukul 09:00 setempat, sedangkan selang waktu menghanyutkannya ke 08:00 atau 10:00.

Simpanlah kaidahnya — waktu setempat, pengenal zona, pola perulangan — lalu wujudkan saat-saatnya dari sana. Ketika tzdata berubah, bangkitkan ulang saat yang telah diwujudkan; jangan memigrasikannya. Kaidah itulah yang disetujui pengguna.

Kasus-kasus canggung mengalir dari dua keterputusan tahunan itu. Rapat pukul 02:30 setiap hari akan mendapati bahwa pada satu hari musim semi waktu itu tak ada, dan pada satu hari musim gugur ia terjadi dua kali. Pilih satu kebijakan, terapkan secara ajek, dan sadarilah bahwa sistem kalender yang berbeda memilih kebijakan yang berbeda — karena itulah acara berulang yang sama dapat muncul terpaut satu jam pada kalender dua orang, tepat dua hari dalam setahun.

## Catatan tentang `Temporal`

Antarmuka `Temporal` pada ECMAScript menggantikan `Date` dengan tipe-tipe yang membedakan saat, waktu jam dinding, dan tanggal-waktu berzona, seperti pada `java.time`. `Temporal.ZonedDateTime` membawa pengenal zona; `Temporal.Instant` adalah titik pada garis waktu; `Temporal.PlainDateTime` adalah bacaan jam dinding tanpa zona, dan sistem tipenya mencegah Anda mengacaukannya.

Pilihan `disambiguation` miliknya membeberkan persis kebijakan dua hari setahun yang terus disinggung panduan ini: `'compatible'` (bawaannya — maju melewati jurang, ambil yang lebih awal dari pasangan bermakna ganda), `'earlier'`, `'later'`, dan `'reject'`. Yang terakhir layak dipertimbangkan untuk hal apa pun yang, bila diam-diam meleset satu jam, lebih buruk daripada sebuah galat.
