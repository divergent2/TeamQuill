# TeamQuill

Interactive platform for copywriters to manage tasks, share ideas, receive updates, and improve submissions with AI

## Quick Start

See [docs/PHASE1.md](docs/PHASE1.md) for complete setup and deployment instructions.

### Demo

Try the live demo:
- URL: [Will be available after deployment]
- Email: `demo@teamquill.test`
- Password: `TeamQuill123!`

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Run development server
npm run dev
```

## Features

- 🔐 User authentication (signup/login)
- 📝 Task management (create, update, delete)
- 🔔 Real-time notifications
- 🔥 Firebase backend with Cloud Functions
- 🧪 E2E testing with Playwright
- 🚀 CI/CD with GitHub Actions
- 📦 Deployed on Netlify

## Documentation

- [Phase 1 Documentation](docs/PHASE1.md) - Complete setup, deployment, and usage guide

## Tech Stack

- **Frontend:** React, Vite, React Router
- **Backend:** Firebase (Authentication, Firestore, Cloud Functions)
- **Testing:** Playwright
- **CI/CD:** GitHub Actions
- **Hosting:** Netlify

## License

ISC

## Testing

To run E2E tests without Firebase credentials, use:
```bash
USE_MOCK=true npm run dev
# In another terminal
npm run test:e2e
```

The `playwright.config.js` is configured to use mock mode automatically.
