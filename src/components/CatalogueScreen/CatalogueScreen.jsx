import { css } from '@generated/css';
import React, { useEffect } from 'react';
import Toggle from '@components/Toggle/Toggle.jsx';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
import CharacterImage from '@components/CharacterImage/CharacterImage.jsx';
import { PageTitle, Paragraph, Heading, PageWidth } from '@components/Layout/Layout.jsx';
import { DB } from '@data/DB.js';
import alphabetsData from '@data/alphabets.json';
import * as db from '@utilities/database.js';
import * as catalogueLogic from '@utilities/catalogueLogic.js';

const STYLES = {
	verticalGap: '2rem',
	imageGap: '0.5rem',
	imageSize: '120px',
};

const GlyphImage = ({ graph, showBaseline, isEnabled }) => (
	<div
		className={css({
			width: STYLES.imageSize,
			height: STYLES.imageSize,
			background: '{colors.paper}',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			border: '1px solid {colors.ink/10}',
		})}
		style={{ opacity: isEnabled ? 1 : 0.2 }}
	>
		<CharacterImage
			imagePath={db.getImagePath(graph)}
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
			marginBottom: '0.5rem',
		})}
	>
		<h3
			id={`char-${letter}`}
			className={css({
				fontSize: '24px',
				fontWeight: '900',
				margin: '0',
				desktop: {
					fontSize: '36px',
					marginLeft: '-1rem',
				},
			})}
		>
			{letter}
		</h3>
		<a href="#top" style={{ fontSize: '0.75rem' }}>
			back to top
		</a>
	</div>
);

const LetterGallery = ({ letter, glyphs, showBaseline, enabledAlphabets }) => (
	<article className={css({ marginBottom: STYLES.verticalGap })}>
		<LetterHeader letter={letter} />
		<div
			className={css({
				display: 'grid',
				gridTemplateColumns: 'repeat(4, 1fr)',
				gap: STYLES.imageGap,
				padding: '0',
				desktop: {
					padding: '0 4rem',
				},
			})}
		>
			{glyphs.map((glyph, index) => (
				<GlyphImage
					key={index}
					graph={glyph}
					showBaseline={showBaseline}
					isEnabled={enabledAlphabets[glyph.source]}
				/>
			))}
		</div>
	</article>
);

const LetterCaseGroup = ({ letters, showBaseline, enabledAlphabets }) => (
	<section className={css({ gridColumn: '1 / -1', marginBottom: STYLES.verticalGap })}>
		{letters.map(({ character, graphs }) => (
			<LetterGallery
				key={character}
				letter={character}
				glyphs={graphs}
				showBaseline={showBaseline}
				enabledAlphabets={enabledAlphabets}
			/>
		))}
	</section>
);

const AlphabetRow = ({ name, metadata, isEnabled, onToggle }) => (
	<React.Fragment>
		<Toggle id={`alphabet-${name}`} checked={isEnabled} onChange={onToggle} />
		<span className={css({ fontWeight: '900' })}>{metadata.date}</span>
		<span>{metadata.title}</span>
		<a href={metadata.sourceUri} target="_blank" rel="noopener noreferrer">
			source
		</a>
	</React.Fragment>
);

const AlphabetSelector = ({ enabledAlphabets, onToggle }) => {
	const sortedNames = db.sortAlphabetsByDate(db.getAllAlphabetNames(DB), alphabetsData);

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'auto 1fr auto auto',
				gap: '0.5rem 1rem',
				alignItems: 'start',
				marginTop: '2rem',
			}}
		>
			{sortedNames.map(name => (
				<AlphabetRow
					key={name}
					name={name}
					metadata={alphabetsData[name]}
					isEnabled={enabledAlphabets[name] || false}
					onToggle={() => onToggle(name)}
				/>
			))}
		</div>
	);
};

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
	const minuscules = letterGroups.find(group => group.title === 'minuscules')?.characters || [];
	const majuscules = letterGroups.find(group => group.title === 'MAJUSCULES')?.characters || [];

	return (
		<div className={css({ marginTop: STYLES.verticalGap, gridColumn: '1 / -1' })}>
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
			<span className={css({ color: '{colors.error}', cursor: 'not-allowed' })}>
				Not allowed! Select one or more alphabets to continue
			</span>
		);
	}

	return (
		<a
			href="#"
			onClick={e => {
				e.preventDefault();
				onReturnToMenu();
			}}
		>
			← Back to Menu
		</a>
	);
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
			You can choose the alphabets you'd like to work on by selecting from the list below. At
			present you have enabled <strong>{alphabetCount}</strong> alphabets (
			<strong>{characterCount}</strong> characters).
		</Paragraph>
	);
};

const CatalogueScreen = ({
	onReturnToMenu,
	onShowFeedback,
	showBaseline = false,
	enabledAlphabets,
	setEnabledAlphabets,
}) => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const letterGroups = catalogueLogic.groupGraphsByGraphSetAndCharacter(
		db.getEnabledGraphSets(DB)
	);
	const alphabetCount = db.countEnabledAlphabets(enabledAlphabets);
	const characterCount = db.countEnabledCharacters(DB, enabledAlphabets);
	const hasNoSelection = alphabetCount === 0 || characterCount === 0;

	const handleToggleAlphabet = name => {
		setEnabledAlphabets(prev => ({
			...prev,
			[name]: !prev[name],
		}));
	};

	return (
		<PageWidth>
			<header id="top" className={css({ gridColumn: '1 / -1' })}>
				<div className={css({ marginBottom: STYLES.verticalGap })}>
					<BackLink isDisabled={hasNoSelection} onReturnToMenu={onReturnToMenu} />
				</div>

				<PageTitle style={{ lineHeight: '2rem', margin: `2rem 0 ${STYLES.verticalGap}` }}>
					Choose Alphabets
				</PageTitle>

				<div className={css({ marginBottom: STYLES.verticalGap })}>
					<Paragraph>
						The alphabets Sharpie tests are extracted from a range of source documents.
						Expanding the time and stylistic coverage of the alphabets available for
						practice is the current top priority. Watch this space.
					</Paragraph>

					<SelectionStatus
						isError={hasNoSelection}
						alphabetCount={alphabetCount}
						characterCount={characterCount}
					/>

					<AlphabetSelector
						enabledAlphabets={enabledAlphabets}
						onToggle={handleToggleAlphabet}
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
				/>
			))}

			<SmallPrint onShowFeedback={onShowFeedback} />
		</PageWidth>
	);
};

export default CatalogueScreen;
