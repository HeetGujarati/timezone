/**
 * Theme toggle.
 *
 * Progressive enhancement: the button is rendered in the prerendered HTML but
 * carries `hidden` until this element upgrades, so a reader without JavaScript is
 * never shown a control that does nothing. The theme itself still works without
 * JavaScript — prefers-color-scheme drives it.
 */

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'meridiem-theme';

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    // Storage is untrusted input like any other: validate, never coerce.
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* Storage denied. The choice applies for this page view only. */
  }
}

function systemTheme(): Theme {
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function currentTheme(): Theme {
  const attribute = document.documentElement.getAttribute('data-theme');
  if (attribute === 'dark' || attribute === 'light') return attribute;
  return systemTheme();
}

class ThemeToggle extends HTMLElement {
  #button: HTMLButtonElement | null = null;

  connectedCallback(): void {
    const button = this.querySelector('button');
    if (!(button instanceof HTMLButtonElement)) return;

    this.#button = button;
    button.hidden = false;
    this.#sync(currentTheme());

    button.addEventListener('click', () => {
      const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      storeTheme(next);
      this.#sync(next);
    });

    // Follow the system if the reader has never made an explicit choice.
    globalThis.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (readStoredTheme() === null) this.#sync(systemTheme());
    });
  }

  #sync(theme: Theme): void {
    const button = this.#button;
    if (button === null) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', `Switch to ${next} theme`);
    button.dataset['theme'] = theme;
  }
}

if (!customElements.get('theme-toggle')) {
  customElements.define('theme-toggle', ThemeToggle);
}
