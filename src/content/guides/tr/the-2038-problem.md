---
title: "2038 sorunu, gerektiği gibi açıklandı"
description: "19 Ocak 2038, 03:14:07 UTC’de işaretli 32 bitlik Unix zamanı taşar. İşte gerçekten bozulanlar ve çoktan düzeltilmiş olanlar."
summary: "Zamanı işaretli 32 bitlik saniye sayacı olarak saklayan sistemler Ocak 2038’de yer kalmayınca Aralık 1901’e sarar. Modern platformların çoğu bunu yıllar önce düzeltti; bugünkü açık gömülü sistemlerde, eski yazılımlarda ve serileştirilmiş veridedir."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 6
keywords: ['2038 sorunu', '2038 yılı hatası', 'unix zaman damgası taşması', 'y2038']
related: ['time-zones-in-code', 'iso-8601-explained', 'what-utc-really-is']
---

19 Ocak 2038, 03:14:07 UTC’de 1 Ocak 1970’ten bu yana geçen saniye sayısı 2.147.483.647’ye ulaşır. Bu, işaretli 32 bitlik bir tam sayının tutabileceği en büyük değerdir. Bir saniye sonra −2.147.483.648’e sarar; o sistemler bunu 13 Aralık 1901 olarak okur.

Kesin bir tarihi olan gerçek bir sorundur ve yazılım sorunları arasında onu olağandışı kılan da budur.

## Neden 32 bit

Unix zamanı 1970’lerin başında, 32 bitlik tam sayının doğal sözcük boyu olduğu ve 68 yıllık payın cömert göründüğü bir dönemde tasarlandı. O sistemlerde `time_t` türü işaretli 32 bitlik bir tam sayıydı ve bu seçim C diline, C’yi saran her dile, dosya biçimlerine, ağ protokollerine ve veritabanı şemalarına yayıldı.

Taşmaya kendine özgü belirtisini veren şey işarettir. İşaretsiz 32 bitlik bir sayaç 2106’ya kadar dayanırdı; işaretli olan aralığını 1970 çevresinde böldüğü için taşma sıfıra değil 1901’e düşer.

## Şimdiye kadar neler yaşandı

2038 sorunu yıllardır üretimde arıza veriyor, çünkü yazılım gelecekteki tarihleri sürekli hesaplar.

- Otuz yıllık konut kredisi hesapları sınırı 2008’de aşmaya başladı.
- Sertifika bitiş tarihleri, önbellek yaşam süreleri ve zamanlanmış işler buna defalarca çarptı.
- 2006’da AOLserver’ın varsayılan veritabanı zaman aşımındaki bir hata — bir milyar saniyeye ayarlıydı, ki bu iş bozulana kadar sorun değildi — hesaplanan bitiş anı taştığında yazılımı devre dışı bıraktı.

Örüntü şu: arıza tarihten çok önce, en ileriye bakan kodun olduğu yerde gelir.

## Halihazırda neler düzeltildi

Durum, panik havasının ima ettiğinden epeyce iyidir.

- **64 bitlik sistemler**: `time_t` neredeyse her 64 bitlik platformda 64 bittir. Bu, kabaca 292 milyar yılda tükenir.
- **32 bit üzerinde Linux**: 5.6 çekirdeği (Mart 2020) 32 bitlik mimarilerde 64 bitlik `time_t` getirdi ve büyük dağıtımlar buna karşılık gelen kullanıcı alanını yayımladı.
- **JavaScript**: milisaniyeler için çift duyarlıklı kayan nokta kullanır; 1970’in her iki yanında yaklaşık 275.000 yıl geçerlidir. Bu sorunu hiç yaşamadı.
- **Java**: `Instant` 64 bitlik bir saniye sayacı ile nanosaniyeleri kullanır.
- **Python**: tam sayılar keyfi duyarlıktadır; kısıt, platformun C kitaplığıdır.
- **PostgreSQL, MySQL 8.0.28+, SQL Server**: 64 bitlik zaman damgası saklama.

## Açığın sürdüğü yerler

**Gömülü sistemler.** Endüstriyel denetleyiciler, tıbbi cihazlar, araç elektroniği, sayaçlar ve algılayıcılar; çoğu yirmi ya da otuz yıllık hizmet ömrü için tasarlanmış, çoğunun güncelleme yolu yok, çoğu çoktan sahada. Gerçek riskin ağırlığı burada ve merkezî bir kaydı yok.

**MySQL’in 8.0.28 öncesi `TIMESTAMP` türü.** 32 bitlik bir saniye sayacıdır ve belgelenmiş üst sınırı 2038-01-19 03:14:07’dir. `DATETIME` hiçbir zaman etkilenmedi. Çok büyük miktarda üretim verisi, açık olan sütun türünde duruyor.

