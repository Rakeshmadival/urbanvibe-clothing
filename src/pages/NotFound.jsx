import { Link } from 'react-router-dom';
import Seo from '../components/common/Seo.jsx';
import Button from '../components/common/Button.jsx';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <Seo title="Page Not Found" />
      <p className="font-display text-7xl md:text-9xl text-gold mb-2">404</p>
      <p className="font-serif italic text-2xl mb-6">This page wandered off the rack.</p>
      <Button as={Link} to="/" variant="primary">
        Back to Home
      </Button>
    </div>
  );
}
