import { css } from '../../../dist/styled-system/css';

const Badge = ({ children, testId, onClick }) => {
	const isClickable = !!onClick;

	return (
		<span
			className={css({
				display: 'inline-block',
				padding: '0.25rem 0.75rem',
				fontSize: 's',
				backgroundColor: 'lemonchiffon',
				whiteSpace: 'nowrap',
				borderRadius: '100px',
				cursor: isClickable ? 'pointer' : 'default',
				transition: isClickable ? 'all 150ms ease-in-out' : 'none',
				_hover: isClickable ? {
					transform: 'scale(1.05)'
				} : {},
				_active: isClickable ? {
					transform: 'scale(0.95)',
				} : {},
			})}
			data-testid={testId}
			onClick={onClick}
			role={isClickable ? 'button' : undefined}
			tabIndex={isClickable ? 0 : undefined}
			onKeyDown={isClickable ? (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onClick?.(e);
				}
			} : undefined}
		>
			{children}
		</span>
	);
};

export default Badge;