**Serileştirilmiş veri ve dosya biçimleri.** 32 bitlik bir zaman alanı yazmış olan her şey, okuyucusu ne kadar yeni olursa olsun 32 bitlik bir zaman alanı olarak kalır. Eski arşiv biçimleri, ikili protokoller ve disk üzerindeki yapılar kısıtı ileriye taşır.

**Hâlâ hizmette olan 32 bitlik yapılar.** Bazı yönlendiriciler, uydu alıcıları ve uzun ömürlü cihazlar, yamanmamış bir çekirdek üzerinde 32 bitlik kullanıcı alanı çalıştırır.

## Bu konuda ne yapmalı

**Saklama türlerini denetleyin.** Zaman damgası tutan `int(11)` sütunlarını, eski sürümlerde MySQL `TIMESTAMP` alanlarını ve 32 bitlik zaman alanı içeren her ikili biçimi arayın. Verinin koddan uzun yaşadığı yer burasıdır.

**2038 sonrası tarihlerle sınayın.** Bir sınama düzeneğini 2040’a ayarlayıp takımı çalıştırın. 2038 hatalarının neredeyse tümü, biri denediği anda kolayca yeniden üretilebilir.

**64 bitlik tam sayıları ya da ISO 8601 dizgilerini yeğleyin.** Milisaniye tutan bir `BIGINT` ya da bir `TIMESTAMPTZ` sütununun düşünmeye değer bir ufku yoktur. ISO 8601 dizgisinin hiç yoktur; bedeli boyut ve karşılaştırma hızıdır.

**Tarihleri bir daha asla 32 bitlik hiçbir şeyde saklamayın.** Yerden kazanç günümüz donanımında anlamsız, ufuk ise artık sıradan bir yazılımın hizmet ömrünün içinde.

## Öteki tarih ufukları

2038 en yakın olan, tek olan değil.

- **2036**: NTP’nin 32 bitlik çağ alanı 7 Şubat’ta devreder. NTPv4 bunu karşılar, ama kurulumlar değişkendir.
- **2106**: işaretsiz 32 bitlik saniye sayaçları sarar.
- **2262**: 64 bitlik _nanosaniye_ sayaçları taşar — Go dilindeki `time.Time` bu gösterimdedir, pandas’ın varsayılan datetime64[ns] türü de öyle.

Sonuncusu, veri işleme kodu yazan herkes için göründüğünden yakındır ve başka bir ölçekte aynı hatadır: işe yarayacak kadar ince bir birim, o gün cömert görünen bir genişlikte.

## Kendi sistemlerinizi nasıl denetlersiniz

Artan emek sırasına göre dört denetim.

**Veritabanı sütun türlerinize bakın.** PostgreSQL’de `SELECT column_name, data_type FROM information_schema.columns WHERE data_type LIKE '%timestamp%'` elinizde ne olduğunu söyler; `timestamp with time zone` 64 bittir ve güvenlidir. MySQL’de 8.0.28 öncesi sunucularda `TIMESTAMP` sütunlarını arayın — açık olanlar bunlardır, `DATETIME` hiç olmadı.

**Saati ileri alın.** Gözden çıkarılabilir bir kapsayıcıda sistem tarihini 2040’a ayarlayıp sınama takımını çalıştırın. Kaba bir yöntemdir ve şaşırtıcı ölçüde çok şey bulur, çünkü sınır geçildikten sonra 2038 hatalarının hemen hiçbiri ince değildir.

**32 bitlik zaman türlerini tarayın.** C ve C++’ta, 32 bitlik bir hedefte zaman değeri tutan her açık `int` ya da `long`. Serileştirme şemalarında, 4 baytlık her zaman alanı. Uygulama kodunda, bir zaman damgasının saklamak ya da iletmek için 32 bitlik tam sayıya dönüştürüldüğü her yer.

**Düzeneklerde yalnızca yakın geleceği değil, uzak geleceği de sınayın.** «Şimdi artı bir gün» kullanan bir sınama 2038’e kadar geçer, sonra bir salı günü düşer. Açıkça 2040 tarihi kullanan bir sınama bugün düşer; düzeltecek biri hazırdayken.

## Ne yapmamalı

Bunu işaretsiz 32 bitlik tam sayılara geçerek «çözmeyin». 68 yıl kazandırır, 1970 öncesi herhangi bir tarihi gösterebilme yetisini yitirtir ve aynı konuşmayı sistemi 2106’da sürdürecek olana yıkar. 4 ile 8 bayt arasındaki fark, ikinci bir göçe değmez.

Modern bir dilin sizi koruduğunu varsaymayın. Uygulama kodu kusursuzca güvenliyken, okuduğu veri güvenli olmayan bir şey tarafından yazılmış olabilir — dosya biçimleri ve iletişim protokolleri kısıtı her yeniden yazımın içinden geçirir.
