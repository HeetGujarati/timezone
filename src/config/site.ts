import { DEFAULT_LOCALE, LOCALE_CODES, type LocaleCode } from './locales.ts';

/**
 * Canonical origin. Read from PUBLIC_SITE_URL at build time.
 *
 * The fallback exists only so `npm run dev` and CI work without a .env file.
 * DEPLOY.md states plainly: set PUBLIC_SITE_URL to your real domain before the
 * first production build, or canonicals and sitemaps will point at the wrong host.
 */
const FALLBACK_ORIGIN = 'https://yourworldtime.com';

function readOrigin(): string {
  const raw = import.meta.env.PUBLIC_SITE_URL ?? process.env['PUBLIC_SITE_URL'];
  const value = typeof raw === 'string' && raw.length > 0 ? raw : FALLBACK_ORIGIN;
  // Normalise: absolute, no trailing slash, no path.
  const url = new URL(value);
  return `${url.protocol}//${url.host}`;
}

export const SITE = {
  /** Product name. Chosen for brandability, not exact-match keywords — see DECISIONS.md. */
  name: 'YourWorldTime',
  shortName: 'YourWorldTime',
  tagline: 'Time zone tools that tell you the truth',

  /**
   * Used whenever a page supplies no description of its own. Kept under the
   * 155-character ceiling enforced by src/lib/seo/metadata.ts.
   */
  defaultDescription:
    'Convert time zones, plan meetings across continents and track DST changes. Accurate to the IANA database, free, and fast on any device.',

  /**
   * Site-wide keywords, merged into every page's keyword set and de-duplicated.
   * Deliberately short: keyword stuffing is a liability, not an asset.
   */
  globalKeywords: [
    // Core head terms
    'time zone converter',
    'world clock',
    'meeting planner',
    'time difference',
    'UTC',
    'daylight saving time',
    // Easy–Medium — Utility queries (high volume, lower competition)
    'current time',
    'time zone calculator',
    'what time is it in',
    'convert time zones',
    'time zone difference',
    // Easy–Medium — Time Zone conversions (India IT traffic)
    'EST to IST',
    'PST to IST',
    'GMT to IST',
    'EST to PST',
    'EST to GMT',
    'IST to EST',
    'PST to EST',
    'UTC to IST',
    'CST to IST',
    'AEST to IST',
    'IST to CST',
    // Easy–Medium — City-based queries
    'time in New York',
    'time in London',
    'time in Tokyo',
    'time in Dubai',
    'time in Sydney',
    'time in Singapore',
    'current time in India',
    'time in California',
    'time in Germany',
    // Easy — Developer / Tech tools
    'unix timestamp to date',
    'epoch converter',
    'epoch time to human readable',
    'milliseconds to date converter',
    // Easy–Medium — Remote work & scheduling
    'remote team meeting planner',
    'working hours overlap',
    'best time to call',
    'schedule meeting across time zones',
    // Medium — Seasonal / DST (spike in Mar & Nov)
    'DST changes 2026',
    'clocks change 2026',
    'when do clocks spring forward',
    'does Arizona observe daylight saving',
  ],

  origin: readOrigin(),
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALE_CODES,

  /** Fallback OG image, generated at build into /og/default.png. */
  defaultOgImage: {
    path: '/og/default.png',
    width: 1200,
    height: 630,
    alt: 'YourWorldTime — time zone converter, meeting planner and world clock',
  },

  creator: {
    name: 'YourWorldTime',
    /** Replaced by the owner before launch — tracked in DEPLOY.md, Part 1. */
    url: 'https://yourworldtime.com',
    x: '@yourworldtime',
  },

  /** Replaced by the owner before launch — tracked in DEPLOY.md, Part 1. */
  contactEmail: 'support@yourworldtime.com',
  securityEmail: 'support@yourworldtime.com',
  legalEntity: '[LEGAL ENTITY NAME]',
  legalJurisdiction: '[JURISDICTION]',
} as const;

/**
 * Open Graph wants underscored territory tags (`en_US`), not the BCP-47 tags used
 * in `<html lang>` and hreflang. Mapped explicitly rather than derived, because
 * the correct territory for a language is a judgement call — pt-BR is Brazil,
 * but `es` targets Spain and `ar` is written in Modern Standard form for the
 * whole region, so it takes the most-populous territory.
 */
