import { css } from '../../../dist/styled-system/css';
import { LinkAsButton } from '@components/LinkAsButton/LinkAsButton.jsx';

const BulkSelectionLink = ({ children, onClick, disabled = false }) => (
	<LinkAsButton
		onClick={onClick}
		disabled={disabled}
		className={css({
			color: disabled ? '{colors.ink/20}' : '{colors.ink}',
			'&:hover:not(:disabled)': {
				color: '{colors.toggleActive}',
			},
		})}
	>
		{children}
	</LinkAsButton>
);

export { BulkSelectionLink };
