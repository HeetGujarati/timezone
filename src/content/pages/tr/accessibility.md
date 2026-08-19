---
title: "Erişilebilirlik"
description: "Bu sitenin hedefi nedir, neler otomatik denetleniyor ve bir şey sizde çalışmıyorsa ne yapmalısınız."
order: 6
updatedAt: '2026-01-15'
---

Bu site **WCAG 2.2 AA düzeyini** hedefler. Bunun otomatik denetlenebilen kısımları her derlemede denetlenir ve geriye gidiş olursa derleme başarısız olur.

## Derlemenin zorunlu tuttukları

- **Renk karşıtlığı.** Her metin eşleşmesi 4,5:1 oranına, her odak göstergesi 3:1 oranına karşı denetlenir; hem açık hem koyu temada. Renk paleti testte kopyalanmak yerine stil dosyasından okunur, böylece bir rengi değiştirmek denetimi kendiliğinden çalıştırır.
- **İşaretleme anlamı.** Linter her bileşene erişilebilirlik kurallarını uygular: eksik etiketler, geçersiz ARIA ve işleyici taşıyan etkileşimsiz öğeler derlemeyi düşürür.
- **Yatay taşma yok**, Arapçanın sağdan sola düzeninde de yok; gerçek bir tarayıcıda denetlenir.

## Tasarım kararları

- **Renk hiçbir zaman tek işaret değildir.** Planlayıcıdaki mesai saatleri dolgunun yanında bir kenar da taşır; yaz saati uyarıları yalnızca kehribar bir ton değil, sözcüklerdir.
- **Sonuçlar kendini duyurur.** Her sonuç alanı `aria-live="polite"` taşır; böylece bir dönüşüm değiştiğinde aranmak yerine sesli okunur.
- **Her alanın gerçek bir etiketi vardır.** Hiçbir yerde yer tutucu metin etiket yerine geçmez.
- **Hareket tercihinize saygı duyar.** `prefers-reduced-motion` etkinse animasyon ve yumuşak kaydırma kapatılır.
- **JavaScript olmadan da çalışır.** Her fark, her geçiş tarihi, her başvuru tablosu ve her açıklama önceden üretilmiş sayfanın içindedir. Yalnızca canlı saatler ve etkileşimli araçlar betik gerektirir; betiksiz çalışmayacak denetimler ölü gösterilmek yerine gizlenir.
- **Saatler tablo rakamlı eşit aralıklı yazıyla dizilir**, böylece sütunlar hizalanır ve ilerleyen bir rakam yanındaki metni asla kaydırmaz.

## Bilinen sınırlar

- Toplantı planlayıcısındaki 24 saatlik şerit geniş bir tablodur. Yeniden akıtılmak yerine kendi kabının içinde yatay kayar, çünkü yeniden akıtılan bir şerit biçim olarak okunmayı bırakır. Aynı bilgi, üstündeki özette metin olarak da vardır.
- Otomatik testler erişilebilirlik sorunlarının azınlığını yakalar. Burada bir şey sizde çalışmıyorsa bu bir kusurdur ve bunu bilmek isteriz.

## Bize bildirmek

[İletişim sayfasındaki](/tr/contact/) adrese, sayfayı ve neyin ters gittiğini yazın. Yardımcı teknolojilere ilişkin bildirimler özellikle değerlidir, çünkü o teknoloji elinizin altında olmadan denetlenmesi en zor şey onlardır.
