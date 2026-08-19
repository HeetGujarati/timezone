---
title: "EST neden çift anlamlı ve yerine ne kullanmalı"
description: "IST üç ayrı şey demek, CST dört. Saat dilimi kısaltmaları birer tanımlayıcı değildir ve öyle sanmak gerçek hatalar doğurur."
summary: "Saat dilimi kısaltmaları, sahibi bir kurum ve teklik güvencesi olmayan gayriresmî etiketlerdir. IST Hindistan, İrlanda ve İsrail demektir; CST Amerika, Çin ve Küba. Bunun yerine IANA tanımlayıcılarını kullanın."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 10
keywords: ['est çift anlamlı', 'saat dilimi kısaltmaları', 'ist ne demek', 'cst saat dilimi']
related: ['how-time-zones-work', 'time-zones-in-code', 'what-utc-really-is']
---

Bir takvim davetinde „14.00 IST“ yazıyor. Gönderene bağlı olarak bu 08.30 UTC, 13.00 UTC ya da 12.00 UTC’dir. Dizgede hangisi olduğunu söyleyen hiçbir şey yoktur ve üç okuma da doğru kullanımdır.

Saat dilimi kısaltmaları gayriresmîdir. Hiçbir standart kurumu onları atamaz, hiçbiri tekliklerini güvenceye almaz ve birkaçı hâlen tartışmalıdır. Bağlamı paylaşan insanlar arasındaki konuşmada işe yararlar; başka her yerde güvensizdirler.

## Önemli olan çakışmalar

**IST** — üçü de kullanımda olan üç anlam:

| Anlam                | Fark      | Dilim                          |
| -------------------- | --------- | ------------------------------ |
| Indian Standard Time | UTC+05:30 | `Asia/Kolkata`                 |
| Irish Standard Time  | UTC+01:00 | `Europe/Dublin` (yalnız yazın) |
| Israel Standard Time | UTC+02:00 | `Asia/Jerusalem`               |

Hindistan ile İrlanda arasında dört buçuk saat var. Yanlış IST’ye kurulmuş bir toplantı biraz erken değildir; neredeyse bir iş gününü ıskalar.

**CST** — dört anlam:

| Anlam                                  | Fark      | Dilim                |
| -------------------------------------- | --------- | -------------------- |
| Central Standard Time (Kuzey Amerika)  | UTC-06:00 | `America/Chicago`    |
| China Standard Time                    | UTC+08:00 | `Asia/Shanghai`      |
| Cuba Standard Time                     | UTC-05:00 | `America/Havana`     |
| Central Standard Time (Avustralya)     | UTC+09:30 | `Australia/Adelaide` |

Chicago ile Şanghay arasında on dört saat var.

**PST** — UTC-08:00’de Pacific Standard Time ve UTC+08:00’de Philippine Standard Time. Tam on altı saatlik fark; yani bir yanlışlık başka bir takvim gününe düşer.

**BST** — UTC+01:00’de British Summer Time ve UTC+06:00’da Bangladesh Standard Time.

**EST** — Kuzey Amerika’da UTC-05:00’teki Eastern Standard Time ve tarihsel olarak, AEST yerleşmeden önce Avustralya’nın doğu eyaletleri için UTC+10:00’da kullandığı kısaltma. Eski Avustralya belgeleri hâlâ çıplak biçimi kullanır.

## Öteki sorun: kısaltmalar mevsimliktir

Bir kısaltma tek anlamlı olduğu yerde bile yılın yalnızca yarısını adlandırır.

`America/New_York` kasımdan marta EST, marttan kasıma EDT’dir. Yani temmuzda „EST“ var olan hiçbir saati tarif etmez; dilim o sırada EDT’dedir. İnsanlar yine de „New York saati“ demek isteyerek böyle yazar ve bunu harfi harfine alan bir sistem yedi ay boyunca bir saat yanlış hesaplar.

„EST“nin internetteki en yanlış kullanılan kısaltma olmasının sebebi budur: bir yerin adı gibi kullanılır, oysa o yerdeki bir mevsimin adıdır.

## Dilimlerin çoğunun hiç kısaltması yok

İngilizce konuşulan dünyanın dilimlerinin çoğunda harf kısaltmaları vardır. Dilimlerin çoğunda yoktur.

Tokyo, Şanghay ve São Paulo’nun, herhangi bir İngilizce yerelin kullandığı ICU verisinde harf kısaltması yoktur; „GMT+9“, „GMT+8“ ve „GMT-3“ olarak bildirilirler. Japonya için „JST“ yazıldığını görürsünüz ve anlaşılır, ama bu veri değil, teamüldür.

