---
title: 'UTC gerçekte nedir ve GMT’den farkı nerede'
description: 'UTC, atom saatlerinin tuttuğu bir zaman standardıdır. GMT, Dünya’nın tuttuğu bir saat dilimidir. Genelde uyuşurlar, fark yine de önemlidir.'
summary: 'UTC bir saat dilimi değildir. Her saat diliminin kendisine göre tanımlandığı referans standarttır; yaklaşık 450 atom saatiyle sürdürülür ve yaz saati için asla kaymaz — sistemlerin onu kullanmasının sebebi tam olarak budur.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 2
keywords: ['utc nedir', 'utc ve gmt farkı', 'eşgüdümlü evrensel zaman', 'utc açıklaması']
related: ['how-time-zones-work', 'iso-8601-explained', 'time-zones-in-code']
---

İnsanlar „UTC“ ile „GMT“yi aynı şeymiş gibi kullanır. Çoğu zaman bir aksilik çıkmaz, çünkü çoğu zaman ikisi aynı saati gösterir. Ama bunlar farklı türden şeylerdir ve o fark, hangisinin veritabanınıza yazılacak doğru şey olduğunu, hangisinin olmadığını açıklar.

## UTC bir standarttır, bir yer değil

Eşgüdümlü evrensel zaman, Uluslararası Ağırlıklar ve Ölçüler Bürosu tarafından, dünya genelinde yaklaşık 85 kurumdaki 450 kadar atom saatinin ağırlıklı ortalamasından tutulur. Bu saatler sezyum-133 atomlarının rezonans frekansını ölçer; kararlılığı kabaca 100 milyon yılda bir saniyedir.

Hiç kimsenin yerel saati yasa gereği UTC değildir. Başlangıç meridyeninin üstünde oturan Birleşik Krallık bile yılın yedi ayı UTC+1’dedir. UTC, her yerel saatin kendisine göre tarif edildiği sabit noktadır — cetveldeki sıfır, haritadaki bir işaret değil.

Yazılım kuran herkes için en önemli özellik şudur: **UTC yaz saati için asla kaymaz.** Mevsimsel dalgalanması, siyasi geçmişi ve istisnası yoktur. Havacılığın, denizciliğin, finansal takasın ve var olan her dağıtık sistemin onu kullanmasının bütün sebebi budur.

## GMT, geçmişi olan bir saat dilimidir

Greenwich ortalama zamanı, Greenwich’teki Kraliyet Gözlemevi’ndeki ortalama güneş zamanıdır. Dünya’nın dönüşüyle tanımlanır ve Dünya bir hassas ölçüm aleti değildir: gezegen sallanır, düzensiz yavaşlar, arada bir hızlanır.

1884’ten 1972’ye kadar GMT dünyanın zaman standardıydı. Yerini UTC’ye bıraktı, çünkü atom saatleri bir gezegene kıyasla daha iyi bir referans çıktı. GMT bir saat diliminin adı olarak yaşıyor: Birleşik Krallık’ın kışın kullandığı ve birkaç Batı Afrika ülkesinin yıl boyu kullandığı dilim.

Yani: **UTC yaz saati uygulamaz. Birleşik Krallık’taki kullanımıyla GMT uygular** — Britanya her mart British Summer Time için ondan çıkar, her ekim geri döner. Britanyalı bir meslektaş temmuzda „saat 15.00 GMT“ diyorsa, neredeyse kesinlikle 15.00 BST’yi, yani 14.00 UTC’yi kastediyordur. Bu hata, varsaymak yerine sormaya değecek kadar sık görülür.

## Kısaltma neden UTC

Ne İngilizce ne de Fransızca kısaltma kazandı. İngilizce konuşanlar „coordinated universal time“ için CUT önerdi. Fransızca konuşanlar „temps universel coordonné“ için TUC önerdi. Uluslararası Telekomünikasyon Birliği UTC’de karar kıldı; bu, hiçbir dile uymadığı için ikisini de eşit ölçüde gücendirir. Kendince kusursuz bir diplomatik sonuç.

## Artık saniyeler ve yaklaşan kaldırılışları

Dünya sabit hızla dönmez. UTC’nin güneş zamanından uzaklaşmasını önlemek için arada fazladan saniyeler eklendi: 1972 ile 2016 arasında 27 tane. Bir artık saniye boyunca bir UTC saati 23:59:60 gösterir — çoğu yazılımın temsil bile edemediği gerçek bir zaman.

