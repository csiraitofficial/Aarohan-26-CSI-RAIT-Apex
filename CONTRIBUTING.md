# Contributing to Krishi 🌿

Thank you for your interest in contributing to Krishi! This document provides guidelines and instructions for contributing to our blockchain-powered herb traceability platform.

## Code of Conduct

- Be respectful and professional
- Provide constructive feedback
- Help others learn and grow
- No harassment, discrimination, or hate speech

## Getting Started

### Prerequisites
- Git installed
- Node.js 14+
- Firebase CLI: `npm install -g firebase-tools`
- Code editor (VS Code recommended)

### Clone & Setup
```bash
git clone https://github.com/yourusername/Aarohan-26-CSI-RAIT-Apex.git
cd Aarohan-26-CSI-RAIT-Apex
firebase login
```

### Local Development
1. Create a Firebase project for testing
2. Copy `.env.example` to `.env.local` and fill in your credentials
3. Start Firebase emulator: `firebase emulators:start`
4. Open http://localhost:5000 in browser

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/description-of-feature
# Or for bug fixes:
git checkout -b fix/description-of-bug
```

**Branch Naming Conventions:**
- `feature/add-dna-verification` - New features
- `fix/qr-code-scanning-bug` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/optimize-blockchain` - Code improvements
- `test/add-auth-tests` - New tests

### 2. Make Your Changes

#### Code Style
- **JavaScript**: Use ES6+ syntax
  ```javascript
  // Good
  const greetUser = (name) => {
    return `Welcome, ${name}!`;
  };

  // Avoid
  var greet = function(name) {
    return "Welcome, " + name + "!";
  };
  ```

- **HTML**: Use semantic tags
  ```html
  <!-- Good -->
  <section id="farmer-dashboard">
    <h2>Farmer Dashboard</h2>
  </section>

  <!-- Avoid -->
  <div id="farmer-dashboard">
    <span>Farmer Dashboard</span>
  </div>
  ```

- **CSS**: Use CSS Variables
  ```css
  /* Good */
  .card {
    background: var(--color-surface);
    padding: var(--space-md);
    border-radius: var(--radius-md);
  }

  /* Avoid */
  .card {
    background: #ffffff;
    padding: 16px;
    border-radius: 12px;
  }
  ```

### 3. Add Comments for Complex Logic
```javascript
// ─── Smart Contract Quality Evaluation ──────────
// Check if herb meets quality standards
function evaluateQuality(herbType, testResults) {
  const threshold = QUALITY_THRESHOLDS[herbType];
  
  // Moisture must be within standard range
  if (testResults.moisture > threshold.maxMoisture) {
    return 'FAIL';
  }
  
  return 'PASS';
}
```

### 4. Test Your Changes

**Manual Testing Checklist:**
- [ ] All page sections load without errors
- [ ] No console warnings/errors
- [ ] Responsive design works (test on mobile width)
- [ ] Forms submit correctly
- [ ] Data persists after page reload
- [ ] User authentication flows work
- [ ] Role-based visibility is correct

**Browser Testing:**
- Chrome/Chromium
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add feature description

- Detailed explanation of changes
- What problem this solves
- Any breaking changes"
```

**Commit Message Format:**
```
type: subject

body
footer
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - CSS/formatting
- `refactor:` - Code restructuring
- `perf:` - Performance improvement
- `test:` - Test additions
- `chore:` - Build/dependency updates

### 6. Push & Create Pull Request
```bash
git push origin feature/your-feature
```

Then create a PR on GitHub with:
- **Title**: Clear, concise description
- **Description**: What, why, how
- **Screenshots**: For UI changes
- **Testing**: How you tested this

## PR Review Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] No console errors/warnings
- [ ] Comments added for complex logic
- [ ] Tests pass locally
- [ ] README updated if needed
- [ ] Commit messages are clear
- [ ] No sensitive data in commits

### What Reviewers Look For
1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it clean and maintainable?
3. **Testing** - Is it properly tested?
4. **Documentation** - Are changes documented?
5. **Performance** - Does it impact performance?
6. **Security** - Are there security considerations?

