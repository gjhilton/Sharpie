import { css } from '../../../dist/styled-system/css';

export const PageWidth = ({ children }) => (
	<div
		className={css({
			display: 'flex',
			flexDirection: 'column',
			gap: '2rem',
			maxWidth: '90%',
			textAlign: 'left',
			desktop: {
				maxWidth: '800px',
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
		className={`${css({
			fontSize: 'l',
			fontWeight: 'bold',
		})} ${className || ''}`}
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

export const Section = ({ title, children, className }) => (
	<section
		className={`${css({
			fontSize: 'l',
		})} ${className || ''}`}
	>
		{title && <Heading>{title}</Heading>}
		{children}
	</section>
);

export const Article = ({ children, className }) => (
	<article className={className || ''}>{children}</article>
);

export const DL = ({ children, className }) => (
	<dl
		className={`${css({
			marginBottom: '1rem',
		})} ${className || ''}`}
	>
		{children}
	</dl>
);

export const DT = ({ children, className }) => (
	<dt
		className={`${css({
			fontWeight: 'bold',
			marginBottom: '0.25rem',
		})} ${className || ''}`}
	>
		{children}
	</dt>
);

export const DD = ({ children, className }) => (
	<dd
		className={`${css({
			marginLeft: 0,
			fontSize: 'm',
			lineHeight: '1.6',
			marginBottom: '1rem',
		})} ${className || ''}`}
	>
		{children}
	</dd>
);

export const Fieldset = ({ children, className }) => (
	<fieldset
		className={`${css({
			border: 'none',
			padding: 0,
			margin: 0,
		})} ${className || ''}`}
	>
		{children}
	</fieldset>
);

export const Legend = ({ children, className, visuallyHidden = false }) =>
	visuallyHidden ? (
		<VisuallyHidden as="legend">{children}</VisuallyHidden>
	) : (
		<legend
			className={`${css({
				fontWeight: 'bold',
				marginBottom: '0.5rem',
			})} ${className || ''}`}
		>
			{children}
		</legend>
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
