import { useEffect } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const visible = (el: HTMLElement) => el.getClientRects().length > 0;

/**
 * Keeps Tab inside an open overlay and hands focus back to whatever
 * opened it on close.
 *
 * The original drawer had neither: opening it left the keyboard focus
 * behind on the burger, and tabbing walked straight through the menu
 * into the page underneath, which was still there but hidden.
 */
export function useFocusTrap<T extends HTMLElement>(ref: RefObject<T | null>, active: boolean) {
  useEffect(() => {
    const root = ref.current;
    if (!active || !root) return;

    const opener = document.activeElement as HTMLElement | null;
    const stops = () => Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(visible);

    /* An element that is still `visibility: hidden` cannot take focus,
       and the panel only becomes visible when its open transition
       starts. If the first attempt lands nowhere, try again on the
       next frame rather than leaving focus behind on the opener. */
    const focusFirst = () => {
      const first = stops()[0];
      if (!first) return false;
      first.focus();
      return root.contains(document.activeElement);
    };

    let retry = 0;
    if (!focusFirst()) {
      retry = requestAnimationFrame(() => {
        focusFirst();
      });
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const list = stops();
      if (list.length === 0) {
        e.preventDefault();
        return;
      }

      const first = list[0];
      const last = list[list.length - 1];
      const current = document.activeElement;
      const outside = !root.contains(current);

      if (e.shiftKey && (current === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(retry);
      document.removeEventListener('keydown', onKeyDown);
      opener?.focus?.();
    };
  }, [ref, active]);
}
