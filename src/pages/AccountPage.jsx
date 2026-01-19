/**
 * Account Page - User account dashboard
 * Contains: balance, trip history, account info
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getUserBalance, getUserRides, fillupBalance } from '../api/profileApi';
import { colors, spacing, radii, typography, badges } from '../theme/tokens';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('balance'); // balance, trips, account
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Top Navigation Bar */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <h1 style={styles.logo}>SparkRunner</h1>
            <span style={styles.tagline}>Användarportal</span>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.userEmail}>{user?.email || 'Användare'}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logga ut
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Sidebar Navigation */}
        <aside style={styles.sidebar}>
          <nav style={styles.nav}>
            <button
              style={activeTab === 'balance' ? styles.navButtonActive : styles.navButton}
              onClick={() => setActiveTab('balance')}
            >
              Mitt Saldo
            </button>
            <button
              style={activeTab === 'trips' ? styles.navButtonActive : styles.navButton}
              onClick={() => setActiveTab('trips')}
            >
              Mina resor
            </button>
            <button
              style={activeTab === 'account' ? styles.navButtonActive : styles.navButton}
              onClick={() => setActiveTab('account')}
            >
              Mitt Konto
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main style={styles.content}>
          {activeTab === 'balance' && <BalanceTab />}
          {activeTab === 'trips' && <TripsTab />}
          {activeTab === 'account' && <AccountTab />}
        </main>
      </div>
    </div>
  );
}

