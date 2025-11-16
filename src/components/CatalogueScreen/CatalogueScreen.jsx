import { css } from '@generated/css';
import React, { useState, useEffect, useRef } from 'react';
import Button from '@components/Button/Button.jsx';
import Toggle from '@components/Toggle/Toggle.jsx';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
import CharacterImage from '@components/CharacterImage/CharacterImage.jsx';
import { PageTitle, Section, Paragraph, Heading } from '@components/Layout/Layout.jsx';
import { PageWidth } from '@components/Layout/Layout.jsx';
import { DB } from '@data/DB.js';
import alphabetsData from '@data/alphabets.json';
import * as db from '@utilities/database.js';
import * as catalogueLogic from '@utilities/catalogueLogic.js';

const SPACING = {
	SECTION_GAP: '2rem',
	GRAPHSET_GAP: '3rem',
	CHARACTER_GAP: '1.5rem',
	IMAGE_GAP: '0.5rem',
};

const IMAGE_SIZE = '120px';

const Popover = ({ children, content, isVisible }) => (
	<div className={css({ position: 'relative', display: 'inline-block' })}>
		{children}
		{isVisible && (
			<div
				className={css({
					position: 'absolute',
					bottom: '100%',
					left: '50%',
					transform: 'translateX(-50%)',
					marginBottom: '0.5rem',
					padding: '0.5rem 0.75rem',
					background: '{colors.popover}',
					color: '{colors.paper}',
					borderRadius: '4px',
					fontSize: '0.875rem',
					whiteSpace: 'nowrap',
					zIndex: 10,
					boxShadow: '0 2px 8px {colors.ink/20}',
					'&::after': {
						content: '""',
						position: 'absolute',
						top: '100%',
						left: '50%',
						transform: 'translateX(-50%)',
						borderWidth: '6px',
						borderStyle: 'solid',
						borderColor: '{colors.popover} transparent transparent transparent',
					},
				})}
			>
				{content}
			</div>
		)}
	</div>
);

const ImageWithInfo = ({ character, graph, showBaseline, isDisabled }) => {
	const imagePath = db.getImagePath(graph);

	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				position: 'relative',
			})}
		>
			<div
				className={css({
					width: IMAGE_SIZE,
					height: IMAGE_SIZE,
					background: '{colors.paper}',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0',
					border: '1px solid {colors.ink/10}',
				})}
				style={{ opacity: isDisabled ? 0.2 : 1 }}
			>
				<CharacterImage
					imagePath={imagePath}
					caption={character}
					showBaseline={showBaseline}
				/>
			</div>
		</div>
	);
};

const CharacterImages = ({
	character,
	graphs,
	showBaseline,
	enabledAlphabets,
}) => (
	<article
		className={css({
			marginBottom: SPACING.CHARACTER_GAP,
		})}
	>
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'baseline',
				margin: '0 0 0.5rem 0',
			}}
		>
			<h3
				id={`char-${character}`}
				style={{
					fontSize: '36px',
					fontWeight: '900',
					margin: '0 0 0 -1rem',
				}}
			>
				{character}
			</h3>
			<a
				href="#top"
				style={{
					fontSize: '0.75rem',
				}}
			>
				back to top
			</a>
		</div>
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(4, 1fr)',
				gap: SPACING.IMAGE_GAP,
				padding: '0 4rem',
			}}
		>
			{graphs.map((graph, idx) => (
				<ImageWithInfo
					key={idx}
					character={character}
					graph={graph}
					showBaseline={showBaseline}
					isDisabled={!enabledAlphabets[graph.source]}
				/>
			))}
		</div>
	</article>
);

const GraphSetSection = ({
	title,
	characters,
	showBaseline,
	enabledAlphabets,
}) => (
	<section
		id={`section-${title}`}
		className={css({
			gridColumn: '1 / -1',
			marginBottom: SPACING.GRAPHSET_GAP,
		})}
	>
		{characters.map(({ character, graphs }) => (
			<CharacterImages
				key={character}
				character={character}
				graphs={graphs}
				showBaseline={showBaseline}
				enabledAlphabets={enabledAlphabets}
			/>
		))}
	</section>
);

const AlphabetsConfiguration = ({ enabledAlphabets, setEnabledAlphabets }) => {
	const alphabetNames = db.getAllAlphabetNames(DB);
	const sortedAlphabetNames = db.sortAlphabetsByDate(alphabetNames, alphabetsData);

	const handleToggleAlphabet = alphabetName => {
		setEnabledAlphabets(prev => ({
			...prev,
			[alphabetName]: !prev[alphabetName],
		}));
	};

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'auto 1fr auto auto',
				gap: '0.5rem 1rem',
				alignItems: 'start',
			}}
		>
			{sortedAlphabetNames.map(alphabetName => {
				const alphabet = alphabetsData[alphabetName];
				return (
					<React.Fragment key={alphabetName}>
							<Toggle
							id={`alphabet-${alphabetName}`}
							checked={enabledAlphabets[alphabetName] || false}
							onChange={() => handleToggleAlphabet(alphabetName)}
						/>
						<span className={css({ alignSelf: 'start', fontWeight: '900' })}>
							{alphabet.date}
						</span>
						<span className={css({ alignSelf: 'start' })}>
							{alphabet.title}
						</span>
						<a
							href={alphabet.sourceUri}
							target="_blank"
							rel="noopener noreferrer"
							className={css({ alignSelf: 'start' })}
						>
							source
						</a>

					</React.Fragment>
				);
			})}
		</div>
	);
};

