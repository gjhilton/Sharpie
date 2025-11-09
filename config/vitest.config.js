import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
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
