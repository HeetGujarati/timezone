---
title: 'Kodda saat dilimleri: uygulamalı bir rehber'
description: 'UTC saklayın, dilim tanımlayıcısını koruyun, gösterimde dönüştürün, asla fark tablosu kurmayın. Kurallar ve her birinin gerekçesi.'
summary: 'Neredeyse her saat dilimi hatası dört yanlıştan birine dayanır. İşte bunun yerine yapılacaklar: JavaScript, Python, Java, Go ve SQL için, yalnızca kuralla değil gerekçesiyle.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords:
  [
    'kodda saat dilimleri',
    'tarih saat iyi uygulamaları',
    'zaman damgası saklama',
    'veritabanında utc',
  ]
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

Üretimdeki neredeyse her saat dilimi hatası dört yanlıştan birine dayanır: yerel saat saklamak, dilim yerine fark saklamak, yanlış katmanda dönüştürmek ya da elle bir fark tablosu kurmak. Aşağıdaki her şey bunlardan kaçınmaktan doğar.

## Kural 1: anları UTC olarak saklayın

Bir an, zaman çizgisi üzerinde bir noktadır. Yerel saat ise bir duvar saati okumasıdır ve bir anlam taşıyabilmesi için bir dilim ile bir belirsizlik giderme ilkesine gereksinim duyar.

```sql
-- İyi: bir an
created_at TIMESTAMPTZ NOT NULL

-- Kötü: dilimsiz bir duvar saati okuması
created_at TIMESTAMP NOT NULL
```

PostgreSQL’in `TIMESTAMPTZ` türü dilim saklamaz; yazarken UTC’ye normalleştirir, okurken dönüştürür. «Bu ne zaman oldu» için istediğiniz tam olarak budur.

## Kural 2: farkı değil dilim tanımlayıcısını saklayın

_Nerede_ olduğunu bilmeniz gerekiyorsa — yinelenen bir olay, bir kullanıcı tercihi, bir işletmenin açılış saatleri için — `+01:00` değil `Europe/London` saklayın.

Fark, tek bir ana ilişkin bir olgudur. Dilim ise bir hükümetin fikir değiştirmesini atlatan bir kurallar kümesidir. Britanya ocakta `+00:00`, temmuzda `+01:00`’dedir; ikisinden birini saklayıp buna «kullanıcının dilimi» demek yılın yarısında yanlıştır.

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- seçtikleri duvar saati saati
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- çözülmüş an, kurallar değişirse yeniden hesaplanır
```

Yinelenen bir olayda doğruluk kaynağı yerel saat ile dilimdir; UTC anı türetilmiş bir dizindir. tzdata değişirse — ki yılda birkaç kez değişir — türetilmiş sütun yeniden üretilir ve kullanıcının 09:00’u 09:00 kalır.

## Kural 3: kenarda dönüştürün

İş mantığı anlarla çalışır. Okunabilir yerel saate dönüştürme, kimin okuduğunu bilen katmanda, olabilecek en son anda gerçekleşir.

Doğal sonucu daha önemlidir: **sunucunun kendi dilimini asla davranışa sızdırmayın.** Dağıtım ortamınızda `TZ=UTC` ayarlayın ve sonucu sunucunun yerel ayarına bağlı olan her kod yolunu bir hata sayın. Bu, ancak biri ikinci bir bölgeye dağıtım yaptığında ortaya çıkan bozulma sınıfıdır.

## Kural 4: asla fark tablosu kurmayın

Her çalışma ortamı IANA veritabanını taşır. Onu kullanın.

**JavaScript**

```js
// Bir dilimde biçimlendirmek
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// Kitaplıksız fark almak: dilimin duvar saatini UTC ile karşılaştır
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

`hourCycle: 'h23'` değerini açıkça verin. Kimi ICU sürümleri `en-US` altında gece yarısını 24. saat diye bildirir; bu, tarihi bir gün kaydırır ve bulunması gerçekten iç karartıcı bir hatadır.

**Python**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # 3.9’dan beri standart kitaplık

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

`datetime.utcnow()` işlevini asla kullanmayın. UTC gibi _görünen_ ama hiçbir dilim taşımayan naif bir tarih döndürür; dilim bilgisi taşıyan tarihlerle karıştırıldığında en kötü anda hata fırlatır. Doğru çağrı `datetime.now(timezone.utc)` biçimindedir.

