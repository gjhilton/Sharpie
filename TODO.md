# Proposed improvements

## 🔥 URGENT
- [ ]	33. Fix Missing Source URI (Immediate)
- [ ]	Refactor sources section of update-db
- [ ]	Logo animation
- [ ]	Homepage redesign

## ✅ To do
- [ ]	1. E2E Testing with Playwright (High Impact)
- [ ]	2. Component Testing (Medium Impact)
- [ ]	3. Test Coverage Reporting (Low Effort, High Value)
- [ ]	4. Visual Regression Testing (Medium Impact)
- [ ]	5. Enhanced CI/CD Pipeline (High Impact)
- [ ]	9. Error Boundaries (Low Effort, High Value)
- [ ]	11. Context API for State (Optional - only if app grows)
- [ ]	12. Code Splitting & Lazy Loading (Medium Impact)
- [ ]	15. Service Worker / PWA (Medium Effort)
- [ ]	16. Automated Accessibility Testing (Medium Impact)
- [x]	18. Color Contrast Fixes (Low Effort)
- [ ]	30. Better Error Messages (Low Effort)
- [ ]	31. Development Tools (Low Effort)
- [ ]	32. Pre-commit Hooks (Low Effort)

## ⛔️ Won't do
- ~~6. Deployment Previews (Medium Impact)~~
- ~~7. Performance Budgets (Low Impact)~~
- ~~8. TypeScript Migration (High Effort, High Long-term Value)~~
- ~~10. Prop Validation (Low Effort)~~
- ~~13. Image Optimization (Medium Impact)~~
- ~~14. Memoization Strategy (Low Impact - only if needed)~~
- ~~17. Screen Reader Testing (High Impact)~~
- ~~19. Focus Management (Medium Effort)~~
- ~~20. Contributing Guide (Low Effort, High Value)~~
- ~~21. Component Documentation (Medium Effort)~~
- ~~22. Architecture Documentation (Low Effort)~~
- ~~23. API Documentation (Low Effort)~~
- ~~24. Progress Tracking (Medium Effort)~~
- ~~25. Difficulty Levels (Medium Effort)~~
- ~~26. Timed Challenge Mode (Low Effort)~~
- ~~27. Statistics Dashboard (Medium Effort)~~
- ~~28. User Preferences (Low Effort)~~
- ~~29. Spaced Repetition (High Effort, High Educational Value)~~

### Testing & Quality Assurance

####  1. E2E Testing with Playwright (High Impact)

  You already have Playwright installed but not configured. This would be valuable for:
  - Testing complete user flows (select mode → play game → view score)
  - Catching integration bugs between components
  - Validating accessibility in real browsers
  - Regression testing before deployment

####  2. Component Testing (Medium Impact)

  Add Vitest + React Testing Library for:
  - Testing individual components in isolation
  - Testing user interactions (button clicks, keyboard input)
  - Testing conditional rendering
  - Snapshot testing for visual regression

####  3. Test Coverage Reporting (Low Effort, High Value)

  - Enable coverage reporting in vitest.config.js
  - Add coverage thresholds to CI/CD
  - Generate HTML coverage reports
  - Badge in README showing coverage %

####  4. Visual Regression Testing (Medium Impact)

  - Add Storybook test runner
  - Integrate Chromatic or Percy for visual diffs
  - Catch unintended UI changes

### DevOps & CI/CD

####  5. Enhanced CI/CD Pipeline (High Impact)

  Current pipeline only builds. Should add:
  - Run unit tests (npm run test:run)
  - Run E2E tests
  - Run linter (npm run lint)
  - Check test coverage thresholds
  - Fail build if tests fail

####  6. Deployment Previews (Medium Impact)

  - Deploy PR branches to temporary URLs
  - Review changes before merging
  - Share work-in-progress with stakeholders

####  7. Performance Budgets (Low Impact)

  - Add bundle size monitoring
  - Fail builds if bundle exceeds threshold
  - Track performance metrics over time

### Architecture & Code Quality

####  8. TypeScript Migration (High Effort, High Long-term Value)

  - Add type safety
  - Better IDE autocomplete
  - Catch errors at compile time
  - Could start incrementally with .ts files

####  9. Error Boundaries (Low Effort, High Value)

  - Add React Error Boundaries around major sections
  - Graceful error handling
  - User-friendly error messages
  - Error reporting/logging

