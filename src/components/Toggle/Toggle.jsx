import { css } from '../../../dist/styled-system/css';

const Toggle = ({
	id,
	label,
	children,
	checked,
	onChange,
	disabled = false,
}) => {
	const handleKeyDown = e => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			onChange(!checked);
		}
	};

	const labelContent = children || label;

	return (
		<div
			className={css({
				display: 'flex',
				alignItems: 'center',
				gap: '0.75rem',
				marginBottom: '1rem',
			})}
		>
			<button
				id={id}
				role="switch"
				aria-checked={checked}
				aria-label={typeof label === 'string' ? label : undefined}
				disabled={disabled}
				onClick={() => onChange(!checked)}
				onKeyDown={handleKeyDown}
				className={css({
					position: 'relative',
					width: '51px',
					height: '31px',
					borderRadius: '31px',
					backgroundColor: checked
						? '{colors.toggleActive}'
						: '{colors.toggleInactive}',
					border: 'none',
					cursor: disabled ? 'not-allowed' : 'pointer',
					transition: 'background-color 0.25s ease-in-out',
					opacity: disabled ? 0.5 : 1,
					flexShrink: 0,
					'&:focus': {
						outline: '2px solid {colors.toggleActive}',
						outlineOffset: '2px',
					},
					'&:active:not(:disabled)': {
						transform: 'scale(0.98)',
					},
				})}
			>
				<span
					className={css({
						position: 'absolute',
						top: '2px',
						left: checked ? '22px' : '2px',
						width: '27px',
						height: '27px',
						borderRadius: '50%',
						backgroundColor: '{colors.paper}',
						boxShadow:
							'0 3px 8px {colors.ink/15}, 0 1px 1px {colors.ink/16}',
						transition: 'left 0.25s ease-in-out',
					})}
				/>
			</button>
			<label
				htmlFor={id}
				onClick={() => onChange(!checked)}
				className={css({
					fontSize: 'm',
					cursor: disabled ? 'not-allowed' : 'pointer',
					opacity: disabled ? 0.5 : 1,
				})}
			>
				{labelContent}
			</label>
		</div>
	);
};

export { Toggle };
export default Toggle;
