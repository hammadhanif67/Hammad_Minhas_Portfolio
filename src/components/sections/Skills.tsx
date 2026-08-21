import { skillGroups } from '../../data/skills';
import { Section, SectionHead } from '../common/Section';
import { SkillCard } from './SkillCard';

/** Reveal stagger between cards, as in the original. */
const STAGGER = 0.06;

export function Skills() {
  return (
    <Section id="skills">
      <SectionHead
        id="skills"
        eyebrow="Skills"
        title="The front-end toolkit"
        lede="Everything listed here has shipped in at least one project. Nothing is on this page because I watched a course about it."
      />

      <div className="skills-grid">
        {skillGroups.map((group, i) => (
          <SkillCard key={group.id} group={group} delay={i * STAGGER} />
        ))}
      </div>
    </Section>
  );
}
