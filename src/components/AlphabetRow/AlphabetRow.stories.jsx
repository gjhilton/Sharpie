import { useState } from 'react';
import AlphabetRow from '@components/AlphabetRow/AlphabetRow.jsx';

export default {
	title: 'Components/AlphabetRow',
	component: AlphabetRow,
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

const AlphabetRowWithState = args => {
	const [isEnabled, setIsEnabled] = useState(args.isEnabled);

	return (
		<AlphabetRow
			{...args}
			isEnabled={isEnabled}
			onToggle={() => setIsEnabled(!isEnabled)}
		/>
	);
};

export const Enabled = {
	render: AlphabetRowWithState,
	args: {
		name: 'Joscelyn',
		metadata: {
			title: 'Joscelyn typeface, drawn by Peter Baker',
			date: '2019',
			sourceUri: 'https://github.com/psb1558/Joscelyn-font/releases',
			difficulty: 'easy',
		},
		isEnabled: true,
	},
};

export const Disabled = {
	render: AlphabetRowWithState,
	args: {
		name: 'NBacon',
		metadata: {
			title: 'Letter from the Privy Council to Nathaniel Bacon',
			date: '1594',
			sourceUri:
				'https://digitalcollections.folger.edu/bib244302-309435-xd502_27?language=en',
			difficulty: 'medium',
		},
		isEnabled: false,
	},
};

export const WithSlashDate = {
	render: AlphabetRowWithState,
	args: {
		name: 'Hill',
		metadata: {
			title: 'Commonplace book of William Hill',
			date: '1574/5',
			sourceUri:
				'https://search.library.yale.edu/catalog/9970402713408651',
			difficulty: 'hard',
		},
		isEnabled: true,
	},
};

export const LongTitle = {
	render: AlphabetRowWithState,
	args: {
		name: 'BeauChesne-Baildon',
		metadata: {
			title: '"The secretarie Alphabete" Jehan de Beau-Chesne & John Baildon, A booke containing diuers sortes of hands (London, 1602). First edition 1570.',
			date: '1570',
			sourceUri:
				'https://archive.org/details/bim_early-english-books-1475-1640_a-booke-containing-diuer_de-beau-chesne-john-a_1615',
			difficulty: 'hard',
		},
		isEnabled: false,
	},
};

export const MultipleRows = {
	render: () => {
		const alphabets = [
			{
				name: 'Joscelyn',
				metadata: {
					title: 'Joscelyn typeface, drawn by Peter Baker',
					date: '2019',
					sourceUri:
						'https://github.com/psb1558/Joscelyn-font/releases',
					difficulty: 'easy',
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
				},
				isEnabled: true,
			},
		];

		const [enabledState, setEnabledState] = useState(
			Object.fromEntries(alphabets.map(a => [a.name, a.isEnabled]))
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
				{alphabets.map(alphabet => (
					<AlphabetRow
						key={alphabet.name}
						name={alphabet.name}
						metadata={alphabet.metadata}
						isEnabled={enabledState[alphabet.name]}
						onToggle={() =>
							setEnabledState(prev => ({
								...prev,
								[alphabet.name]: !prev[alphabet.name],
							}))
						}
					/>
				))}
			</div>
		);
	},
};