const InPageNavigation = ({ catalogueData }) => {
	const minusculeChars =
		catalogueData.find(gs => gs.title === 'minuscules')?.characters || [];
	const majusculeChars =
		catalogueData.find(gs => gs.title === 'MAJUSCULES')?.characters || [];

	return (
		<div
	
		>
			<Heading>
				Jump to...
			</Heading>
			{minusculeChars.length > 0 && (
				<div className={css({ marginBottom: '1rem' })}>
					<strong>minuscule: </strong>
					{minusculeChars.map(({ character }, idx) => (
						<span key={character}>
							<a
								href={`#char-${character}`}
								className={css({
									textDecoration: 'none',
									'&:hover': {
										textDecoration: 'underline',
									},
								})}
							>
								{character}
							</a>
							{idx < minusculeChars.length - 1 && ' '}
						</span>
					))}
				</div>
			)}
			{majusculeChars.length > 0 && (
				<div>
					<strong>MAJUSCULE: </strong>
					{majusculeChars.map(({ character }, idx) => (
						<span key={character}>
							<a
								href={`#char-${character}`}
								className={css({
									textDecoration: 'none',
									'&:hover': {
										textDecoration: 'underline',
									},
								})}
							>
								{character}
							</a>
							{idx < majusculeChars.length - 1 && ' '}
						</span>
					))}
				</div>
			)}
		</div>
	);
};

const CatalogueScreen = ({
	onReturnToMenu,
	onShowFeedback,
	showBaseline = false,
	enabledAlphabets,
	setEnabledAlphabets,
}) => {
	const enabledGraphSets = db.getEnabledGraphSets(DB);
	const catalogueData =
		catalogueLogic.groupGraphsByGraphSetAndCharacter(enabledGraphSets);
	const enabledAlphabetsCount = db.countEnabledAlphabets(enabledAlphabets);
	const enabledCharactersCount = db.countEnabledCharacters(DB, enabledAlphabets);
	const hasNoAlphabetsSelected = enabledAlphabetsCount === 0 || enabledCharactersCount === 0;

	return (

<PageWidth>
	<header id="top" className={css({ gridColumn: '1 / -1' })}>
			<div >
				{hasNoAlphabetsSelected ? (
					<span className={css({ color: '{colors.error}', cursor: 'not-allowed' })}>
						Not allowed! Select one or more alphabets to continue
					</span>
				) : (
					<a
						href="#"
						onClick={e => {
							e.preventDefault();
							onReturnToMenu();
						}}
					>
						← Back to Menu
					</a>
				)}
			</div>

<PageTitle style={{ lineHeight: '2rem', margin: '2rem 0 2rem' }}>
    Character Catalogue
  </PageTitle>

<Heading>Practice alphabets</Heading>
<Paragraph>The alphabets Sharpie tests are extracted from a range of source documents. Expanding the time and stylistic coverage of the alphabets available for practice is the current top priority. Watch this space.</Paragraph>
{hasNoAlphabetsSelected ? (
	<Paragraph className={css({ color: '{colors.error}' })}>
		<strong>Error:</strong> Please select at least one alphabet.
	</Paragraph>
) : (
	<Paragraph>You can choose the alphabets you'd like to work on by selecting from the list below. At present you have enabled <strong>{enabledAlphabetsCount}</strong> alphabets (<strong>{enabledCharactersCount}</strong> characters).</Paragraph>
)}
	<AlphabetsConfiguration
				enabledAlphabets={enabledAlphabets}
				setEnabledAlphabets={setEnabledAlphabets}
			/>

<InPageNavigation catalogueData={catalogueData} />

			</header>

			{catalogueData.map(graphSet => (
				<GraphSetSection
					key={graphSet.title}
					title={graphSet.title}
					characters={graphSet.characters}
					showBaseline={showBaseline}
					enabledAlphabets={enabledAlphabets}
				/>
			))}

			<SmallPrint onShowFeedback={onShowFeedback} />

	</PageWidth>
	
	);
};

export default CatalogueScreen;

	/*
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				gap: SPACING.SECTION_GAP,
				padding: SPACING.SECTION_GAP,
				maxWidth: '1200px',
				margin: '0 auto',
			})}
		>
			<PageTitle>Character Catalogue</PageTitle>

		

			<InPageNavigation catalogueData={catalogueData} />

			<div
				className={css({
					display: 'flex',
					flexDirection: 'column',
					gap: SPACING.GRAPHSET_GAP,
				})}
			>
				{catalogueData.map(graphSet => (
					<GraphSetSection
						key={graphSet.title}
						title={graphSet.title}
						characters={graphSet.characters}
						showBaseline={showBaseline}
						enabledAlphabets={enabledAlphabets}
					/>
				))}
			</div>
			<SmallPrint onShowFeedback={onShowFeedback} />
		</div>

		*/