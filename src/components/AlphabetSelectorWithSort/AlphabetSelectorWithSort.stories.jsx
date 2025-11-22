import { useState } from 'react';
import AlphabetSelectorWithSort from '@components/AlphabetSelectorWithSort/AlphabetSelectorWithSort.jsx';

export default {
	title: 'Components/AlphabetSelectorWithSort',
	component: AlphabetSelectorWithSort,
	tags: ['autodocs'],
};

const mockAlphabetsMetadata = {
	Joscelyn: {
		title: 'Joscelyn typeface, drawn by Peter Baker',
		date: '2019',
		sourceUri: 'https://github.com/psb1558/Joscelyn-font/releases',
		difficulty: 'easy',
	},
	NBacon: {
		title: 'Letter from the Privy Council to Nathaniel Bacon',
		date: '1594',
		sourceUri:
			'https://digitalcollections.folger.edu/bib244302-309435-xd502_27?language=en',
		difficulty: 'medium',
	},
	Howard: {
		title: 'Letter: Charles Howard, Lord Chamberlain',
		date: '1579/80',
		sourceUri: 'https://digitalcollections.folger.edu/bib193549-251897',
		difficulty: 'medium',
	},
	'BeauChesne-Baildon': {
		title: '"The secretarie Alphabete" Jehan de Beau-Chesne & John Baildon, A booke containing diuers sortes of hands (London, 1602). First edition 1570.',
		date: '1570',
		sourceUri:
			'https://archive.org/details/bim_early-english-books-1475-1640_a-booke-containing-diuer_de-beau-chesne-john-a_1615',
		difficulty: 'hard',
	},
	Hill: {
		title: 'Commonplace book of William Hill',
		date: '1574/5',
		sourceUri: 'https://search.library.yale.edu/catalog/9970402713408651',
		difficulty: 'hard',
	},
};

const AlphabetSelectorWithState = args => {
	const alphabetNames = Object.keys(mockAlphabetsMetadata);
	const [enabledAlphabets, setEnabledAlphabets] = useState(
		Object.fromEntries(alphabetNames.map(name => [name, true]))
	);

	const handleToggle = name => {
		setEnabledAlphabets(prev => ({
			...prev,
			[name]: !prev[name],
		}));
	};

	return (
		<AlphabetSelectorWithSort
			{...args}
			alphabetNames={alphabetNames}
			alphabetsMetadata={mockAlphabetsMetadata}
			enabledAlphabets={enabledAlphabets}
			onToggle={handleToggle}
		/>
	);
};

export const Default = {
	render: AlphabetSelectorWithState,
	args: {},
};

export const WithMixedStates = {
	render: () => {
		const alphabetNames = Object.keys(mockAlphabetsMetadata);
		const [enabledAlphabets, setEnabledAlphabets] = useState({
			Joscelyn: true,
			NBacon: false,
			Howard: true,
			'BeauChesne-Baildon': false,
			Hill: true,
		});

		const handleToggle = name => {
			setEnabledAlphabets(prev => ({
				...prev,
				[name]: !prev[name],
			}));
		};

		return (
			<AlphabetSelectorWithSort
				alphabetNames={alphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={enabledAlphabets}
				onToggle={handleToggle}
			/>
		);
	},
};

export const Interactive = {
	render: AlphabetSelectorWithState,
	args: {},
	parameters: {
		docs: {
			description: {
				story: 'Try changing the sort order and toggling alphabets to see the component in action.',
			},
		},
	},
};
