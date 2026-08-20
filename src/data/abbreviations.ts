import { isValidTimeZone } from '~/lib/time/offset.ts';

/**
 * The 16 zone abbreviations people actually type into a search box.
 *
 * Each maps to one canonical representative IANA zone, and every page built from
 * this data says which zone it used and why. That disclosure is not a formality:
 * an abbreviation is not a time zone. IST means three different things, CST means
 * four, and code that trusts an abbreviation is code that will be wrong somewhere.
 */

export type Abbreviation = {
  /** The abbreviation itself, uppercase. */
  code: string;
  /** URL slug, lowercase. */
  slug: string;
  /** Full name in the sense this page treats it. */
  name: string;
  /** The IANA zone this page computes with. */
  timeZone: string;
  /** Standard offset in minutes, for display in listings only. */
  offsetMinutes: number;
  /** True when this abbreviation only exists during daylight saving. */
  daylight: boolean;
  /**
   * Other meanings of the same letters, when there are any. Rendered as a
   * prominent disambiguation panel, and cross-linked.
   */
  alsoMeans: { name: string; timeZone: string; offsetLabel: string; note: string }[];
};

export const ABBREVIATIONS: readonly Abbreviation[] = [
  {
    code: 'EST',
    slug: 'est',
    name: 'Eastern Standard Time',
    timeZone: 'America/New_York',
    offsetMinutes: -300,
    daylight: false,
    alsoMeans: [
      {
        name: 'Eastern Standard Time (Australia)',
        timeZone: 'Australia/Sydney',
        offsetLabel: 'UTC+10',
        note: 'Australia used "EST" for its eastern states until the AEST/AEDT forms took over. Older documents still use the bare form.',
      },
    ],
  },
  {
    code: 'EDT',
    slug: 'edt',
    name: 'Eastern Daylight Time',
    timeZone: 'America/New_York',
    offsetMinutes: -240,
    daylight: true,
    alsoMeans: [],
  },
  {
    code: 'CST',
    slug: 'cst',
    name: 'Central Standard Time',
    timeZone: 'America/Chicago',
    offsetMinutes: -360,
    daylight: false,
    alsoMeans: [
      {
        name: 'China Standard Time',
        timeZone: 'Asia/Shanghai',
        offsetLabel: 'UTC+8',
        note: 'The whole of China runs on one zone, fourteen hours ahead of the American CST.',
      },
      {
        name: 'Cuba Standard Time',
        timeZone: 'America/Havana',
        offsetLabel: 'UTC-5',
        note: 'An hour ahead of the American CST, and it observes daylight saving on its own schedule.',
      },
    ],
  },
  {
    code: 'CDT',
    slug: 'cdt',
    name: 'Central Daylight Time',
    timeZone: 'America/Chicago',
    offsetMinutes: -300,
    daylight: true,
    alsoMeans: [
      {
        name: 'Cuba Daylight Time',
        timeZone: 'America/Havana',
        offsetLabel: 'UTC-4',
        note: 'Same letters, one hour apart from the American CDT.',
      },
    ],
  },
  {
    code: 'MST',
    slug: 'mst',
    name: 'Mountain Standard Time',
    timeZone: 'America/Denver',
    offsetMinutes: -420,
    daylight: false,
    alsoMeans: [
      {
        name: 'Mountain Standard Time (Arizona)',
        timeZone: 'America/Phoenix',
        offsetLabel: 'UTC-7',
        note: 'Arizona keeps MST all year, so for half the year it matches Pacific time rather than Mountain.',
      },
    ],
  },
  {
    code: 'PST',
    slug: 'pst',
    name: 'Pacific Standard Time',
    timeZone: 'America/Los_Angeles',
    offsetMinutes: -480,
    daylight: false,
    alsoMeans: [
      {
        name: 'Philippine Standard Time',
        timeZone: 'Asia/Manila',
        offsetLabel: 'UTC+8',
        note: 'Sixteen hours ahead of the American PST, and it never changes its clocks.',
      },
    ],
  },
  {
    code: 'PDT',
    slug: 'pdt',
    name: 'Pacific Daylight Time',
    timeZone: 'America/Los_Angeles',
    offsetMinutes: -420,
    daylight: true,
    alsoMeans: [],
  },
  {
    code: 'UTC',
    slug: 'utc',
    name: 'Coordinated Universal Time',
    timeZone: 'UTC',
    offsetMinutes: 0,
    daylight: false,
    alsoMeans: [],
  },
  {
    code: 'GMT',
    slug: 'gmt',
    name: 'Greenwich Mean Time',
    timeZone: 'Etc/GMT',
    offsetMinutes: 0,
    daylight: false,
    alsoMeans: [
      {
        name: 'United Kingdom local time in winter',
        timeZone: 'Europe/London',
        offsetLabel: 'UTC+0',
        note: 'Britain is on GMT only from late October to late March; the rest of the year it is on BST, an hour ahead.',
      },
    ],
  },
  {
    code: 'BST',
    slug: 'bst',
    name: 'British Summer Time',
    timeZone: 'Europe/London',
    offsetMinutes: 60,
    daylight: true,
    alsoMeans: [
      {
        name: 'Bangladesh Standard Time',
        timeZone: 'Asia/Dhaka',
        offsetLabel: 'UTC+6',
        note: 'Five hours ahead of British Summer Time, and unrelated to it.',
      },
    ],
  },
  {
    code: 'CET',
    slug: 'cet',
    name: 'Central European Time',
    timeZone: 'Europe/Berlin',
    offsetMinutes: 60,
    daylight: false,
    alsoMeans: [],
  },
  {
    code: 'CEST',
    slug: 'cest',
    name: 'Central European Summer Time',
    timeZone: 'Europe/Berlin',
    offsetMinutes: 120,
    daylight: true,
    alsoMeans: [],
  },
  {
    code: 'EET',
    slug: 'eet',
    name: 'Eastern European Time',
    timeZone: 'Europe/Bucharest',
    offsetMinutes: 120,
    daylight: false,
    alsoMeans: [],
  },
  {
    code: 'IST',
    slug: 'ist',
    name: 'India Standard Time',
    timeZone: 'Asia/Kolkata',
    offsetMinutes: 330,
    daylight: false,
    alsoMeans: [
      {
        name: 'Irish Standard Time',
        timeZone: 'Europe/Dublin',
        offsetLabel: 'UTC+1',
        note: 'Ireland calls its summer time IST — four and a half hours behind India, and only in summer.',
      },
      {
        name: 'Israel Standard Time',
        timeZone: 'Asia/Jerusalem',
        offsetLabel: 'UTC+2',
        note: 'Three and a half hours behind India, and it does observe daylight saving.',
      },
    ],
  },
  {
    code: 'JST',
    slug: 'jst',
    name: 'Japan Standard Time',
    timeZone: 'Asia/Tokyo',
    offsetMinutes: 540,
    daylight: false,
    alsoMeans: [],
  },
  {
    code: 'AEST',
    slug: 'aest',
    name: 'Australian Eastern Standard Time',
    timeZone: 'Australia/Sydney',
    offsetMinutes: 600,
    daylight: false,
    alsoMeans: [
      {
        name: 'Queensland, which never leaves it',
        timeZone: 'Australia/Brisbane',
        offsetLabel: 'UTC+10',
        note: 'Queensland stays on AEST all year while New South Wales and Victoria move to AEDT, so for four months Brisbane and Sydney disagree by an hour.',
      },
    ],
  },
];

