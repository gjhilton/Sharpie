import { css } from '../../../dist/styled-system/css';
import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
import CharacterImage from '@components/CharacterImage/CharacterImage.jsx';
import AlphabetSelectorWithSort from '@components/AlphabetSelectorWithSort/AlphabetSelectorWithSort.jsx';
import { LinkAsButton } from '@components/LinkAsButton/LinkAsButton.jsx';
import {
	PageTitle,
	Paragraph,
	Heading,
	PageWidth,
} from '@components/Layout/Layout.jsx';
import alphabetsData from '@data/alphabets.json';
import * as catalogueLogic from '@utilities/catalogueLogic.js';
import { useGameOptions } from '@lib/hooks/useGameOptions.js';
import { useDatabase } from '@context/DatabaseContext.jsx';

const STYLES = {
	verticalGap: '2rem',
	imageGap: '0.5rem',
	imageSize: '100%',
};

const GlyphImage = ({ graph, showBaseline, isEnabled, getImagePath }) => (
	<div
		className={css({
			width: STYLES.imageSize,
			height: STYLES.imageSize,
			background: '{colors.paper}',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			cborder: '1px solid {colors.ink/10}',
			opacity: isEnabled ? 1 : 0.2,
		})}
	>
		<CharacterImage
			imagePath={getImagePath(graph)}
			caption={graph.character}
			showBaseline={showBaseline}
		/>
	</div>
);

const LetterHeader = ({ letter }) => (
	<div
		className={css({
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'baseline',
			borderBottom: '2px solid black',
			marginBottom: '1rem',
		})}
	>
		<h3
			id={`char-${letter}`}
			className={css({
				fontSize: '24px',
				fontWeight: '900',
				margin: '0',

				desktop: {
					fontSize: '28px',
				},
			})}
		>
			{letter}
		</h3>
		<a href="#top" className={css({ fontSize: '0.75rem' })}>
			back to top
		</a>
	</div>
);

const LetterGallery = ({
	letter,
	glyphs,
	showBaseline,
	enabledAlphabets,
	getImagePath,
}) => (
	<article className={css({ marginBottom: STYLES.verticalGap })}>
		<LetterHeader letter={letter} />
		<div
			className={css({
				display: 'grid',
				gridTemplateColumns: 'repeat(6, 1fr)',
				gap: 0,
				padding: '0',
			})}
		>
			{glyphs.map((glyph, index) => (
				<GlyphImage
					key={index}
					graph={glyph}
					showBaseline={showBaseline}
					isEnabled={enabledAlphabets[glyph.source]}
					getImagePath={getImagePath}
				/>
			))}
		</div>
	</article>
);

const LetterCaseGroup = ({
	letters,
	showBaseline,
	enabledAlphabets,
	getImagePath,
}) => (
	<section
		className={css({
			gridColumn: '1 / -1',
			marginBottom: STYLES.verticalGap,
		})}
	>
		{letters.map(({ character, graphs }) => (
			<LetterGallery
				key={character}
				letter={character}
				glyphs={graphs}
				showBaseline={showBaseline}
				enabledAlphabets={enabledAlphabets}
				getImagePath={getImagePath}
			/>
		))}
	</section>
);

const LetterLink = ({ letter }) => (
	<a
		href={`#char-${letter}`}
		className={css({
			textDecoration: 'none',
			'&:hover': { textDecoration: 'underline' },
		})}
	>
		{letter}
	</a>
);

const LetterIndex = ({ label, letters }) => {
	if (letters.length === 0) return null;

	return (
		<div className={css({ marginBottom: '0.5rem' })}>
			<strong>{label}: </strong>
			{letters.map(({ character }, index) => (
				<span key={character}>
					<LetterLink letter={character} />
					{index < letters.length - 1 && ' '}
				</span>
			))}
		</div>
	);
};

const CharacterIndex = ({ letterGroups }) => {
	const minuscules =
		letterGroups.find(group => group.title === 'minuscules')?.characters || [];
	const majuscules =
		letterGroups.find(group => group.title === 'MAJUSCULES')?.characters || [];

	return (
		<div
			className={css({
				marginTop: STYLES.verticalGap,
				gridColumn: '1 / -1',
			})}
		>
			<PageTitle>Character Catalogue</PageTitle>
			<Heading>Jump to...</Heading>
			<LetterIndex label="minuscule" letters={minuscules} />
			<LetterIndex label="MAJUSCULE" letters={majuscules} />
		</div>
	);
};

