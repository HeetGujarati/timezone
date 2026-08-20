import type { PageCopy } from '../types.ts';

/**
 * Türkçe metinler. Sözleşme İngilizcedir: bir alan eksikse tür denetimi hata verir.
 */
export const copy: PageCopy = {
  tools: {
    converter: {
      title: 'Saat dilimi dönüştürücü',
      metaTitle: 'Saat dilimi dönüştürücü — her tarih için',
      description:
        'Herhangi bir saat dilimini bir başkasına, istediğiniz tarih için çevirin. Yaz saatini, yarım saatlik ve 45 dakikalık farkları hesaba katar.',
      summary:
        'İki dilim ve bir tarih seçin; dönüşüm tam çıkar — saat değişiminin bir yerel saati imkânsız ya da çift anlamlı hâle getirdiği yılın o iki gününde bile.',
      faqs: [
        {
          question: 'Bu dönüştürücü yaz saatini hesaba katıyor mu?',
          answer:
            'Evet, hem de o iki zahmetli günü de. Farklar tarayıcı üzerinden IANA veritabanından gelir; bu yüzden geçiş gününde yapılan bir dönüşüm, bugünkü farkı değil o anda gerçekten geçerli olan farkı kullanır. Hiç yaşanmamış ya da iki kez yaşanmış bir yerel saat girerseniz, dönüştürücü sessizce birini seçmek yerine bunu size söyler.',
        },
        {
          question: 'İki şehir arasındaki saat farkı yıl içinde neden değişiyor?',
          answer:
            'Çünkü iki yer saatlerini nadiren aynı tarihte değiştirir, bazıları ise hiç değiştirmez. New York yılın büyük bölümünde Londra’dan 5 saat geridedir, mart ayında iki hafta boyunca ise 4 saat — çünkü Amerika Birleşik Devletleri saatleri Avrupa’dan iki üç hafta önce ileri alır. Her zaman belirli bir tarihe göre çevirin, aklınızda kalan bir farka göre değil.',
        },
        {
          question: 'Hangi saat dilimleri arasında çeviri yapabilirim?',
          answer:
            'IANA veritabanındaki hepsi arasında — 400’den fazla dilim — dönüştürücülerin çoğunun tökezlediği yarım saatlik ve 45 dakikalık farklar dâhil. UTC+05:30 ile Hindistan, UTC+05:45 ile Nepal ve UTC+12:45 ile Chatham Adaları en yakın saate yuvarlanmadan, tam olarak işlenir.',
        },
        {
          question: 'JavaScript gerekiyor mu?',
          answer:
            'Canlı dönüştürücü için evet. Geri kalan her şey — farklar, saat değişim tarihleri, saat saat başvuru tabloları ve bütün açıklamalar — önceden üretilmiş sayfanın parçasıdır ve JavaScript kapalıyken de çalışır.',
        },
        {
          question: 'Buraya yazdıklarım bir yere gönderiliyor mu?',
          answer:
            'Hayır. Bütün hesaplar tarayıcınızda yapılır. Arka uç, analitik, çerez ya da üçüncü taraf betiği yok. Seçtiğiniz dilimler adres çubuğunda görünür ki bir dönüşümü paylaşabilesiniz veya yer imine ekleyebilesiniz; gittikleri tek yer orasıdır.',
        },
      ],
      sections: [
        {
          heading: 'Saat dilimi dönüşümleri neden yanlış gider',
          paragraphs: [
            'Neredeyse her toplantı hatası dört sebepten birinden doğar ve burada dördü de yuvarlanıp geçilmek yerine ele alınır.',
            'Fark sabit değildir. „New York Londra’dan beş saat geridir“ yılın yaklaşık on ayı doğrudur. İlkbaharda üç hafta, sonbaharda bir hafta boyunca dört saattir, çünkü iki bölge saatlerini farklı tarihlerde değiştirir. Şehir başına sabit bir fark saklayan bir dönüştürücü tam da o günlerde yanılır — ve insanların sonradan pişman olacağı toplantıyı ayarladığı günler tam olarak o günlerdir.',
            'Her fark tam saat değildir. Hindistan UTC’den 5 saat 30 dakika ileridedir, Nepal 5 saat 45 dakika. Chatham Adaları 12 saat 45 dakika ileridedir ve Lord Howe Adası yaz saatine geçerken yalnızca 30 dakika kayar. Dünyanın kabaca beşte biri tam saat olmayan bir farkla yaşar.',
            'Bazı yerel saatler hiç var olmaz. Saatler ileri alındığında bir saat silinir. New York’ta geçiş gününde 01:59:59’dan hemen sonra 03:00:00 gelir — yani 02:30 hiç yaşanmaz. Çoğu araca 02:30’u çevirmesini söyleyin, yine de kendinden emin bir cevap verecektir. Bu araç ise ne yaptığını size söyler.',
            'Bazı yerel saatler iki kez yaşanır. Saatler geri alındığında bir saat tekrarlanır. 01:30 bir kez yaz saatinde, bir saat sonra bir kez daha standart saatte gelir. Bu dönüştürücü ilkini alır, bunu söyler ve size ikincisini gösterir.',
          ],
        },
      ],
    },

    meetingPlanner: {
      title: 'Toplantı planlayıcı',
      metaTitle: 'Saat dilimleri arasında toplantı planlayıcı',
      description:
        'İki ile on arasında dilim ekleyin, mesai saatleri gölgeli bir 24 saatlik şerit görün. Ortak saatleri bulun ya da hiç olmadığını öğrenin.',
      summary:
        'Ekibinizin çalıştığı dilimleri ekleyin: aşağıdaki şerit bütün günü bir bakışta gösterir, mesai saatleri gölgeli — kesişim yaptığınız bir hesap değil, gördüğünüz bir biçim olur.',
      faqs: [
        {
          question: 'Kaç saat dilimi ekleyebilirim?',
          answer:
            'İki ile on arasında. Onu geçince şerit tek bakışta okunmaz olur; oysa sayı listesi yerine şerit kullanmanın bütün sebebi budur — yani sınır teknik değil, tasarım kararıdır.',
        },
        {
          question: 'Mesai saati olarak ne sayılıyor?',
          answer:
            'Siz ne belirlerseniz. Varsayılan, her dilimde yerel saatle 09:00–18:00 arasıdır ve iki uç da ayarlanabilir. Mesainin bir öncesi ve bir sonrasındaki saatler daha açık gölgelidir: ulaşılabilir, ama bir iyilik istiyorsunuz demektir.',
        },
        {
          question: 'Bazı satırlarda saatler neden :30 veya :45 ile bitiyor?',
          answer:
            'Çünkü o dilimler gerçekten yarım ya da üç çeyrek saat kaymıştır. Hindistan UTC+05:30, Nepal UTC+05:45, Chatham Adaları UTC+12:45’tir. Şeridin her sütunu aynı andır, dolayısıyla o satırlar yuvarlanmış değil gerçek yerel okumayı gösterir.',
        },
        {
          question: 'Hiç kesişim yoksa ne olur?',
          answer:
            'Planlayıcı, kimsenin kabul etmediği bir orta yol önermek yerine bunu açıkça söyler. Los Angeles ile Mumbai 09:00–18:00 arası bir günün tek bir dakikasını paylaşmaz ve hiçbir gölgelendirme bunu değiştirmez — birinin yer değiştirmesi gerekir. Mesaiyi genişletmek ya da toplantıyı ikiye bölmek dürüst seçeneklerdir.',
        },
        {
          question: 'Plan sayfa yenilendiğinde kalıyor mu?',
          answer:
            'Evet. Dilimleriniz, tarih ve mesai saatleri adres çubuğuna yazılır; planı yer imine ekleyebilir ya da birine gönderebilirsiniz, o kişi tam olarak sizin gördüğünüzü görür. Dilim listesi ayrıca tarayıcınızda tutulur, böylece planlayıcı bir dahaki sefere ekibinizi hatırlar.',
        },
        {
          question: 'Yaz saatini hesaba katıyor mu?',
          answer:
            'Evet, seçtiğiniz tarihte. Mart ya da ekim ayından bir tarih seçin, satırların birbirine göre kaydığını görürsünüz; çünkü gerçekte olan budur: dilimler saatlerini farklı günlerde değiştirir.',
        },
      ],
      sections: [
        {
          heading: 'Şerit nasıl okunur',
          paragraphs: [
            'Her sütun tek bir andır. Bir sütunu yukarıdan aşağıya okuduğunuzda, aynı anda her yerde saatin kaçı gösterdiğini görürsünüz — fark listelerinin kafadan hesaplamaya zorladığı ve insanların yanıldığı şey tam olarak budur.',
            'Üç ton: mesai saatlerinin üstünde renkli bir kenar vardır, iki yanındaki saat daha açıktır, geri kalanı düzdür. Kenar en az dolgu kadar önemlidir — ayrım hiçbir zaman yalnızca renge dayanmaz, dolayısıyla o iki maviyi birbirinden ayıramasanız da okunur kalır.',
          ],
        },
        {
          heading: 'Kesişim olmadığında',
          paragraphs: [
            'Bazı ekiplerin gerçekten hiç kesişimi yoktur. Los Angeles’ta 09:00–18:00 arası bir gün ile Mumbai’de aynı saatler hiçbir şey paylaşmaz — Mumbai’nin mesaisi Los Angeles uyanmadan biter. New York ile Sidney daha da tuhaftır: kasımdan marta, aradaki fark 16 saatken tam olarak bir saat paylaşırlar; nisandan ekime, fark 14 saate inerken hiçbir şey paylaşmazlar. Aynı iki şehir, zıt cevap, değişen tek şey tarih.',
            'Böyle olduğunda planlayıcı bir yeri gölgeleyip umut etmek yerine bunu söyler. Gerçekçi seçenekler şunlardır: bir taraf için mesaiyi genişletmek, zahmetli görüşmeyi sırayla üstlenmek ya da eşzamanlı toplanmayı bırakmak. 22:00’nin sorun olmadığını varsaymak, insanların sessizce tükendiği yoldur.',
          ],
        },
      ],
    },

    worldClock: {
      title: 'Dünya saati',
      metaTitle: 'Dünya saati: 80 şehirde saat kaç',
      description:
        '80 büyük şehirde canlı yerel saat, doğudan batıya sıralı. İstediğiniz şehri arayın, önemsediklerinizi sabitleyin, tarihin dönüşünü izleyin.',
      summary:
        '80 şehirde canlı yerel saat — dünyanın en ileri saatinden en gerisine. Süzmek için arayın, sık baktığınız şehirleri sabitleyin: en üstte kalırlar.',
      faqs: [
        {
          question: 'Bu saatler ne kadar doğru?',
          answer:
            'Cihazınızın saatini okuyup tarayıcınızın IANA veritabanından aldığı farkı uygularlar; yani sizin makineniz kadar doğrudurlar. Bilgisayarınızın saati yanlışsa buradaki her saat aynı miktarda yanlıştır — bu sayfadaki hiçbir şey bir sunucudan gelmez.',
        },
        {
          question: 'Şehirlerimi en üstte tutabilir miyim?',
          answer:
            'Evet. Bir şehri sabitleyin, ızgaranın başına geçer ve bir sonraki ziyaretinizde orada kalır. Sabitlemeler yalnızca tarayıcınızda durur; hiçbir yere bir şey gönderilmez ve çerez konmaz.',
        },
        {
          question: 'Bazı şehirler neden farklı bir tarih gösteriyor?',
          answer:
            'Çünkü gerçekten farklı. New York’ta pazartesi akşamıyken Tokyo’da çoktan salı sabahıdır. Her saatin altındaki tarih o şehrin yerel takvim tarihidir, sizinki değil.',
        },
        {
          question: 'Mumbai ve Katmandu neden :30 ve :45 ile biten saatler gösteriyor?',
          answer:
            'Hindistan UTC+05:30, Nepal ise UTC+05:45 üzerinden işler. Bunlar yuvarlama hatası değil gerçek farklardır — dünyanın kabaca beşte biri tam saat olmayan bir farkla yaşar.',
        },
      ],
      sections: [],
    },

    timeDifference: {
      title: 'Saat farkı',
      metaTitle: 'İki saat dilimi arasındaki saat farkı',
      description:
        'İki yer arasındaki güncel fark ve önümüzdeki yıl içinde, biri saatlerini değiştirdiği için bu farkın değiştiği bütün tarihler.',
      summary:
        'İki yer seçin; şu anda aralarında ne kadar olduğunu görün — üstelik önümüzdeki yıl bu farkın değiştiği kesin tarihlerle birlikte, ki çoğu araç tam da bu kısmı atlar.',
      faqs: [
        {
          question: 'Fark neden yıl boyunca aynı değil?',
          answer:
            'Çünkü iki yer saatlerini farklı tarihlerde değiştirir ya da biri hiç değiştirmez. New York ile Londra yılın çoğunda 5 saat, martta Amerika saatleri ileri aldıktan sonra Avrupa almadan önceki üç hafta boyunca 4 saat, ekim sonunda Avrupa geri aldıktan sonra Amerika almadan önceki bir hafta boyunca yine 4 saat ayrıdır.',
        },
        {
          question: 'Hangi yerlerde fark hiç değişmez?',
          answer:
            'Hiçbirinin yaz saati uygulamadığı her çiftte — örneğin Hindistan ile Japonya arasında kalıcı olarak 3 saat 30 dakika vardır. Aynı düzenleme bloğundaki çiftler de kararlıdır: bütün Avrupa Birliği dilimleri aynı anda değişir, dolayısıyla Lizbon ile Atina yıl boyunca tam 2 saat ayrı kalır.',
        },
        {
          question: 'Fark nasıl hesaplanıyor?',
          answer:
            'Tarayıcıya her iki dilimin aynı andaki farkı sorulup çıkarma yapılarak. Yani baktığınız anda doğrudur — bir geçişin tam ortasında bile — geçen ay doğru olan saklı bir sayıyı okumak yerine.',
        },
        {
          question: 'Negatif fark ne anlama geliyor?',
          answer:
            'İkinci yerin birincinin gerisinde olduğu anlamına gelir. Sayfa tam da bu yüzden „ileride“ ya da „geride“ diye kelimeyle yazar: saat farklarındaki eksi işaretini insanların kabaca yarısı ters okur.',
        },
      ],
      sections: [],
    },

    workingHoursOverlap: {
      title: 'Mesai saatleri kesişimi',
      metaTitle: 'Dağıtık ekipler için ortak mesai saatleri',
      description:
        'Dağıtık bir ekibin paylaştığı kesin saatleri herkesin kendi yerel saatiyle görün — ya da hiç olmadığını dürüstçe öğrenin.',
      summary:
        'Ekibinizin çalıştığı dilimleri ekleyin; herkesin müsait olduğu kesin pencereleri, her birinin kendi saatiyle alın — ve hiç yoksa bunu açıkça öğrenin.',
      faqs: [
        {
          question: 'Mesai saati olarak ne sayılıyor?',
          answer:
            'Varsayılan herkes için yerel saatle 09:00–18:00 arasıdır ve iki uç da ayarlanabilir. Hangi ülkelerin erken başladığına dair varsayımları koda gömmek yerine her dilim bilerek aynı biçimde ele alınır — gerçekten 10:00–19:00 arası çalışan bir ekip bunu belirtmelidir.',
        },
        {
          question: 'Kesişim yoksa ne olur?',
          answer:
            'Bunu size söyleriz, üstelik en çok kişinin mesaisi içinde kaldığı en yakın pencerelerle birlikte. Los Angeles ile Mumbai 09:00–18:00 arası bir günün tek dakikasını paylaşmaz; ızgarayı nasıl dizerseniz dizin bu değişmez. Dürüst seçenekler bir tarafta günü genişletmek, zahmetli görüşmeyi sırayla üstlenmek ya da eşzamansız çalışmaktır.',
        },
        {
          question: 'Bu, toplantı planlayıcıdan nasıl farklı?',
          answer:
            'Planlayıcı bütün günü bir şerit olarak gösterir, böylece biçimi görürsünüz. Bu araç daha dar soruyu tam olarak yanıtlar: hangi dakikalar ortaktır ve o dakikalar herkesin saatinde kaça denk gelir. Keşfetmek için planlayıcıyı, karar vermek için bunu kullanın.',
        },
        {
          question: 'Yaz saatini hesaba katıyor mu?',
          answer:
            'Evet, bugün için. Bir taraf saatlerini değiştirip diğeri henüz değiştirmediğinde kesişim pencereleri bir saat kayar — aynı ekibin şubatta dört, martta üç ortak saati olmasının sebebi budur.',
        },
      ],
      sections: [],
    },

    unixTimestamp: {
      title: 'Unix zaman damgası dönüştürücü',
      metaTitle: 'Unix zaman damgasını tarihe çevirin',
      description:
        'Bir Unix zaman damgasını okunur tarihe ve geri çevirin, istediğiniz dilimde. Saniye mi milisaniye mi olduğunu anlar, canlı sayaç gösterir.',
      summary:
        'Tarih olarak okumak için bir Unix zaman damgası yapıştırın ya da damgayı almak için bir tarih seçin — dönüştürücü sayınızın saniye mi milisaniye mi olduğunu anlar ve neyi varsaydığını söyler.',
      faqs: [
        {
          question: 'Saniye mi milisaniye mi — bunu nasıl anlıyor?',
          answer:
            'Büyüklüğünden. 1e11 ve üzeri bir damga milisaniye kabul edilir, çünkü 1e11 saniye 5138 yılına denk gelir ve gerçek hiçbir şey oraya ulaşmaz. Anlaşılan birim sessizce uygulanmak yerine sonucun yanında gösterilir; çünkü burada yanılmak sizi 1970’e düşüren bin katlık bir hatadır.',
        },
        {
          question: 'Unix zaman damgası nedir?',
          answer:
            '1 Ocak 1970 saat 00:00:00 UTC’den bu yana geçen saniye sayısıdır, artık saniyeler sayılmadan. Saat dilimi iliştirilmemiş tek bir sayıdır ve sistemlerin onu kullanmasının sebebi tam olarak budur: dünyanın herhangi iki noktasındaki iki makine aynı damgayı okuduğunda aynı an üzerinde anlaşır.',
        },
        {
          question: 'Bir damga negatif olabilir mi?',
          answer:
            'Olabilir. 1970 öncesindeki her şey negatiftir. Apollo 11’in Ay’a inişi kabaca -14.182.940’tır. Bu dönüştürücü negatif değerleri her iki yönde de işler.',
        },
        {
          question: '2038’de ne olacak?',
          answer:
            'Sayımı işaretli 32 bitlik bir tam sayıda tutan sistemlerin yeri 19 Ocak 2038’de saat 03:14:07 UTC’de biter. Sonraki saniye negatif bir sayıya taşar ve o sistemler bunu Aralık 1901 diye okur. Modern platformların çoğu yıllar önce 64 bitlik sayıma geçti; açıkta kalanlar gömülü ve eski sistemlerdir.',
        },
        {
          question: 'Saat dilimi damgayı etkiler mi?',
          answer:
            'Damganın kendisini etkilemez — o her zaman bir UTC anından sayılır. Dilim yalnızca o anın tarih ve saat olarak nasıl gösterileceğine ve hangi yerel okumanın hangi sayıya döneceğine karar verir.',
        },
      ],
      sections: [],
    },

    durationCalculator: {
      title: 'Süre hesaplayıcı',
      metaTitle: 'Saat dilimleri arası süre hesaplayıcı',
      description:
        'İki tarih ve saat arasındaki süreyi, her biri kendi diliminde, hesaplayın. Yaz saatini doğru işler: 23 saatlik gün 23 saat olarak bildirilir.',
      summary:
        'Bir başlangıç ve bir bitiş belirleyin — farklılarsa her biri kendi diliminde — ve gerçekten geçen süreyi alın, 23 ya da 25 saat süren günler dâhil.',
      faqs: [
        {
          question: 'Bir gün neden bazen 23 ya da 25 saat çıkıyor?',
          answer:
            'Çünkü öyleydi. Saatlerin ileri alındığı gün gece yarısından gece yarısına 23 saat vardır; geri alındığı gün 25. Bu hesaplayıcı çıkarma yapmadan önce iki ucu da mutlak anlara çevirir, böylece takvimin ima ettiği süreyi değil gerçekten geçen süreyi bildirir.',
        },
        {
          question: 'İki uç farklı saat dilimlerinde olabilir mi?',
          answer:
            'Olabilir, zaten mesele bu. Tokyo’dan 17:00’de kalkıp San Francisco’ya aynı sabah 09:30’da inen bir uçuş dokuz buçuk saat sürmüştür, eksi yedi buçuk değil. Her ucu kendi dilimine ayarlayın, hesap tutar.',
        },
        {
          question: 'Artık saniyeler dâhil mi?',
          answer:
            'Hayır. Tarayıcılar bunları dışarı vermez — JavaScript saati artık saniyeleri tamamen yok sayar, dolayısıyla birinin üzerinden geçen bir aralık bir saniye kısa bildirilir. UTC’nin bütün tarihinde bu toplam 27 saniyedir: uydu seyrüseferi için önemlidir, burada ölçeceğiniz hiçbir şey için değil.',
        },
        {
          question: 'Bitiş başlangıçtan önceyse ne olur?',
          answer:
            'Bunu söyler ve büyüklüğü yine de bildirir. Negatif süre genellikle bir yazım hatasıdır ve işareti sessizce çevirmek onu gizlerdi.',
        },
      ],
      sections: [
        {
          heading: 'Takvim aritmetiği neden saat aritmetiği değildir',
          paragraphs: [
            '„Bir gün sonra“ ile „24 saat sonra“ farklı talimatlardır ve yılda iki kez farklı cevaplar verir. Gecelik bir iş yerel saatle 02:30’a programlandıysa, bir sonbahar sabahı iki kez çalışır, bir ilkbahar sabahı ise hiç çalışmaz. Her 86.400 saniyede bir programlandıysa bunun yerine 02:30’dan bir saat uzaklaşır.',
            'İki davranış da hatalı değildir; farklı sorulara cevap verirler. Sorun, kod birini yaparken insanın diğerini beklemesiyle başlar. Bu hesaplayıcı her zaman saat sorusuna cevap verir — gerçekte ne kadar zaman geçti — ve takvim günlerini yanında gösterir.',
          ],
        },
      ],
    },

    countdown: {
      title: 'Geri sayım',
      metaTitle: 'Her tarih ve dilim için geri sayım sayacı',
      description:
        'İstediğiniz dilimdeki istediğiniz ana geri sayın ve bağlantı olarak paylaşın. Hesap yok, depolama yok — geri sayımın tamamı adreste durur.',
      summary:
        'Bir an ve bir dilim seçin, aşağıdaki geri sayım ona doğru işlesin — hepsi adreste durduğu için paylaşmak, adres çubuğunu kopyalamaktır.',
      faqs: [
        {
          question: 'Bir geri sayımı nasıl paylaşırım?',
          answer:
            'Kurun ve adres çubuğunu kopyalayın — her alan adreste. Bağlantıyı açan kişi aynı ana giden aynı geri sayımı, kendi cihaz saatiyle sayılırken görür. Hesap yok, kaydedilmiş bir kayıt yok ve sunucuda hiçbir şey yok; çünkü sunucu yok.',
        },
        {
          question: 'Alan kişi kendi saat diliminde mi görür?',
          answer:
            'Aynı geri sayımı görür, çünkü geri sayım tek bir ana olan uzaklığı ölçer ve bu uzaklık her yerde aynıdır. Hedef tarih ve saat sizin seçtiğiniz dilimde gösterilir, böylece herkes hangi yerel andan söz edildiğini görebilir.',
        },
        {
          question: 'Sıfıra ulaştığında ne olur?',
          answer:
            'Anın geçtiğini söyler ve durur. İleri saymaya başlamaz — bir olaydan bu yana geçen süreyi istiyorsanız, o soruyu süre hesaplayıcı düzgün biçimde yanıtlar.',
        },
        {
          question: 'Var olmayan bir saate geri sayabilir miyim?',
          answer:
            'İleri alma boşluğunun içinde kalan bir yerel saat seçerseniz, geri sayım değişimden sonraki eşdeğer ana kayar ve bunu size söyler. Bu sitedeki her aracın izlediği ilke aynıdır.',
        },
      ],
      sections: [
        {
          heading: 'Geri sayımın tamamı neden bağlantıda',
          paragraphs: [
            'Çoğu geri sayım aracı hesap açmanızı ister; böylece geri sayımınızı kendi sunucusunda tutar ve yanına bir reklam koyar. Burada sunucu olmadığı için durumun, bağlantının taşıyabileceği bir yerde durması gerekir — ki bu herkes için daha iyi çıkıyor. Kaydolunacak bir şey yok, sonradan silinecek bir şey yok, bir şirket kapandığında çalışmayı bırakacak bir şey yok.',
            'Bilinmeye değer tek şey: başlık adreste yolculuk ettiği için, tanımadığınız birinden gelen geri sayım bağlantısına her bağlantıya davrandığınız gibi davranın. Başlık, düz metin olmayan her şeyden arındırılır ve daima metin olarak işlenir, asla biçimlendirme olarak değil.',
          ],
        },
      ],
    },

    utcTime: {
      title: 'UTC saati',
      metaTitle: 'UTC saati şimdi — eşgüdümlü evrensel zaman',
      description:
        'Canlı işleyen güncel UTC saati; ayrıca UTC gerçekte nedir, GMT’den nasıl ayrılır ve diğer bütün dilim farkları neye göre ölçülür.',
      summary:
        'UTC, diğer her saat diliminin kendisine göre tanımlandığı referans saattir — yaz saati için asla kaymaz ve aşağıdaki okuma, cihazınızın saatinin UTC cinsinden ifadesidir.',
      faqs: [
        {
          question: 'UTC nedir?',
          answer:
            'Eşgüdümlü evrensel zaman, diğer her saat diliminin kendisine göre tanımlandığı referanstır. Kimsenin içinde yaşadığı bir dilim değildir; temel çizgidir. Gördüğünüz her fark, UTC-12’den UTC+14’e kadar, bu saate olan uzaklıktır.',
        },
        {
          question: 'UTC ile GMT aynı şey mi?',
          answer:
            'Gündelik kullanımda aynı okumayı gösterirler ama farklı şeylerdir. GMT bir saat dilimidir; Greenwich meridyeninde güneşin konumuyla tanımlanır ve Britanya her yaz ondan çıkar. UTC ise bir zaman standardıdır; yaklaşık 450 atom saatiyle tutulur ve yaz saati için asla ayarlanmaz. „Referans“ demek istiyorsanız UTC deyin.',
        },
        {
          question: 'Neden CUT değil de UTC diye kısaltılıyor?',
          answer:
            'Çünkü ne İngilizce ne de Fransızca kısaltma kazandı. İngilizce konuşanlar „coordinated universal time“ için CUT istedi, Fransızca konuşanlar „temps universel coordonné“ için TUC istedi ve Uluslararası Telekomünikasyon Birliği UTC’de karar kıldı — hiçbir dile uymayan, dolayısıyla ikisini de eşit ölçüde gücendiren bir kısaltma.',
        },
        {
          question: 'UTC yaz saati uygular mı?',
          answer:
            'Asla. Bütün mesele bu. UTC kaymaz; sunucuların, havacılığın, denizciliğin ve iki makinenin bir şeyin ne zaman olduğunda anlaşması gereken her dağıtık sistemin yerel bir dilim yerine onu kullanmasının sebebi budur.',
        },
        {
          question: 'Peki artık saniyeler?',
          answer:
            'UTC’ye, Dünya’nın gerçek dönüşünden 0,9 saniyeden fazla ayrılmamak için zaman zaman artık saniye eklendi — 1972’den beri 27 tane, sonuncusu 2016 sonunda. 2022’de Ağırlıklar ve Ölçüler Genel Konferansı 2035’e kadar eklemeyi bırakma kararı aldı. Tarayıcınız artık saniyeleri dışarı vermez, dolayısıyla bu sayfa da vermez.',
        },
      ],
      sections: [
        {
          heading: 'Neden her şey buradan ölçülür',
          paragraphs: [
            '1884’ten önce her kasaba kendi öğlesine göre kurulmuş kendi saatini tutardı. Demiryolları gelene kadar bu işe yaradı; o noktada altmış kilometre arayla iki kasabanın on iki dakika ayrılması bir merak konusu olmaktan çıkıp çarpışma riskine dönüştü. Uluslararası Meridyen Konferansı Greenwich’i başlangıç meridyeni seçti ve bugünkü fark düzeni buradan doğdu.',
            'UTC, teknik standart olarak Greenwich ortalama zamanının yerini 1972’de aldı. Aradaki fark kulağa geldiğinden daha önemlidir: GMT sallanan Dünya’ya göre tanımlıdır, UTC ise sallanmayan sezyum atomlarına göre. İkisi elle, birbirinden bir saniyeden fazla ayrılmayacak şekilde tutulur.',
            'Bir zaman damgasını veritabanına yazıyorsanız, bir olayı günlüğe kaydediyorsanız ya da iki makinenin üzerinde anlaşması gereken bir şey planlıyorsanız: UTC olarak saklayın, yalnızca gösterirken çevirin. Yerel saati saklamak, sistemlerin yılda iki kez yaşanan bir saatle ve ona yakışır bir destek kaydıyla baş başa kalma yoludur.',
          ],
        },
      ],
    },

    dstChanges: {
      title: 'Yaz saati değişiklikleri',
      metaTitle: 'Bu yıl ve gelecek yıl yaz saati değişimleri',
      description:
        'Bu yıl ve gelecek yıl için planlanmış her saat değişimi: kesin tarihler, yerel değişim saati ve öncesindeki ile sonrasındaki fark. Ülkeye göre süzülür.',
      summary:
        'Aşağıdaki her tarih IANA veritabanından gelir, her değişimin yürürlüğe girdiği kesin yerel anla birlikte — saatlerini hiç değiştirmeyen şehirler ise ayrı listelenir.',
      faqs: [
        {
          question: 'Hangi ülkeler yaz saatini kaldırdı?',
          answer:
            'Rusya 2014’te, Türkiye 2016’da, İran 2022’de, Meksika ülkenin büyük bölümünde 2022’de bıraktı; Brezilya ise onlarca yıl kullandıktan sonra 2019’da. Japonya, Hindistan, Çin ile Afrika ve Güneydoğu Asya’nın neredeyse tamamı hiç kullanmadı. Dünyanın kabaca üçte biri uyguluyor; geri kalanı altı ayda bir kopan tartışmayı ilgiyle izliyor.',
        },
        {
          question: 'Avrupa Birliği hâlâ kaldırmayı planlıyor mu?',
          answer:
            'Avrupa Parlamentosu 2019’da mevsimsel saat değişimlerine son verme yönünde oy kullandı, ancak direktif tıkandı: üye devletler kalıcı yaz saatinde mi yoksa kalıcı kış saatinde mi kalınacağı konusunda anlaşamadı ve yamalı bir çözüm ortak pazarın saat dilimlerini parçalardı. Bu çözülene kadar bu sayfadaki tarihler geçerlidir.',
        },
        {
          question: 'Lord Howe Adası neden yalnızca 30 dakika kayıyor?',
          answer:
            'Çünkü bir saatin fazla olduğuna karar verdi. Avustralya’nın doğu kıyısı açıklarındaki Lord Howe, UTC+10:30’dan UTC+11:00’e geçer — dünyadaki tek yarım saatlik yaz saati değişimi. Aynı zamanda bir saatlik kayma varsayan her zaman kütüphanesinin yaklaşık 380 kişi için sessizce yanılmasının sebebidir.',
        },
        {
          question: 'Saatler gerçekte kaçta değişiyor?',
          answer:
            'Değişir. Amerika Birleşik Devletleri yerel saatle 02:00’de, Avrupa Birliği 01:00 UTC’de değiştirir — yani bütün AB dilimleri aynı anda ama farklı yerel saatlerde değişir. Avustralya yerel saatle 02:00’de, Şili 24:00’te değiştirir. Yerel saat sütunu her değişimden önceki son okumayı gösterir.',
        },
        {
          question: 'Bu sayfa ne sıklıkla güncelleniyor?',
          answer:
            'Aylık olarak ve ayrıca 1 Mart, 1 Nisan, 1 Ekim ve 1 Kasım’da yeniden üretilir; böylece IANA veritabanındaki her değişiklik, etkilediği tarihlerden önce yakalanır. Hükûmetler bu değişiklikleri bir yıldan iki haftaya kadar değişen sürelerle duyurur.',
        },
      ],
      sections: [],
    },
  },

  hubs: {
    convert: {
      title: 'Saat dilimi dönüşümleri',
      metaTitle: 'Şehirler arası saat dilimi dönüşümleri',
      description:
        'Bu sitedeki bütün şehir çifti ve kısaltma dönüşümleri; her biri saat saat tablo, yaz saati tarihleri ve arayabileceğiniz saatlerle birlikte.',
      summary:
        'Her dönüşüm yanında saat saat bir tablo, iki şehrin de yaz saati tarihleri ve gerçekten arayabileceğiniz saatler getirir.',
    },
    cities: {
      title: 'Şehre göre güncel saat',
      metaTitle: 'Her kıtadan şehirlerde güncel saat',
      description:
        'Yerleşik bütün kıtalardan 80 şehir için yerel saat, UTC farkı ve yaz saati tarihleri.',
      summary:
        'Her sayfada canlı bir saat, o dilimin kesin yaz saati tarihleri, şehrin koordinatlarından hesaplanan gün doğumu ile batımı ve büyük merkezlere dönüşümler bulunur.',
    },
    guides: {
      title: 'Rehberler',
      metaTitle: 'Saat dilimleri, UTC ve yaz saati rehberleri',
      description:
        'Saat dilimlerinin nasıl işlediği, UTC’nin ne olduğu, yaz saatinin neden var olduğu ve bunların kodda nasıl doğru ele alınacağı üzerine rehberler.',
      summary:
        'Saat dilimleri gerçekte nasıl işler — mekanizma, tarih ve yazılımın yanıldığı belirli yollar. Sıralamada yükselmek için değil, bir kez okunup akılda kalsın diye yazıldı.',
    },
  },

  generated: {
    hourByHour: 'Saat saat',
    daylightSaving: 'Yaz saati',
    whenYouCanTalk: 'Gerçekten ne zaman konuşabilirsiniz',
    reference: 'Başvuru',
    zoneFacts: 'Dilim bilgileri',
    sunriseSunset: 'Gün doğumu ve batımı',
    againstHubs: 'Büyük merkezlere göre',
    convertTo: 'Şuna çevir',
    exampleNote:
      'Farklar ve tarihler derleme sırasında IANA veritabanından hesaplanır. Canlı saatler tarayıcınızda oluşturulur.',
    sunNote:
      'Şehrin enlem ve boylamından NOAA güneş konumu algoritmasıyla hesaplandı — API yok, ağ isteği yok.',
    noDstNote: 'Bu şehir yaz saati uygulamaz. UTC’ye olan farkı yılın her günü aynıdır.',
    ambiguousPanelHeading: 'Bu harfler birden fazla anlama geliyor',
    ambiguousPanelBody:
      'Diğerlerinden birini kastettiyseniz aşağıdaki fark sizin için yanlıştır — ve toplantılar tam olarak böyle yanlış saate ayarlanır.',
    abbreviationTableNote:
      'Bu kısaltmanın gerçekten yürürlükte olduğu bir tarihte hesaplandı — bugünü kullanmak yılın yarısında yanlış olurdu.',
  },
};

export default copy;
