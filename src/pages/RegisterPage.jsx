/**
 * Register Page
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authApi';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme/tokens';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Vänligen fyll i alla fält');
      return;
    }

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken');
      return;
    }

    try {
      setIsLoading(true);
      // Register user
      await register({ username, email, password });
      // Auto-login after registration
      await login({ email, password });
      // Redirect to account page
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrering misslyckades');
    } finally {
      setIsLoading(false);
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

      {/* Right Side - Register Form */}
      <div style={styles.formSection}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Skapa konto</h2>
            <p style={styles.formSubtitle}>Kom igång med SparkRunner idag</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>Användarnamn</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="dittnamn"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

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
                autoComplete="email"
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
                placeholder="Minst 6 tecken"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>Bekräfta lösenord</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                placeholder="Ange lösenord igen"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Skapar konto...' : 'Skapa konto'}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Har du redan ett konto?{' '}
              <Link to="/login" style={styles.link}>
                Logga in
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
    flex: 1,
    background: `linear-gradient(135deg, ${colors.brand} 0%, ${colors.brandDark} 100%)`,
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
    lineHeight: 1.2,
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
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    backgroundColor: '#F9FAFB',
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
    color: '#1F2937',
    marginBottom: '8px',
  },
  formSubtitle: {
    fontSize: '16px',
    color: '#6B7280',
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
    color: '#1F2937',
  },
  input: {
    fontSize: '16px',
    padding: '14px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: 'white',
  },
  error: {
    padding: '12px 16px',
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
  },
  submitButton: {
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
  footer: {
    marginTop: '24px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
  },
  link: {
    color: colors.brand,
    textDecoration: 'none',
    fontWeight: 600,
  },
};
