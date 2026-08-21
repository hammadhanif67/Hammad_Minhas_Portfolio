import { profile, socialLinks } from '../../data/site';
import { externalLink } from '../../utils/dom';
import { Brand } from '../common/Brand';
import { Icon } from '../common/Icon';

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <Brand />

        <div className="foot-social">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.label}
              {...(link.external ? externalLink : null)}
            >
              <Icon name={link.icon} size={18} />
            </a>
          ))}
        </div>

        <p className="foot-note">© 2026 · {profile.location}</p>
      </div>
    </footer>
  );
}
