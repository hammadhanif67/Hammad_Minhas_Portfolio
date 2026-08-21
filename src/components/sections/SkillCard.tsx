import { useCallback } from 'react';
import type { MouseEvent } from 'react';
import type { SkillGroup } from '../../types';
import { useHasHover } from '../../hooks/useMediaQuery';
import { useReveal } from '../../hooks/useReveal';
import { cx } from '../../utils/dom';
import { Icon } from '../common/Icon';

interface SkillCardProps {
  group: SkillGroup;
  delay: number;
}

export function SkillCard({ group, delay }: SkillCardProps) {
  const reveal = useReveal<HTMLDivElement>(delay);
  const hasHover = useHasHover();

  /* The spotlight is two custom properties and a radial gradient that
     already exists in the layer — no state, no re-render, nothing for
     React to do between frames. Devices without a cursor never attach
     the listener at all; skills.css gives them a fixed wash instead. */
  const trackPointer = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div className="skill-card rv" onMouseMove={hasHover ? trackPointer : undefined} {...reveal}>
      <div className="skill-head">
        <span className="ico-box ico-tile">
          <Icon name={group.icon} size={22} />
        </span>
        <div>
          <h3>{group.title}</h3>
          <p>{group.kind}</p>
        </div>
      </div>

      <div className="chips">
        {group.chips.map((chip) => (
          <span className={cx('chip', group.ice && 'ice')} key={chip}>
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
