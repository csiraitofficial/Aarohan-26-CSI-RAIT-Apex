# Deployment Guide for Krishi 🌿

Complete guide for deploying Krishi to Firebase Hosting and other platforms.

---

## Table of Contents
- [Firebase Hosting](#firebase-hosting)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)
- [Rollback](#rollback)

---

## Firebase Hosting

### Why Firebase?
- ✅ Global CDN (fast worldwide delivery)
- ✅ Free SSL/TLS certificates
- ✅ Automatic HTTPS
- ✅ One-click rollbacks
- ✅ Integrated with Firestore/Auth
- ✅ Free tier includes 10GB/month hosting
- ✅ Analytics included
- ✅ Custom domain support

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All console errors resolved
- [ ] No sensitive data in code
- [ ] All Firebase rules reviewed
- [ ] CSS and JS minified (optional)
- [ ] Service Worker tested
- [ ] Offline functionality works

### Testing
- [ ] All pages load correctly
- [ ] All user roles tested
- [ ] Mobile responsiveness verified
- [ ] All 4 languages tested
- [ ] QR code generation works
- [ ] Blockchain explorer functions
- [ ] Search works
- [ ] Chatbot responds

### Security
- [ ] Firebase credentials in .env
- [ ] No API keys in code
- [ ] Firestore rules locked down
- [ ] Storage rules configured
- [ ] CORS settings correct
- [ ] Authentication enabled

### Database
- [ ] Firestore indexes created
- [ ] Sample data verified
- [ ] Backups configured
- [ ] Rules tested with emulator

---

## Environment Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

### 2. Authenticate
```bash
firebase login
```

This opens browser to authenticate with Google account.

### 3. Initialize Firebase (if not done)
```bash
firebase init
```

When prompted, select:
- ✓ Hosting
- ✓ Firestore
- ✓ Storage
- Choose existing Firebase project
- Set public directory: `.` (current directory)
- Configure as single-page app: `No` (we use server rewrite)
- Don't overwrite existing files: `No`

### 4. Firebase Configuration File
The `firebase.json` file controls deployment:

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      ".firebaserc",
      ".git/**",
      "node_modules/**",
      "*.md",
      ".env*"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(html|js|css|json|woff|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=3600"
          }
        ]
      },
      {
        "source": "sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

---

## Deployment Steps

### Option 1: Full Deployment (All Services)

```bash
# Deploy everything
firebase deploy

# Expected output:
# ✓ Hosting
# ✓ Firestore Rules
# ✓ Storage Rules
# ✓ Database Rules
```

Estimated time: 2-3 minutes

### Option 2: Specific Services

```bash
# Only hosting (fastest for frontend changes)
firebase deploy --only hosting

# Only Firestore rules
firebase deploy --only firestore:rules

# Only Storage rules
firebase deploy --only storage:rules

# Only Database rules
firebase deploy --only database:rules
```

### Option 3: Preview Channel (for testing)
```bash
# Create preview deployment
firebase hosting:channel:deploy preview-1

# Returns unique preview URL
# Good for testing before production

# Promote preview to production
firebase hosting:clone krishi-herb-traceability:main preview-1/main:hosting
```

### Option 4: Scheduled Deployment
```bash
# Deploy with specific version
firebase deploy \
  --only hosting \
  --message "v1.0.0 - Production Release"
```

---

## Post-Deployment

### 1. Verify Deployment
```bash
# Check deployment status
firebase hosting:list

# Check deployed files
firebase hosting:releases

# View live site
# https://krishi-herb-traceability.firebaseapp.com
```

### 2. Monitor Performance
In Firebase Console:
1. Go to Hosting → Deployment history
2. View analytics and bandwidth
3. Monitor error rates in Cloud Functions

### 3. Custom Domain
```bash
firebase hosting:sites:list
firebase hosting:domain:create krishi.com

# Or via Firebase Console:
# Hosting → Settings → Domain
```

### 4. SSL Certificate
- Automatic (Firebase handles it)
- Verification takes 24 hours
- HSTS header included automatically

### 5. Verify HTTPS
```bash
curl -I https://krishi-herb-traceability.firebaseapp.com
# Should show: HTTP/2 200
```

---

## Continuous Deployment (GitHub Actions)

### Set Up GitHub Actions

1. **Get Firebase Deploy Token**
```bash
firebase login:ci
# Outputs: 1//0... (token)
```

2. **Add Secret to GitHub**
   - Go to repository Settings
   - Secrets and variables → Actions
   - New secret: `FIREBASE_TOKEN` = (paste token)

3. **Create `.github/workflows/deploy.yml`**
```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main
      - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: krishi-herb-traceability
          channelId: live

      - name: Notify Slack
        if: always()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"Krishi deployed successfully"}'
```

4. **Get Service Account Key**
   - Firebase Console → Settings → Service Accounts
   - Create new private key
   - Add as GitHub Secret: `FIREBASE_SERVICE_ACCOUNT`

Now every push to `main` auto-deploys!

---

## Docker Deployment (Optional)

For advanced deployments, create `Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install -g firebase-tools

EXPOSE 5000

CMD ["firebase", "emulators:start"]
```

Build and run:
```bash
docker build -t krishi .
docker run -p 5000:5000 krishi
```

---

## Environment Variables

Never commit real credentials! Use `.env.local`:

```env
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=krishi-herb-traceability.firebaseapp.com
FIREBASE_PROJECT_ID=krishi-herb-traceability
FIREBASE_STORAGE_BUCKET=krishi-herb-traceability.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123...
FIREBASE_APP_ID=1:123...
```

Access in `firebase-config.js`:
```javascript
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  // ... other config
};
```

---

## Performance Optimization

### 1. Enable Compression
```bash
# Firebase automatically gzips HTML, JS, CSS
# No action needed
```

### 2. Set Cache Headers
Already configured in `firebase.json`:
```json
"Cache-Control": "max-age=3600"  // 1 hour
```

### 3. CDN Performance
- Firebase uses Google's global CDN
- Served from servers nearest to users
- Check latency: `curl -w "@curl-format.txt" ...`

### 4. Monitor Usage
```bash
firebase billing:set -c spark  # Spark plan (free)
firebase billing:set -c paid   # Blaze plan (pay-as-you-go)
```

---

## Troubleshooting

### Issue: Deployment fails
```bash
# Check credentials
firebase login

# Verify project
firebase projects:list

# Use correct Firebase config
firebase use --add
```

### Issue: Files not updating
```bash
# Clear cache
firebase hosting:disabled false

# Force redeploy
rm -rf .firebase
firebase deploy
```

### Issue: "Missing Firestore database"
```bash
# Create Firestore database
firebase firestore:databases:create --region us-central1
```

### Issue: Rules deployment fails
```bash
# Validate rules
firebase ext:list

# Test locally first
firebase emulators:start

# Check rule syntax
# Run through Firebase Console validator
```

### Issue: Slow performance
1. Check Analytics in Firebase Console
2. Monitor bandwidth usage
3. Check function execution times
4. Review Firestore read/write operations

---

## Rollback

### Quick Rollback
```bash
# View deployments
firebase hosting:releases

# Rollback to previous version
firebase hosting:releases:rollback

# Or specify version
firebase hosting:releases:rollback DEPLOYMENT_ID
```

### Manual Rollback
1. Firebase Console → Hosting → Deployments
2. Click version number
3. Click "Rollback"
4. Confirm

Takes effect immediately (< 1 second).

---

## Status Page & Monitoring

### Create Status Checks
```bash
# Deploy a status endpoint (using functions)
firebase deploy --only functions
```

### Monitor Real-Time
- **Firebase Console**: Hosting → Analytics
- **Google Cloud Console**: Monitoring → Dashboards
- **Uptime Checks**: Cloud Monitoring → Uptime Checks

### Set Up Alerts
1. Google Cloud Console
2. Monitoring → Alert policies
3. Create policy for >10% error rate
4. Notify via email/Slack

---

## Version Management

### Semantic Versioning
- **v1.0.0** - Major release
- **v1.0.1** - Patch (bug fix)
- **v1.1.0** - Minor (new feature)

### Create Release
```bash
# Tag version in git
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Deploy with version
firebase deploy --message "v1.0.0 Release"
```

Create GitHub Release with notes.

---

## Scaling & Limits

### Free Tier (Spark Plan)
- 10 GB/month hosting
- 1 GB/month Firestore
- Sufficient for MVP/testing

### Paid Tier (Blaze Plan)
- Pay-per-use
- Unlimited storage
- Better for production
- Estimated: $20-50/month for typical load

### Firestore Limits
- 10k reads/day (free)
- 5k writes/day (free)
- No charge after daily limits on free tier

---

## Maintenance

### Regular Tasks
- [ ] Weekly: Monitor analytics
- [ ] Monthly: Review security rules
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Review performance metrics
- [ ] Quarterly: Update translations/content

### Backup Strategy
- [x] Firestore daily backups (set via Console)
- [x] GitHub version control
- [x] Firebase automatic rollback capability

---

## Support & Help

- **Firebase Status**: https://firebase.google.com/status
- **Documentation**: https://firebase.google.com/docs
- **Community**: https://stackoverflow.com/questions/tagged/firebase
- **Email Support**: support@krishi.com

---

**Last Updated**: March 6, 2026  
**Tested On**: Firebase Hosting, GitHub Actions, Docker
