import { css } from '../../../dist/styled-system/css';

const ANIMATION_DURATION = '150ms';
const HOVER_SCALE = 1.05;
const ACTIVE_SCALE = 0.95;

export const Badge = ({ children, testId, onClick }) => {
	const isClickable = !!onClick;

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick?.(e);
		}
	};

	const interactiveStyles = isClickable
		? {
				cursor: 'pointer',
				transition: `all ${ANIMATION_DURATION} ease-in-out`,
				_hover: { transform: `scale(${HOVER_SCALE})` },
				_active: { transform: `scale(${ACTIVE_SCALE})` },
		  }
		: { cursor: 'default' };

	const interactiveProps = isClickable
		? {
				role: 'button',
				tabIndex: 0,
				onKeyDown: handleKeyDown,
		  }
		: {};

	return (
		<span
			className={css({
				border: '1px solid black',
				display: 'inline-block',
				padding: '0.25rem 0.75rem',
				fontSize: 's',
				backgroundColor: 'lemonchiffon',
				whiteSpace: 'nowrap',
				borderRadius: '100px',
				...interactiveStyles,
			})}
			data-testid={testId}
			onClick={onClick}
			{...interactiveProps}
		>
			{children}
		</span>
	);
};
