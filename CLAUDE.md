# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application built with Vite, currently using the default React + Vite template. The project is named "Secretary" and appears to be in early development stages.

## Architecture

- **Frontend Framework**: React 19 with modern features
- **Build Tool**: Vite 7 with Hot Module Replacement (HMR)
- **Bundler**: Vite with React plugin and React Compiler enabled
- **Language**: JavaScript (ES modules)
- **Entry Point**: `src/main.js` renders the root `App` component
- **Main Component**: `src/App.js` contains the primary application logic

## Key Configuration

- **React Compiler**: Enabled via babel-plugin-react-compiler for optimization
- **ESLint**: Configured with React-specific rules and modern JavaScript standards
- **Module System**: ES modules with `"type": "module"` in package.json

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.js           # Main application component
├── main.js          # Application entry point
├── App.css          # App-specific styles
├── index.css        # Global styles
└── assets/          # Static assets (images, etc.)
```

## ESLint Configuration

- Uses modern ESLint flat config format
- Includes React Hooks and React Refresh plugins
- Custom rule: allows unused variables with uppercase naming pattern
- Ignores `dist` directory