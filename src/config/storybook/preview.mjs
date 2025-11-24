import '../../style/index.css';
import '../../style/fonts.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
