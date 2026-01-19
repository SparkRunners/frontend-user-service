/**
 * Login Page
 */
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme/tokens';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vänligen ange e-post och lösenord');
      return;
    }

    try {
      await login({ email, password });
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Inloggning misslyckades, kontrollera din e-post och lösenord');
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>SparkRunner</h1>
          <p style={styles.heroSubtitle}>Din smarta elscooter-tjänst</p>
          <div style={styles.features}>
            <div style={styles.feature}>
              <div style={styles.featureBullet}></div>
              <span>Snabb och miljövänlig</span>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureBullet}></div>
              <span>Finns överallt i staden</span>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureBullet}></div>
              <span>Flexibla prisalternativ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.formSection}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Välkommen</h2>
            <p style={styles.formSubtitle}>Logga in för att fortsätta</p>
          </div>

          {successMessage && <div style={styles.success}>{successMessage}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>E-post</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="din@email.se"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Lösenord</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Ange ditt lösenord"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {successMessage && <div style={styles.success}>{successMessage}</div>}
            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? 'Loggar in...' : 'Logga in'}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Testar? Använd: <strong>test@test.com</strong> / <strong>Test123!</strong>
            </p>
            <p style={styles.footerText}>
              Har du inget konto?{' '}
              <Link to="/register" style={styles.link}>
                Skapa konto
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  hero: {
    flex: '1',
    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    color: 'white',
  },
  heroContent: {
    maxWidth: '500px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 700,
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '24px',
    fontWeight: 400,
    marginBottom: '48px',
    opacity: 0.95,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '18px',
  },
  featureBullet: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flexShrink: 0,
  },
  formSection: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    backgroundColor: colors.background,
  },
  formContainer: {
    width: '100%',
    maxWidth: '420px',
  },
  formHeader: {
    marginBottom: '32px',
  },
  formTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: colors.text,
    marginBottom: '8px',
  },
  formSubtitle: {
    fontSize: '16px',
    color: colors.textSecondary,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: colors.text,
  },
  input: {
    fontSize: '16px',
    padding: '14px 16px',
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: colors.card,
  },
  button: {
    fontSize: '16px',
    fontWeight: 600,
    backgroundColor: colors.brand,
    color: 'white',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px',
  },
  error: {
    fontSize: '14px',
    color: colors.danger,
    backgroundColor: '#FEE2E2',
    padding: '12px 16px',
    borderRadius: '8px',
  },
  footer: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: colors.card,
    borderRadius: '12px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: colors.textSecondary,
    margin: 0,
  },
  success: {
    padding: '12px 16px',
    backgroundColor: '#D1FAE5',
    color: '#059669',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
  },
  link: {
    color: colors.brand,
    textDecoration: 'none',
    fontWeight: 600,
  },
};
