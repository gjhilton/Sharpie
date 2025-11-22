/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
	stories: ['../../**/*.mdx', '../../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
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
		const { resolve, join } = await import('path');
		const root = process.cwd();

		return {
			...config,
			resolve: {
				...config.resolve,
				alias: {
					...config.resolve?.alias,
					'@': join(root, 'src'),
					'@components': join(root, 'src/components'),
					'@constants': join(root, 'src/constants'),
					'@data': join(root, 'src/data'),
					'@utilities': join(root, 'src/utilities'),
					'@style': join(root, 'src/style'),
					'@generated': join(root, 'dist/styled-system'),
				},
			},
		};
	},
};
export default config;
