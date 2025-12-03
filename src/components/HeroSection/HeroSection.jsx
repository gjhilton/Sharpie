import { css } from '../../../dist/styled-system/css';
import ReactMarkdown from 'react-markdown';
import { Button } from '@components/Button/Button';
import { PageTitle, Paragraph } from '@components/Layout/Layout.jsx';
import heroContent from '@data/hero.md?raw';

const HeroSection = ({ onPlay }) => (
	<section
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
			<Button hero onClick={onPlay} label="Play" />
		</div>
	</section>
);

export default HeroSection;
