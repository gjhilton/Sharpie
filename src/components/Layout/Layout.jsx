import { css } from '../../../styled-system/css';

export const PageWidth = ({ children }) => (
	<div
		className={css({
			display: 'grid',
			gridTemplateColumns: '1fr',
			gap: '2rem',
			maxWidth: '90%',
			textAlign: 'left',
			desktop: {
				maxWidth: '800px',
				gridTemplateColumns: '1fr 2fr',
				columnGap: '3rem',
				rowGap: '2rem',
			},
			margin: '2rem auto',
		})}
	>
		{children}
	</div>
);

export const PageTitle = ({ children, style = {} }) => (
	<h1
		className={css({
			fontSize: '2rem',
			fontWeight: 'bold',
			marginBottom: '1rem',
			desktop: {
				lineHeight: '3rem',
			},
		})}
		style={style}
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
		className={`${css({
			fontSize: 'm',
			lineHeight: '1.6',
			marginBottom: '1rem',
		})} ${className || ''}`}
	>
		{children}
	</p>
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
