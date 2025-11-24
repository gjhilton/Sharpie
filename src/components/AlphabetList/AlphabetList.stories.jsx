import { useState } from 'react';
import AlphabetList from '@components/AlphabetList/AlphabetList.jsx';

export default {
	title: 'Components/AlphabetList',
	component: AlphabetList,
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

const AlphabetListWithState = args => {
	const alphabetNames = args.alphabets || Object.keys(mockAlphabetsMetadata);
	const [enabledAlphabets, setEnabledAlphabets] = useState(
		args.enabledAlphabets ||
			Object.fromEntries(alphabetNames.map(name => [name, true]))
	);

	const handleToggle = name => {
		setEnabledAlphabets(prev => ({
			...prev,
			[name]: !prev[name],
		}));
	};

	return (
		<AlphabetList
			{...args}
			alphabetsMetadata={mockAlphabetsMetadata}
			enabledAlphabets={enabledAlphabets}
			onToggle={handleToggle}
		/>
	);
};

export const FlatListByDate = {
	render: AlphabetListWithState,
	args: {
		alphabets: [
			'BeauChesne-Baildon',
			'Hill',
			'Howard',
			'NBacon',
			'Joscelyn',
		],
		showDifficultyGroups: false,
	},
};

export const FlatListByName = {
	render: AlphabetListWithState,
	args: {
		alphabets: [
			'BeauChesne-Baildon',
			'Hill',
			'Howard',
			'Joscelyn',
			'NBacon',
		],
		showDifficultyGroups: false,
	},
};

export const GroupedByDifficulty = {
	render: AlphabetListWithState,
	args: {
		alphabets: [],
		showDifficultyGroups: true,
		difficultyGroups: {
			easy: ['Joscelyn'],
			medium: ['Howard', 'NBacon'],
			hard: ['BeauChesne-Baildon', 'Hill'],
		},
	},
};

export const MixedEnabledDisabled = {
	render: AlphabetListWithState,
	args: {
		alphabets: [
			'BeauChesne-Baildon',
			'Hill',
			'Howard',
			'NBacon',
			'Joscelyn',
		],
		enabledAlphabets: {
			Joscelyn: true,
			NBacon: false,
			Howard: true,
			'BeauChesne-Baildon': false,
			Hill: true,
		},
		showDifficultyGroups: false,
	},
};

export const OnlyEasyDifficulty = {
	render: AlphabetListWithState,
	args: {
		alphabets: [],
		showDifficultyGroups: true,
		difficultyGroups: {
			easy: ['Joscelyn'],
			medium: [],
			hard: [],
		},
	},
};

export const EmptyList = {
	render: AlphabetListWithState,
	args: {
		alphabets: [],
		showDifficultyGroups: false,
	},
};
