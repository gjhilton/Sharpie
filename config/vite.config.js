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
	resolve: {
		alias: {
			'@': resolve(__dirname, '../src'),
			'@components': resolve(__dirname, '../src/components'),
			'@constants': resolve(__dirname, '../src/constants'),
			'@data': resolve(__dirname, '../src/data'),
			'@utilities': resolve(__dirname, '../src/utilities'),
			'@style': resolve(__dirname, '../src/style'),
			'@generated': resolve(__dirname, '../styled-system'),
		},
	},
});
