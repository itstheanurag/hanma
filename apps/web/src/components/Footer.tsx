import { Link } from "react-router-dom";
import Logo from "./Logo";
import { footerMeta, footerLinks, footerSocials } from "../data/footer.data";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <Logo className="text-foreground" size={24} />
              <span className="text-lg font-bold text-foreground">
                {footerMeta.brand.name}
              </span>
            </Link>
            <p className="text-muted text-sm max-w-sm">
              {footerMeta.brand.description}
            </p>
          </div>

          {/* Link groups */}
          {footerLinks.map((group) => (
            <div key={group.id}>
              <h4 className="text-foreground font-semibold mb-4 text-sm">
                {group.title}
              </h4>
              <ul className="space-y-2 text-sm text-muted">
                {group.links.map((link, idx) => (
                  <li key={idx}>
                    {link.type === "internal" ? (
                      <Link
                        to={link.to!}
                        className="hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            {footerMeta.copyright}
          </p>

          <div className="flex items-center gap-4">
            {footerSocials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                aria-label={social.label}
                className="text-muted hover:text-foreground transition-colors"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
