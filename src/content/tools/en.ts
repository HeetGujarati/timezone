import type { PageCopy } from './types.ts';

/**
 * English is the source of truth. Every other locale implements the same type, so
 * a missing field is a compile error rather than an English sentence appearing in
 * the middle of a Japanese page.
 */
export const en: PageCopy = {
  tools: {
    converter: {
      title: 'Time zone converter',
      metaTitle: 'Time zone converter — convert any zone, any date',
      description:
        'Convert any time zone to any other for any date. DST-aware, accurate to the IANA database, and it handles half-hour and 45-minute offsets exactly.',
      summary:
        'Pick two zones and a date, and this converts between them exactly — including on the two days a year when daylight saving makes a local time either impossible or ambiguous.',
      faqs: [
        {
          question: 'Does this converter handle daylight saving time?',
          answer:
            'Yes, and it handles the two awkward days as well. Offsets come from the IANA time zone database through the browser, so a conversion on a change-over date uses the offset that actually applied at that moment, not the one that applies today. If you enter a local time that never happened, or one that happened twice, the converter says so instead of silently picking one.',
        },
        {
          question: 'Why does the time difference between two cities change during the year?',
          answer:
            'Because the two places rarely change their clocks on the same date, and some never change them at all. New York is 5 hours behind London for most of the year but 4 hours behind for two weeks in March, because the United States moves its clocks two to three weeks before Europe does. Always convert against a specific date rather than a remembered offset.',
        },
        {
          question: 'Which time zones can I convert between?',
          answer:
            'Every zone in the IANA database — over 400 of them, including the half-hour and 45-minute offsets that trip up most converters. India at UTC+05:30, Nepal at UTC+05:45 and the Chatham Islands at UTC+12:45 are all handled exactly, not rounded to the nearest hour.',
        },
        {
          question: 'Do I need JavaScript?',
          answer:
            'For the live converter, yes. Everything else on this site — offsets, daylight saving transition dates, hour-by-hour reference tables and every explanation — is part of the prerendered page and works with JavaScript disabled.',
        },
        {
          question: 'Is anything I type here sent anywhere?',
          answer:
            'No. Every calculation happens in your browser. There is no backend, no analytics, no cookies and no third-party script. The zones you pick appear in the URL so you can share or bookmark a conversion, and that is the only place they go.',
        },
      ],
      sections: [
        {
          heading: 'What makes time zone conversion go wrong',
          paragraphs: [
            'Almost every scheduling mistake comes from one of four places, and all four are handled here rather than rounded away.',
            'The offset is not a constant. "New York is five hours behind London" is true for about ten months of the year. For roughly three weeks each spring and one each autumn it is four hours, because the two regions change their clocks on different dates. A converter that stores a fixed offset per city is wrong on those days, and those are exactly the days people book the meeting they later regret.',
            'Not every offset is a whole number of hours. India is 5 hours 30 minutes ahead of UTC. Nepal is 5 hours 45 minutes ahead. The Chatham Islands are 12 hours 45 minutes ahead, and Lord Howe Island shifts by only 30 minutes when its daylight saving starts. Roughly a fifth of the world lives on a non-whole-hour offset.',
            'Some local times do not exist. When clocks spring forward, an hour is deleted. In New York on the changeover date, 01:59:59 is followed immediately by 03:00:00 — so 02:30 never happens. Ask most tools to convert 02:30 and they will answer confidently anyway. This one tells you what it did.',
            'Some local times happen twice. When clocks fall back, an hour repeats. 01:30 occurs once on daylight time and again an hour later on standard time. This converter takes the first occurrence and says so, and shows you the second.',
          ],
        },
      ],
    },

    meetingPlanner: {
      title: 'Meeting planner',
      metaTitle: 'Meeting planner across time zones',
      description:
        'Add two to ten time zones and see a 24-hour band with working hours shaded. Find the hours everyone shares, or find out there are none.',
      summary:
        'Add the zones your team works in and the band below shows every hour of the day at once, with working hours shaded — so the overlap is a shape you see rather than a sum you do.',
      faqs: [
        {
          question: 'How many time zones can I add?',
          answer:
            'Between two and ten. Past ten the band stops being readable at a glance, which is the entire reason to use a band rather than a list of numbers — so the limit is a design decision rather than a technical one.',
        },
        {
          question: 'What counts as working hours?',
          answer:
            'Whatever you set. The default is 09:00 to 18:00 local time in every zone, and both ends are adjustable. The hour either side of the working day is shaded more lightly: it is reachable, but you are asking someone a favour.',
        },
        {
          question: 'Why do some rows show times ending in :30 or :45?',
          answer:
            'Because those zones are genuinely offset by half or three-quarters of an hour. India is UTC+05:30, Nepal is UTC+05:45, the Chatham Islands are UTC+12:45. Each column in the band is the same instant, so those rows show the real local reading rather than a rounded one.',
        },
        {
          question: 'What if there is no overlap at all?',
          answer:
            'The planner says so plainly instead of suggesting a compromise nobody agreed to. Los Angeles and Mumbai share no minute of a 09:00–18:00 day, and no amount of grid shading changes that — someone has to move. Widening the working day or splitting into two calls are the honest options.',
        },
        {
          question: 'Does the plan survive a page reload?',
          answer:
            'Yes. Your zones, date and working hours are written into the URL, so you can bookmark a plan or send it to someone and they see exactly what you see. The zone list is also kept in your browser so the planner remembers your team next time.',
        },
        {
          question: 'Does it account for daylight saving?',
          answer:
            'Yes, on the date you choose. Pick a date in March or October and you will see rows shift relative to each other, because that is what actually happens — the zones change their clocks on different days.',
        },
      ],
      sections: [
        {
          heading: 'How to read the band',
          paragraphs: [
            'Every column is one instant. Read down a column and you see what the clock says in each place at that same moment — which is the thing a list of offsets makes you compute in your head, and the thing people get wrong.',
            'Three shades: working hours carry a coloured top border, the hour either side is lighter, and the rest is flat. The border matters as much as the fill — the distinction never rests on colour alone, so it still reads if you cannot separate those two blues.',
          ],
        },
        {
          heading: 'When there is no overlap',
          paragraphs: [
            'Some teams genuinely have none. A 09:00–18:00 day in Los Angeles and the same in Mumbai share nothing at all — Mumbai’s working day ends before Los Angeles wakes up. New York and Sydney are stranger still: they share exactly one hour from November to March, when the gap is 16 hours, and nothing whatsoever from April to October, when it narrows to 14. Same two cities, opposite answer, and the only thing that changed is the date.',
            'When that happens the planner says so rather than shading something in and hoping. The realistic choices are to widen the working day for one side, to alternate which side takes the awkward call, or to stop meeting synchronously. Pretending a 22:00 slot is fine is how people quietly burn out.',
          ],
        },
      ],
    },

    worldClock: {
      title: 'World clock',
      metaTitle: 'World clock — live times in 80 cities',
      description:
        'Live local time in 80 major cities, ordered east to west. Search any city, pin the ones you care about, and see the date roll over as you go.',
      summary:
        'Live local time in 80 cities, ordered from the earliest clock on earth to the latest — search to narrow it, pin the cities you check often and they stay at the top.',
      faqs: [
        {
          question: 'How accurate are these clocks?',
          answer:
            'They read your device clock and apply the offset your browser gets from the IANA time zone database, so they are as accurate as your own machine. If your computer clock is wrong, every clock here is wrong by the same amount — nothing on this page comes from a server.',
        },
        {
          question: 'Can I keep my cities at the top?',
          answer:
            'Yes. Pin any city and it moves to the front of the grid and stays there on your next visit. Pins live in your browser only; nothing is sent anywhere and no cookie is set.',
        },
        {
          question: 'Why are some cities showing a different date?',
          answer:
            'Because they are. When it is Monday evening in New York it is already Tuesday morning in Tokyo. The date under each clock is the local calendar date in that city, not yours.',
        },
        {
          question: 'Why do Mumbai and Kathmandu show times ending in :30 and :45?',
          answer:
            'India runs at UTC+05:30 and Nepal at UTC+05:45. Those are the real offsets, not rounding errors — around a fifth of the world lives on an offset that is not a whole number of hours.',
        },
      ],
      sections: [],
    },

    timeDifference: {
      title: 'Time difference',
      metaTitle: 'Time difference between any two time zones',
      description:
        'See the current difference between two places, and every date in the next year when that difference changes because one of them shifts its clocks.',
      summary:
        'Pick two places and this shows how far apart they are right now — plus the exact dates over the next year when that gap changes, which is the part most tools leave out.',
      faqs: [
        {
          question: 'Why is the difference not the same all year?',
          answer:
            'Because the two places change their clocks on different dates, or one of them does not change at all. New York and London are 5 hours apart for most of the year, 4 hours apart for the three weeks in March after the United States springs forward but before Europe does, and 4 hours apart again for the week in late October after Europe falls back but before the United States does.',
        },
        {
          question: 'Which places never change the difference?',
          answer:
            'Any pair where neither observes daylight saving — India and Japan, for instance, are permanently 3 hours 30 minutes apart. Pairs inside the same regulatory bloc are also stable: every European Union zone changes at the same instant, so Lisbon and Athens stay exactly 2 hours apart all year.',
        },
        {
          question: 'How is the difference calculated?',
          answer:
            'By asking your browser for each zone offset at the same instant and subtracting. That means it is correct at the moment you look at it, including in the middle of a change-over, rather than reading a stored number that was true last month.',
        },
        {
          question: 'What does a negative difference mean?',
          answer:
            'It means the second place is behind the first. The page says "ahead" or "behind" in words for exactly that reason — minus signs on time differences are read backwards by roughly half of everyone.',
        },
      ],
      sections: [],
    },

    workingHoursOverlap: {
      title: 'Working hours overlap',
      metaTitle: 'Working hours overlap for distributed teams',
      description:
        "Find the exact hours a distributed team shares, shown on everyone's local clock — or find out honestly that there are none.",
      summary:
        "Add the zones your team works in and this returns the exact windows everyone is available, on each person's own clock — and tells you plainly when there are none.",
      faqs: [
        {
          question: 'What counts as working hours?',
          answer:
            'The default is 09:00 to 18:00 local time for everyone, and both ends are adjustable. It deliberately treats every zone the same rather than encoding assumptions about which countries start early — a team that actually works 10:00 to 19:00 should say so.',
        },
        {
          question: 'What if there is no overlap?',
          answer:
            'You get told, plus the nearest windows where the most people are inside working hours. Los Angeles and Mumbai share no minute of a 09:00–18:00 day; no arrangement of the grid changes that. The honest options are to widen the day on one side, to alternate who takes the awkward call, or to work asynchronously.',
        },
        {
          question: 'How does this differ from the meeting planner?',
          answer:
            'The planner shows the whole day as a band so you can see the shape of it. This answers the narrower question exactly: which minutes are shared, and what those minutes read as on each person’s clock. Use the planner to explore, use this to decide.',
        },
        {
          question: 'Does it account for daylight saving?',
          answer:
            'Yes, for today. Overlap windows shift by an hour when one side changes its clocks and the other has not yet — which is why the same team can have four shared hours in February and three in March.',
        },
      ],
      sections: [],
    },

    unixTimestamp: {
      title: 'Unix timestamp converter',
      metaTitle: 'Unix timestamp converter — epoch to date',
      description:
        'Convert a Unix timestamp to a human date and back, in any time zone. Detects seconds versus milliseconds and shows a live epoch counter.',
      summary:
        'Paste a Unix timestamp to read it as a date, or pick a date to get the timestamp — the converter detects whether your number is in seconds or milliseconds and tells you which it assumed.',
      faqs: [
        {
          question: 'Seconds or milliseconds — how does it know?',
          answer:
            'By size. A timestamp of 1e11 or more is treated as milliseconds, because 1e11 seconds is the year 5138 and nothing real reaches it. The detected unit is shown next to the result rather than applied silently, because guessing wrong is a factor-of-1000 error that lands you in 1970.',
        },
        {
          question: 'What is a Unix timestamp?',
          answer:
            'The number of seconds since 1 January 1970 at 00:00:00 UTC, not counting leap seconds. It is a single number with no time zone attached, which is exactly why systems use it: two machines anywhere on earth reading the same timestamp agree on the same instant.',
        },
        {
          question: 'Can a timestamp be negative?',
          answer:
            'Yes. Anything before 1970 is negative. The Apollo 11 landing is roughly -14,182,940. This converter handles negative values in both directions.',
        },
        {
          question: 'What happens in 2038?',
          answer:
            'Systems storing the count in a signed 32-bit integer run out of room at 03:14:07 UTC on 19 January 2038. The next second overflows to a negative number, which those systems read as December 1901. Most modern platforms moved to 64-bit counts years ago; embedded and legacy systems are the ones still exposed.',
        },
        {
          question: 'Does the time zone affect the timestamp?',
          answer:
            'Not the timestamp itself — it is always counted from a UTC instant. The zone only decides how that instant is displayed as a date and time, and which local reading converts back to which number.',
        },
      ],
      sections: [],
    },

    durationCalculator: {
      title: 'Duration calculator',
      metaTitle: 'Duration calculator across time zones',
      description:
        'Work out the time between two date-times, each in its own zone. Handles daylight saving correctly, so a 23-hour day is reported as 23 hours.',
      summary:
        'Set a start and an end — each in its own time zone if they differ — and this reports the time that actually elapsed, including the days that are 23 or 25 hours long.',
      faqs: [
        {
          question: 'Why does a day sometimes come out as 23 or 25 hours?',
          answer:
            'Because it was. On the day clocks spring forward, midnight to midnight is 23 hours; on the day they fall back it is 25. This calculator resolves both ends to absolute instants before subtracting, so it reports the time that actually passed rather than the time the calendar suggests.',
        },
        {
          question: 'Can the two ends be in different time zones?',
          answer:
            'Yes, and that is the point. A flight leaving Tokyo at 17:00 and landing in San Francisco at 09:30 the same morning took nine and a half hours, not minus seven and a half. Set each end to its own zone and the arithmetic works out.',
        },
        {
          question: 'Are leap seconds included?',
          answer:
            'No. Browsers do not expose them — the JavaScript clock ignores leap seconds entirely, so a span crossing one is reported a second short. Over the whole history of UTC that is 27 seconds in total, which matters for satellite navigation and for nothing you are likely to be measuring here.',
        },
        {
          question: 'What if the end is before the start?',
          answer:
            'It says so, and reports the magnitude anyway. A negative duration is usually a typo, and silently flipping the sign would hide it.',
        },
      ],
      sections: [
        {
          heading: 'Why calendar arithmetic is not clock arithmetic',
          paragraphs: [
            '"One day later" and "24 hours later" are different instructions, and twice a year they give different answers. If a nightly job is scheduled for 02:30 local time, it runs twice on one autumn morning and not at all on one spring morning. If it is scheduled every 86,400 seconds, it drifts an hour away from 02:30 instead.',
            'Neither behaviour is a bug; they answer different questions. The trouble starts when the code does one and the person expected the other. This calculator always answers the clock question — how much time actually passed — and shows the calendar days alongside it.',
          ],
        },
      ],
    },

    countdown: {
      title: 'Countdown',
      metaTitle: 'Countdown timer to any date and time zone',
      description:
        'Count down to any moment in any time zone, and share it as a link. No account, no storage — the whole countdown lives in the URL.',
      summary:
        'Pick a moment and a zone, and the countdown below runs to it — the whole thing lives in the URL, so copying the address bar is how you share it.',
      faqs: [
        {
          question: 'How do I share a countdown?',
          answer:
            'Set it up and copy the address bar — every field is in the URL. Whoever opens it sees the same countdown to the same instant, counted down in their own device clock. There is no account, no saved record and nothing stored on a server, because there is no server.',
        },
        {
          question: 'Does the recipient see it in their own time zone?',
          answer:
            'They see the same countdown, because a countdown measures a distance to one instant and that distance is the same everywhere. The target date and time are shown in the zone you chose, so everyone can see which local moment it refers to.',
        },
        {
          question: 'What happens when it reaches zero?',
          answer:
            'It says the moment has passed and stops. It does not start counting up — if you want elapsed time since an event, the duration calculator answers that properly.',
        },
        {
          question: 'Can I count down to a time that does not exist?',
          answer:
            'If you pick a local time inside a spring-forward gap, the countdown moves to the equivalent instant after the change and tells you. That is the same policy every tool on this site uses.',
        },
      ],
      sections: [
        {
          heading: 'Why the whole countdown is in the link',
          paragraphs: [
            'Most countdown tools ask you to make an account so they can store your countdown on their server and show you an advert next to it. There is no server here, so the state has to live somewhere the link can carry it — which turns out to be better for everyone. Nothing to sign up for, nothing to delete later, nothing that stops working when a company shuts down.',
            'The one thing worth knowing: because the title travels in the URL, treat a countdown link from a stranger the way you would any link. The title is stripped of anything that is not plain text and rendered as text, never as markup.',
          ],
        },
      ],
    },

    utcTime: {
      title: 'UTC time',
      metaTitle: 'UTC time now — current Coordinated Universal Time',
      description:
        "The current UTC time, ticking live, plus what UTC actually is, how it differs from GMT, and what every other zone's offset is measured against.",
      summary:
        "UTC is the reference clock every other time zone is defined against — it never shifts for daylight saving, and the reading below is your device's clock expressed in it.",
      faqs: [
        {
          question: 'What is UTC?',
          answer:
            'Coordinated Universal Time is the reference every other time zone is defined against. It is not a time zone anyone lives in — it is the baseline. Every offset you see, from UTC-12 to UTC+14, is a distance from this clock.',
        },
        {
          question: 'Is UTC the same as GMT?',
          answer:
            'For everyday purposes they show the same reading, but they are different things. GMT is a time zone, defined by the position of the sun at the Greenwich meridian, and Britain leaves it every summer. UTC is a time standard, kept by around 450 atomic clocks and never adjusted for daylight saving. If you mean "the reference", say UTC.',
        },
        {
          question: 'Why is it abbreviated UTC and not CUT?',
          answer:
            'Because neither the English nor the French acronym won. English speakers wanted CUT for "coordinated universal time", French speakers wanted TUC for "temps universel coordonné", and the International Telecommunication Union settled on UTC — which matches neither language and therefore offends both equally.',
        },
        {
          question: 'Does UTC observe daylight saving time?',
          answer:
            'Never. That is the entire point of it. UTC does not shift, which is why servers, aviation, shipping and every distributed system that needs two machines to agree on when something happened use it rather than a local zone.',
        },
        {
          question: 'What about leap seconds?',
          answer:
            'UTC has occasionally had a leap second inserted to keep it within 0.9 seconds of the earth’s actual rotation — 27 of them since 1972, the most recent at the end of 2016. In 2022 the General Conference on Weights and Measures voted to stop adding them by 2035. Your browser does not expose leap seconds, so neither does this page.',
        },
      ],
      sections: [
        {
          heading: 'Why everything is measured from here',
          paragraphs: [
            'Before 1884 every town kept its own clock, set by its own noon. That worked until the railways, at which point two towns forty miles apart disagreeing by twelve minutes stopped being a curiosity and started being a collision risk. The International Meridian Conference picked Greenwich as the prime meridian, and the modern system of offsets follows from it.',
            'UTC replaced Greenwich Mean Time as the technical standard in 1972. The difference matters more than it sounds: GMT is defined by the earth, which wobbles, while UTC is defined by caesium atoms, which do not. The two are kept within a second of each other by hand.',
            'If you are storing a timestamp in a database, logging an event, or scheduling anything that two machines must agree on, store it in UTC and convert on display. Storing local time is how systems end up with an hour that happens twice a year and a support ticket to match.',
          ],
        },
      ],
    },

    dstChanges: {
      title: 'Daylight saving changes',
      metaTitle: 'Daylight saving time changes this year and next',
      description:
        'Every scheduled clock change for this year and next, with exact dates, local change times and the offset either side. Filterable by country.',
      summary:
        'Every date below comes from the IANA time zone database, with the exact local moment each change takes effect — and the cities that never change their clocks listed separately.',
      faqs: [
        {
          question: 'Which countries have abolished daylight saving time?',
          answer:
            'Russia stopped in 2014, Turkey in 2016, Iran in 2022, Mexico in 2022 for most of the country, and Brazil in 2019 after decades of using it. Japan, India, China and almost all of Africa and Southeast Asia have never used it at all. Roughly a third of the world observes it; the rest watch the twice-yearly argument with interest.',
        },
        {
          question: 'Is the European Union still planning to abolish it?',
          answer:
            'The European Parliament voted in 2019 to end seasonal clock changes, but the directive stalled: member states could not agree on whether to settle on permanent summer or permanent winter time, and a patchwork would fragment the single market’s time zones. Until that is resolved, the changes on this page stand.',
        },
        {
          question: 'Why does Lord Howe Island shift by only 30 minutes?',
          answer:
            'Because it decided an hour was too much. Lord Howe, off the east coast of Australia, moves from UTC+10:30 to UTC+11:00 — the only half-hour daylight saving shift in the world. It is also the reason any time library that assumes a one-hour shift is quietly wrong for about 380 people.',
        },
        {
          question: 'What time do clocks actually change?',
          answer:
            'It varies. The United States changes at 02:00 local time, the European Union at 01:00 UTC — meaning every EU zone changes at the same instant but a different local hour. Australia changes at 02:00 local, Chile at 24:00. The local time column shows the last reading before each change.',
        },
        {
          question: 'How often is this page updated?',
          answer:
            'It is rebuilt monthly, and on the first of March, April, October and November, so that any change to the IANA time zone database is picked up before the dates it affects. Governments announce these changes with anything from a year’s notice to a fortnight’s.',
        },
      ],
      sections: [],
    },
  },

  hubs: {
    convert: {
      title: 'Time zone conversions',
      metaTitle: 'Time zone conversions between cities',
      description:
        'Every city-pair and abbreviation conversion on this site, each with an hour-by-hour table, daylight saving dates and the hours you can actually call.',
      summary:
        'Each conversion carries an hour-by-hour table, both cities’ daylight saving dates, and the hours you can actually call.',
    },
    cities: {
      title: 'Current time by city',
      metaTitle: 'Current time by city, across every continent',
      description:
        'Local time, UTC offset and daylight saving dates for 80 cities across every inhabited continent.',
      summary:
        'Each page carries a live clock, the exact daylight saving dates for that zone, sunrise and sunset computed from the city’s coordinates, and conversions to the major hubs.',
    },
    guides: {
      title: 'Guides',
      metaTitle: 'Guides to time zones, UTC and daylight saving',
      description:
        'Guides on how time zones work, what UTC is, why daylight saving exists, and how to handle all of it in code without getting it wrong.',
      summary:
        'How time zones actually work — the mechanism, the history, and the specific ways software gets it wrong. Written to be read once and remembered, not to rank.',
    },
  },

  generated: {
    hourByHour: 'Hour by hour',
    daylightSaving: 'Daylight saving time',
    whenYouCanTalk: 'When you can actually talk',
    reference: 'Reference',
    zoneFacts: 'Zone facts',
    sunriseSunset: 'Sunrise and sunset',
    againstHubs: 'Against the major hubs',
    convertTo: 'Convert to',
    exampleNote:
      'Offsets and dates are computed at build time from the IANA database. Live times render in your browser.',
    sunNote:
      'Computed from the city’s latitude and longitude with the NOAA solar position algorithm — no API, no network call.',
    noDstNote:
      'This city does not observe daylight saving time. Its offset from UTC is the same on every day of the year.',
    ambiguousPanelHeading: 'These letters mean more than one thing',
    ambiguousPanelBody:
      'If you meant one of the others, the offset below is wrong for you — and this is exactly how meetings get booked at the wrong hour.',
    abbreviationTableNote:
      'Computed on a date when this abbreviation is genuinely in force — using today would be wrong for half the year.',
  },
};
