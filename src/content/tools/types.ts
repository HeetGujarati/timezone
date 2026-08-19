/**
 * Page copy, per locale.
 *
 * Long-form copy lives here rather than in the flat JSON dictionary because a
 * paragraph is not a UI string: it needs paragraph breaks, it is written rather
 * than labelled, and a translator needs to see it in context. The type is the
 * contract — a locale missing a field fails to compile, which is a better failure
 * than a page that renders in English for a Japanese reader.
 */

export type Faq = { question: string; answer: string };

export type Section = {
  heading: string;
  /** Paragraphs. Rendered in order, each as its own <p>. */
  paragraphs: string[];
};

export type ToolCopy = {
  /** The <h1>. */
  title: string;
  /** The <title> tag, before the site name is appended. */
  metaTitle: string;
  /** The meta description. Must stay under 155 characters after translation. */
  description: string;
  /** The answer-first opening paragraph. */
  summary: string;
  faqs: Faq[];
  /** Long-form explainer sections rendered below the tool. */
  sections: Section[];
};

export type ToolKey =
  | 'converter'
  | 'meetingPlanner'
  | 'worldClock'
  | 'timeDifference'
  | 'workingHoursOverlap'
  | 'unixTimestamp'
  | 'durationCalculator'
  | 'countdown'
  | 'utcTime'
  | 'dstChanges';

export type PageCopy = {
  /** Copy for each of the ten core tools. */
  tools: Record<ToolKey, ToolCopy>;
  /** Copy for the hub pages. */
  hubs: {
    convert: Pick<ToolCopy, 'title' | 'metaTitle' | 'description' | 'summary'>;
    cities: Pick<ToolCopy, 'title' | 'metaTitle' | 'description' | 'summary'>;
    guides: Pick<ToolCopy, 'title' | 'metaTitle' | 'description' | 'summary'>;
  };
  /** Section headings reused across generated pages. */
  generated: {
    hourByHour: string;
    daylightSaving: string;
    whenYouCanTalk: string;
    reference: string;
    zoneFacts: string;
    sunriseSunset: string;
    againstHubs: string;
    convertTo: string;
    exampleNote: string;
    sunNote: string;
    noDstNote: string;
    ambiguousPanelHeading: string;
    ambiguousPanelBody: string;
    abbreviationTableNote: string;
  };
};
