import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
	stories: [
		'../../src/**/*.mdx',
		'../../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: [
		'@chromatic-com/storybook',
		'@storybook/addon-docs',
		'@storybook/addon-a11y',
		'@storybook/addon-vitest',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	staticDirs: ['../../public'],
	async viteFinal(config) {
		// Add path aliases without importing vite.config.js (to avoid React Compiler conflicts)
		return {
			...config,
			resolve: {
				...config.resolve,
				alias: {
					...config.resolve?.alias,
					'@': resolve(__dirname, '../../src'),
					'@components': resolve(__dirname, '../../src/components'),
					'@constants': resolve(__dirname, '../../src/constants'),
					'@data': resolve(__dirname, '../../src/data'),
					'@utilities': resolve(__dirname, '../../src/utilities'),
					'@style': resolve(__dirname, '../../src/style'),
				},
			},
		};
	},
};
export default config;