const OG_LOCALES: Record<LocaleCode, string> = {
  en: 'en_US',
  es: 'es_ES',
  'pt-BR': 'pt_BR',
  fr: 'fr_FR',
  de: 'de_DE',
  it: 'it_IT',
  ru: 'ru_RU',
  tr: 'tr_TR',
  ar: 'ar_AR',
  hi: 'hi_IN',
  id: 'id_ID',
  ja: 'ja_JP',
  ko: 'ko_KR',
  'zh-Hans': 'zh_CN',
};

export function toOpenGraphLocale(locale: LocaleCode): string {
  return OG_LOCALES[locale];
}

/** Absolute URL for a site-root-relative path. Always absolute, never with a query string. */
export function absoluteUrl(path: string): string {
  const url = new URL(path, `${SITE.origin}/`);
  url.search = '';
  url.hash = '';
  return url.href;
}

/**
 * Locale-specific keywords that people actually search in their native language.
 * Merged with globalKeywords (English) on every page via mergeKeywords().
 * This gives each locale's pages the best chance of ranking for local queries.
 */
export const LOCALE_KEYWORDS: Record<LocaleCode, readonly string[]> = {
  en: [
    'time zone converter', 'world clock', 'current time',
    'EST to PST', 'EST to GMT', 'PST to EST',
    'time difference calculator', 'meeting planner across time zones',
    'what time is it', 'daylight saving time',
    'time in New York', 'time in London', 'time in Tokyo',
  ],
  es: [
    'convertidor de zona horaria', 'hora actual', 'reloj mundial',
    'diferencia horaria', 'hora en Nueva York', 'hora en Madrid',
    'hora en México', 'hora en Buenos Aires', 'hora en Colombia',
    'cambio de horario', 'horario de verano',
    'hora GMT', 'hora UTC', 'zona horaria España',
    'planificador de reuniones', 'hora en Estados Unidos',
  ],
  'pt-BR': [
    'conversor de fuso horário', 'hora atual', 'relógio mundial',
    'diferença de horário', 'hora em Nova York', 'hora em Lisboa',
    'hora em São Paulo', 'hora em Portugal', 'hora no Japão',
    'fuso horário Brasil', 'horário de Brasília',
    'horário de verão', 'hora GMT', 'hora UTC',
    'planejador de reuniões', 'que horas são',
    // Easy–Medium KD — targeted PT-BR queries
    'horário de brasília agora', 'diferença de horário brasil eua',
    'relógio mundial online', 'horário em nova york agora',
    'que horas são em londres', 'fuso horário são paulo',
    'horário de tóquio agora', 'calcular fuso horário',
    'horário UTC brasil', 'fuso horário portugal',
  ],
  fr: [
    'convertisseur de fuseau horaire', 'heure actuelle', 'horloge mondiale',
    'décalage horaire', 'heure à New York', 'heure à Paris',
    'heure à Tokyo', 'heure à Montréal', 'heure au Canada',
    'changement d\'heure', 'heure d\'été',
    'heure GMT', 'heure UTC', 'fuseau horaire France',
    'planificateur de réunion', 'quelle heure est-il',
  ],
  de: [
    'Zeitzonenrechner', 'aktuelle Uhrzeit', 'Weltuhr',
    'Zeitunterschied', 'Uhrzeit in New York', 'Uhrzeit in Berlin',
    'Uhrzeit in Tokyo', 'Uhrzeit in Wien', 'Uhrzeit in Zürich',
    'Zeitumstellung', 'Sommerzeit', 'Winterzeit',
    'GMT Zeit', 'UTC Zeit', 'Zeitzone Deutschland',
    'Meetingplaner', 'wie spät ist es',
  ],
  it: [
    'convertitore fuso orario', 'ora attuale', 'orologio mondiale',
    'differenza di orario', 'ora a New York', 'ora a Roma',
    'ora a Tokyo', 'ora a Milano', 'ora a Londra',
    'cambio ora', 'ora legale', 'ora solare',
    'ora GMT', 'ora UTC', 'fuso orario Italia',
    'pianificatore riunioni', 'che ore sono',
  ],
  ru: [
    'конвертер часовых поясов', 'текущее время', 'мировые часы',
    'разница во времени', 'время в Нью-Йорке', 'время в Москве',
    'время в Токио', 'время в Лондоне', 'время в Дубае',
    'перевод часов', 'летнее время', 'зимнее время',
    'время по Гринвичу', 'время UTC', 'часовой пояс Москвы',
    'планировщик встреч', 'сколько времени',
  ],
  tr: [
    'saat dilimi dönüştürücü', 'şu anki saat', 'dünya saati',
    'saat farkı', 'New York saati', 'İstanbul saati',
    'Tokyo saati', 'Londra saati', 'Dubai saati',
    'saat değişikliği', 'yaz saati uygulaması',
    'GMT saati', 'UTC saati', 'Türkiye saat dilimi',
    'toplantı planlayıcı', 'saat kaç',
  ],
  ar: [
    'محول المنطقة الزمنية', 'الوقت الحالي', 'ساعة عالمية',
    'فرق التوقيت', 'الوقت في نيويورك', 'الوقت في دبي',
    'الوقت في الرياض', 'الوقت في القاهرة', 'الوقت في لندن',
    'توقيت غرينتش', 'توقيت UTC', 'المنطقة الزمنية السعودية',
    'كم الساعة الآن', 'التوقيت الصيفي',
    'مخطط الاجتماعات', 'فرق الوقت بين الدول',
  ],
  hi: [
    'समय क्षेत्र कनवर्टर', 'वर्तमान समय', 'विश्व घड़ी',
    'समय का अंतर', 'न्यूयॉर्क में समय', 'भारत में समय',
    'लंदन में समय', 'दुबई में समय', 'टोक्यो में समय',
    'IST समय', 'भारतीय मानक समय', 'EST to IST',
    'PST to IST', 'GMT to IST', 'अभी कितने बजे हैं',
    'अमेरिका और भारत में समय का अंतर',
    'मीटिंग प्लानर', 'डेलाइट सेविंग टाइम',
    // Easy — India-specific high-volume long-tail
    'IST to PST समय', 'अमेरिका में अभी कितने बजे हैं',
    'भारत और अमेरिका का समय का अंतर',
    'भारत का समय क्षेत्र +5:30 क्यों है',
    'इंडिया टाइम vs यूएस टाइम',
    'भारत से अमेरिका कॉल करने का सही समय',
    'यूनिक्स टाइमस्टैम्प कनवर्टर',
    'बैंगलोर में समय', 'मुंबई में समय',
  ],
  id: [
    'konverter zona waktu', 'waktu saat ini', 'jam dunia',
    'perbedaan waktu', 'waktu di New York', 'waktu di Jakarta',
    'waktu di Tokyo', 'waktu di London', 'waktu di Singapura',
    'WIB WITA WIT', 'zona waktu Indonesia',
    'waktu GMT', 'waktu UTC', 'jam berapa sekarang',
    'perencana rapat', 'perbedaan waktu antar negara',
  ],
  ja: [
    '時差計算', '現在時刻', '世界時計',
    '時差', 'ニューヨーク 時間', '東京 時間',
    'ロンドン 時間', 'ドバイ 時間', 'シンガポール 時間',
    'GMT 時間', 'UTC 時間', '日本時間',
    'サマータイム', '今何時', 'タイムゾーン 変換',
    '会議プランナー', '時差 アメリカ 日本',
  ],
  ko: [
    '시간대 변환기', '현재 시간', '세계 시계',
    '시차', '뉴욕 시간', '서울 시간',
    '런던 시간', '도쿄 시간', '두바이 시간',
    'GMT 시간', 'UTC 시간', '한국 시간',
    '서머타임', '지금 몇 시', '시간대 계산기',
    '회의 플래너', '미국 한국 시차',
  ],
  'zh-Hans': [
    '时区转换器', '当前时间', '世界时钟',
    '时差', '纽约时间', '北京时间',
    '伦敦时间', '东京时间', '迪拜时间',
    'GMT时间', 'UTC时间', '中国时间',
    '夏令时', '现在几点', '时区计算器',
    '会议规划器', '美国中国时差',
  ],
};

/** Return locale-specific keywords for a given locale, falling back to empty. */
export function getLocaleKeywords(locale: LocaleCode): readonly string[] {
  return LOCALE_KEYWORDS[locale] ?? [];
}
