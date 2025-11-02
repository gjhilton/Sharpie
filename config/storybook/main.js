/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
	stories: ['../../src/**/*.mdx', '../../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@chromatic-com/storybook',
		'@storybook/addon-docs',
		'@storybook/addon-onboarding',
		'@storybook/addon-a11y',
		'@storybook/addon-vitest',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	viteFinal: async (config) => {
		const viteConfig = await import('../vite.config.js');
		return {
			...config,
			plugins: [...(config.plugins || []), ...(viteConfig.default.plugins || [])],
		};
	},
};
export default config;
