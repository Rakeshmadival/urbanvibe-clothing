import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { firebaseConfigured } from '../../firebase/app.js';

const ERROR_MESSAGES = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'No admin account found with that email.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/invalid-email': 'Enter a valid email address.',
};

function AdminLoginForm() {
  const { login, isAuthenticated, checking } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!checking && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/admin/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || 'Could not log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-3xl tracking-wide">
            <span className="text-ivory">URBAN</span>
            <span className="text-gold ml-1">VIBE</span>
          </span>
          <p className="text-ivory/40 text-xs tracking-widest2 uppercase mt-2">Admin Panel</p>
        </div>

        {!firebaseConfigured && (
          <div className="border border-rust/40 bg-rust/10 text-rust text-xs px-4 py-3 mb-5">
            Firebase isn't configured yet (.env.local is missing). See README.md → "Firebase Setup" before logging
            in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-ivory p-7">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold/15 mx-auto mb-5">
            <Lock size={18} className="text-gold-deep" strokeWidth={1.5} />
          </div>

          <label className="text-sm font-medium block mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/20 px-4 py-2.5 text-sm outline-none focus:border-ink mb-4"
            placeholder="admin@urbanvibe.com"
          />

          <label className="text-sm font-medium block mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/20 px-4 py-2.5 text-sm outline-none focus:border-ink mb-5"
            placeholder="••••••••"
          />

          {error && <p className="text-rust text-xs mb-4">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-ivory py-3 text-sm tracking-widest2 uppercase hover:bg-charcoal transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            {submitting ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
        <p className="text-ivory/30 text-xs text-center mt-5">
          Admin accounts are created manually in the Firebase Console — see README.md.
        </p>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <AdminAuthProvider>
      <AdminLoginForm />
    </AdminAuthProvider>
  );
}
