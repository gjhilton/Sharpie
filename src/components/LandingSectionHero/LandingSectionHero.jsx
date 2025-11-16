import { css } from '../../../styled-system/css';
import ReactMarkdown from 'react-markdown';
import Button from '@components/Button/Button.jsx';
import Logo, { SIZE } from '@components/Logo/Logo.jsx';
import { PageTitle, Paragraph } from '@components/Layout/Layout.jsx';
import DisclosureSection from '@components/DisclosureSection/DisclosureSection.jsx';
import MarkdownWithPlaceholders from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx';
import { GAME_MODES } from '@constants/stages.js';
import alphabets from '@data/alphabets.json';
import heroContent from '@data/hero.md?raw';
import identifyContent from '@data/identify.md?raw';
import alphabetContent from '@data/alphabet.md?raw';
import baselinesContent from '@data/baselines.md?raw';
import howToUseContent from '@data/how-to-use.md?raw';
import lettersInContextContent from '@data/letters-in-context.md?raw';
import hintsContent from '@data/hints.md?raw';
import nextStepsContent from '@data/next-steps.md?raw';
import changelog from '@data/changelog.json';
import { DB } from '@data/DB.js';
import * as db from '@utilities/database.js';
import Toggle from '@components/Toggle/Toggle.jsx';
import CharacterImage from '@components/CharacterImage/CharacterImage.jsx';

const SubSection = ({ title, children }) => (
	<div
		className={css({
			display: 'grid',
			gridTemplateColumns: '1fr 2fr',
			gap: '2rem',
			alignItems: 'baseline',
			marginBottom: '1.5rem',
		})}
	>
		<h3
			className={css({
				margin: '0',
				fontWeight: 'bold',
				fontSize: 'm',
			})}
		>
			{title}
		</h3>
		<div>{children}</div>
	</div>
);

const DL = ({ children }) => (
	<dl
		className={css({
			marginBottom: '1rem',
		})}
	>
		{children}
	</dl>
);

const VersionEntry = ({ version, description }) => (
	<>
		<dt
			className={css({
				fontWeight: 'bold',
				marginBottom: '0.25rem',
			})}
		>
			v{version}
		</dt>
		<dd
			className={css({
				marginLeft: 0,
				fontSize: 'm',
				lineHeight: '1.6',
				marginBottom: '1rem',
			})}
		>
			{description}
		</dd>
	</>
);

