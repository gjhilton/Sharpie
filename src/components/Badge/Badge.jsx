import { css } from '../../../dist/styled-system/css';
import {
	TRANSITION_ALL_FAST,
	HOVER_SCALE_MEDIUM,
	ACTIVE_SCALE
} from '@lib/constants/ui';

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
				transition: TRANSITION_ALL_FAST,
				_hover: { transform: `scale(${HOVER_SCALE_MEDIUM})` },
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
