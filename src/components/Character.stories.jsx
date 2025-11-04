import Character from './Character';

export default {
	title: 'Components/Character',
	component: Character,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		state: {
			control: 'select',
			options: ['awaitAnswer', 'correctAnswer', 'incorrectAnswer'],
			description: 'The state of the character component',
		},
		imagePath: {
			control: 'text',
			description: 'Path to a single image',
		},
		imagePaths: {
			control: 'object',
			description: 'Array of image paths for slideshow',
		},
		character: {
			control: 'text',
			description: 'The character being displayed',
		},
		sourceLink: {
			control: 'text',
			description: 'Link to the image source',
		},
		sourceTitle: {
			control: 'text',
			description: 'Title of the image source',
		},
	},
};

export const AwaitAnswer = {
	args: {
		state: 'awaitAnswer',
		imagePath: '/data/joscelyn-min/a.png',
	},
};

export const CorrectAnswer = {
	args: {
		state: 'correctAnswer',
		imagePath: '/data/joscelyn-min/a.png',
		character: 'a',
		sourceLink: 'https://github.com/psb1558/Joscelyn-font/releases',
		sourceTitle: 'Joscelyn typeface, drawn by Peter Baker (2019)',
	},
};

export const IncorrectAnswer = {
	args: {
		state: 'incorrectAnswer',
		imagePaths: [
			'/data/joscelyn-min/b.png',
			'/data/joscelyn-min/b2.png',
			'/data/joscelyn-min/b3.png',
		],
		character: 'b',
	},
};

export const AllStates = {
	render: () => (
		<div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
			<div style={{ flex: '1 1 300px', minWidth: '300px' }}>
				<h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Await Answer</h3>
				<Character
					state="awaitAnswer"
					imagePath="/data/Joscelyn/joscelyn-min-assets/a.png"
				/>
			</div>
			<div style={{ flex: '1 1 300px', minWidth: '300px' }}>
				<h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Correct Answer</h3>
				<Character
					state="correctAnswer"
					imagePath="/data/Joscelyn/joscelyn-min-assets/a.png"
					character="a"
					sourceLink="https://github.com/psb1558/Joscelyn-font/releases"
					sourceTitle="Joscelyn typeface, drawn by Peter Baker (2019)"
				/>
			</div>
			<div style={{ flex: '1 1 300px', minWidth: '300px' }}>
				<h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Incorrect Answer</h3>
				<Character
					state="incorrectAnswer"
					imagePaths={[
						'/data/Joscelyn/joscelyn-min-assets/b.png',
						'/data/BeauChesne-Baildon/BCB-AB-assets/b3.png',
						'/data/BeauChesne-Baildon/BCB-AB-assets/b4.png',
					]}
					character="b"
				/>
			</div>
		</div>
	),
	parameters: {
		layout: 'fullscreen',
	},
};