const LandingSectionHero = ({
	onSelectMode,
	twentyFourLetterAlphabet,
	setTwentyFourLetterAlphabet,
	selectedMode,
	setSelectedMode,
	enabledAlphabets,
	onShowCatalogue,
	showBaseline,
	setShowBaseline,
}) => {
	return (
		<>
			<header>
				<div
					className={css({
						marginBottom: '2rem',
					})}
				>
					<Logo size={SIZE.S} />
				</div>
				<figure>
					<img alt="Secretary Hand" src="secretary_hand.gif" />
					<figcaption
						className={css({
							margin: '1rem 0',
							fontStyle: 'italic',
							fontSize: 's',
						})}
					>
						{alphabets['BeauChesne-Baildon'].title}
						<a
							href={alphabets['BeauChesne-Baildon'].sourceUri}
							target="_blank"
							rel="noopener noreferrer"
						>
							{' '}
							[source]
						</a>
					</figcaption>
				</figure>
			</header>
			<div
				className={css({
					display: 'grid',
					gridTemplateColumns: '1fr 2fr',
					gap: '2rem',
					alignItems: 'start',
				})}
			>
				<PageTitle>
					Hone your{' '}
					<span className={css({ fontFamily: 'joscelyn' })}>Secretary</span>
				</PageTitle>
				<div>
					<Paragraph>
						<ReactMarkdown
							components={{
								p: ({ children }) => <>{children}</>,
							}}
						>
							{heroContent}
						</ReactMarkdown>
					</Paragraph>
					<Button
						hero
						onClick={() => onSelectMode(selectedMode, twentyFourLetterAlphabet)}
						label="Play"
					/>
				</div>
			</div>
			<div>
				<DisclosureSection title="Options">
					<SubSection title="Identify...">
					<fieldset
						className={css({
							border: 'none',
							padding: '0',
							margin: '0',
							marginBottom: '1rem',
						})}
					>
						<div
							className={css({
								display: 'flex',
								flexDirection: 'column',
								gap: '0',
								lineHeight: '1.6',
							})}
						>
							<label
								className={css({
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem',
									cursor: 'pointer',
									fontWeight:
										selectedMode === GAME_MODES.MINUSCULE ? 'bold' : 'normal',
								})}
							>
								<input
									type="radio"
									name="gameMode"
									value={GAME_MODES.MINUSCULE}
									checked={selectedMode === GAME_MODES.MINUSCULE}
									onChange={e => setSelectedMode(e.target.value)}
									className={css({
										width: '1.2rem',
										height: '1.2rem',
									})}
								/>
								minuscules only
							</label>
							<label
								className={css({
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem',
									cursor: 'pointer',
									fontWeight:
										selectedMode === GAME_MODES.MAJUSCULE ? 'bold' : 'normal',
								})}
							>
								<input
									type="radio"
									name="gameMode"
									value={GAME_MODES.MAJUSCULE}
									checked={selectedMode === GAME_MODES.MAJUSCULE}
									onChange={e => setSelectedMode(e.target.value)}
									className={css({
										width: '1.2rem',
										height: '1.2rem',
									})}
								/>
								MAJUSCULES only
							</label>
							<label
								className={css({
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem',
									cursor: 'pointer',
									fontWeight: selectedMode === GAME_MODES.ALL ? 'bold' : 'normal',
								})}
							>
								<input
									type="radio"
									name="gameMode"
									value={GAME_MODES.ALL}
									checked={selectedMode === GAME_MODES.ALL}
									onChange={e => setSelectedMode(e.target.value)}
									className={css({
										width: '1.2rem',
										height: '1.2rem',
									})}
								/>
								both minuscules AND MAJUSCULES
							</label>
						</div>
					</fieldset>
					<Paragraph>
						<ReactMarkdown
							components={{
								p: ({ children }) => <>{children}</>,
							}}
						>
							{identifyContent}
						</ReactMarkdown>
					</Paragraph>
				</SubSection>
				<SubSection title="Alphabets">
					<Paragraph>
						Question bank: <strong>{db.countEnabledCharacters(DB, enabledAlphabets)}</strong>{' '}
						characters from <strong>{db.countEnabledAlphabets(enabledAlphabets)}</strong>{' '}
						alphabets.
					</Paragraph>
					<Button label="Choose alphabets" onClick={onShowCatalogue} />
				</SubSection>
				<SubSection title="26 letters vs 24">
					<MarkdownWithPlaceholders
						content={alphabetContent}
						placeholders={{
							ALPHABET_TOGGLE: (
								<Toggle
									id="twenty-four-letter-alphabet"
									label="24-letter alphabet"
									checked={twentyFourLetterAlphabet}
									onChange={setTwentyFourLetterAlphabet}
								/>
							),
						}}
					/>
				</SubSection>
				<SubSection title="Baselines">
					<MarkdownWithPlaceholders
						content={baselinesContent}
						placeholders={{
							BASELINE_TOGGLE: (
								<Toggle
									id="baseline-toggle"
									label="Show baselines"
									checked={showBaseline}
									onChange={setShowBaseline}
								/>
							),
							BASELINE_EXAMPLES: (() => {
								const baseUrl = import.meta.env.BASE_URL || '/';
								const exampleImagePath = `${baseUrl}data/Joscelyn/joscelyn-minuscule-assets/b.png`;
								return (
									<div
										className={css({
											display: 'grid',
											gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
											gap: '2rem',
											marginTop: '2rem',
											marginBottom: '1rem',
										})}
									>
										<div>
											<div
												className={css({
													fontWeight: 'bold',
													textAlign: 'center',
													marginBottom: '0.5rem',
												})}
											>
												Without baseline
											</div>
											<div
												className={css({
													height: '300px',
													border: '1px solid {colors.border}',
												})}
											>
												<CharacterImage
													imagePath={exampleImagePath}
													caption="Joscelyn minuscule b"
													showBaseline={false}
												/>
											</div>
										</div>
										<div>
											<div
												className={css({
													fontWeight: 'bold',
													textAlign: 'center',
													marginBottom: '0.5rem',
												})}
											>
												With baseline
											</div>
											<div
												className={css({
													height: '300px',
													border: '1px solid {colors.border}',
												})}
											>
												<CharacterImage
													imagePath={exampleImagePath}
													caption="Joscelyn minuscule b with baseline"
													showBaseline={true}
												/>
											</div>
										</div>
									</div>
								);
							})(),
						}}
					/>
				</SubSection>
			</DisclosureSection>
				<DisclosureSection title="How to play">
					<SubSection title="Gameplay">
						<MarkdownWithPlaceholders content={howToUseContent} />
					</SubSection>
					<SubSection title="Letters in context">
						<MarkdownWithPlaceholders
							content={lettersInContextContent}
							placeholders={{
								CONTEXT_IMAGE: (() => {
								const baseUrl = import.meta.env.BASE_URL || '/';
								return (
									<img
										src={`${baseUrl}data/Howard/Howard-assets/e-word-7asd.png`}
										alt="The word 'there' with the first 'e' highlighted in black"
										className={css({
											maxWidth: '100%',
											display: 'block',
											marginTop: '1rem',
											marginBottom: '1rem',
										})}
									/>
								);
							})(),
							}}
						/>
					</SubSection>
					<SubSection title="Hints">
						<MarkdownWithPlaceholders content={hintsContent} />
					</SubSection>
				</DisclosureSection>
				<DisclosureSection title="Next steps for learners">
					<SubSection title="Additional resources">
						<MarkdownWithPlaceholders content={nextStepsContent} />
					</SubSection>
				</DisclosureSection>
				<DisclosureSection title="What's new?">
					<SubSection title="Changelog">
						<DL>
							{changelog.map(entry => (
								<VersionEntry
									key={entry.version}
									version={entry.version}
									description={entry.description}
								/>
							))}
						</DL>
					</SubSection>
				</DisclosureSection>
			</div>
		</>
	);
};

export default LandingSectionHero;
