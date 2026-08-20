---
title: 'Saat dilimleri gerçekte nasıl işler'
description: 'Saat dilimleri, coğrafi bir sorunun üstüne serilmiş siyasi bir yapıdır. İşte mekanizması ve yazılımın nerede yanıldığı.'
summary: 'Saat dilimi kürenin bir dilimi değildir; belirli bir yerdeki saatin ne gösterdiğine, ne gösterdiğine ve ne göstereceğine dair adlandırılmış bir kurallar kümesidir. Bütün konu bu ayrımdır.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 1
keywords:
  [
    'saat dilimleri nasıl çalışır',
    'saat dilimi nedir',
    'saat dilimleri açıklaması',
    'iana saat dilimi veritabanı',
  ]
related: ['what-utc-really-is', 'why-est-is-ambiguous', 'time-zones-in-code']
---

Çoğu kişiye saat diliminin ne olduğunu sorun, size haritada dikey bir şerit tarif edecektir: dünyanın, boylamın belirlediği, birer saat aralıklı yirmi dört eşit dilime bölünmüş hâli. Bu model derli topludur, akılda kalır ve er geç size bir toplantıya mal olacak biçimde yanlıştır.

Saat dilimi, bir hükûmetin sürdürdüğü, belirli bir toprak parçasındaki saatlerin ne göstereceğine dair **adlandırılmış bir kurallar kümesidir**. Kurallar değişebilir. Siyasi nedenlerle, iktisadi nedenlerle, arada bir de iki haftalık bir bildirimle değişirler. Boylam, fikrin başladığı yerdir; vardığı yer değil.

## Fikir nereden geldi

1880’lerden önce her kasaba kendi saatini tutardı; yerel öğleye göre, yani güneşin tepedeki meridyeni geçtiği ana göre kurulmuş bir saat. Bristol, Londra’dan on dakika geriydi ve kimse aldırmıyordu, çünkü hiçbir şey on dakikanın önem kazanacağı kadar hızlı yol almıyordu.

Demiryolları bunu değiştirdi. Trenin 10.15’te kalktığını yazan bir tarife, 10.15 hattın iki ucunda başka şey demekse hiçbir işe yaramaz; 1840’lara gelindiğinde İngiliz demiryolu şirketleri bütün ağlarına Londra saatini olduğu gibi dayatmıştı. Amerika Birleşik Devletleri 1883’te izledi; demiryolları ülkeyi kendi kararlarıyla dört dilime böldü. 1884’teki Uluslararası Meridyen Konferansı Greenwich’i başlangıç meridyeni yaparak dünyaya ortak bir ölçüt verdi.

Bu tarihin önemli yanı şudur: saat dilimleri bir eşgüdüm sorununu çözmek için, hem de o sorunu yaşayan kuruluşlarca icat edildi. Hiçbir zaman güneşin nerede olduğunun tarifi olmadılar.

## Bir dilim gerçekte neyi içerir

Yetkili kayıt, tzdata ya da Olson veritabanı diye de anılan **IANA saat dilimi veritabanıdır**. Bir metin dosyasıdır, yılda birkaç kez güncellenir ve kullandığınız her işletim sistemi, tarayıcı ve programlama dili onun bir sürümünü okur.

Her dilim için şunları tutar:

- `America/New_York` ya da `Asia/Kathmandu` gibi bir tanımlayıcı
- o dilimin tarihindeki her dönemde geçerli olmuş UTC farkı
- o farkın ne zaman değiştiğine dair kurallar, değişiyorsa
- her dönem için, varsa, bir kısaltma

Tanımlayıcılar `Bölge/Yer` düzenini izler ve yer, ülke değil temsilî bir şehirdir — çünkü ülkeler bölünür, birleşir ve kurallarını sınırlarından bağımsız olarak değiştirir. `America/Argentina/Buenos_Aires` vardır, çünkü Arjantin’in eyaletleri bir zamanlar birbirinden farklı saatler tutuyordu.

