import { parseLocalTimeInZone, InvalidLocalTimeError } from '~/lib/time/parse.ts';
import { isKnownZone } from '~/data/zones.ts';
import { describeElapsed } from './lib/elapsed.ts';

/**
 * Duration between two date-times that may be in different zones.
 *
 * Both ends are resolved to instants first, then subtracted — which is the only way
 * to get this right across a daylight-saving boundary. A naive "subtract the wall
 * clocks" gives 24 hours for a day that was actually 23 or 25.
 */
class DurationCalculator extends HTMLElement {
  connectedCallback(): void {
    for (const control of this.querySelectorAll('input, select')) {
      control.addEventListener('change', () => this.#update());
      control.addEventListener('input', () => this.#update());
    }
    this.#update();
  }

  #value(role: string): string {
    const element = this.querySelector(`[data-role="${role}"]`);
    return element instanceof HTMLInputElement || element instanceof HTMLSelectElement
      ? element.value
      : '';
  }

  #update(): void {
    const startZone = this.#value('start-zone');
    const endZone = this.#value('end-zone');
    if (!isKnownZone(startZone) || !isKnownZone(endZone)) return;

    const error = this.querySelector('[data-role="error"]');

    try {
      const start = parseLocalTimeInZone(
        this.#value('start-date'),
        this.#value('start-time'),
        startZone,
      );
      const end = parseLocalTimeInZone(this.#value('end-date'), this.#value('end-time'), endZone);

      if (error instanceof HTMLElement) {
        error.textContent = '';
        error.hidden = true;
      }

      const elapsed = describeElapsed(start.instant, end.instant);
      this.#setOutputs({
        headline: elapsed.headline,
        days: String(elapsed.totalDays),
        hours: String(elapsed.totalHours),
        minutes: String(elapsed.totalMinutes),
        seconds: String(elapsed.totalSeconds),
        direction: elapsed.negative
          ? (this.dataset['labelBefore'] ?? 'The end is before the start.')
          : '',
      });
    } catch (thrown) {
      if (error instanceof HTMLElement) {
        error.textContent =
          thrown instanceof InvalidLocalTimeError
            ? thrown.message
            : (this.dataset['errorGeneric'] ?? 'Could not read those dates.');
        error.hidden = false;
      }
    }
  }

  #setOutputs(values: Record<string, string>): void {
    for (const [key, value] of Object.entries(values)) {
      const target = this.querySelector(`[data-out="${key}"]`);
      if (target instanceof HTMLElement) target.textContent = value;
    }
  }
}

if (!customElements.get('duration-calculator')) {
  customElements.define('duration-calculator', DurationCalculator);
}
