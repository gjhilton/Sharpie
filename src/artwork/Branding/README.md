# Branding Assets

This directory contains the Sharpie logo and related tools.

## Files

### sharpielogo-line.svg
The main logo file containing:
- Black text paths for "Sharpie"
- A red stroke path (class="red") that wraps around the text

## Path Measurement Tools

Two helper tools were created to measure the exact length of the red path for animation purposes:

### measure-path.html (in project root)
An HTML file that loads the SVG and calculates the path length using the browser's `getTotalLength()` API.

**Usage:**
```bash
open measure-path.html
```

The page displays the calculated path length both on screen and in the console.

### measure-path.js (in project root)
A Node.js script that programmatically calculates the path length using the `svg-path-properties` package.

**Usage:**
```bash
node measure-path.js
```

**Output:**
```
RED PATH LENGTH: 2849.780465261178
```

## Why Measure the Path?

The red path in the logo uses a "drawing" animation effect created with CSS:
- `stroke-dasharray` - Creates a dashed line pattern
- `stroke-dashoffset` - Offsets the dash pattern to hide/reveal it

For smooth animation, both values must be set to the exact path length. These tools calculate that precise length (2849.78 pixels) which is then used in the Logo component's animation CSS.

## Implementation

The measured path length is used in `/src/components/Logo.jsx`:

```javascript
'& .red': {
  strokeDasharray: '2849.780465261178',
  strokeDashoffset: '2849.780465261178',
  animation: 'dash 5s linear forwards',
}
```

This creates an effect where the red outline "draws itself" over 5 seconds when the logo appears.