function validate(): readonly Abbreviation[] {
  const slugs = new Set<string>();
  for (const entry of ABBREVIATIONS) {
    if (slugs.has(entry.slug)) throw new Error(`Duplicate abbreviation slug: ${entry.slug}`);
    slugs.add(entry.slug);
    if (!isValidTimeZone(entry.timeZone)) {
      throw new Error(`${entry.code} maps to an unknown zone: ${entry.timeZone}`);
    }
    for (const other of entry.alsoMeans) {
      if (!isValidTimeZone(other.timeZone)) {
        throw new Error(`${entry.code} disambiguation names an unknown zone: ${other.timeZone}`);
      }
    }
  }
  if (ABBREVIATIONS.length !== 16) {
    throw new Error(`Expected 16 abbreviations, found ${ABBREVIATIONS.length}`);
  }
  return ABBREVIATIONS;
}

// Runs at module load, so a bad record fails the build rather than rendering 240
// pages about a zone that does not exist. The unit tests assert the same things;
// this is the half that cannot be skipped by not running them. Its result is not
// exported because nothing needs the value — only the check.
validate();

const BY_SLUG = new Map(ABBREVIATIONS.map((entry) => [entry.slug, entry]));

export function abbreviationBySlug(slug: string): Abbreviation | undefined {
  return BY_SLUG.get(slug);
}

export type AbbreviationPair = {
  from: Abbreviation;
  to: Abbreviation;
  slug: string;
};

/** The full directional cartesian product: 16 x 15 = 240 pages. */
export function abbreviationPairs(): AbbreviationPair[] {
  const pairs: AbbreviationPair[] = [];
  for (const from of ABBREVIATIONS) {
    for (const to of ABBREVIATIONS) {
      if (from.slug === to.slug) continue;
      pairs.push({ from, to, slug: `${from.slug}-to-${to.slug}` });
    }
  }
  return pairs;
}

/** Abbreviations that mean more than one thing — the ones that cause real bugs. */
export function ambiguousAbbreviations(): readonly Abbreviation[] {
  return ABBREVIATIONS.filter((entry) => entry.alsoMeans.length > 0);
}
