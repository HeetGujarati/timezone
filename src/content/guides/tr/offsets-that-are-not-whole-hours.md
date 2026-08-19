---
title: "Tam saat olmayan UTC farkları"
description: "Hindistan, Nepal, Newfoundland ve Chatham Adaları yarım ve çeyrek saatlerle çalışır. İşte tam liste ve yazılımda bu yüzden bozulanlar."
summary: "Dünyanın yaklaşık beşte biri, UTC’den tam saat olmayan bir farkta yaşar. Bunun tersini varsayan yazılım o insanlar için azıcık yanılmaz; 30 ya da 45 dakika yanılır ki bu daha kötüdür."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 5
keywords: ['yarım saatlik saat dilimleri', 'utc farkı 45 dakika', 'hindistan saat dilimi farkı', 'nepal saat dilimi']
related: ['half-hour-offsets-explained', 'time-zones-in-code', 'how-time-zones-work']
---

Yirmi dört saatlik dilim modeli pahalı biçimde yanlıştır: bir milyarı çok aşan insan için kendinden emin bir biçimde 30 ya da 45 dakika şaşan kod üretir. Tam saatlik bir yanlış hiç değilse yanlış gibi görünür. Kırk beş dakikalık olan ise bir yazım hatası gibi görünür ve yayına çıkar.

## Tam liste

**:30’daki farklar**

| Fark      | Nerede                                                        |
| --------- | ------------------------------------------------------------- |
| UTC-09:30 | Markiz Adaları                                                |
| UTC-03:30 | Newfoundland ve Labrador                                      |
| UTC+03:30 | İran                                                          |
| UTC+04:30 | Afganistan                                                    |
| UTC+05:30 | Hindistan, Sri Lanka                                          |
| UTC+06:30 | Myanmar, Cocos Adaları                                        |
| UTC+09:30 | Orta Avustralya — Kuzey Toprakları, Güney Avustralya          |
| UTC+10:30 | Lord Howe Adası (kış saati)                                   |

**:45’teki farklar**

| Fark      | Nerede                                                       |
| --------- | ------------------------------------------------------------ |
| UTC+05:45 | Nepal                                                        |
| UTC+08:45 | Batı Avustralya’nın güneydoğusu (Eucla, gayriresmî)          |
| UTC+12:45 | Chatham Adaları (kış saati)                                  |

Yalnızca Hindistan 1,4 milyar kişidir. İran’ı, Afganistan’ı, Myanmar’ı, Sri Lanka’yı ve Nepal’i ekleyin; Avustralya ya da Kanada’yı saymadan gezegenin beşte birini aşarsınız.

## Öteki olağandışı fark türü

Tam saat olmayan farklar bilinen tuhaflıktır. İki tanesi daha aynı ölçüde önemlidir.

**Aralık 24 değil 26 saattir.** Kiribati’deki Kiritimati UTC+14’tedir; Baker ve Howland adaları UTC-12’de. Bu 26 saatlik bir açıklıktır ve demek ki yeryüzünün bir yerinde aynı anda üç ayrı takvim tarihinin kullanıldığı anlar vardır. İki günlük bir pencerenin bütün dilimleri kapsadığını varsayan kod günde iki kez yanılır.

**Yaz saati her zaman bir saat değildir.** Kalıcı nüfusu yaklaşık 380 olan küçük bir Avustralya adası olan Lord Howe Adası 30 dakika kayar: kışın UTC+10:30, yazın UTC+11:00. Bunu yapan yeryüzündeki tek yerdir ve bir tarih kitaplığı için en iyi sınama örneğidir — 60 dakikalık kaymayı koda gömen her gerçekleştirim orada yanlış, başka hiçbir yerde yanlış değildir; yani yazacağınız öteki bütün sınamaları geçer.

## Ne bozulur

**En yakın saate yuvarlamak.** En sık görülen aksama. Farkı tamsayı saat olarak hesaplayan kod Hindistan’ı sessizce +5’e budar; bu, ülkedeki her kullanıcı için 30 dakikalık bir yanlıştır.

**Farkları tamsayı olarak saklamak.** Saat sayısı diye tanımlanmış bir şema sütunu Katmandu’yu gösteremez. Bu genellikle veri içine girdikten sonra fark edilir.

