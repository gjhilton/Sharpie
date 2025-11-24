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
	root: resolve(__dirname, '../html'),
	publicDir: resolve(__dirname, '../public'),
	plugins: [
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
		favicons(resolve(__dirname, '../public/sharpieicon.svg'), {
			path: '/Sharpie/',
		}),
	],
	css: {
		postcss: resolve(__dirname, 'postcss.config.cjs'),
	},
	server: {
		port: 5175,
		strictPort: true,
		fs: {
			allow: ['..'],
		},
	},
	build: {
		outDir: resolve(__dirname, '../../dist'),
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, '..'),
			'@components': resolve(__dirname, '../components'),
			'@constants': resolve(__dirname, '../constants'),
			'@data': resolve(__dirname, '../data'),
			'@utilities': resolve(__dirname, '../utilities'),
			'@style': resolve(__dirname, '../style'),
			'@lib': resolve(__dirname, '../lib'),
			'@generated': resolve(__dirname, '../../dist/styled-system'),
		},
	},
});
