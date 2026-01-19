# SparkRunner - User Web Portal

Web-based user portal for SparkRunner e-scooter service, built with React and Vite.

## Prerequisites

- Node.js 22+
- npm or yarn
- Backend services running:
  - Auth service (port 3001)
  - User/Scooter service (port 3002)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration - Uses Vite proxy to avoid CORS
VITE_AUTH_API_URL=/api/auth
VITE_SCOOTER_API_URL=/api/v1

# OAuth Configuration (optional)
VITE_GOOGLE_CLIENT_ID=
VITE_GITHUB_CLIENT_ID=

# App Configuration
VITE_APP_NAME=SparkRunner
VITE_FRONTEND_URL=http://localhost:5173
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report
- `npm run deploy` - Deploy to GitHub Pages

## Testing

Run tests:

```bash
# Run all tests
npm test

# Generate coverage report
npm run test:coverage
```

## Vite Proxy Configuration

Development server uses Vite proxy to avoid CORS issues:

- `/api/auth/*` → `http://localhost:3001/auth/*`
- `/api/v1/*` → `http://localhost:3002/api/v1/*`

## Docker Support

Build and run with Docker:

```bash
# Build image
docker build -t sparkrunner-user-web .

# Run container
docker run -p 5173:5173 sparkrunner-user-web
```

For Docker Compose, use `.env.docker` configuration.


## Design System

The app uses a consistent design system with:

- **Brand Color**: `#22C55E` (Green)
- **Typography**: System fonts with specific sizes and weights
- **Spacing**: Consistent spacing scale (xs to xxl)
- **Border Radius**: Standardized radii (card, control, pill)
- **Badges**: Success, warning, danger, info variants

## Test Account

For testing purposes:

- **Email**: `test@test.com`
- **Password**: `Test123!`

## Development

### Hot Module Replacement (HMR)

Vite provides instant HMR. Changes to components will be reflected immediately without full page reload.

### Code Style

- ESLint configuration included
- React Hooks rules enforced
- Consistent code formatting

## Deployment

### GitHub Pages

```bash
npm run deploy
```

### Docker

Use the provided Dockerfile for containerized deployment.


## License

MIT
