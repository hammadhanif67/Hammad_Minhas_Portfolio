import type { ProcessStep } from '../../types';
import { processSteps } from '../../data/process';
import { useReveal } from '../../hooks/useReveal';
import { Icon } from '../common/Icon';
import { Section, SectionHead } from '../common/Section';

const STAGGER = 0.06;

function Step({ step, delay }: { step: ProcessStep; delay: number }) {
  const reveal = useReveal<HTMLLIElement>(delay);

  return (
    <li className="step rv" {...reveal}>
      <p className="step-n">{step.n}</p>
      <span className="ico-box ico-tile">
        <Icon name={step.icon} size={22} />
      </span>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
    </li>
  );
}

export function Process() {
  return (
    <Section id="process">
      <SectionHead
        id="process"
        eyebrow="Process"
        title="Four steps, no surprises"
        lede="The same process every time, so you always know what happens next and what it costs."
      />

      {/* An ordered list, because the order is the point. */}
      <ol className="steps">
        {processSteps.map((step, i) => (
          <Step key={step.n} step={step} delay={i * STAGGER} />
        ))}
      </ol>
    </Section>
  );
}
