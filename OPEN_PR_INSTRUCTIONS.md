# Instructions for Opening the Pull Request

Since automated PR creation requires additional GitHub permissions, please follow these steps to open the PR manually:

## Option 1: Via GitHub Web Interface

1. Go to: https://github.com/divergent2/TeamQuill
2. Click on "Pull requests" tab
3. Click "New pull request"
4. Set base branch: `main`
5. Set compare branch: `teamquill/phase1-final`
6. Click "Create pull request"
7. Title: `Phase1: finalize backend triggers, E2E, CI/CD, deploy`
8. Copy the content from `PR_DESCRIPTION.md` into the PR description
9. Click "Create pull request"

## Option 2: Via GitHub CLI (if available)

```bash
gh pr create \
  --base main \
  --head teamquill/phase1-final \
  --title "Phase1: finalize backend triggers, E2E, CI/CD, deploy" \
  --body-file PR_DESCRIPTION.md
```

## After Creating the PR

### Required Actions Before Merge:

1. **Set up Firebase Project**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password provider)
   - Enable Firestore Database
   - Enable Cloud Functions

2. **Configure GitHub Secrets**

   Go to: Repository Settings → Secrets and variables → Actions → New repository secret

   Add these secrets:

   **Firebase:**
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

   **Netlify:**
   - `NETLIFY_AUTH_TOKEN` (from Netlify User Settings → Applications)
   - `NETLIFY_SITE_ID` (from Netlify Site Settings)

3. **Deploy Firebase Resources**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools

   # Login
   firebase login

   # Initialize (if not already done)
   firebase init

   # Deploy Firestore rules
   firebase deploy --only firestore

   # Deploy Cloud Functions
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

4. **Create Demo Account**
   - Go to Firebase Console → Authentication → Users
   - Click "Add user"
   - Email: `demo@teamquill.test`
   - Password: `TeamQuill123!`

5. **Merge the PR**
   - Once all secrets are configured
   - GitHub Actions will automatically run tests and deploy to Netlify

6. **Update PR with Deployment URL**
   - After successful deployment
   - GitHub Actions will comment with the Netlify deployment URL
   - Or find it in: Netlify Dashboard → Your Site

## Current Status

✅ Code implementation complete
✅ Tests written and verified
✅ Documentation complete
✅ Branch pushed to GitHub: `teamquill/phase1-final`
⏳ PR needs to be created manually
⏳ Firebase project needs to be configured
⏳ GitHub secrets need to be added
⏳ Deployment will happen automatically after merge

## Verification After Deployment

1. Visit the deployed Netlify URL
2. Log in with demo credentials: `demo@teamquill.test` / `TeamQuill123!`
3. Create a task
4. Verify notification appears
5. Update task status
6. Verify status change notification appears
7. Click notification to mark as read

## Support

For detailed documentation, see:
- [docs/PHASE1.md](docs/PHASE1.md) - Complete setup guide
- [PR_DESCRIPTION.md](PR_DESCRIPTION.md) - Full PR description