Artık saniyeler gerçek kesintilere yol açtı. 2012’de bir artık saniye Reddit’i, Mozilla’nın servislerini ve birkaç havayolu rezervasyon sistemini çökertti; hepsi aynı Linux çekirdeği hatası yüzünden. 2017’de Cloudflare’in DNS’i bozuldu, çünkü ekleme anını aşan bir süre hesabı negatife düştü.

Kasım 2022’de Ağırlıklar ve Ölçüler Genel Konferansı, 2035’e kadar artık saniye eklemeyi bırakma kararı aldı. UTC o zaman güneş zamanından uzaklaşmakta serbest olacak ve fark rahatsız edici hâle geldiğinde konu yeniden ele alınacak — muhtemelen bir asır sonra.

Tarayıcınız artık saniyeleri dışarı vermez. JavaScript’in saati onların hiç yaşanmadığını varsayar; dolayısıyla birinin üzerinden geçen bir süre bir saniye kısa bildirilir. Neredeyse her amaç için bu doğru bir takastır; uydu seyrüseferiyle uğraşıyorsanız zaten biliyordunuz.

## Aslında ne yapmalı

**Zaman damgalarını UTC olarak saklayın.** Kullanıcının diliminde değil, sunucunun diliminde değil, şirketin merkezinin bulunduğu dilimde de değil. UTC anı tek anlamlıdır, sıralanabilir ve bir hükûmetin fikir değiştirmesinden etkilenmez.

**Yerel saate gösterim anında çevirin**, okuyanın dilimini ve çalışma ortamının IANA kopyasını kullanarak.

**UTC demek istiyorsanız UTC yazın.** Bir şartnameye „GMT“ yazmak, birinin bunu Birleşik Krallık yerel saati diye okumasına davetiyedir ve yazın bu bir saat sapar. „12:00 UTC“nin yılın her günü tam olarak tek bir anlamı vardır.

**ISO 8601’in Z ekini kullanın.** `2026-03-08T14:30:00Z` UTC’dir ve başka türlü okunamaz. `2026-03-08T14:30:00` ise belirtilmemiş bir dilimdeki yerel saattir; yani hiç zaman damgası değildir.

## Zaman ölçeklerinin ailesi

UTC, akraba birkaç ölçekten biridir ve farklar arada bir önem kazanır.

**TAI** — uluslararası atom zamanı. Artık saniyesiz, ham atom ölçeği. TAI şu anda UTC’den 37 saniye ileridedir ve her eklemede fark büyür. GPS uyduları TAI’ye göre kaydırılmış bir ölçekte çalışır.

**UT1** — uzak kuazarlara göre ölçülen, Dünya’nın gerçek dönüşü. UTC’nin artık saniyeleri bunu kovalıyordu. UTC, UT1’den 0,9 saniyeden fazla ayrılmayacak şekilde tutulur — daha doğrusu, 2035 kararına kadar öyleydi.

**GPS zamanı** — Ocak 1980’de UTC ile hizalı başladı ve o günden beri artık saniyeleri yok sayar. Şu anda UTC’den 18 saniye ileridedir. Alıcılar bunu düzeltir; ham GPS zamanını okuyan sistemler bazen düzeltmez.

**Unix zamanı** — 1970’ten beri geçen saniyelerin sayımı; artık saniyeleri saymak yerine bir saniyeyi tekrarlayarak yok sayar. Bu da onu tam olarak geçen saniyelerin sayımı olmaktan çıkarır ve bu incelik, bir eklemenin üzerinden süre ölçenleri ısırmıştır.

Neredeyse bütün yazılımlar için doğru cevap UTC’dir, gerisi malumattır. Uydularla, yüksek frekanslı işlem zaman damgalarıyla ya da bilimsel ölçüm düzenekleriyle ilgili her şeyde ise bu ayrımlar yük taşır.

## „UTC saati“ neden gereksiz tekrar, ve neden yine de böyle yazıyoruz

Baştaki T zaman demektir, dolayısıyla „UTC saati“ aslında „eşgüdümlü evrensel zaman saati“ olur. Titizler itiraz eder.

Bu sitedeki sayfalar başlıklarda yine de „UTC saati“ diyor, çünkü insanların aradığı ve yazdığı şey bu. Doğruluğun size okuru kaybettiren bir sürümü vardır ve bir kısaltma üzerine titizlik tam da oraya düşer. Okurun zaten geldiği gövde metninde ise yalnızca UTC yeter.
