import { css } from '../../../dist/styled-system/css';
import { Button } from '@components/Button/Button';
import { InlineMarkdown } from '@components/InlineMarkdown/InlineMarkdown';
import { PageTitle, Paragraph } from '@components/Layout/Layout';
import heroContent from '@data/hero.md?raw';

const GAP = '2rem';

export const HeroSection = ({ onPlay }) => (
	<section
		className={css({
			display: 'grid',
			gridTemplateColumns: '1fr 2fr',
			gap: GAP,
			alignItems: 'start',
		})}
	>
		<PageTitle>
			Hone your{' '}
			<span className={css({ fontFamily: 'joscelyn' })}>Secretary</span>
		</PageTitle>
		<div>
			<Paragraph>
				<InlineMarkdown content={heroContent} />
			</Paragraph>
			<Button hero onClick={onPlay} label="Play" />
		</div>
	</section>
);
