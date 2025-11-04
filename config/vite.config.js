import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import favicons from '@peterek/vite-plugin-favicons';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
	base: '/Sharpie/',
	plugins: [
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
		favicons(resolve(__dirname, '../src/artwork/Branding/sharpieicon.svg')),
	],
	css: {
		postcss: resolve(__dirname, 'postcss.config.cjs'),
	},
});
