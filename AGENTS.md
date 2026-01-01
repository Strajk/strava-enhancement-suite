# CLAUDE.md

## Quick Commands

### Development
- `npm install` - Install dependencies
- `npm run lint` - Run ESLint on all files
- `npm run lint-fix` - Auto-fix ESLint issues
- `npm test` - Run AVA tests (unit tests for helper functions)
- `npm run test:watch` - Run tests in watch mode
- `npm run cypress:open` - Open Cypress test runner for e2e testing
- `npm run cypress:run` - Run Cypress tests headlessly

### Documentation & Build
- `npm run docs:watch` - Watch and build documentation site
- `npm run readme:build` - Build README from EJS template
- `npm run zip` - Create extension ZIP for distribution

### Manual Testing
- Clone the repo and open `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked" and select the `extension` directory
- Refresh any Strava.com page to see changes immediately

## Architecture Overview

### Extension Structure
This is a Chrome Manifest V3 browser extension that enhances Strava.com with additional features and UX improvements. The extension uses a minimal architecture without frameworks—mostly vanilla JS with jQuery for DOM manipulation.

#### Key Files & Their Roles

**Content Script Layer** (`extension/js/content_script.js`):
- Manifest V3 content script that runs on all Strava.com pages
- Handles CSS injection, library injection, and options loading
- Guards against multiple executions with `window.__SES_CONTENT_SCRIPT_LOADED__`
- Uses `injectJs()`, `injectCss()`, `injectData()` functions to inject resources into page context
- Supports URL parameter-based feature configuration via `__SES.opts.*` query params for easy testing

**Background Service Worker** (`extension/js/background.js`):
- Minimal Manifest V3 service worker
- Only manages extension icon visibility based on whether user is on Strava.com

**Main Enhancement Script** (`extension/js/main.js`):
- **The core script** - injected into page context by content_script.js
- Contains most of the feature logic as a single monolithic module
- Exports `StravaEnhancementSuiteHelpers` object with shared utilities (keySort, formatTime, etc.)
- Uses jQuery and vanilla JS to query/manipulate DOM
- Accesses React internals when needed for React-based pages using arrive.js observers

**Options System** (`extension/pages/options.js` + `extension/pages/options_page.js`):
- `options.js`: Defines all features and their defaults as `StravaEnhancementSuiteOptions` and `StravaEnhancementSuiteOptionsContexts`
- `options_page.js`: Simple jQuery-based UI for the options page
- Each option maps to a feature toggle/choice that gets stored in `chrome.storage.sync`
- Options are injected as JSON and accessed via `window.__SES_OPTIONS__`

**Feature Toggle Pattern**:
Features are controlled through a global options object structure:
```javascript
const StravaEnhancementSuiteOptions = {
  feature_name: {
    context: StravaEnhancementSuiteOptionsContexts.dashboard, // UI category
    title: 'Feature Display Name',
    description: 'HTML description shown in options',
    default: true,
    choices: [[val1, label1], [val2, label2]], // optional for select dropdowns
    internal: false, // if true, hidden from UI
    removed: false, // if true, shown in UI but no controls
    _tested: '2023-01-09 @author', // optional testing date
  }
};
```

**Libraries**:
- `arrive.js` - DOM observer for dynamic content detection
- `notyf.js` - Toast notifications library
- `react.development.js`, `react-dom.development.js` - React for accessing Strava's React components
- `browser-polyfill.js` (old) - Now using native Chrome APIs in MV3

### Testing

**Unit Tests** (`test.js`):
- Uses AVA test runner (not Jest)
- Tests exported helpers from main.js (e.g., `keySort` function)
- Run with `npm test` or `npm run test:watch`

**E2E Tests** (`cypress/`):
- Cypress integration tests that run against real Strava.com
- Requires valid Strava credentials in `.env` file (`CYPRESS_PASSWORD_TEST`)
- Tests actual user flows like keyboard navigation, feature toggles, etc.
- Run with `npm run cypress:open` or `npm run cypress:run`
- Custom Cypress plugin for browser extension testing

### Options/Configuration Contexts
Features are organized into these UI categories in the options page:
- `general` - Site-wide features
- `dashboard` - Dashboard/feed specific
- `activity` - Activity page features
- `training` - Training log enhancements
- `search` - Search page improvements
- `athlete` - Athlete profile features
- `upload` - Activity upload improvements
- `other` - Miscellaneous features

## Code Patterns & Conventions

### Accessing Strava's React Data
Main.js sometimes needs to access data from Strava's React components. This is done by:
1. Finding React root using Strava's internal patterns
2. Accessing React Fiber tree to get component props
3. Example: `segAndBestEffortAchievements`, `stats` from feed entry props

### DOM Selection Pattern
- Uses jQuery selectors: `$('[selector]')`
- Common Strava class patterns have comments explaining what they target
- Example: `#dashboard-feed` for the main feed container

### Feature Implementation Pattern
1. Add new option definition in `extension/pages/options.js`
2. Add feature check in `main.js`: `if (window.StravaEnhancementSuiteOptions[feature_name] && options[feature_name]) { ... }`
3. Implement feature logic (DOM manipulation, event listeners, etc.)
4. If testing dynamic content: use arrive.js observers
5. If needing notifications: use `StravaEnhancementSuiteHelpers.notify(message, type)`

### Important Globals
These are defined by the extension and available in all scripts:
- `window.StravaEnhancementSuiteOptions` - All feature definitions
- `window.StravaEnhancementSuiteOptionsContexts` - Option categories
- `window.__SES_OPTIONS__` - Currently enabled options (JSON)
- jQuery and `$` - Available for DOM manipulation
- `window.Notyf` - Notification library

## Development Notes

### CSP and Code Injection
Manifest V3 has strict Content Security Policy:
- External scripts must be from extension package
- Inline scripts only allowed in specific elements
- The `injectJs()` function handles this by creating `<script>` tags with appropriate src paths

### Local Development URL Parameters
For testing features without changing persistent storage:
- Use URL parameters like: `?__SES.opts.feature_name=true`
- These are automatically parsed and applied by content_script.js
- URL is then cleaned up to remove the params

### Version Management
- Version is automatically updated with `npm run update-version` to date format: `YY.M.D.HHmm`
- Manifest.json must match version schema

### Publishing
- `npm run release:cws` - Publishes to Chrome Web Store
- Uses `webstore-upload-cli` with OAuth credentials
- Only runs on `develop` branch in CI; uses `append-beta-to-name` to mark beta builds

## Linting & Code Style

ESLint rules:
- Uses ESLint recommended ruleset + unicorn plugin
- Single quotes required
- 2-space indentation
- Semicolons required
- No unused variable warnings (some edge cases in extension code)
- Key names prefer unquoted where possible
- jQuery and global options objects are whitelisted

Check `.eslintrc.js` for complete rules.
