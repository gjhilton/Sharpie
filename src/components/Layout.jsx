import { css } from '../../styled-system/css';

export const H1 = ({ children, className }) => (
	<h1
		className={
			className ||
			css({
				fontSize: { base: '2rem', desktop: '3rem' },
				fontWeight: 'bold',
				marginBottom: '1rem',
				desktop: {
					lineHeight: '3rem',
				},
			})
		}
	>
		{children}
	</h1>
);

export const Heading = ({ children, className }) => (
	<h2
		className={
			className ||
			css({
				fontSize: 'l',
				fontWeight: 'bold',
			})
		}
	>
		{children}
	</h2>
);

export const Paragraph = ({ children, className }) => (
	<p
		className={
			className ||
			css({
				fontSize: 'm',
				lineHeight: '1.6',
				marginBottom: '1rem',
			})
		}
	>
		{children}
	</p>
);

export const PageTitle = () => (
	<H1>
		Hone your{' '}
		<span className={css({ fontFamily: 'joscelyn' })}>Secretary</span>
	</H1>
);

export const Section = ({ title, children }) => (
	<>
		{title}
		<div
			className={css({
				fontSize: 'l',
			})}
		>
			{children}
		</div>
	</>
);

export const VisuallyHidden = ({ children, as: Component = 'span' }) => (
	<Component
		className={css({
			position: 'absolute',
			width: '1px',
			height: '1px',
			padding: 0,
			margin: '-1px',
			overflow: 'hidden',
			clip: 'rect(0, 0, 0, 0)',
			whiteSpace: 'nowrap',
			border: 0,
		})}
	>
		{children}
	</Component>
);
