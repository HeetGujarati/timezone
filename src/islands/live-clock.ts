import { formatOffsetShort, getOffsetMinutes, getZoneAbbreviation } from '~/lib/time/offset.ts';
import { isKnownZone } from '~/data/zones.ts';
import { formatDate, formatTime, formatTimeWithSeconds, readFormatContext } from './lib/format.ts';

/**
 * A ticking clock for one zone.
 *
 * Prerendered pages must never show a stale "now", so the element renders an em
 * dash until it upgrades and then updates on the second. Every instance shares one
 * interval — a world clock with forty cities should not schedule forty timers.
 */

const subscribers = new Set<LiveClock>();
let timer: number | undefined;

function tick(): void {
  const now = Date.now();
  for (const clock of subscribers) clock.render(now);
}

function startTicking(): void {
  if (timer !== undefined) return;
  tick();
  // Align to the next second boundary so every clock on the page flips together.
  const delay = 1000 - (Date.now() % 1000);
  window.setTimeout(() => {
    tick();
    timer = window.setInterval(tick, 1000);
  }, delay);
  timer = -1;
}

class LiveClock extends HTMLElement {
  #zone = 'UTC';
  #showSeconds = false;
  #showDate = false;

  connectedCallback(): void {
    const zone = this.dataset['zone'] ?? 'UTC';
    if (!isKnownZone(zone)) return;

    this.#zone = zone;
    this.#showSeconds = this.dataset['seconds'] === 'true';
    this.#showDate = this.dataset['date'] === 'true';

    subscribers.add(this);
    startTicking();
    this.render(Date.now());
  }

  disconnectedCallback(): void {
    subscribers.delete(this);
  }

  render(now: number): void {
    const context = readFormatContext(this);

    const timeTarget = this.querySelector('[data-clock="time"]');
    if (timeTarget instanceof HTMLElement) {
      timeTarget.textContent = this.#showSeconds
        ? formatTimeWithSeconds(now, this.#zone, context)
        : formatTime(now, this.#zone, context);
    }

    if (this.#showDate) {
      const dateTarget = this.querySelector('[data-clock="date"]');
      if (dateTarget instanceof HTMLElement) {
        dateTarget.textContent = formatDate(now, this.#zone, context);
      }
    }

    const zoneTarget = this.querySelector('[data-clock="zone"]');
    if (zoneTarget instanceof HTMLElement) {
      const abbreviation = getZoneAbbreviation(this.#zone, now);
      const offset = formatOffsetShort(getOffsetMinutes(this.#zone, now));
      zoneTarget.textContent = abbreviation === offset ? offset : `${abbreviation} · ${offset}`;
    }
  }
}

if (!customElements.get('live-clock')) {
  customElements.define('live-clock', LiveClock);
}
