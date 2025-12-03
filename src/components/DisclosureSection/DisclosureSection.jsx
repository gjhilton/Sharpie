import { useState } from 'react';
import { css } from '../../../dist/styled-system/css';

const MARGIN_TOP = '-4px';
const BORDER_WIDTH = '4px';
const PADDING_VERTICAL = '1rem';
const HEADING_GAP = '1rem';
const CONTENT_MARGIN_BOTTOM = '2rem';
const TOGGLE_FONT_SIZE = '2rem';

export const DisclosureSection = ({
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
				marginTop: MARGIN_TOP,
				borderTop: `${BORDER_WIDTH} solid {colors.ink}`,
				borderBottom: `${BORDER_WIDTH} solid {colors.ink}`,
				paddingTop: PADDING_VERTICAL,
				paddingBottom: PADDING_VERTICAL,
				_first: {
					marginTop: '0',
				},
			})}
		>
			<div
				className={css({
					display: 'flex',
					alignItems: 'center',
					gap: HEADING_GAP,
					marginBottom: isExpanded ? CONTENT_MARGIN_BOTTOM : '0',
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
						fontSize: TOGGLE_FONT_SIZE,
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
