import { parseLocalTimeInZone, InvalidLocalTimeError } from '~/lib/time/parse.ts';
import { isKnownZone } from '~/data/zones.ts';
import { countdownParts } from './lib/elapsed.ts';
import { sanitiseTitle } from './lib/title.ts';
import { formatDate, formatTime, readFormatContext } from './lib/format.ts';
import { parseDateParam, parseTimeParam, readParam } from './lib/params.ts';

/**
 * A shareable countdown. All state lives in the URL, so there is nothing to store
 * and the link is the whole product.
 *
 * The title is the only reader-supplied string that reaches the page. It is
 * sanitised on the way in and written with `textContent` on the way out, so a
 * crafted link cannot inject anything into what its recipient sees.
 */
class CountdownTimer extends HTMLElement {
  #target: number | null = null;
  #timer: number | undefined;

  connectedCallback(): void {
    this.#applyUrlState();

    for (const control of this.querySelectorAll('input, select')) {
      control.addEventListener('change', () => this.#recompute());
      control.addEventListener('input', () => this.#recompute());
    }

    const share = this.querySelector('[data-role="share"]');
    if (share instanceof HTMLButtonElement && navigator.clipboard !== undefined) {
      share.hidden = false;
      share.addEventListener('click', () => {
        void navigator.clipboard.writeText(window.location.href).then(() => {
          const done = this.dataset['copiedLabel'];
          if (done !== undefined) share.textContent = done;
        });
      });
    }

    this.#recompute();
    this.#timer = window.setInterval(() => this.#tick(), 1000);
  }

  disconnectedCallback(): void {
    if (this.#timer !== undefined) window.clearInterval(this.#timer);
  }

  #field(role: string): HTMLInputElement | HTMLSelectElement | null {
    const element = this.querySelector(`[data-role="${role}"]`);
    return element instanceof HTMLInputElement || element instanceof HTMLSelectElement
      ? element
      : null;
  }

  #applyUrlState(): void {
    const params = new URLSearchParams(window.location.search);

    const title = sanitiseTitle(readParam(params, 'title'));
    const titleField = this.#field('title');
    if (titleField !== null && title !== '') titleField.value = title;

    const date = parseDateParam(readParam(params, 'date'));
    const dateField = this.#field('date');
    if (dateField !== null && date !== null) dateField.value = date;

    const time = parseTimeParam(readParam(params, 'time'));
    const timeField = this.#field('time');
    if (timeField !== null && time !== null) timeField.value = time;

    const zone = readParam(params, 'zone');
    const zoneField = this.#field('zone');
    if (zoneField !== null && zone !== null && isKnownZone(zone)) zoneField.value = zone;
  }

  #recompute(): void {
    const zone = this.#field('zone')?.value ?? 'UTC';
    const date = this.#field('date')?.value ?? '';
    const time = this.#field('time')?.value ?? '';
    const error = this.querySelector('[data-role="error"]');

    if (!isKnownZone(zone)) return;

    try {
      const resolved = parseLocalTimeInZone(date, time, zone);
      this.#target = resolved.instant;

      if (error instanceof HTMLElement) {
        error.textContent = '';
        error.hidden = true;
      }

      const context = readFormatContext(this);
      const targetLabel = this.querySelector('[data-out="target"]');
      if (targetLabel instanceof HTMLElement) {
        targetLabel.textContent = `${formatDate(resolved.instant, zone, context)} \u00b7 ${formatTime(resolved.instant, zone, context)}`;
      }

      const titleValue = sanitiseTitle(this.#field('title')?.value ?? '');
      const heading = this.querySelector('[data-out="title"]');
      if (heading instanceof HTMLElement) heading.textContent = titleValue;

      const url = new URL(window.location.href);
      url.searchParams.set('title', titleValue);
      url.searchParams.set('date', date);
      url.searchParams.set('time', time);
      url.searchParams.set('zone', zone);
      window.history.replaceState(null, '', url);

      this.#tick();
    } catch (thrown) {
      this.#target = null;
      if (error instanceof HTMLElement) {
        error.textContent =
          thrown instanceof InvalidLocalTimeError
            ? thrown.message
            : (this.dataset['errorGeneric'] ?? 'Could not read that date.');
        error.hidden = false;
      }
    }
  }

  #tick(): void {
    if (this.#target === null) return;
    const parts = countdownParts(Date.now(), this.#target);

    const finished = this.querySelector('[data-role="finished"]');
    if (finished instanceof HTMLElement) finished.hidden = !parts.finished;

    for (const unit of ['days', 'hours', 'minutes', 'seconds'] as const) {
      const target = this.querySelector(`[data-out="${unit}"]`);
      if (target instanceof HTMLElement) {
        target.textContent =
          unit === 'days' ? String(parts[unit]) : String(parts[unit]).padStart(2, '0');
      }
    }
  }
}

if (!customElements.get('countdown-timer')) {
  customElements.define('countdown-timer', CountdownTimer);
}