const BackLink = ({ isDisabled, onReturnToMenu }) => {
	if (isDisabled) {
		return (
			<span
				className={css({
					color: '{colors.error}',
					cursor: 'not-allowed',
				})}
			>
				Not allowed! Select one or more alphabets to continue
			</span>
		);
	}

	return <LinkAsButton onClick={onReturnToMenu}>← Back to Menu</LinkAsButton>;
};

const SelectionStatus = ({ isError, alphabetCount, characterCount }) => {
	if (isError) {
		return (
			<Paragraph className={css({ color: '{colors.error}' })}>
				<strong>Error:</strong> Please select at least one alphabet.
			</Paragraph>
		);
	}

	return (
		<Paragraph>
			Enable the alphabets you'd like to work on from the list below. At present
			you have enabled <strong>{alphabetCount}</strong>{' '}
			{alphabetCount === 1 ? 'alphabet' : 'alphabets'} (
			<strong>{characterCount}</strong> characters).
		</Paragraph>
	);
};

const CatalogueScreen = () => {
	const navigate = useNavigate();
	const { options, updateOption } = useGameOptions();
	const {
		DB,
		getImagePath,
		getEnabledGraphSets,
		countEnabledAlphabets,
		countEnabledCharacters,
		getAllAlphabetNames,
	} = useDatabase();

	const { showBaseline = false, enabledAlphabets } = options;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleReturnToMenu = () => navigate({ to: '/', search: prev => prev });
	const handleShowFeedback = () => navigate({ to: '/feedback', search: prev => prev });

	const letterGroups = catalogueLogic.groupGraphsByGraphSetAndCharacter(
		getEnabledGraphSets(DB)
	);
	const alphabetCount = countEnabledAlphabets(enabledAlphabets);
	const characterCount = countEnabledCharacters(DB, enabledAlphabets);
	const hasNoSelection = alphabetCount === 0 || characterCount === 0;

	const handleToggleAlphabet = name => {
		const newEnabledAlphabets = {
			...enabledAlphabets,
			[name]: !enabledAlphabets[name],
		};
		updateOption('alphabets', newEnabledAlphabets);
	};

	const handleBatchToggleAlphabets = updates => {
		const newEnabledAlphabets = {
			...enabledAlphabets,
			...updates,
		};
		updateOption('alphabets', newEnabledAlphabets);
	};

	return (
		<PageWidth>
			<header id="top" className={css({ gridColumn: '1 / -1' })}>
				<div className={css({ marginBottom: STYLES.verticalGap })}>
					<BackLink
						isDisabled={hasNoSelection}
						onReturnToMenu={handleReturnToMenu}
					/>
				</div>

				<Heading
					className={css({
						lineHeight: '2rem',
						margin: `2rem 0 ${STYLES.verticalGap}`,
						fontSize: 'xl',
					})}
				>
					Choose Alphabets
				</Heading>

				<div className={css({ marginBottom: STYLES.verticalGap })}>
					<Paragraph>
						The alphabets Sharpie tests are extracted from a range of source
						documents. Expanding the time and stylistic coverage of the
						alphabets available for practice is the current top priority. Watch
						this space.
					</Paragraph>

					<SelectionStatus
						isError={hasNoSelection}
						alphabetCount={alphabetCount}
						characterCount={characterCount}
					/>

					<AlphabetSelectorWithSort
						enabledAlphabets={enabledAlphabets}
						alphabetNames={getAllAlphabetNames(DB)}
						alphabetsMetadata={alphabetsData}
						onToggle={handleToggleAlphabet}
						onBatchToggle={handleBatchToggleAlphabets}

					/>
				</div>
			</header>

			<CharacterIndex letterGroups={letterGroups} />

			{letterGroups.map(group => (
				<LetterCaseGroup
					key={group.title}
					letters={group.characters}
					showBaseline={showBaseline}
					enabledAlphabets={enabledAlphabets}
					getImagePath={getImagePath}
				/>
			))}

			<SmallPrint onShowFeedback={handleShowFeedback} />
		</PageWidth>
	);
};

export { CatalogueScreen };
export default CatalogueScreen;