**Java**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time` iyi tasarlanmıştır: zaman çizgisi üzerindeki noktalar için `Instant`, dilimsiz duvar saati okumaları için `LocalDateTime`, ikisi bir arada için `ZonedDateTime`. Tür dizgesi, bu rehberin ısrarla vurguladığı ayrımı zorunlu kılar.

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation` sistemin tzdata dosyasını okur. Boş bir kapsayıcıda böyle bir dosya yoktur; ikili dosyaya gömmek için `_ "time/tzdata"` içe aktarın, yoksa her dilim araması sessizce UTC’ye düşer.

## Yılın iki günü

İleri alma bir saati siler; geri alma bir saati yineler. Bir ilke seçin, tutarlı uygulayın ve kullanıcıya ne yaptığınızı söyleyin:

- **Var olmayan yerel saat** (ABD’nin ilkbahar tarihinde 02:30): boşluğun büyüklüğü kadar ileri alın; 02:30, 03:30 olur.
- **Belirsiz yerel saat** (ABD’nin sonbahar tarihinde 01:30): ilk, yani daha erken olanı alın.

Bu sitenin kullandığı ilkeler bunlardır ve ECMAScript `Temporal` arayüzünün `disambiguation: 'compatible'` varsayılanıyla örtüşür — davranışınızın platformla uyuşması için örtüşmeye değer.

Boşluk her zaman bir saat değildir. Lord Howe Adası 30 dakika kayar; bu yüzden büyüklüğü varsaymak yerine geçişten okuyun.

## Sınama

Dört durum işin çoğunu yakalar:

1. **Yarım saatlik bir dilim** — `Asia/Kolkata` (+05:30). Tam saat varsayımlarını yakalar.
2. **45 dakikalık bir dilim** — `Asia/Kathmandu` (+05:45). Yarım saat varsayımlarını yakalar.
3. **Güney yarımküreden bir dilim** — `Australia/Sydney`. «Yaz demek haziran demek» varsayımını yakalar.
4. **Lord Howe Adası** — `Australia/Lord_Howe`. Koda gömülü 60 dakikalık kaymayı yakalar; başka hiçbir şey yakalamaz.

Kullanıcılarınızın gerçekten bulunduğu her dilim için bir ileri alma ve bir geri alma tarihi ekleyin ve sürekli tümleştirmede tzdata sürümünü sabitleyin ki bir veritabanı güncellemesi yanlış nedenle bir yapıyı düşürmesin.

## Yinelenen olaylar başka bir sorundur

Tek seferlik bir olay bir andır. Yinelenen bir olay bir kuraldır ve ikisi ayrı saklama ister.

«Her salı 09:00’da Europe/London» ile «bu andan başlayarak her 604800 saniyede bir» aynı şey değildir. İkisi, Britanya saatlerini değiştirdiği anda ayrışır: kural toplantıyı yerel saatle 09:00’da tutar, aralık ise onu 08:00 ya da 10:00’a kaydırır.

Kuralı saklayın — yerel saat, dilim tanımlayıcısı, yineleme örüntüsü — ve anları ondan üretin. tzdata değiştiğinde üretilmiş anları yeniden üretin; onları göç ettirmeyin. Kullanıcının razı olduğu şey kuraldır.

Zahmetli durumlar yıllık iki süreksizlikten doğar. Her gün 02:30’daki bir toplantı, bir ilkbahar gününde o saatin var olmadığını, bir sonbahar gününde ise iki kez gerçekleştiğini görecektir. Bir ilke seçin, tutarlı uygulayın ve farklı takvim dizgelerinin farklı ilkeler seçtiğini bilin — aynı yinelenen olayın yılda tam iki gün, iki kişinin takviminde bir saat arayla görünmesinin nedeni budur.

## `Temporal` üzerine bir not

ECMAScript’in `Temporal` arayüzü, `java.time` tarzında, anları, duvar saati saatlerini ve dilimli tarih-saatleri ayıran türlerle `Date` yerine geçer. `Temporal.ZonedDateTime` bir dilim tanımlayıcısı taşır; `Temporal.Instant` zaman çizgisi üzerinde bir noktadır; `Temporal.PlainDateTime` dilimsiz bir duvar saati okumasıdır ve tür dizgesi bunları karıştırmanızı engeller.

`disambiguation` seçeneği, bu rehberin döne döne geldiği yılın iki günü ilkesini tam olarak açığa çıkarır: `'compatible'` (varsayılan — boşlukların içinden ileri al, belirsiz çiftin erken olanını al), `'earlier'`, `'later'` ve `'reject'`. Sonuncusu, sessizce bir saat şaşmanın bir hatadan kötü olduğu her yerde düşünmeye değer.