Bu da saat dilimi aracı kuran herkes için apaçık bir cazibe doğurur: boşlukları doldurmak. Akla yatkın göründüğü için „JST“ uydurmak, Brezilya için „BRT“, Katmandu için bir şeyler. Bu site bunu bilerek yapmaz. Hiçbir yerelde harf yoksa farkı gösterir — çünkü verdiği tek söz, verinin tahminden değil IANA veritabanından geldiğidir; uydurulmuş bir kısaltma da tam olarak, bir başvuru kaynağını güvenilmez kılan türden akla yatkın bir yalandır.

## Yerine ne kullanmalı

**IANA tanımlayıcıları.** `America/New_York`, `Asia/Kolkata`, `Europe/Dublin`. Bunlar tek, kararlı ve bir mevsimi değil, kural tarihi olan bir yeri adlandırır.

Kural değişikliklerinden de sağ çıkarlar. Türkiye 2016’da yaz saatini kaldırdığında `Europe/Istanbul` Türkiye anlamına gelmeye devam etti. „EET“ ya da „EEST“ye bağlanmış her kodu değiştirmek gerekti.

**İnsanlara yazarken** şehri ve farkı söyleyin: „Mumbai’de 14.00 (UTC+05:30)“. Nerede olursa olsun okuyan kişi, hangi IST’yi kastettiğinizi bilmeden harekete geçebilir.

**Takvim davetlerinde** dilimi takvimin eklemesine izin verin. Her modern takvim, olayla birlikte bir dilim tanımlayıcısı saklar ve her katılımcı için çevirir. Başlığa bir kısaltma yazmak tam da bunu boşa çıkarır.

**Arayüzlerde ve veride** açık bir fark ya da `Z` ile ISO 8601 kullanın; yalnızca _hangi fark_ değil _nerede_ olduğunu bilmeniz gerektiğinde tanımlayıcıyı ayrıca taşıyın.

## Birini okumak zorunda kaldığınızda

Bir kısaltma geldiyse ve soramıyorsanız bağlamdan yararlanın:

- Kim göndermiş? Hintli bir şirket Hindistan’ı, İrlandalı bir şirket İrlanda’yı kasteder.
- Önerilen saati onlar için makul kılan fark hangisi olurdu? Kimse görüşmeyi 03.00’e koymaz.
- Yazışmada bir şehir geçiyor mu? Bir şehir meseleyi tamamen çözer.

Ve iş ciddiyse — bir müşteri görüşmesi, bir teslim tarihi, bir yayına alma penceresi — sorun. „Hindistan mı İrlanda mı?“ demenin on saniyesi, alternatifinden ucuzdur; üstelik sorduğunuz kişi büyük olasılıkla aynı şeyi kendi de merak etmiştir.

## Güvenli olan kısaltmalar

Her kısaltma tartışmalı değildir. Birkaçı pratikte tektir ve düz metinde makul ölçüde güvenlidir — kodda yine de değil:

- **UTC** — tanımı gereği tek anlam
- **CEST** — Central European Summer Time, tek
- **AEDT** / **AEST** — Australian Eastern, A öneki benimsendiğinden beri açık
- **NZDT** / **NZST** — Yeni Zelanda
- **JST** — Japonya; veriyle değil teamülle. ICU bunu hiçbir İngilizce yerel için taşımaz

Örüntüye dikkat: güvenli olanlar ülke ya da kıta öneki taşıyanlardır. „Eastern Standard Time“ nasılsa çakışacaktı, çünkü birden fazla kıtanın doğusu var.

## IANA veritabanı kısaltmalar hakkında ne diyor

Veritabanı kısaltmaları her dilim dönemi için bir alanda kaydeder, ama onları gayriresmî sayar. Kendi belgeleri, bunların tek olmadığını, standartlaştırılmadığını ve bazı durumlarda yerel bir kısaltma bulunmadığı yerlerde veritabanını sürdürenlerce uydurulduğunu belirtir.

Birkaçı zamanla, uydurma oldukları için çıkarıldı. Bir zamanlar uydurulmuş üç harfli kodlar taşıyan dilimler bugün `+0545` gibi sayısal bir biçim bildiriyor — tam da uydurma bir kısaltma dürüst bir farktan kötü olduğu için.

Bu editoryal yargı — akla yatkın bir uydurmanın, bir eksiği kabul etmekten kötü olduğu — bu sitenin de uyguladığı yargıdır. Tokyo sayfasındaki kısaltma sütununda JST değil UTC+9 yazmasının sebebi budur.
