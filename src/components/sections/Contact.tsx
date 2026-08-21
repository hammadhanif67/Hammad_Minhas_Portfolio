import type { ContactCard as ContactCardType } from '../../types';
import { contactCards } from '../../data/contact';
import { waLink, waMessages } from '../../data/site';
import { useReveal } from '../../hooks/useReveal';
import { cx, externalLink } from '../../utils/dom';
import { Icon } from '../common/Icon';
import { Section } from '../common/Section';

const STAGGER = 0.06;

function ContactCard({ card, delay }: { card: ContactCardType; delay: number }) {
  const reveal = useReveal<HTMLAnchorElement>(delay);

  return (
    <a
      className={cx('ccard', card.tone, 'rv')}
      href={card.href}
      aria-label={`${card.key}: ${card.value}`}
      {...(card.external ? externalLink : null)}
      {...reveal}
    >
      <span className="ico-box">
        <Icon name={card.icon} size={22} />
      </span>
      <div>
        <p className="ccard-k">{card.key}</p>
        <p className="ccard-v">{card.value}</p>
      </div>
    </a>
  );
}

export function Contact() {
  const head = useReveal<HTMLDivElement>();
  const cta = useReveal<HTMLDivElement>();

  return (
    <Section id="contact">
      <div className="contact-head rv" {...head}>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          Contact
        </p>
        <h2 id="contact-title">
          Let&rsquo;s build <span>something.</span>
        </h2>
        <p className="sec-lede">
          Tell me what you&rsquo;re making and where it&rsquo;s stuck. If I&rsquo;m not the right
          fit, I&rsquo;ll say so and point you somewhere better.
        </p>
      </div>

      <div className="cards">
        {contactCards.map((card, i) => (
          <ContactCard key={card.id} card={card} delay={i * STAGGER} />
        ))}
      </div>

      <div className="rv center" {...cta}>
        <a className="btn btn-primary" href={waLink(waMessages.project)} {...externalLink}>
          Start the conversation
          <Icon name="arrow-ur" size={18} />
        </a>
      </div>
    </Section>
  );
}
