---
title: 'ISO 8601 ve bir tarihi çift anlama gelmeden yazmak'
description: '03/04/2026 okuyana göre iki ayrı tarih demektir. ISO 8601 bunu çözer ve kurallarını tam olarak bilmeye değer.'
summary: 'ISO 8601 var, çünkü 03/04/2026 Amerika’da mart, başka her yerde nisandır. 2026-04-03 yazmak belirsizliği kaldırır, metin olarak doğru sıralanır ve her arayüzün kabul etmesi gereken biçimdir.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 7
keywords: ['iso 8601', 'tarih biçimi standardı', 'zaman damgası biçimi', 'rfc 3339']
related: ['what-utc-really-is', 'time-zones-in-code', 'the-2038-problem']
---

`03/04/2026`, dünyanın çoğunda 3 Nisan, Amerika Birleşik Devletleri’nde 4 Mart’tır. Hangisinin kastedildiğini yalnızca dizgeye bakarak anlamanın yolu yoktur ve iki okuma da gayet makuldür. Her yıl bu belirsizlik kaçırılmış teslim tarihleri, çifte rezervasyonlar ve en az bir akılda kalıcı kesinti üretir.

ISO 8601, bunu ortadan kaldıran uluslararası standarttır.

## Çekirdek biçim

```
2026-04-03T14:30:00Z
```

Soldan sağa, en büyük birimden en küçüğe:

- `2026-04-03` — yıl, ay, gün; her biri başına sıfır konarak ve daima bu sırayla
- `T` — tarih ile saat arasındaki ayırıcı; katı biçimde zorunludur
- `14:30:00` — 24 saatlik düzende saat, dakika, saniye
- `Z` — dilim belirteci. `Z` tam olarak UTC demektir

Mesele sıralamadır. Bileşenler en anlamlıdan en az anlamlıya doğru gittiği için, **bir ISO 8601 dizgesi düz metin olarak doğru sıralanır.** Basit dizge karşılaştırmasında `2026-04-03`, `2026-04-10`dan önce gelir; bunu başka hiçbir yaygın biçim beceremez. Tek başına bu özellik bile standardı haklı çıkarır.

## Dilim belirteçleri

Üç biçim geçerlidir ve farklı şeyler anlatır:

| Biçim                       | Anlamı                                                               |
| --------------------------- | -------------------------------------------------------------------- |
| `2026-04-03T14:30:00Z`      | 14:30 UTC. Tek anlamlı                                               |
| `2026-04-03T14:30:00+05:45` | UTC’den 5 sa 45 dk ileri bir dilimde yerel saatle 14:30. Tek anlamlı |
| `2026-04-03T14:30:00`       | Belirtilmemiş bir dilimde 14:30. **Zaman damgası değildir**          |

Sorun çıkaran üçüncü biçimdir. O bir _yerel tarih-saattir_: bir zaman çizgisine yerleştirmenin hiçbir yolu olmayan bir duvar saati okuması. Onu bir sistem sınırından geçirip karşı tarafın sizinle aynı dilimi varsaydığını ummak, başka bir bölgeye yapılacak dağıtımı bekleyen bir hatadır.

Şuna da dikkat edin: fark bir dilim değildir. `+05:45` size Nepal’in farkını söyler, zaman damgasının Nepal’den geldiğini değil. Aynı farkı birkaç dilim paylaşır ve bir dilimin farkı değişir. Nerede olduğunu bilmeniz gerekiyorsa tanımlayıcıyı yanında taşıyın.

## RFC 3339, muhtemelen istediğiniz profil

ISO 8601 geniştir. Hafta tarihlerine (`2026-W14-5`), sıra tarihlerine (`2026-093`), kesirli birimlere ve yüzyılı atlayan kısaltılmış bir biçime izin verir. Bunların çoğu bir arayüzde istediğiniz şey değildir.

RFC 3339, internet protokolleri için sıkılaştırılmış bir profildir. Tam tarihi zorunlu tutar, bir dilim belirteci ister ve ayırıcı olarak `T` ya da boşluğa izin verir. Biri bir API bağlamında „ISO biçimi“ dediğinde neredeyse her zaman RFC 3339’u kasteder.

**İşe yarar bir kural:** iyi bir çözümleyicinin kabul edeceği her şeyi kabul edin; yalnızca `Z` ile katı RFC 3339 üretin.

## Süreler ve aralıklar

Daha az kullanılır; karşılaştığınızda bilmeye değer.

**Süreler** dönem anlamında `P` ile başlar, `T` ise tarih kısımlarını saat kısımlarından ayırır:

- `P3Y6M4D` — üç yıl, altı ay, dört gün
- `PT1H30M` — bir saat otuz dakika
- `P1DT12H` — bir gün on iki saat

