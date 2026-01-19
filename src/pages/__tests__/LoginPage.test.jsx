import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';
import { AuthProvider } from '../../auth/AuthContext';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../auth/AuthContext', async () => {
  const actual = await vi.importActual('../../auth/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      login: mockLogin,
      isLoading: false,
    }),
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText('SparkRunner')).toBeInTheDocument();
    expect(screen.getByText('Välkommen')).toBeInTheDocument();
    expect(screen.getByLabelText('E-post')).toBeInTheDocument();
    expect(screen.getByLabelText('Lösenord')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logga in/i })).toBeInTheDocument();
  });

  it('should show error when fields are empty', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /logga in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Vänligen ange e-post och lösenord')).toBeInTheDocument();
    });
  });

  it('should call login and navigate on successful login', async () => {
    mockLogin.mockResolvedValue({ token: 'test-token' });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('E-post');
    const passwordInput = screen.getByLabelText('Lösenord');
    const submitButton = screen.getByRole('button', { name: /logga in/i });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'Test123!',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/account');
    });
  });

  it('should show error message on login failure', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('E-post');
    const passwordInput = screen.getByLabelText('Lösenord');
    const submitButton = screen.getByRole('button', { name: /logga in/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should display test credentials hint', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/test@test.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Test123!/i)).toBeInTheDocument();
  });
});
