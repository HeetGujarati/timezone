import { toZonedDateTime } from '~/lib/time/offset.ts';
import { parseLocalTimeInZone, InvalidLocalTimeError } from '~/lib/time/parse.ts';
import { isKnownZone } from '~/data/zones.ts';
import {
  formatDate,
  formatTimeWithSeconds,
  readFormatContext,
  toDateInputValue,
  toTimeInputValue,
} from './lib/format.ts';
import { parseIntParam, readParam } from './lib/params.ts';
import { MAX_INSTANT, detectUnit, toInstant } from './lib/epoch-unit.ts';

/**
 * Unix timestamp converter, both directions.
 *
 * Seconds versus milliseconds is detected rather than asked: a value with 13 or
 * more digits is milliseconds, because a 13-digit second count is the year 318857.
 * The detection is shown to the reader rather than applied silently, since guessing
 * wrong is a factor-of-1000 error.
 */

class EpochConverter extends HTMLElement {
  #epochInput!: HTMLInputElement;
  #zoneSelect!: HTMLSelectElement;
  #dateInput!: HTMLInputElement;
  #timeInput!: HTMLInputElement;
  #liveEpoch!: HTMLElement;
  #timer: number | undefined;

  connectedCallback(): void {
    const epochInput = this.querySelector('[data-role="epoch"]');
    const zoneSelect = this.querySelector('[data-role="zone"]');
    const dateInput = this.querySelector('[data-role="date"]');
    const timeInput = this.querySelector('[data-role="time"]');
    const liveEpoch = this.querySelector('[data-role="live-epoch"]');

    if (
      !(epochInput instanceof HTMLInputElement) ||
      !(zoneSelect instanceof HTMLSelectElement) ||
      !(dateInput instanceof HTMLInputElement) ||
      !(timeInput instanceof HTMLInputElement) ||
      !(liveEpoch instanceof HTMLElement)
    ) {
      return;
    }

    this.#epochInput = epochInput;
    this.#zoneSelect = zoneSelect;
    this.#dateInput = dateInput;
    this.#timeInput = timeInput;
    this.#liveEpoch = liveEpoch;

    const seeded = parseIntParam(
      readParam(new URLSearchParams(window.location.search), 't'),
      -MAX_INSTANT,
      MAX_INSTANT,
    );
    epochInput.value = String(seeded ?? Math.floor(Date.now() / 1000));

    epochInput.addEventListener('input', () => this.#fromEpoch());
    zoneSelect.addEventListener('change', () => this.#fromEpoch());
    dateInput.addEventListener('change', () => this.#toEpoch());
    timeInput.addEventListener('change', () => this.#toEpoch());

    const nowButton = this.querySelector('[data-role="now"]');
    if (nowButton instanceof HTMLButtonElement) {
      nowButton.hidden = false;
      nowButton.addEventListener('click', () => {
        this.#epochInput.value = String(Math.floor(Date.now() / 1000));
        this.#fromEpoch();
      });
    }

    this.#tickLiveEpoch();
    this.#timer = window.setInterval(() => this.#tickLiveEpoch(), 1000);
    this.#fromEpoch();
  }

  disconnectedCallback(): void {
    if (this.#timer !== undefined) window.clearInterval(this.#timer);
  }

  #tickLiveEpoch(): void {
    const seconds = this.#liveEpoch.querySelector('[data-out="live-seconds"]');
    const millis = this.#liveEpoch.querySelector('[data-out="live-millis"]');
    const now = Date.now();
    if (seconds instanceof HTMLElement) seconds.textContent = String(Math.floor(now / 1000));
    if (millis instanceof HTMLElement) millis.textContent = String(now);
  }

  #setError(message: string | null): void {
    const target = this.querySelector('[data-role="error"]');
    if (!(target instanceof HTMLElement)) return;
    target.textContent = message ?? '';
    target.hidden = message === null;
  }

  #fromEpoch(): void {
    const raw = this.#epochInput.value.trim();
    if (!/^-?\d{1,17}$/.test(raw)) {
      this.#setError(this.dataset['errorNumber'] ?? 'Enter a whole number.');
      return;
    }

    const value = Number(raw);
    const unit = detectUnit(value);
    const instant = toInstant(value);

    if (instant === null) {
      this.#setError(
        this.dataset['errorRange'] ?? 'That timestamp is outside the supported range.',
      );
      return;
    }

    const zone = this.#zoneSelect.value;
    if (!isKnownZone(zone)) return;

    this.#setError(null);

    const context = readFormatContext(this);
    const zoned = toZonedDateTime(instant, zone);

    this.#dateInput.value = toDateInputValue(zoned);
    this.#timeInput.value = toTimeInputValue(zoned);

    this.#setOutputs({
      unit:
        unit === 'milliseconds' ? (this.dataset['unitMs'] ?? 'ms') : (this.dataset['unitS'] ?? 's'),
      date: formatDate(instant, zone, context),
      time: formatTimeWithSeconds(instant, zone, context),
      iso: new Date(instant).toISOString(),
    });
  }

  #toEpoch(): void {
    const zone = this.#zoneSelect.value;
    if (!isKnownZone(zone)) return;

    try {
      const resolved = parseLocalTimeInZone(this.#dateInput.value, this.#timeInput.value, zone);
      this.#epochInput.value = String(Math.floor(resolved.instant / 1000));
      this.#setError(null);
      this.#fromEpoch();
    } catch (thrown) {
      this.#setError(
        thrown instanceof InvalidLocalTimeError
          ? thrown.message
          : (this.dataset['errorGeneric'] ?? 'Could not read that.'),
      );
    }
  }

  #setOutputs(values: Record<string, string>): void {
    for (const [key, value] of Object.entries(values)) {
      const target = this.querySelector(`[data-out="${key}"]`);
      if (target instanceof HTMLElement) target.textContent = value;
    }
  }
}

if (!customElements.get('epoch-converter')) {
  customElements.define('epoch-converter', EpochConverter);
}