####  10. Prop Validation (Low Effort)

  - Add PropTypes or TypeScript
  - JSDoc comments on components
  - Better developer experience
  - Catch prop errors early

####  11. Context API for State (Optional - only if app grows)

  - Currently prop-drilling is fine for this app size
  - If you add more features, Context could help
  - Theme context, user preferences, etc.

### Performance Optimization

####  12. Code Splitting & Lazy Loading (Medium Impact)

  const CatalogueScreen = lazy(() => import('./CatalogueScreen'))
  const FeedbackScreen = lazy(() => import('./FeedbackScreen'))
  - Smaller initial bundle
  - Faster time to interactive
  - Load screens on demand

####  13. Image Optimization (Medium Impact)

  - Generate multiple sizes of character images
  - Use modern formats (WebP, AVIF)
  - Lazy load images below the fold
  - Add loading states

####  14. Memoization Strategy (Low Impact - only if needed)

  - Add React.memo to expensive components
  - useMemo for expensive calculations
  - useCallback for event handlers passed to children

####  15. Service Worker / PWA (Medium Effort)

  - Offline support
  - Install as app
  - Cache character images
  - Faster repeat visits

### Accessibility Improvements

####  16. Automated Accessibility Testing (Medium Impact)

  - Add axe-core to E2E tests
  - Run a11y checks in CI/CD
  - Add lighthouse CI
  - Catch accessibility regressions

####  17. Screen Reader Testing (High Impact)

  - Test with NVDA, JAWS, VoiceOver
  - Ensure game is fully playable
  - Add better ARIA live regions
  - Document keyboard shortcuts

####  18. Color Contrast Fixes (Low Effort)

  - Audit all text/background combinations
  - Ensure WCAG AA compliance
  - Test in high contrast mode

####  19. Focus Management (Medium Effort)

  - Better focus indicators
  - Focus trap in modals
  - Return focus after actions
  - Skip links for navigation

### Documentation

####  20. Contributing Guide (Low Effort, High Value)

  - CONTRIBUTING.md with setup instructions
  - Code style guide
  - How to add new characters
  - Pull request process

####  21. Component Documentation (Medium Effort)

  - JSDoc comments on all components
  - Document all props
  - Usage examples
  - Better Storybook documentation

####  22. Architecture Documentation (Low Effort)

  - Document data flow
  - Explain state management decisions
  - Component hierarchy diagram
  - Decision records (ADRs)

####  23. API Documentation (Low Effort)

  - Document all utility functions
  - Explain database structure
  - Game logic flow diagrams

### User-Facing Features

####  24. Progress Tracking (Medium Effort)

  - LocalStorage to save game history
  - Track accuracy over time
  - Show improvement graphs
  - Most difficult letters identified

####  25. Difficulty Levels (Medium Effort)

  - Beginner: Common letters only
  - Intermediate: All letters
  - Advanced: Timed mode or similar-looking letters

####  26. Timed Challenge Mode (Low Effort)

  - Answer as many as possible in 60 seconds
  - Leaderboard (local)
  - Speed vs accuracy trade-off

####  27. Statistics Dashboard (Medium Effort)

  - Overall accuracy by letter
  - Total games played
  - Streak tracking
  - Personal best scores

####  28. User Preferences (Low Effort)

  - Dark mode
  - Sound effects toggle
  - Keyboard layout preference
  - Font size adjustments

####  29. Spaced Repetition (High Effort, High Educational Value)

  - Show letters you struggle with more often
  - Adaptive learning algorithm
  - Track mastery level per letter

### Developer Experience

####  30. Better Error Messages (Low Effort)

  - Clear error boundaries
  - Development-mode warnings
  - Helpful console messages

####  31. Development Tools (Low Effort)

  - Add React DevTools tips to README
  - Debug mode with extra logging
  - Storybook addons for state management

####  32. Pre-commit Hooks (Low Effort)

  - Add husky + lint-staged
  - Run linter before commit
  - Run tests before push
  - Format code automatically

### Bug Fixes

####  33. Fix Missing Source URI (Immediate)

  There's a TODO in update-db.js:
  sourceUri: 'https://example.com/beaucheche-baildon', // TODO: Add correct URI