### After Approval
- Merge when approved
- Delete feature branch
- Update changelog if needed

## Common Development Tasks

### Adding a New Dashboard
1. Create HTML section in `index.html`
```html
<section id="new-dashboard" class="dashboard-section" style="display:none">
  <div class="dash-header">
    <h2>📊 New Dashboard</h2>
  </div>
  <div class="dash-grid">
    <!-- Content here -->
  </div>
</section>
```

2. Add styling to `styles.css`
```css
#new-dashboard {
  /* Styles */
}
```

3. Add JavaScript in `app.js`
```javascript
function initNewDashboard() {
  // Initialize
}

function handleNewDashboardAction() {
  // Handle user action
}
```

### Adding a New Language
1. Create translation file: `locales/[lang]/translation.json`
```json
{
  "app-title": "Krishi",
  "dashboard": "Dashboard",
  "new-key": "Translated Text"
}
```

2. Update `i18n.js`
```javascript
const langs = ['en', 'hi', 'gu', 'mr', 'new-lang'];
```

3. Add option to language selector in HTML
```html
<option value="new-lang">Language Name</option>
```

### Updating Security Rules
1. Edit `firestore.rules`
2. Test with Firebase Emulator
3. Deploy with: `firebase deploy --only firestore:rules`

### Adding a Smart Contract
1. Create class in `smart-contract-enhanced.js`
```javascript
class NewContract {
  constructor() {
    // Initialize
  }
  
  evaluate(params) {
    // Logic
    return result;
  }
}
```

2. Test thoroughly with different inputs
3. Integrate in `app.js`

## Project Structure Notes

- **`index.html`** - Application shell (8KB)
- **`styles.css`** - All styling (1600+ lines)
- **`app.js`** - Main logic (1000+ lines)
- **`auth.js`** - Authentication and roles
- **`blockchain-simulator.js`** - Blockchain engine
- **`smart-contract-enhanced.js`** - Smart contracts
- **`i18n.js`** - Internationalization
- **`locales/`** - Translation files (4 languages)

## Performance Tips

- Use const/let instead of var
- Debounce rapid function calls
- Use event delegation for dynamic elements
- Lazy load images and heavy content
- Cache DOM queries in variables

```javascript
// Good - Cache query
const form = document.getElementById('batch-form');
form.addEventListener('submit', handleSubmit);

// Avoid - Query repeatedly
document.getElementById('batch-form').addEventListener('submit', handleSubmit);
document.getElementById('batch-form').style.display = 'block';
document.getElementById('batch-form').reset();
```

## Security Considerations

- Never commit Firebase credentials
- Always use HTTPS in production
- Validate all user inputs
- Use prepared statements for queries
- Check user roles before sensitive operations
- Sanitize any user-generated content
- Review Firestore security rules

## Testing Checklist

For any new feature:
- [ ] Works with all user roles (admin, farmer, lab, manufacturer, consumer)
- [ ] Works on mobile (375px width)
- [ ] Works on desktop (1920px width)
- [ ] Works offline (Service Worker)
- [ ] All languages display correctly
- [ ] No console errors
- [ ] Data syncs to Firestore
- [ ] Blockchain records created correctly

## Reporting Issues

### Bug Reports
Include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos
- Browser and OS info
- Console errors

### Feature Requests
Include:
- Clear description of requested feature
- Why it would be useful
- Proposed implementation (if you have ideas)
- Use cases

### Security Issues
⚠️ **DO NOT** open public issues for security vulnerabilities.  
Email: security@krishi.com with details and reproduction steps.

## Getting Help

- **Questions?** Check existing GitHub Issues
- **Need Support?** Email: dev@krishi.com
- **Want a Feature?** Create an Issue/Discussion
- **Found a Bug?** Report with detailed steps

## Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes for major contributions
- Project documentation

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Leaflet.js Guide](https://leafletjs.com/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Git Basics](https://git-scm.com/doc)

## Questions?

Don't hesitate to reach out:
- Open a GitHub Discussion
- Email: dev@krishi.com
- Join our community Discord

**Thank you for contributing to making herb supply chains transparent and trustworthy!** 🌿✨