// My Balance Tab
function BalanceTab() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fillupAmount, setFillupAmount] = useState('');
  const [fillupLoading, setFillupLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const loadBalance = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await getUserBalance(user.id);
      // Handle different response formats
      if (data && typeof data.balance !== 'undefined') {
        setBalance(data.balance);
      } else if (data && typeof data.amount !== 'undefined') {
        setBalance(data.amount);
      } else if (typeof data === 'number') {
        setBalance(data);
      } else {
        // New user might not have balance, set to 0
        setBalance(0);
      }
    } catch (err) {
      console.error('Failed to load balance:', err);
      // If user not found or no balance, set to 0
      if (err.response?.status === 404) {
        setBalance(0);
      } else {
        setError('Kunde inte ladda saldo');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  const handleFillup = async (e) => {
    e.preventDefault();
    const amount = parseFloat(fillupAmount);
    
    if (!amount || amount <= 0) {
      setError('Vänligen ange ett giltigt belopp');
      return;
    }

    try {
      setFillupLoading(true);
      setError('');
      const data = await fillupBalance(user.id, { amount });
      // Handle different response formats
      if (data && typeof data.balance !== 'undefined') {
        setBalance(data.balance);
      } else if (data && typeof data.amount !== 'undefined') {
        setBalance(data.amount);
      } else {
        // Reload balance after fillup
        await loadBalance();
      }
      setFillupAmount('');
    } catch (err) {
      console.error('Failed to fillup:', err);
      setError(err.response?.data?.message || 'Påfyllning misslyckades');
    } finally {
      setFillupLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Laddar...</div>;
  }

  return (
    <div style={styles.tabPane}>
      <div style={styles.balanceCard}>
        <div style={styles.balanceLabel}>Aktuellt saldo</div>
        <div style={styles.balanceAmount}>
          {balance !== null && balance !== undefined ? `${balance.toFixed(2)} kr` : '—'}
        </div>
      </div>

      <form onSubmit={handleFillup} style={styles.fillupForm}>
        <h3 style={styles.sectionTitle}>Fyll på saldo</h3>
        <div style={styles.inputGroup}>
          <input
            type="number"
            value={fillupAmount}
            onChange={(e) => setFillupAmount(e.target.value)}
            placeholder="Belopp (kr)"
            style={styles.input}
            step="0.01"
            min="0"
            disabled={fillupLoading}
          />
          <button type="submit" style={styles.primaryButton} disabled={fillupLoading}>
            {fillupLoading ? 'Laddar...' : 'Fyll på'}
          </button>
        </div>
        {error && <div style={styles.error}>{error}</div>}
      </form>

      <div style={styles.quickAmounts}>
        <button onClick={() => setFillupAmount('50')} style={styles.quickButton}>50 kr</button>
        <button onClick={() => setFillupAmount('100')} style={styles.quickButton}>100 kr</button>
        <button onClick={() => setFillupAmount('200')} style={styles.quickButton}>200 kr</button>
      </div>
    </div>
  );
}

// My Trips Tab
function TripsTab() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUserRides({ limit: 20 });
      // Backend returns format: { count, trips }
      setTrips(data.trips || []);
    } catch (err) {
      console.error('Failed to load trips:', err);
      setError('Kunde inte ladda resehistorik');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Laddar...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (trips.length === 0) {
    return (
      <div style={styles.tabPane}>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Inga resor ännu</p>
          <p style={styles.emptySubtext}>Dina resor visas här när du börjar åka</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tabPane}>
      <h3 style={styles.sectionTitle}>Senaste resor</h3>
      <div style={styles.tripsList}>
        {trips.map((trip) => {
          // Parse backend string formats: "1 minutes", "12.5 kr"
          const durationMatch = trip.duration?.match(/(\d+)/);
          const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : null;
          
          const costMatch = trip.cost?.match(/([0-9.]+)/);
          const costValue = costMatch ? parseFloat(costMatch[1]) : null;
          
          return (
          <div key={trip.id} style={styles.tripCard}>
            <div style={styles.tripHeader}>
              <span style={styles.tripDate}>
                {new Date(trip.startTime).toLocaleDateString('sv-SE')}
              </span>
              <span style={styles.tripCost}>
                {costValue ? `${costValue.toFixed(2)} SEK` : '—'}
              </span>
            </div>
            <div style={styles.tripDetails}>
              <div style={styles.tripDetail}>
                <span style={styles.tripDetailLabel}>Tid:</span>
                <span>{durationMinutes !== null ? `${durationMinutes} min` : '—'}</span>
              </div>
              <div style={styles.tripDetail}>
                <span style={styles.tripDetailLabel}>Scooter:</span>
                <span>{trip.scooter || '—'}</span>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}

// My Account Tab
function AccountTab() {
  const { user } = useAuth();

  return (
    <div style={styles.tabPane}>
      <h3 style={styles.sectionTitle}>Kontoinformation</h3>
      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>E-post:</span>
          <span style={styles.infoValue}>{user?.email || '—'}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Status:</span>
          <span style={{...badges.success, padding: `${spacing.xs} ${spacing.md}`, borderRadius: radii.pill}}>
            Aktiv
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: 'white',
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '16px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 700,
    color: colors.brand,
    margin: 0,
  },
  tagline: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userEmail: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
  logoutButton: {
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: 'transparent',
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  main: {
    display: 'flex',
    flex: 1,
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    padding: '32px',
    gap: '32px',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  navButton: {
    fontSize: '15px',
    fontWeight: 500,
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.textSecondary,
    padding: '12px 16px',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s',
    textAlign: 'left',
    width: '100%',
  },
  navButtonActive: {
    fontSize: '15px',
    fontWeight: 600,
    backgroundColor: colors.brandMuted,
    border: 'none',
    color: colors.brand,
    padding: '12px 16px',
    cursor: 'pointer',
    borderRadius: '8px',
    textAlign: 'left',
    width: '100%',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  tabPane: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl,
  },
  loading: {
    ...typography.bodyM,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xxl,
  },
  balanceCard: {
    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center',
    color: 'white',
  },
  balanceLabel: {
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '8px',
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: '48px',
    fontWeight: 700,
    letterSpacing: '-1px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: colors.text,
    margin: 0,
    marginBottom: '16px',
  },
  fillupForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '24px',
    backgroundColor: colors.background,
    borderRadius: '12px',
  },
  inputGroup: {
    display: 'flex',
    gap: '12px',
  },
  input: {
    fontSize: '16px',
    flex: 1,
    padding: '12px 16px',
    border: `2px solid ${colors.border}`,
    borderRadius: '8px',
    outline: 'none',
  },
  primaryButton: {
    fontSize: '16px',
    fontWeight: 600,
    backgroundColor: colors.brand,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  quickAmounts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  quickButton: {
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: 'white',
    border: `2px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  error: {
    fontSize: '14px',
    color: colors.danger,
    backgroundColor: '#FEE2E2',
    padding: '12px 16px',
    borderRadius: '8px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.textSecondary,
    margin: 0,
    marginBottom: '8px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: colors.textMuted,
    margin: 0,
  },
  tripsList: {
    display: 'grid',
    gap: '12px',
  },
  tripCard: {
    backgroundColor: colors.background,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${colors.border}`,
    transition: 'all 0.2s',
  },
  tripHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  tripDate: {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.text,
  },
  tripCost: {
    fontSize: '18px',
    fontWeight: 700,
    color: colors.brand,
  },
  tripDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  tripDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tripDetailLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    backgroundColor: colors.border,
    borderRadius: '12px',
    overflow: 'hidden',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    backgroundColor: 'white',
  },
  infoLabel: {
    fontSize: '15px',
    fontWeight: 500,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: '15px',
    fontWeight: 600,
    color: colors.text,
  },
};
