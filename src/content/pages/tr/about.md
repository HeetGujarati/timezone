---
title: "Meridiem hakkında"
description: "Bu site neden var, gösterdiklerini nasıl hesaplıyor ve bilerek neleri yapmıyor."
order: 1
updatedAt: '2026-01-15'
---

Meridiem, tek bir ilke üzerine kurulmuş bir saat dilimi araçları takımıdır: gerektiği anda IANA veritabanından hesaplanmamış hiçbir zaman bilgisini asla ileri sürmemek.

## Neden var

Saat dilimi araçlarının çoğu, kaydedilmiş bir fark tablosuna dayanır. O tablo, bir hükûmet fikrini değiştirene kadar doğrudur — bu da yılda birkaç kez olur — ve ondan sonra sessizce yanlıştır; üstelik öyle bir yanlıştır ki yazılım hatasından çok insan kaynaklı bir randevu hatası gibi görünür.

Bu sitedeki her fark, her geçiş tarihi ve her dönüşüm, çalışma ortamının taşıdığı IANA veritabanı kopyasından `Intl` arayüzü üzerinden gelir. Bu kod tabanında hiçbir fark tablosu yoktur. Veritabanı güncellendiğinde yeni bir derleme bunu alır ve site tek satır değişmeden yeniden doğru olur.

## Nasıl kurulu

- Her sayfa önceden üretilir. Sunucu yok, veritabanı yok, programlama arayüzü yok.
- Mutlak güncel saatler sayfada değil, tarayıcınızda üretilir. Önceden üretilmiş bir sayfa şu anın kaç olduğunu bildiğini dürüstçe iddia edemez, bu yüzden denemez.
- Kalıcı olgular — farklar, geçiş tarihleri, kesişim pencereleri — derleme sırasında hesaplanır ve o derlemenin tarihine göre bildirilir.
- Site her ay, ayrıca 1 Mart, 1 Nisan, 1 Ekim ve 1 Kasım’da yeniden derlenir; böylece veritabanı güncellemeleri, etkiledikleri tarihlerden önce yerine oturur.

## Burada neler var

On araç, 80 şehir sayfası, 1.448 şehir çifti dönüşümü, 240 kısaltma dönüşümü ve on iki rehber. Üretilen her sayfa, tam da o çift için hesaplanmış bilgiler taşır: saat tablosu, iki şehrin de yaz saati tarihleri ve iki yerin gerçekten paylaştığı saatler.

## Bilerek neleri yapmıyor

- **İzleme yok.** Analitik yok, çerez yok, üçüncü taraf betiği yok.
- **Hesap yok.** Geri sayımlar ve toplantı planları adres çubuğunda yaşar; bir bağlantıyı paylaşmak işlevin tamamıdır.
- **Uydurulmuş veri yok.** IANA verisinde bir dilimin kısaltması yoksa, akla yatkın görünen bir tahmin yerine farkın kendisi gösterilir. Değerlendirme verisi yoksa hiçbir puan iddia edilmez.
- **Çalışma anında ağ isteği yok.** Gün doğumu ve batımı, bir yerden çekilmek yerine enlem ve boylamdan NOAA güneş konumu algoritmasıyla hesaplanır.

## Düzeltmeler

Burada bir şey yanlışsa bu önemlidir: bir başvuru kaynağının bütün değeri doğru olmasındadır. İletişim bilgileri [iletişim sayfasında](/tr/contact/).
