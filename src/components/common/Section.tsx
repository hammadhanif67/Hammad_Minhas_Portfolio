import type { ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { cx } from '../../utils/dom';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * A page section and its container. `sec + sec` draws the hairline rule
 * between neighbours, so the order these appear in App.tsx is the order
 * the rules land in.
 */
export function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={cx('sec', className)} aria-labelledby={`${id}-title`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

interface SectionHeadProps {
  /** Matches the parent Section's id, wiring up aria-labelledby. */
  id: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  center?: boolean;
}

export function SectionHead({ id, eyebrow, title, lede, center }: SectionHeadProps) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <div className={cx('sec-head rv', center && 'center')} {...reveal}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="sec-title" id={`${id}-title`}>
        {title}
      </h2>
      {lede ? <p className="sec-lede">{lede}</p> : null}
    </div>
  );
}
