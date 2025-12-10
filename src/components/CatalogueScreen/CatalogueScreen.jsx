import { css } from '../../../dist/styled-system/css';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { SmallPrint } from '@components/SmallPrint/SmallPrint';
import { CharacterImage } from '@components/CharacterImage/CharacterImage';
import { HandSelectorWithSort } from '@components/HandSelectorWithSort/HandSelectorWithSort';
import { LinkAsButton } from '@components/LinkAsButton/LinkAsButton';
import {
	PageTitle,
	Paragraph,
	Heading,
	PageWidth,
} from '@components/Layout/Layout';
import handsData from '@data/hands.json';
import * as catalogueLogic from '@lib/utilities/catalogueLogic';
import { useGameOptions } from '@lib/hooks/useGameOptions';
import { useDatabase } from '@lib/context/DatabaseContext';
import { flexCenter } from '@lib/constants/ui';

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
			...flexCenter,
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
	enabledHands,
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
					isEnabled={enabledHands[glyph.source]}
					getImagePath={getImagePath}
				/>
			))}
		</div>
	</article>
);

const LetterCaseGroup = ({
	letters,
	showBaseline,
	enabledHands,
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
				enabledHands={enabledHands}
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
				Not allowed! Select one or more hands to continue
			</span>
		);
	}

	return <LinkAsButton onClick={onReturnToMenu}>← Back to Menu</LinkAsButton>;
};

const SelectionStatus = ({ isError, handCount, letterCounts }) => {
	if (isError) {
		return (
			<Paragraph className={css({ color: '{colors.error}' })}>
				<strong>Error:</strong> Please select at least one hand.
			</Paragraph>
		);
	}

	return (
		<Paragraph>
			Enable the hands you'd like to work on from the list below. You have enabled <strong>{handCount}</strong>{' '}
			{handCount === 1 ? 'hand' : 'hands'} (
			<strong>{letterCounts && letterCounts.total > 0 ? letterCounts.total : 0}</strong> characters total:{' '}
			{letterCounts && letterCounts.total > 0 ? (
				<>
					<strong>{letterCounts.minuscules}</strong> minuscule,{' '}
					<strong>{letterCounts.majuscules}</strong> majuscule
				</>
			) : (
				<>0 minuscule, 0 majuscule</>
			)}
			).
		</Paragraph>
	);
};

export const CatalogueScreen = () => {
	const navigate = useNavigate();
	const { options, updateOption } = useGameOptions();
	const {
		DB,
		getImagePath,
		getEnabledGraphSets,
		countEnabledHands,
		getAllHandNames,
		countEnabledLetters,
	} = useDatabase();

	const { showBaseline = false, enabledHands } = options;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleReturnToMenu = () => navigate({ to: '/', search: prev => prev });
	const handleShowFeedback = () => navigate({ to: '/feedback', search: prev => prev });

	const letterGroups = catalogueLogic.groupGraphsByGraphSetAndCharacter(
		getEnabledGraphSets(DB)
	);
	const handCount = countEnabledHands(enabledHands);
	const letterCounts = countEnabledLetters(DB, enabledHands);
	const hasNoSelection = handCount === 0 || letterCounts.total === 0;

	const handleToggleHand = name => {
		const newEnabledHands = {
			...enabledHands,
			[name]: !enabledHands[name],
		};
		updateOption('hands', newEnabledHands);
	};

	const handleBatchToggleHands = updates => {
		const newEnabledHands = {
			...enabledHands,
			...updates,
		};
		updateOption('hands', newEnabledHands);
	};

	return (
		<PageWidth>
			<img
				src="/hand.png"
				alt="Hand"
				className={css({
					display: 'block',
					margin: '0 auto 1rem auto',
					maxWidth: '100%',
					height: '150px',
				})}
			/>
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
					Choose Hand(s)
				</Heading>

				<div className={css({ marginBottom: STYLES.verticalGap })}>
					<Paragraph>
						The hands Sharpie tests are extracted from a range of source
						documents. Expanding the time and stylistic coverage of the
						hands available for practice is the current top priority. Watch
						this space.
					</Paragraph>

					<SelectionStatus
						isError={hasNoSelection}
						handCount={handCount}
						letterCounts={letterCounts}
					/>

					<HandSelectorWithSort
						enabledHands={enabledHands}
						handNames={getAllHandNames(DB)}
						handsMetadata={DB.sources}
						onToggle={handleToggleHand}
						onBatchToggle={handleBatchToggleHands}
					/>
				</div>
			</header>

			<CharacterIndex letterGroups={letterGroups} />

			{letterGroups.map(group => (
				<LetterCaseGroup
					key={group.title}
					letters={group.characters}
					showBaseline={showBaseline}
					enabledHands={enabledHands}
					getImagePath={getImagePath}
				/>
			))}

			<SmallPrint onShowFeedback={handleShowFeedback} />
		</PageWidth>
	);
};