`T` isteğe bağlı değildir: `P1M` bir ay, `PT1M` bir dakikadır. ISO 8601 sürelerinin klasik hatası budur.

**Aralıklar** iki noktayı eğik çizgiyle birleştirir: `2026-04-03T14:00Z/2026-04-03T16:00Z`, ya da bir nokta ile bir süreyi: `2026-04-03T14:00Z/PT2H`.

Bu sitedeki `HowTo` yapılandırılmış verisi süre sözdizimini kullanır — iki dakikalık bir iş için `PT2M` — çünkü schema.org ISO 8601 sürelerini şart koşar.

## Hafta tarihleri ve içindeki tuzak

`2026-W14-5`, 2026’nın on dördüncü ISO haftasının cumasıdır. ISO haftaları pazartesi başlar ve 1. hafta, ocak ayının ilk perşembesini içeren haftadır.

İnsanların takıldığı sonuç şudur: **ISO hafta yılı her zaman takvim yılı değildir.** 1 Ocak 2027, 2026’nın 53. ISO haftasına düşer. Bir ISO hafta numarasını takvim yılıyla eşleştiren biçimlendirme kodu, her yıl birkaç gün boyunca yanlış bir tarih üretir — üstelik çoğu dilde biçim belirteçleri neredeyse birbirinin aynıdır (`YYYY` ile `GGGG`, ya da `%Y` ile `%G`).

## Pratik kurallar

1. **UTC olarak saklayın, `Z` ile üretin.** `2026-04-03T14:30:00Z`nin her yerde tam olarak tek bir anlamı vardır.
2. **Bir sınırdan asla çıplak yerel tarih-saat göndermeyin.** Bir dilim iliştiremiyorsanız elinizde zaman damgası yoktur.
3. **Her şeyi sıfırla doldurun.** `2026-4-3` geçerli ISO 8601 değildir; çözümleyicilerin çoğu kabul etse bile.
4. **`-` ve `:` ayırıcılarını kullanın.** Sıkıştırılmış biçim (`20260403T143000Z`) yasaldır ama kullanıcı dostu değildir ve bazı çözümleyiciler onu reddeder.
5. **Dilim tanımlayıcısını ayrı taşıyın**; yalnızca _hangi fark_ değil _nerede_ olduğunu bilmeniz gerektiğinde. `Europe/London` bir kural değişikliğinden sağ çıkar, `+01:00` çıkmaz.

## Çözümleme tuzakları

Bir standart olsa bile işlerin ters gittiği yer çözümlemedir.

**JavaScript’in `Date` yapıcısı, ISO olmayan girdilerde tutarsızdır.** `new Date('2026-04-03')` UTC gece yarısı olarak çözümlenir. `new Date('2026-04-03T00:00:00')` — dilim belirteci yok — _yerel_ gece yarısı olarak çözümlenir. İkisi arasındaki fark sizin farkınızdır; yani aynı kod, çalıştığı yere göre farklı günler üretir. Her zaman bir dilim belirteci koyun.

**İki haneli yıllar çift anlamlıdır ve reddedilmelidir.** ISO 8601 kısaltılmış bir biçime izin verir; neredeyse hiçbir şeyin onu kabul etmemesi gerekir. `26-04-03`, 1926 da olabilir 2026 da; bunu çözen kayan pencere, bir çözümleyicinin içinde saklanan bir politika kararıdır.

**Saniyenin kesirleri farklı hassasiyette olur.** `14:30:00.5`, `14:30:00.500` ve `14:30:00.500000` hepsi geçerlidir ve hepsi aynı andır. Anları değil dizgeleri karşılaştıran bir çözümleyici buna katılmayacaktır.

**Virgül yasaldır.** ISO 8601 `14:30:00,5` biçimine — ondalık virgüle — izin verir, hatta onu yeğler. Çözümleyicilerin çoğu reddeder. Avrupalı bir sistemden veri alıyorsanız hazırlıklı olun.

**Gece yarısının iki yazımı vardır.** Bir günün `24:00:00`ı, ertesi günün `00:00:00`ı ile aynı andır ve ikisi de geçerli ISO 8601’dir. İkinci biçimi üretin; ikisini de kabul edin.

## Sıralama üzerine bir not

ISO 8601’in sıralanabilirliği yalnızca aynı dilim gösterimine sahip dizgeler için geçerlidir. `2026-04-03T14:00:00Z` ile `2026-04-03T10:00:00-05:00` aynı andır, ama dizge olarak ikincisi daha önce sıralanır.

Zaman damgalarını metin olarak sıralıyorsanız — bir günlük dosyasında, bir dosya adında, metin olarak tanımlanmış bir veritabanı sütununda — önce hepsini `Z` ile UTC’ye normalleştirin. Aksi hâlde sıralama, zamanın değil biçimlendirmenin bir özelliği olur.
