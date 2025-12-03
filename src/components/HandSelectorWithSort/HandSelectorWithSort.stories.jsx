import { useState } from 'react';
import { HandSelectorWithSort } from '@components/HandSelectorWithSort/HandSelectorWithSort';

export default {
	title: 'Components/HandSelectorWithSort',
	component: HandSelectorWithSort,
	tags: ['autodocs'],
};

const mockHandsMetadata = {
	Joscelyn: {
		title: 'Joscelyn typeface, drawn by Peter Baker',
		date: '2019',
		sourceUri: 'https://github.com/psb1558/Joscelyn-font/releases',
		difficulty: 'easy',
		majuscules: 26,
		minuscules: 26,
	},
	NBacon: {
		title: 'Letter from the Privy Council to Nathaniel Bacon',
		date: '1594',
		sourceUri:
			'https://digitalcollections.folger.edu/bib244302-309435-xd502_27?language=en',
		difficulty: 'medium',
		majuscules: 1,
		minuscules: 21,
	},
	Howard: {
		title: 'Letter: Charles Howard, Lord Chamberlain',
		date: '1579/80',
		sourceUri: 'https://digitalcollections.folger.edu/bib193549-251897',
		difficulty: 'medium',
		majuscules: 7,
		minuscules: 31,
	},
	'BeauChesne-Baildon': {
		title: '"The secretarie Alphabete" Jehan de Beau-Chesne & John Baildon, A booke containing diuers sortes of hands (London, 1602). First edition 1570.',
		date: '1570',
		sourceUri:
			'https://archive.org/details/bim_early-english-books-1475-1640_a-booke-containing-diuer_de-beau-chesne-john-a_1615',
		difficulty: 'hard',
		majuscules: 52,
		minuscules: 45,
	},
	Hill: {
		title: 'Commonplace book of William Hill',
		date: '1574/5',
		sourceUri: 'https://search.library.yale.edu/catalog/9970402713408651',
		difficulty: 'hard',
		majuscules: 20,
		minuscules: 49,
	},
};

const HandSelectorWithState = args => {
	const handNames = Object.keys(mockHandsMetadata);
	const [enabledHands, setEnabledHands] = useState(
		Object.fromEntries(handNames.map(name => [name, true]))
	);

	const handleToggle = name => {
		setEnabledHands(prev => ({
			...prev,
			[name]: !prev[name],
		}));
	};

	return (
		<HandSelectorWithSort
			{...args}
			handNames={handNames}
			handsMetadata={mockHandsMetadata}
			enabledHands={enabledHands}
			onToggle={handleToggle}
		/>
	);
};

export const Default = {
	render: HandSelectorWithState,
	args: {},
};

export const WithMixedStates = {
	render: () => {
		const handNames = Object.keys(mockHandsMetadata);
		const [enabledHands, setEnabledHands] = useState({
			Joscelyn: true,
			NBacon: false,
			Howard: true,
			'BeauChesne-Baildon': false,
			Hill: true,
		});

		const handleToggle = name => {
			setEnabledHands(prev => ({
				...prev,
				[name]: !prev[name],
			}));
		};

		return (
			<HandSelectorWithSort
				handNames={handNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={enabledHands}
				onToggle={handleToggle}
			/>
		);
	},
};

export const Interactive = {
	render: HandSelectorWithState,
	args: {},
	parameters: {
		docs: {
			description: {
				story: 'Try changing the sort order and toggling hands to see the component in action.',
			},
		},
	},
};
