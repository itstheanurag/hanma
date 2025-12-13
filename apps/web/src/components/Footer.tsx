import { LuGithub, LuTwitter, LuDisc } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 border-x border-border/0">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
             <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                <Logo className="text-foreground" size={24} />
                <span className="text-lg font-bold text-foreground">Hanma</span>
            </Link>
            <p className="text-muted text-sm max-w-sm">
              The backend component library for modern developers. 
              Built to help you ship faster without compromising on code quality or security.
            </p>
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/docs" className="hover:text-foreground transition-colors">Snippets</Link></li>
              <li><Link to="/docs" className="hover:text-foreground transition-colors">Templates</Link></li>
              <li><Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Legal</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © 2024 Hanma Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted hover:text-foreground transition-colors"><LuGithub size={16} /></a>
            <a href="#" className="text-muted hover:text-foreground transition-colors"><LuTwitter size={16} /></a>
            <a href="#" className="text-muted hover:text-foreground transition-colors"><LuDisc size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;