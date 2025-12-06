import { useState } from 'react';
import { HandRow } from '@components/HandRow/HandRow';

export default {
	title: 'Components/HandRow',
	component: HandRow,
	tags: ['autodocs'],
	decorators: [
		Story => (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
					gap: '0.5rem 1rem',
					alignItems: 'start',
				}}
			>
				<Story />
			</div>
		),
	],
};

const HandRowWithState = args => {
	const [isEnabled, setIsEnabled] = useState(args.isEnabled);

	return (
		<HandRow
			{...args}
			isEnabled={isEnabled}
			onToggle={() => setIsEnabled(!isEnabled)}
		/>
	);
};

export const Enabled = {
	render: HandRowWithState,
	args: {
		name: 'Joscelyn',
		metadata: {
			title: 'Joscelyn typeface, drawn by Peter Baker',
			date: '2019',
			sourceUri: 'https://github.com/psb1558/Joscelyn-font/releases',
			difficulty: 'easy',
			majuscules: 26,
			minuscules: 26,
		},
		isEnabled: true,
	},
};

export const Disabled = {
	render: HandRowWithState,
	args: {
		name: 'NBacon',
		metadata: {
			title: 'Letter from the Privy Council to Nathaniel Bacon',
			date: '1594',
			sourceUri:
				'https://digitalcollections.folger.edu/bib244302-309435-xd502_27?language=en',
			difficulty: 'medium',
			majuscules: 1,
			minuscules: 21,
		},
		isEnabled: false,
	},
};

export const WithSlashDate = {
	render: HandRowWithState,
	args: {
		name: 'Hill',
		metadata: {
			title: 'Commonplace book of William Hill',
			date: '1574/5',
			sourceUri:
				'https://search.library.yale.edu/catalog/9970402713408651',
			difficulty: 'hard',
			majuscules: 20,
			minuscules: 49,
		},
		isEnabled: true,
	},
};

export const LongTitle = {
	render: HandRowWithState,
	args: {
		name: 'BeauChesne-Baildon',
		metadata: {
			title: '"The secretarie Alphabete" Jehan de Beau-Chesne & John Baildon, A booke containing diuers sortes of hands (London, 1602). First edition 1570.',
			date: '1570',
			sourceUri:
				'https://archive.org/details/bim_early-english-books-1475-1640_a-booke-containing-diuer_de-beau-chesne-john-a_1615',
			difficulty: 'hard',
			majuscules: 52,
			minuscules: 45,
		},
		isEnabled: false,
	},
};

export const MultipleRows = {
	render: () => {
		const hands = [
			{
				name: 'Joscelyn',
				metadata: {
					title: 'Joscelyn typeface, drawn by Peter Baker',
					date: '2019',
					sourceUri:
						'https://github.com/psb1558/Joscelyn-font/releases',
					difficulty: 'easy',
					majuscules: 26,
					minuscules: 26,
				},
				isEnabled: true,
			},
			{
				name: 'NBacon',
				metadata: {
					title: 'Letter from the Privy Council to Nathaniel Bacon',
					date: '1594',
					sourceUri:
						'https://digitalcollections.folger.edu/bib244302-309435-xd502_27?language=en',
					difficulty: 'medium',
					majuscules: 1,
					minuscules: 21,
				},
				isEnabled: false,
			},
			{
				name: 'Hill',
				metadata: {
					title: 'Commonplace book of William Hill',
					date: '1574/5',
					sourceUri:
						'https://search.library.yale.edu/catalog/9970402713408651',
					difficulty: 'hard',
					majuscules: 20,
					minuscules: 49,
				},
				isEnabled: true,
			},
		];

		const [enabledState, setEnabledState] = useState(
			Object.fromEntries(hands.map(h => [h.name, h.isEnabled]))
		);

		return (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
					gap: '0.5rem 1rem',
					alignItems: 'start',
				}}
			>
				{hands.map(hand => (
					<HandRow
						key={hand.name}
						name={hand.name}
						metadata={hand.metadata}
						isEnabled={enabledState[hand.name]}
						onToggle={() =>
							setEnabledState(prev => ({
								...prev,
								[hand.name]: !prev[hand.name],
							}))
						}
					/>
				))}
			</div>
		);
	},
};
