# TeamQuill Phase 1 Documentation

## Overview

TeamQuill is an interactive platform for copywriters to manage tasks, share ideas, receive updates, and improve submissions with AI. This Phase 1 implementation includes:

- User authentication (signup/login)
- Task management (create, update, delete tasks)
- Real-time notifications via Firebase Cloud Functions
- End-to-end testing with Playwright
- CI/CD pipeline with GitHub Actions
- Deployment to Netlify

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase account and project
- Netlify account (for deployment)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/divergent2/TeamQuill.git
cd TeamQuill
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Enable Cloud Functions

#### Set Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

You can find these values in:
- Firebase Console → Project Settings → General → Your apps → Web app

#### Deploy Firebase Resources

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (select Firestore, Functions, and Hosting)
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Install function dependencies
cd functions
npm install
cd ..

# Deploy Cloud Functions
firebase deploy --only functions
```

### 4. Create Demo Account

Create a demo user in Firebase Authentication:
- Email: `demo@teamquill.test`
- Password: `TeamQuill123!`

You can do this via:
1. Firebase Console → Authentication → Users → Add user
2. Or by signing up through the application UI

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Running Tests

### E2E Tests with Playwright

```bash
# Run tests headless
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui
```

**Note:** E2E tests require:
- The application to be running (Playwright will start it automatically)
- Valid Firebase credentials in `.env`
- Internet connection to Firebase

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Deployment

### Netlify Deployment

#### Option 1: Manual Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### Option 2: Continuous Deployment via GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that automatically:
1. Runs E2E tests
2. Builds the application
3. Deploys to Netlify on merge to `main`

**Required GitHub Secrets:**

Set these in your GitHub repository settings (Settings → Secrets and variables → Actions):

1. **Firebase Configuration:**
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

2. **Netlify Configuration:**
   - `NETLIFY_AUTH_TOKEN`: Generate from Netlify → User Settings → Applications → Personal access tokens
   - `NETLIFY_SITE_ID`: Found in Netlify → Site Settings → General → Site information → Site ID

### Alternative: Vercel Deployment

If Netlify is unavailable, you can deploy to Vercel:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. For GitHub integration:
   - Connect your GitHub repository in Vercel dashboard
   - Configure environment variables in Vercel project settings
   - Vercel will automatically deploy on push to main

## Demo Credentials

For testing the deployed application:

- **Email:** `demo@teamquill.test`
- **Password:** `TeamQuill123!`

## Project Structure

```
TeamQuill/
├── src/
│   ├── components/       # React components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Dashboard.jsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx
│   ├── services/         # Firebase services
│   │   ├── firebase.js
│   │   ├── taskService.js
│   │   └── notificationService.js
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── functions/           # Firebase Cloud Functions
│   └── index.js
├── e2e/                # Playwright E2E tests
│   └── teamquill.spec.js
├── .github/
│   └── workflows/
│       └── ci-cd.yml   # GitHub Actions workflow
├── docs/
│   └── PHASE1.md       # This file
├── firebase.json       # Firebase configuration
├── firestore.rules     # Firestore security rules
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Features

### Authentication
- Sign up with email/password
- Login/logout functionality
- Protected routes

### Task Management
- Create tasks with title and description
- Update task status (To Do, In Progress, Done)
- View tasks in a responsive grid layout

### Notifications
- Real-time notifications via Firestore listeners
- Notifications triggered by Cloud Functions when:
  - A task is created
  - A task status is updated
  - A task is reassigned
- Mark notifications as read
- Unread count badge

### Security
- Firestore security rules ensure:
  - Users can only access their own tasks
  - Users can only read their own notifications
  - Only Cloud Functions can create notifications
  - All operations require authentication

## Troubleshooting

### Firebase Connection Issues
- Verify your `.env` file has correct Firebase credentials
- Check Firebase project is active
- Ensure Firestore and Authentication are enabled

### Cloud Functions Not Triggering
- Verify functions are deployed: `firebase deploy --only functions`
- Check function logs: `firebase functions:log`
- Ensure Firestore rules allow the operations

### E2E Tests Failing
- Ensure Firebase credentials are set in `.env`
- Verify demo account exists
- Check internet connection
- Run with UI mode to debug: `npm run test:e2e:ui`

### Deployment Issues
- Verify all required secrets are set in GitHub
- Check build logs in GitHub Actions
- Ensure Netlify/Vercel account is properly configured

## Support

For issues or questions:
1. Check the documentation above
2. Review Firebase Console logs
3. Check GitHub Actions workflow logs
4. Review Playwright test reports

## Next Steps (Future Phases)

- AI-powered content suggestions
- Team collaboration features
- File attachments
- Comments and discussions
- Analytics dashboard
