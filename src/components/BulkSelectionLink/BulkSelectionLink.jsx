import { css } from '../../../styled-system/css';

const BulkSelectionLink = ({ children, onClick, disabled = false }) => {
	const handleClick = e => {
		e.preventDefault();
		if (!disabled && onClick) {
			onClick();
		}
	};

	return (
		<a
			href="#"
			onClick={handleClick}
			className={css({
				color: disabled ? '{colors.ink/20}' : '{colors.ink}',
				textDecoration: disabled ? 'none' : 'underline',
				cursor: disabled ? 'not-allowed' : 'pointer',
				'&:hover': {
					color: disabled ? '{colors.ink/20}' : '{colors.toggleActive}',
				},
			})}
			aria-disabled={disabled}
		>
			{children}
		</a>
	);
};

export default BulkSelectionLink;
