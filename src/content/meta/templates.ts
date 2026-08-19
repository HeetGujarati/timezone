import type { LocaleCode } from '~/config/locales.ts';
import type {
  AbbreviationMetaInput,
  CityMetaInput,
  MetaTemplates,
  PairMetaInput,
} from './types.ts';

/**
 * One set of generated-page templates per locale.
 *
 * Titles are kept deliberately short. The longest realised city pairing is
 * "Los Angeles" with "Lord Howe Island" — 27 characters of proper noun — and
 * the site name costs another 11, which leaves 22 for the template's own words
 * before a title is cut off in the results page. English spends all 22; the
 * others stay well under. `templates.test.ts` proves this against every real
 * pair rather than trusting the arithmetic.
 */

const templates: Record<LocaleCode, MetaTemplates> = {
  en: {
    pairTitle: ({ from, to }) => `Convert ${from} time to ${to} time`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} and ${to} share one time zone, so there is no difference. Hour-by-hour table, daylight saving dates and zone identifiers.`
        : sameTime
          ? `${to} reads the same as ${from} today. Hour-by-hour table, daylight saving dates for both cities, and when you can call.`
          : `${to} is ${difference} ${targetAhead ? 'ahead of' : 'behind'} ${from}. Hour-by-hour table, daylight saving dates for both cities, and when you can call.`,
    cityTitle: ({ city }) => `Time in ${city}`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `Local time in ${city}, ${country}: live clock, UTC offset, ${hasTransitions ? 'daylight saving dates' : 'no daylight saving'}, sunrise and sunset.`,
    abbreviationTitle: ({ from, to }) => `${from} to ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to} reads the same as ${from}. Hour-by-hour conversion table, the IANA zones each abbreviation maps to, and what else those letters can mean.`
        : `${to} is ${difference} ${targetAhead ? 'ahead of' : 'behind'} ${from}. Hour-by-hour conversion table, the IANA zones each abbreviation maps to, and what else those letters mean.`,
  },

  es: {
    pairTitle: ({ from, to }) => `Hora de ${from} a ${to}`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} y ${to} comparten zona horaria: no hay diferencia. Tabla hora por hora, fechas del cambio de hora e identificadores de zona.`
        : sameTime
          ? `Hoy ${to} marca la misma hora que ${from}. Tabla hora por hora, fechas del cambio de hora y las horas para llamar.`
          : `${to} va ${difference} ${targetAhead ? 'por delante de' : 'por detrás de'} ${from}. Tabla hora por hora, fechas del cambio de hora y las horas para llamar.`,
    cityTitle: ({ city }) => `Hora en ${city}`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `Hora local en ${city}, ${country}: reloj en vivo, desfase UTC, ${hasTransitions ? 'fechas del cambio de hora' : 'sin horario de verano'}, amanecer y atardecer.`,
    abbreviationTitle: ({ from, to }) => `${from} a ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to} marca lo mismo que ${from}. Tabla de conversión hora por hora, zonas IANA de cada abreviatura y qué más pueden significar esas letras.`
        : `${to} va ${difference} ${targetAhead ? 'por delante de' : 'por detrás de'} ${from}. Tabla hora por hora, zonas IANA de cada abreviatura y qué más significan esas letras.`,
  },

  'pt-BR': {
    pairTitle: ({ from, to }) => `Hora de ${from} para ${to}`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} e ${to} ficam no mesmo fuso: não há diferença. Tabela hora a hora, datas do horário de verão e os identificadores de fuso.`
        : sameTime
          ? `Hoje ${to} marca a mesma hora que ${from}. Tabela hora a hora, datas do horário de verão e as horas para ligar.`
          : `${to} está ${difference} ${targetAhead ? 'à frente de' : 'atrás de'} ${from}. Tabela hora a hora, datas do horário de verão e as horas para ligar.`,
    cityTitle: ({ city }) => `Hora em ${city}`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `Hora local em ${city}, ${country}: relógio ao vivo, diferença para o UTC, ${hasTransitions ? 'datas do horário de verão' : 'sem horário de verão'}, nascer e pôr do sol.`,
    abbreviationTitle: ({ from, to }) => `${from} para ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to} marca o mesmo que ${from}. Tabela de conversão hora a hora, os fusos IANA de cada sigla e o que mais essas letras podem significar.`
        : `${to} está ${difference} ${targetAhead ? 'à frente de' : 'atrás de'} ${from}. Tabela hora a hora, os fusos IANA de cada sigla e o que mais essas letras significam.`,
  },

  fr: {
    pairTitle: ({ from, to }) => `Heure de ${from} à ${to}`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} et ${to} partagent un fuseau : aucun écart. Tableau heure par heure, dates de changement d’heure et identifiants de fuseau.`
        : sameTime
          ? `Aujourd’hui ${to} affiche la même heure que ${from}. Tableau heure par heure et créneaux pour appeler.`
          : `${to} est ${difference} ${targetAhead ? 'en avance sur' : 'en retard sur'} ${from}. Tableau heure par heure et créneaux pour appeler.`,
    cityTitle: ({ city }) => `Heure à ${city}`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `Heure locale à ${city}, ${country} : horloge en direct, décalage UTC, ${hasTransitions ? 'dates de changement d’heure' : 'pas de changement d’heure'}, lever et coucher du soleil.`,
    abbreviationTitle: ({ from, to }) => `${from} vers ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to} affiche la même heure que ${from}. Tableau heure par heure, fuseaux IANA de chaque sigle et ce que ces lettres peuvent signifier d’autre.`
        : `${to} est ${difference} ${targetAhead ? 'en avance sur' : 'en retard sur'} ${from}. Tableau heure par heure, fuseaux IANA de chaque sigle et le sens de ces lettres.`,
  },

  de: {
    pairTitle: ({ from, to }) => `Uhrzeit ${from} zu ${to}`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} und ${to} liegen in derselben Zeitzone, es gibt keinen Unterschied. Stundentabelle, Umstellungstermine und Zonenkennungen.`
        : sameTime
          ? `Heute zeigt ${to} dieselbe Uhrzeit wie ${from}. Stundentabelle, Umstellungstermine beider Städte und Zeiten zum Anrufen.`
          : `${to} liegt ${difference} ${targetAhead ? 'vor' : 'hinter'} ${from}. Stundentabelle, Umstellungstermine beider Städte und Zeiten zum Anrufen.`,
    cityTitle: ({ city }) => `Uhrzeit in ${city}`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `Ortszeit in ${city}, ${country}: Live-Uhr, UTC-Versatz, ${hasTransitions ? 'Umstellungstermine' : 'keine Zeitumstellung'}, Sonnenauf- und -untergang.`,
    abbreviationTitle: ({ from, to }) => `${from} zu ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to} zeigt dieselbe Uhrzeit wie ${from}. Umrechnungstabelle Stunde für Stunde, die IANA-Zonen beider Kürzel und was die Buchstaben sonst bedeuten.`
        : `${to} liegt ${difference} ${targetAhead ? 'vor' : 'hinter'} ${from}. Umrechnungstabelle Stunde für Stunde, die IANA-Zonen beider Kürzel und was die Buchstaben sonst bedeuten.`,
  },

  it: {
    pairTitle: ({ from, to }) => `Ora da ${from} a ${to}`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} e ${to} condividono il fuso: nessuna differenza. Tabella ora per ora, date dell’ora legale e identificativi di fuso.`
        : sameTime
          ? `Oggi ${to} segna la stessa ora di ${from}. Tabella ora per ora, date dell’ora legale e le ore per telefonare.`
          : `${to} è ${difference} ${targetAhead ? 'avanti a' : 'indietro rispetto a'} ${from}. Tabella ora per ora, date dell’ora legale e le ore per telefonare.`,
    cityTitle: ({ city }) => `Ora a ${city}`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `Ora locale a ${city}, ${country}: orologio dal vivo, scarto da UTC, ${hasTransitions ? 'date dell’ora legale' : 'nessuna ora legale'}, alba e tramonto.`,
    abbreviationTitle: ({ from, to }) => `${from} a ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to} segna la stessa ora di ${from}. Tabella ora per ora, i fusi IANA di ogni sigla e che altro possono significare quelle lettere.`
        : `${to} è ${difference} ${targetAhead ? 'avanti rispetto a' : 'indietro rispetto a'} ${from}. Tabella ora per ora, i fusi IANA di ogni sigla e il senso di quelle lettere.`,
  },

  ru: {
    pairTitle: ({ from, to }) => `Время: ${from} и ${to}`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} и ${to} находятся в одном часовом поясе, разницы между ними нет. Почасовая таблица, даты перевода стрелок и идентификаторы поясов.`
        : sameTime
          ? `Сегодня в ${to} те же показания, что и в ${from}. Почасовая таблица перевода, даты перевода стрелок в обоих городах и часы для звонка.`
          : `${to} ${targetAhead ? 'опережает' : 'отстаёт от'} ${from} на ${difference}. Почасовая таблица перевода, даты перевода стрелок и часы, когда удобно позвонить.`,
    cityTitle: ({ city }) => `Время в ${city}`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `Местное время в ${city}, ${country}: живые часы, смещение от UTC, ${hasTransitions ? 'даты перевода стрелок' : 'перевода стрелок нет'}, восход и закат.`,
    abbreviationTitle: ({ from, to }) => `${from} в ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to} показывает то же, что и ${from}. Почасовая таблица перевода, пояса IANA для каждого сокращения и что ещё могут значить эти буквы.`
        : `${to} ${targetAhead ? 'опережает' : 'отстаёт от'} ${from} на ${difference}. Почасовая таблица, пояса IANA для каждого сокращения и что ещё значат эти буквы.`,
  },

  tr: {
    pairTitle: ({ from, to }) => `${from} saati ${to} saatine`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} ile ${to} aynı saat diliminde, aralarında fark yok. Saat saat tablo, yaz saati tarihleri ve her iki şehrin dilim tanımlayıcıları.`
        : sameTime
          ? `Bugün ${to}, ${from} ile aynı saati gösteriyor. Saat saat dönüşüm tablosu, iki şehrin yaz saati tarihleri ve arayabileceğiniz saatler.`
          : `${to}, ${from}’dan ${difference} ${targetAhead ? 'ileride' : 'geride'}. Saat saat dönüşüm tablosu, iki şehrin yaz saati tarihleri ve arayabileceğiniz saatler.`,
    cityTitle: ({ city }) => `${city} saati`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `${city}, ${country} yerel saati: canlı saat, UTC farkı, ${hasTransitions ? 'yaz saati tarihleri' : 'yaz saati yok'}, gün doğumu ve batımı.`,
    abbreviationTitle: ({ from, to }) => `${from} — ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to}, ${from} ile aynı saati gösterir. Saat saat dönüşüm tablosu, her kısaltmanın IANA dilimleri ve o harflerin başka anlamları.`
        : `${to}, ${from}’dan ${difference} ${targetAhead ? 'ileridedir' : 'geridedir'}. Saat saat dönüşüm tablosu, kısaltmaların IANA dilimleri ve harflerin başka anlamları.`,
  },

  ar: {
    pairTitle: ({ from, to }) => `الوقت من ${from} إلى ${to}`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} و${to} في المنطقة الزمنية نفسها، فلا فرق بينهما. جدول ساعة بساعة وتواريخ التوقيت الصيفي ومعرّفات المنطقة لكل منهما.`
        : sameTime
          ? `اليوم يعرض ${to} الوقت نفسه الذي يعرضه ${from}. جدول تحويل ساعة بساعة وتواريخ التوقيت الصيفي للمدينتين والساعات المناسبة للاتصال.`
          : `${to} ${targetAhead ? 'يسبق' : 'يتأخر عن'} ${from} بمقدار ${difference}. جدول تحويل ساعة بساعة وتواريخ التوقيت الصيفي للمدينتين وساعات الاتصال.`,
    cityTitle: ({ city }) => `الوقت في ${city}`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `الوقت المحلي في ${city}، ${country}: ساعة حية وفرق UTC و${hasTransitions ? 'تواريخ التوقيت الصيفي' : 'لا توقيت صيفي'} وشروق الشمس وغروبها.`,
    abbreviationTitle: ({ from, to }) => `${from} إلى ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to} يعرض الوقت نفسه الذي يعرضه ${from}. جدول تحويل ساعة بساعة ومناطق IANA لكل اختصار وما قد تعنيه تلك الحروف أيضًا.`
        : `${to} ${targetAhead ? 'يسبق' : 'يتأخر عن'} ${from} بمقدار ${difference}. جدول تحويل ساعة بساعة ومناطق IANA لكل اختصار وما تعنيه تلك الحروف أيضًا.`,
  },

  hi: {
    pairTitle: ({ from, to }) => `${from} से ${to} का समय`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} और ${to} एक ही समय क्षेत्र में हैं, कोई अंतर नहीं। घंटे-दर-घंटे तालिका, डेलाइट सेविंग तारीख़ें और ज़ोन पहचानकर्ता।`
        : sameTime
          ? `आज ${to} में वही समय है जो ${from} में है। घंटे-दर-घंटे तालिका, डेलाइट सेविंग तारीख़ें और कॉल के घंटे।`
          : `${to}, ${from} से ${difference} ${targetAhead ? 'आगे' : 'पीछे'} है। घंटे-दर-घंटे तालिका, डेलाइट सेविंग तारीख़ें और कॉल के घंटे।`,
    cityTitle: ({ city }) => `${city} में समय`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `${city}, ${country} में स्थानीय समय: सजीव घड़ी, UTC अंतर, ${hasTransitions ? 'डेलाइट सेविंग तारीख़ें' : 'डेलाइट सेविंग नहीं'}, सूर्योदय और सूर्यास्त।`,
    abbreviationTitle: ({ from, to }) => `${from} से ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to} वही समय दिखाता है जो ${from}। घंटे-दर-घंटे रूपांतरण तालिका, हर संक्षेप के IANA क्षेत्र, और उन अक्षरों के दूसरे मतलब।`
        : `${to}, ${from} से ${difference} ${targetAhead ? 'आगे' : 'पीछे'} है। घंटे-दर-घंटे तालिका, हर संक्षेप के IANA क्षेत्र, और उन अक्षरों के दूसरे मतलब।`,
  },

  id: {
    pairTitle: ({ from, to }) => `Waktu ${from} ke ${to}`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from} dan ${to} berada di zona waktu yang sama, tidak ada selisih. Tabel jam demi jam, tanggal waktu musim panas, dan pengenal zona.`
        : sameTime
          ? `Hari ini ${to} sama dengan ${from}. Tabel konversi jam demi jam, tanggal waktu musim panas, dan jam untuk menelepon.`
          : `${to} ${difference} ${targetAhead ? 'lebih awal dari' : 'lebih lambat dari'} ${from}. Tabel jam demi jam, tanggal waktu musim panas, dan jam menelepon.`,
    cityTitle: ({ city }) => `Waktu di ${city}`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `Waktu setempat di ${city}, ${country}: jam langsung, selisih UTC, ${hasTransitions ? 'tanggal waktu musim panas' : 'tanpa waktu musim panas'}, matahari terbit dan terbenam.`,
    abbreviationTitle: ({ from, to }) => `${from} ke ${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to} menunjukkan waktu yang sama dengan ${from}. Tabel konversi jam demi jam, zona IANA tiap singkatan, dan arti lain huruf-huruf itu.`
        : `${to} ${difference} ${targetAhead ? 'lebih awal daripada' : 'lebih lambat daripada'} ${from}. Tabel jam demi jam, zona IANA tiap singkatan, dan arti lain huruf itu.`,
  },

  ja: {
    pairTitle: ({ from, to }) => `${from}と${to}の時刻換算`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from}と${to}は同じタイムゾーンにあり、時差はありません。一時間ごとの対照表、夏時間の切り替え日、両都市のゾーン識別子を掲載しています。`
        : sameTime
          ? `本日、${to}は${from}と同じ時刻を指しています。一時間ごとの換算表、両都市の夏時間の日程、実際に電話できる時間帯を掲載しています。`
          : `${to}は${from}より${difference}${targetAhead ? '進んでいます' : '遅れています'}。一時間ごとの換算表、両都市の夏時間の日程、実際に電話できる時間帯を掲載。`,
    cityTitle: ({ city }) => `${city}の現在時刻`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `${country}・${city}の現在の現地時刻。実時間の時計、UTCオフセット、${hasTransitions ? '今年と来年の夏時間の日程' : '夏時間の扱い'}、日の出と日の入りを掲載しています。`,
    abbreviationTitle: ({ from, to }) => `${from}から${to}へ`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to}は${from}と同じ時刻を指します。一時間ごとの換算表、各略称が対応するIANAゾーン、そしてその文字が持つ別の意味を掲載しています。`
        : `${to}は${from}より${difference}${targetAhead ? '進んでいます' : '遅れています'}。一時間ごとの換算表、各略称のIANAゾーン、その文字が持つ別の意味を掲載。`,
  },

  ko: {
    pairTitle: ({ from, to }) => `${from}에서 ${to} 시간 변환`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from}과 ${to}은 같은 시간대에 있어 시차가 없습니다. 시간별 대조표와 서머타임 날짜, 두 도시의 시간대 식별자를 함께 실었습니다.`
        : sameTime
          ? `오늘 ${to}은 ${from}과 같은 시각을 가리킵니다. 시간별 변환표와 두 도시의 서머타임 일정, 실제로 통화할 수 있는 시간대를 실었습니다.`
          : `${to}은 ${from}보다 ${difference} ${targetAhead ? '빠릅니다' : '느립니다'}. 시간별 변환표와 두 도시의 서머타임 일정, 통화 가능한 시간대를 함께 실었습니다.`,
    cityTitle: ({ city }) => `${city} 현재 시각`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `${country} ${city}의 현재 현지 시각. 실시간 시계와 UTC 시차, ${hasTransitions ? '올해와 내년의 서머타임 일정' : '서머타임 적용 여부'}, 일출과 일몰을 함께 실었습니다.`,
    abbreviationTitle: ({ from, to }) => `${from}에서 ${to}로`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to}은 ${from}과 같은 시각을 가리킵니다. 시간별 변환표와 각 약어가 가리키는 IANA 시간대, 그 글자들의 다른 뜻을 함께 실었습니다.`
        : `${to}은 ${from}보다 ${difference} ${targetAhead ? '빠릅니다' : '느립니다'}. 시간별 변환표와 각 약어의 IANA 시간대, 그 글자들의 다른 뜻을 함께 실었습니다.`,
  },

  'zh-Hans': {
    pairTitle: ({ from, to }) => `${from}到${to}时间换算`,
    pairDescription: ({ from, to, difference, targetAhead, sameZone, sameTime }) =>
      sameZone
        ? `${from}和${to}处在同一时区，两地没有时差。含逐小时对照表、夏令时调整日期，以及两地各自的时区标识符。`
        : sameTime
          ? `今天${to}与${from}显示相同的时刻。含逐小时换算表、两座城市各自的夏令时日期，以及真正能打电话的时段。`
          : `${to}比${from}${targetAhead ? '快' : '慢'}${difference}。含逐小时换算表、两座城市各自的夏令时日期，以及真正能打电话的时段。`,
    cityTitle: ({ city }) => `${city}当前时间`,
    cityDescription: ({ city, country, hasTransitions }) =>
      `${country}${city}的当前当地时间：实时时钟、UTC 偏移量、${hasTransitions ? '今年与明年的夏令时日期' : '是否实行夏令时'}、日出与日落。`,
    abbreviationTitle: ({ from, to }) => `${from}到${to}`,
    abbreviationDescription: ({ from, to, difference, targetAhead, sameTime }) =>
      sameTime
        ? `${to}与${from}显示相同的时刻。含逐小时换算表、每个缩写对应的 IANA 时区，以及这几个字母还可能代表什么。`
        : `${to}比${from}${targetAhead ? '快' : '慢'}${difference}。含逐小时换算表、每个缩写对应的 IANA 时区，以及这几个字母还可能代表什么。`,
  },
};

export function getMetaTemplates(locale: LocaleCode): MetaTemplates {
  return templates[locale];
}

export type { AbbreviationMetaInput, CityMetaInput, MetaTemplates, PairMetaInput };
