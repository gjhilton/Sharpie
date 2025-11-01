# Secretary Hand Typing Game

A React-based typing game for learning Secretary Hand letterforms.

## Development

### Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173/

### Run on LAN (accessible from other devices)

To access the app from other devices on your local network (phones, tablets, etc.):

```bash
npm run dev -- --host --port 8080
```

This will start the server on port 8080 and expose it to your local network. You'll see output like:

```
➜  Local:   http://localhost:8080/
➜  Network: http://192.168.1.xxx:8080/
```

Use the Network URL to access the app from other devices on your LAN.

### Build for Production

```bash
npm run build
```

### Other Commands

```bash
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run storybook     # Run Storybook
```

## Game Modes

- **Majuscule**: Uppercase letters (A-Z)
- **Minuscule**: Lowercase letters (a-z)
- **Extras**: Numbers and punctuation
- **All**: Everything combined
