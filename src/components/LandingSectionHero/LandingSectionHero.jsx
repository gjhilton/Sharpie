import { css } from '@generated/css';
import ReactMarkdown from 'react-markdown';
import Button from '@components/Button/Button.jsx';
import Logo, { SIZE } from '@components/Logo/Logo.jsx';
import { PageTitle, Paragraph, Section } from '@components/Layout/Layout.jsx';
import { GAME_MODES } from '@constants/stages.js';
import sources from '@data/sources.json';
import heroContent from '@data/hero.md?raw';

const LandingSectionHero = ({ onSelectMode, twentyFourLetterAlphabet }) => {
	return (
		<>
			<header
				className={css({
					gridColumn: '1 / -1',
				})}
			>
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
						{sources['BeauChesne-Baildon'].title}
						<a
							href={sources['BeauChesne-Baildon'].sourceUri}
							target="_blank"
							rel="noopener noreferrer"
						>
							{' '}
							[source]
						</a>
					</figcaption>
				</figure>
			</header>
			<Section
				title={
					<PageTitle>
						Hone your{' '}
						<span className={css({ fontFamily: 'joscelyn' })}>
							Secretary
						</span>
					</PageTitle>
				}
			>
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
					onClick={() => onSelectMode(GAME_MODES.ALL, twentyFourLetterAlphabet)}
					label="Start"
				/>
			</Section>
		</>
	);
};

export default LandingSectionHero;
