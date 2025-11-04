/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
	stories: ['../../src/**/*.mdx', '../../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
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
	// No viteFinal needed - let Storybook use its default React config
	// Don't import vite.config.js to avoid React Compiler conflicts
};
export default config;
