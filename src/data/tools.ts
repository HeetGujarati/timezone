/**
 * The ten core tools, as one list.
 *
 * The header, the footer and the rollout table each hold their own slice of this
 * information for their own reasons — a nav shows five, a footer shows ten, the
 * rollout table is about which locales a path exists in. What none of them held
 * was a machine-readable list with a sentence of English about each, which is
 * what `/llms.txt` needs. Rather than write that list inline in one route, it
 * lives here, and `tools.test.ts` fails if a path drifts from the set the
 * rollout table ships in every locale.
 *
 * The `label` is an i18n key so the English name here and the translated name in
 * the navigation can never disagree about which tool is meant.
 */
export interface Tool {
  /** Site-relative path, always with a trailing slash. */
  readonly path: string;
  /** English display name. */
  readonly name: string;
  /** The i18n key the navigation uses for the same tool. */
  readonly label: string;
  /** One sentence, matching the page's own meta description. */
  readonly summary: string;
}

export const TOOLS: readonly Tool[] = [
  {
    path: '/',
    name: 'Time zone converter',
    label: 'nav.converter',
    summary:
      'Convert any time zone to any other for any date, including half-hour and 45-minute offsets.',
  },
  {
    path: '/meeting-planner/',
    name: 'Meeting planner',
    label: 'nav.meetingPlanner',
    summary:
      'Add two to ten zones and read a 24-hour band with working hours shaded, to find the hours everyone shares.',
  },
  {
    path: '/world-clock/',
    name: 'World clock',
    label: 'nav.worldClock',
    summary: 'Live local time in 80 major cities, ordered east to west, searchable and pinnable.',
  },
  {
    path: '/time-difference/',
    name: 'Time difference',
    label: 'nav.timeDifference',
    summary:
      'The current difference between two places, and every date in the next year on which it changes.',
  },
  {
    path: '/working-hours-overlap/',
    name: 'Working hours overlap',
    label: 'nav.workingHoursOverlap',
    summary:
      "The exact hours a distributed team shares, shown on everyone's local clock, or an honest none.",
  },
  {
    path: '/unix-timestamp-converter/',
    name: 'Unix timestamp converter',
    label: 'nav.unixTimestamp',
    summary:
      'Convert a Unix timestamp to a date and back in any zone, detecting seconds versus milliseconds.',
  },
  {
    path: '/duration-calculator/',
    name: 'Duration calculator',
    label: 'nav.durationCalculator',
    summary:
      'The time between two date-times, each in its own zone, with daylight saving handled so a 23-hour day reports as 23 hours.',
  },
  {
    path: '/countdown/',
    name: 'Countdown',
    label: 'nav.countdown',
    summary:
      'Count down to any moment in any zone and share it as a link; the whole countdown lives in the URL.',
  },
  {
    path: '/utc-time/',
    name: 'UTC time',
    label: 'nav.utcTime',
    summary: 'The current UTC time ticking live, with what UTC is and how it differs from GMT.',
  },
  {
    path: '/dst-changes/',
    name: 'Daylight saving changes',
    label: 'nav.dstChanges',
    summary:
      'Every scheduled clock change for this year and next, with dates, local change times and both offsets.',
  },
];
