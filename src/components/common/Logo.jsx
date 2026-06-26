import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig.js';

// To swap in a real logo file later: replace the contents of this component
// with <img src="/images/logo.svg" alt={siteConfig.brandName} className="h-8" />
export default function Logo({ light = true, className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-baseline font-display tracking-wide select-none ${className}`}>
      <span className={`text-2xl ${light ? 'text-ivory' : 'text-ink'}`}>URBAN</span>
      <span className="text-2xl text-gold ml-1">VIBE</span>
    </Link>
  );
}
