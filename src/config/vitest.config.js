import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(__dirname, '..'),
			'@components': resolve(__dirname, '../components'),
			'@constants': resolve(__dirname, '../constants'),
			'@data': resolve(__dirname, '../data'),
			'@utilities': resolve(__dirname, '../utilities'),
			'@style': resolve(__dirname, '../style'),
			'@generated': resolve(__dirname, '../../styled-system'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/config/vitest.setup.js'],
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/e2e/**',
			'**/.{idea,git,cache,output,temp}/**',
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			exclude: [
				'node_modules/**',
				'dist/**',
				'config/**',
				'styled-system/**',
				'storybook-static/**',
				'coverage/**',
				'**/*.config.js',
				'**/*.config.mjs',
				'src/scripts/**',
				'src/e2e/**',
				'src/artwork/**',
				'**/*.stories.jsx',
				'**/main.jsx',
			],
			thresholds: {
				lines: 60,
				functions: 60,
				branches: 60,
				statements: 60,
			},
		},
	},
});
