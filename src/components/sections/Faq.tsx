import { useState } from 'react';
import type { FaqEntry } from '../../types';
import { faqEntries } from '../../data/faq';
import { useReveal } from '../../hooks/useReveal';
import { Icon } from '../common/Icon';
import { Section, SectionHead } from '../common/Section';

interface FaqItemProps {
  entry: FaqEntry;
  open: boolean;
  onToggle: () => void;
}

function FaqItem({ entry, open, onToggle }: FaqItemProps) {
  const reveal = useReveal<HTMLDivElement>();
  const panelId = `faq-panel-${entry.id}`;
  const buttonId = `faq-button-${entry.id}`;

  return (
    <div className="q rv" data-open={open ? 'true' : 'false'} {...reveal}>
      {/* A heading that is also the control: assistive tech can list the
          questions, and everyone gets one thing to click. */}
      <h3 className="q-head">
        <button
          type="button"
          id={buttonId}
          className="q-btn"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
        >
          {entry.question}
          <Icon name="plus" />
        </button>
      </h3>

      <div className="q-panel" id={panelId} role="region" aria-labelledby={buttonId}>
        <div>
          <p>{entry.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  // One open at a time, as in the original; clicking the open one shuts it.
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Section id="faq">
      <SectionHead id="faq" center eyebrow="FAQ" title="Before you message me" />

      <div className="faq">
        {faqEntries.map((entry) => (
          <FaqItem
            key={entry.id}
            entry={entry}
            open={entry.id === openId}
            onToggle={() => setOpenId((current) => (current === entry.id ? null : entry.id))}
          />
        ))}
      </div>
    </Section>
  );
}