Bir dilimin ne olmadığına dikkat edin: bir fark değildir. `America/New_York`, „UTC-5“ değildir. Farkı yılın bir bölümünde UTC-5, geri kalanında UTC-4 olan; İkinci Dünya Savaşı boyunca yıl boyu UTC-5’te kalan; 1966 öncesinde başka bir kural kümesi kullanan bir dilimdir. „UTC-5“i saklayıp ona New York demek, yazılımdaki en yaygın saat dilimi hatasıdır.

## Kurallar değişir, hem de kademeli olarak değil

2016’da Türkiye yaz saatini yaklaşık üç haftalık bir bildirimle bıraktı ve kalıcı olarak UTC+3’te kaldı. 2018’de Kuzey Kore, Güney ile yeniden hizalanmak için saatlerini 30 dakika kaydırdı. 2022’de İran yaz saatini kaldırdı; aynı yıl Meksika ülkenin büyük bölümünde bıraktı. Mısır, 2014’te kaldırdığı uygulamayı 2023’te geri getirdi.

Bunların her biri bir tzdata yayımıydı ve her biri, fark tablosunu koda gömmüş her sistemi bozdu. Bu sitedeki her sayfanın arkasındaki düzeneğin farkları burada saklanan bir şeyden değil, çalışma ortamının tzdata kopyasından okumasının sebebi budur. Yeni bir derleme yeni kuralları alır; düzenlenecek hiçbir şey yoktur.

## Farklar neden tam saat değil

Dünya nüfusunun kabaca beşte biri, UTC’den tam sayıda saat uzakta olmayan bir farkla yaşar. Hindistan UTC+05:30’dadır; iki dilimi hak edecek genişlikte bir ülke için tek bir uzlaşma dilimi olarak seçilmiştir. Nepal UTC+05:45’tedir ve o kırk beş dakika, kısmen Hindistan saatinden bağımsızlığı vurgular. Chatham Adaları UTC+12:45’tedir. Newfoundland UTC-03:30’dadır.

Farkların tam saat olduğunu varsayan yazılım yalnızca yuvarlamakla kalmaz: yüz milyonlarca insan için 30 ya da 45 dakika yanlış cevaplar üretir. Bu da tam olarak, görüşme sırasında fark edilen, öncesinde değil, büyüklükte bir hatadır.

## Yerel saatin bir işlev olmadığı iki gün

Yaz saati yılda iki süreksizlik yaratır ve „şu yerel saati çevir“ işinin göründüğünden zor olmasının sebebi bunlardır.

**İleri alma bir saati siler.** New York’ta geçiş gününde 01:59:59’un hemen ardından 03:00:00 gelir. 02:30 yerel saati hiç yaşanmaz. Kullanıcı onu girerse döndürülecek doğru bir an yoktur — yalnızca yerine ne döndürüleceğine dair ilkeler vardır.

**Geri alma bir saati tekrarlar.** 01:30 iki kez yaşanır: bir kez yaz saatinde, bir saat sonra bir kez daha standart saatte. Tek başına bir yerel saat gerçekten çift anlamlıdır; hangisinin kastedildiğini bilmek gerekir ve arayüzlerin neredeyse hiçbiri bunu sormaz.

Bu sitedeki her araç iki durumu da açıkça çözer ve ne yaptığını size söyler. Sessizce birini seçmek, bir takvim kaydının bir saat kayması ve bunu görüşmeye kadar kimsenin fark etmemesi demektir.

## Bunun pratikteki anlamı

Mekanizmadan üç kural çıkar ve bunlar ters gidenlerin çoğunu kapsar:

1. **Anları saklayın, yerel saatleri değil.** UTC zaman damgası tek anlamlıdır. Yerel saat ise bir zaman damgası artı bir dilim artı o iki zahmetli gün için bir ilkedir.
2. **Dilim tanımlayıcısını saklayın, farkı değil.** `Europe/London` bir kural değişikliğinden sağ çıkar; `UTC+0` çıkmaz ve zaten yılın yarısında yanlıştır.
3. **Gösterim anında, çalışma ortamının tzdata’sıyla çevirin.** Saklama anında değil ve asla kendi tuttuğunuz bir tablodan değil.

Bu sitenin farklar için sürekli „son derleme itibarıyla“ demesinin ve güncel saatleri bunun yerine tarayıcınızda hesaplamasının sebebi de aynıdır. O kurallar bizim dondurabileceğimiz kurallar değil.
