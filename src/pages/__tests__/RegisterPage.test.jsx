import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../RegisterPage';
import * as authApi from '../../api/authApi';

// Mock the authApi module
vi.mock('../../api/authApi');

// Mock useNavigate
const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../auth/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render registration form', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getByText('SparkRunner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Skapa konto' })).toBeInTheDocument();
    expect(screen.getByLabelText('Användarnamn')).toBeInTheDocument();
    expect(screen.getByLabelText('E-post')).toBeInTheDocument();
    expect(screen.getByLabelText('Lösenord')).toBeInTheDocument();
    expect(screen.getByLabelText('Bekräfta lösenord')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /skapa konto/i })).toBeInTheDocument();
  });

  it('should show error when fields are empty', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /skapa konto/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Vänligen fyll i alla fält')).toBeInTheDocument();
    });
  });

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Användarnamn');
    const emailInput = screen.getByLabelText('E-post');
    const passwordInput = screen.getByLabelText('Lösenord');
    const confirmPasswordInput = screen.getByLabelText('Bekräfta lösenord');
    const submitButton = screen.getByRole('button', { name: /skapa konto/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Lösenorden matchar inte')).toBeInTheDocument();
    });
  });

  it('should show error when password is too short', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Användarnamn');
    const emailInput = screen.getByLabelText('E-post');
    const passwordInput = screen.getByLabelText('Lösenord');
    const confirmPasswordInput = screen.getByLabelText('Bekräfta lösenord');
    const submitButton = screen.getByRole('button', { name: /skapa konto/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '12345');
    await user.type(confirmPasswordInput, '12345');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Lösenordet måste vara minst 6 tecken')).toBeInTheDocument();
    });
  });

  it('should call register and navigate on successful registration', async () => {
    const user = userEvent.setup();
    authApi.register.mockResolvedValue({ id: '1', username: 'testuser', email: 'test@example.com' });
    mockLogin.mockResolvedValue();

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Användarnamn');
    const emailInput = screen.getByLabelText('E-post');
    const passwordInput = screen.getByLabelText('Lösenord');
    const confirmPasswordInput = screen.getByLabelText('Bekräfta lösenord');
    const submitButton = screen.getByRole('button', { name: /skapa konto/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/account');
    });
  });

  it('should show error message on registration failure', async () => {
    const user = userEvent.setup();
    authApi.register.mockRejectedValue({
      response: { data: { message: 'Email already exists' } },
    });

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Användarnamn');
    const emailInput = screen.getByLabelText('E-post');
    const passwordInput = screen.getByLabelText('Lösenord');
    const confirmPasswordInput = screen.getByLabelText('Bekräfta lösenord');
    const submitButton = screen.getByRole('button', { name: /skapa konto/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('should display link to login page', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const loginLink = screen.getByText('Logga in');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });
});
