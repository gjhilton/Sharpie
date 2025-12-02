import { useState } from 'react';
import { css } from '../../../dist/styled-system/css';

const DisclosureSection = ({
	title,
	defaultExpanded = false,
	additionalComponent,
	children,
}) => {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	const toggle = () => setIsExpanded(prev => !prev);

	return (
		<div
			className={css({
				marginTop: '-4px',
				borderTop: '4px solid {colors.ink}',
				borderBottom: '4px solid {colors.ink}',
				paddingTop: '1rem',
				paddingBottom: '1rem',
				_first: {
					marginTop: '0',
				},
			})}
		>
			<div
				className={css({
					display: 'flex',
					alignItems: 'center',
					gap: '1rem',
					marginBottom: isExpanded ? '2rem' : '0',
					cursor: 'pointer',
				})}
				onClick={toggle}
			>
				<h2
					className={css({
						margin: '0',
						fontSize: 'l',
						fontWeight: 'bold',
						flexShrink: 0,
					})}
				>
					<button
						className={css({
							background: 'none',
							border: 'none',
							padding: '0',
							cursor: 'pointer',
							textAlign: 'left',
							fontSize: 'inherit',
							fontWeight: 'inherit',
						})}
						aria-expanded={isExpanded}
					>
						{title}
					</button>
				</h2>
				{additionalComponent && (
					<div
						onClick={(e) => e.stopPropagation()}
						className={css({
							cursor: 'default',
							flexGrow: 1,
						})}
					>
						{additionalComponent}
					</div>
				)}
				<div
					className={css({
						textAlign: 'right',
						cursor: 'pointer',
						fontSize: '2rem',
						lineHeight: '1',
						flexShrink: 0,
						marginLeft: additionalComponent ? '0' : 'auto',
					})}
				>
					<span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
				</div>
			</div>

			{isExpanded && <div>{children}</div>}
		</div>
	);
};

export default DisclosureSection;
