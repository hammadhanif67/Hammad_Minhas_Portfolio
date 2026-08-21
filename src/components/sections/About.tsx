import { aboutParagraphs, facts } from '../../data/about';
import { useReveal } from '../../hooks/useReveal';
import { Icon } from '../common/Icon';
import { Section, SectionHead } from '../common/Section';

export function About() {
  const body = useReveal<HTMLDivElement>();
  const list = useReveal<HTMLDivElement>(0.1);

  return (
    <Section id="about">
      <SectionHead
        id="about"
        eyebrow="About"
        title={
          <>
            I learn by building,
            <br />
            not by watching.
          </>
        }
      />

      <div className="about-grid">
        <div className="about-body rv" {...body}>
          {aboutParagraphs.map((paragraph, i) => (
            // eslint-disable-next-line react/no-array-index-key -- prose, fixed order
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="facts rv" {...list}>
          {facts.map((fact) => (
            <div className="fact" key={fact.key}>
              <span className="ico-box ico-tile">
                <Icon name={fact.icon} />
              </span>
              <div>
                <p className="fact-k">{fact.key}</p>
                <p className="fact-v">{fact.value}</p>
                <p className="fact-s">{fact.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
