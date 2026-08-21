import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { contactCards } from '../../data/contact';
import { cx, externalLink } from '../../utils/dom';
import { Icon } from '../common/Icon';

/**
 * The floating contact control.
 *
 * It replaces the WhatsApp-only button, which committed the whole
 * corner of every page to one channel. Collapsed it is a single small
 * square; opened it lists every way to make contact — WhatsApp, email,
 * LinkedIn, GitHub — read from the same `contactCards` data the
 * Contact section renders, so the two can never disagree.
 *
 * Closing returns it to exactly its collapsed state: Escape, a click
 * outside, picking a channel, or the button itself. Focus goes back to
 * the trigger so the keyboard is never stranded.
 */
export function ContactDock() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  /* The Contact section already offers all four channels, plus a
     "Start the conversation" button. Floating a shortcut to the same
     four on top of it is the same offer twice, so the dock steps out
     of the way while that section is on screen. */
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const contact = document.getElementById('contact');
    if (!contact) return;

    const io = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  // Never leave it expanded as it fades out.
  useEffect(() => {
    if (atContact) setOpen(false);
  }, [atContact]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close(true);
      }
    };
    // pointerdown rather than click: dismiss on press, the way every
    // other menu on a phone behaves.
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  return (
    <div
      className="dock"
      ref={rootRef}
      data-open={open ? 'true' : 'false'}
      data-hidden={atContact ? 'true' : 'false'}
      inert={atContact}
    >
      <ul className="dock-list" id={listId} inert={!open}>
        {contactCards.map((card, i) => (
          <li
            key={card.id}
            className="dock-row"
            // Opens as a short cascade from the button upward; on close
            // every row leaves at once, so it never feels sticky.
            style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
          >
            <span className="dock-label">{card.key}</span>
            <a
              className={cx('dock-link', card.tone)}
              href={card.href}
              aria-label={`${card.key}: ${card.value}`}
              onClick={() => close()}
              {...(card.external ? externalLink : null)}
            >
              <Icon name={card.icon} size={18} />
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        ref={triggerRef}
        className="dock-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={listId}
        aria-label={open ? 'Close contact options' : 'Contact options'}
      >
        {/* `msgsq`, not `chat`. `chat` is the round bubble this site
            uses for WhatsApp specifically — on the hero button, in the
            footer, on the WhatsApp row inside this very dock. Wearing
            it here made the floating button read as a second WhatsApp
            button sitting a few hundred pixels from the first one.
            This opens four channels, so it takes a mark that belongs
            to none of them. */}
        <Icon name={open ? 'x' : 'msgsq'} size={20} />
      </button>
    </div>
  );
}
