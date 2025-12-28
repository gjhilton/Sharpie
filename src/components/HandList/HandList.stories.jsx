import { useState } from 'react';
import { HandList } from '@components/HandList/HandList';

export default {
	title: 'Components/HandList',
	component: HandList,
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

const HandListWithState = args => {
	const handNames = args.hands || Object.keys(mockHandsMetadata);
	const [enabledHands, setEnabledHands] = useState(
		args.enabledHands ||
			Object.fromEntries(handNames.map(name => [name, true]))
	);

	const handleToggle = name => {
		setEnabledHands(prev => ({
			...prev,
			[name]: !prev[name],
		}));
	};

	return (
		<HandList
			{...args}
			handsMetadata={mockHandsMetadata}
			enabledHands={enabledHands}
			onToggle={handleToggle}
		/>
	);
};

export const FlatListByDate = {
	render: HandListWithState,
	args: {
		hands: ['BeauChesne-Baildon', 'Hill', 'Howard', 'NBacon', 'Joscelyn'],
		showDifficultyGroups: false,
	},
};

export const FlatListByName = {
	render: HandListWithState,
	args: {
		hands: ['BeauChesne-Baildon', 'Hill', 'Howard', 'Joscelyn', 'NBacon'],
		showDifficultyGroups: false,
	},
};

export const GroupedByDifficulty = {
	render: HandListWithState,
	args: {
		hands: [],
		showDifficultyGroups: true,
		difficultyGroups: {
			easy: ['Joscelyn'],
			medium: ['Howard', 'NBacon'],
			hard: ['BeauChesne-Baildon', 'Hill'],
		},
	},
};

export const MixedEnabledDisabled = {
	render: HandListWithState,
	args: {
		hands: ['BeauChesne-Baildon', 'Hill', 'Howard', 'NBacon', 'Joscelyn'],
		enabledHands: {
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
	render: HandListWithState,
	args: {
		hands: [],
		showDifficultyGroups: true,
		difficultyGroups: {
			easy: ['Joscelyn'],
			medium: [],
			hard: [],
		},
	},
};

export const EmptyList = {
	render: HandListWithState,
	args: {
		hands: [],
		showDifficultyGroups: false,
	},
};
