# Hands Selection Feature Implementation

## Date: 2025-11-16
## Branch: features-v1.1

## Summary
Implemented a major feature allowing users to configure which historical "hands" (handwriting sources) are included in the game. This affects both the character catalogue display and the gameplay.

## What Was Implemented

### 1. Landing Page - New "Hands" Section
- **Location**: `src/components/LandingSectionHands/LandingSectionHands.jsx` (new file)
- **Content**: `src/data/hands-section.md` (new file)
- Shows database statistics:
  - Total characters and hands in database
  - Currently enabled characters and hands (dynamically calculated)
- Contains hyperlink to catalogue screen for configuration

### 2. State Management in App.jsx
- Added `enabledHands` state object tracking which hands are enabled
- Initialized from `hands.json` using each hand's `isDefaultEnabled` property
- State is shared with:
  - LandingScreen (for stats display)
  - CatalogueScreen (for configuration)
  - GameScreen (for filtering gameplay)

### 3. Enhanced Catalogue Screen
- **File**: `src/components/CatalogueScreen/CatalogueScreen.jsx`
- **New features**:
  - "Configure Hands" section with Toggle switches for each hand
  - Hands listed in chronological order by date
  - Toggle labels show `[date] title` format
  - "Quick Navigation" section with anchor links to minuscule/MAJUSCULE characters
  - Characters from disabled hands display at 25% opacity
  - In-page navigation using anchor links (`#char-a`, `#char-B`, etc.)

### 4. Game Filtering
- **File**: `src/components/GameScreen/GameScreen.jsx`
- Now accepts `enabledHands` prop
- Passes enabledHands to `getGraphsForGameMode()`
- Only characters from enabled hands appear in gameplay

### 5. New Utility Functions
- **File**: `src/utilities/database.js`
- Added:
  - `filterGraphsByEnabledHands(graphs, enabledHands)` - filters graph array
  - `countTotalCharacters(db)` - counts all characters in database
  - `countEnabledCharacters(db, enabledHands)` - counts enabled characters
  - `getAllHandNames(db)` - returns all hand source keys
  - `countEnabledHands(enabledHands)` - counts true values
  - `sortHandsByDate(handNames, handsMetadata)` - sorts by date (handles "1574/5" format)

### 6. Updated Game Logic
- **File**: `src/utilities/gameLogic.js`
- `getGraphsForGameMode()` now accepts third parameter `enabledHands`
- Filters graphs when enabledHands is provided

### 7. Removed Legacy Catalogue Link
- Removed `onShowCatalogue` prop from `LandingSectionOptions`
- Catalogue access is now exclusively through the new Hands section

## Files Changed

### New Files
- `src/components/LandingSectionHands/LandingSectionHands.jsx`
- `src/data/hands-section.md`

### Modified Files
- `src/components/App/App.jsx` - Added enabledHands state management
- `src/components/LandingScreen/LandingScreen.jsx` - Added Hands section, passes enabledHands
- `src/components/LandingSectionOptions/LandingSectionOptions.jsx` - Removed catalogue link
- `src/components/CatalogueScreen/CatalogueScreen.jsx` - Complete rewrite with new features
- `src/components/GameScreen/GameScreen.jsx` - Added enabledHands filtering
- `src/utilities/database.js` - Added utility functions
- `src/utilities/gameLogic.js` - Updated getGraphsForGameMode

### Test Files Updated
- `src/components/CatalogueScreen/CatalogueScreen.test.jsx` - Added enabledHands props, new test sections
- `src/components/LandingSectionOptions/LandingSectionOptions.test.jsx` - Removed catalogue link tests
- `src/components/LandingScreen/LandingScreen.test.jsx` - Added enabledHands props, Hands section tests
- `src/components/GameScreen/GameScreen.test.jsx` - Updated for third parameter in getGraphsForGameMode

## Test Results
- All 594 tests passing
- CatalogueScreen: 38 tests (was 30)
- LandingSectionOptions: 10 tests (was 13)
- LandingScreen: 39 tests (was 35)
- GameScreen: 30 tests (all passing)

## Data Structures

### enabledHands State Object
```javascript
{
  'Howard': true,
  'Joscelyn': true,
  'BeauChesne-Baildon': true,
  'Hill': true
}
```

### hands.json Structure (existing)
```javascript
{
  "Howard": {
    "title": "Letter: Charles Howard, Lord Chamberlain",
    "sourceUri": "https://...",
    "date": "1579/80",
    "isDefaultEnabled": true
  }
}
```

## Key Implementation Details

1. **Opacity for disabled hands**: Characters from disabled hands show at 25% opacity in catalogue (`opacity: isDisabled ? '0.25' : '1'`)

2. **Date sorting**: Handles various date formats like "1579/80" by parsing first number

3. **Toggle labels**: Format is `[date] title` e.g., `[1570] "The secretarie Alphabete"...`

4. **In-page navigation**: Uses CSS-based scroll with anchor links to `#char-{character}` IDs

5. **State persistence**: enabledHands persists in App state until page reload (not localStorage)

## What's Left To Do

1. Consider adding localStorage persistence for enabledHands preferences
2. Add tests for LandingSectionHands component (not yet created)
3. Add tests for new database utility functions
4. E2E tests for the complete flow

## How to Resume

1. Run `npm run dev` to start development server
2. Run `npm run test:run` to verify all tests pass
3. Check `/Sharpie/` route to see landing page with new Hands section
4. Click "you can configure which hands" link to access catalogue with toggles
5. Toggle hands and verify:
   - Stats update on landing page
   - Disabled characters show at 25% opacity in catalogue
   - Only enabled hand characters appear in game