**Saat sütunları üzerine kurulu ızgara arayüzleri.** Günü 24 eşit hücreye seren ve her dilimin yerel saatinin bir hücre sınırına oturduğunu varsayan her takvim ya da düzenleyici, yarım saatlik ve 45 dakikalık dilimleri yanlış yerleştirir. Bu sitedeki toplantı düzenleyicisinin şeridi sütun olarak yerel saatleri değil anları kullanır; böylece bir +05:45 satırı, UTC satırının 04:00 gösterdiği sütunda 09:45 gösterir — daha derli toplu bir yalan yerine gerçek olan budur.

**Otuz dakikalık bir yaz saati değişimini aşan süre aritmetiği.** Bir yaz saati geçişinin tam olarak 3.600.000 milisaniye olduğunu varsaymak Lord Howe Adası’nda yanlış yanıt verir, yalnızca orada.

## Doğru yapmak

Çözüm neredeyse her saat dilimi hatasını çözen çözümdür: **bir farkı asla kendiniz hesaplamayın.** Platforma sorun.

Her çağdaş çalışma ortamı IANA veritabanını taşır ve size bir dilimin belirli bir andaki farkını dakika cinsinden, doğru biçimde söyler; Katmandu ve Lord Howe dâhil. JavaScript’te bu, `timeZoneName: 'longOffset'` ile `Intl.DateTimeFormat` ya da dilimin duvar saati okumasının UTC ile karşılaştırılmasıdır — bu sitenin işleyişinin izlediği yol da budur, çünkü 1900 öncesi verideki dakika altı yerel ortalama saat farklarında bile tam kalır.

Sonra üç kurala tutunun:

1. **Farklar dakikadır**, asla saat değil. Bir değişkenin adı `offsetHours` ise o zaten bir hatadır.
2. **Katmandu ve Lord Howe ile sınayın.** Başka her şeyin sizde bırakmasına izin verdiği iki varsayımı bunlar kırar.
3. **Bir saat dilimini asla yuvarlamayın.** Bir gösterim yaklaşık olmak zorundaysa bunu söyleyin; bir yerleşimi kolaylaştırmak için kullanıcının saatini sessizce 30 dakika oynatmayın.

## Çözümlü bir örnek: 45 dakika bir ızgaraya ne yapar

Günü her biri bir saatlik 24 sütuna seren ve her katılımcının çalışma saatlerini gölgeleyen bir toplantı düzenleyicisi düşünün. Saf gerçekleştirim her satırı, temel satırı dilimin saat cinsinden farkı kadar kaydırarak hesaplar.

Londra ile New York için bu işler: New York satırı, Londra satırının beş hücre sağa kaydırılmışıdır. Londra ile Katmandu için işlemez. Katmandu 5 saat 45 dakika ileridedir, yani 5,75 hücre, ve hücrenin dörtte üçü diye bir şey yoktur. Gerçekleştirim yuvarlar — genellikle 6’ya — ve artık o satırdaki her okuma 15 dakika erkendir.

Yanlış, bir gözden geçirmeyi atlatacak kadar küçük, önemsenecek kadar büyüktür: ızgaranın Katmandu için 09:00 dediği bir 09:00 toplantısı orada gerçekte 08:45’tir ve katılan kişi kendi gününe on beş dakika geç kalır.

Çözüm, sütunları saat saymayı bırakmaktır. Her sütunu bir _an_ yapın ve o anda her dilimde yerel duvar saatinin ne gösterdiğini platforma sorun. O zaman bir +05:45 satırı, UTC satırının 04:00 gösterdiği yerde 09:45 gösterir — ızgarayla gözle görülür biçimde hizasız, ki dürüst çizim budur. Bu sitedeki toplantı düzenleyicisi tam olarak bunu yapar ve Katmandu satırındaki pürüzlü kenar bir özelliktir.

## Tarihsel farklar daha da tuhaftır

Ölçünleşmeden önce farklar yerel ortalama güneş zamanıydı ve saniyesine dek kesindi. IANA veritabanı bunları kaydeder.

Hollanda 1909’dan 1937’ye dek UTC+00:19:32,13’teydi. Liberya 1972’ye dek UTC-00:44:30’daydı. Bir çalışma ortamına 1920 tarihli bir günde `Europe/Amsterdam` farkını sorun; size saniyesiyle birlikte tam değeri verir.

Bu sitenin altındaki fark işlevinin saniye cinsinden hesaplayıp yalnızca gösterim katmanında dakikaya yuvarlamasının nedeni budur. Dakika saklayan bir işleyiş, Hollanda tarihinin 32 saniyesini sessizce yitirirdi — kimsenin fark etmeyeceği ve yine de yanlış olacak bir yitim.
