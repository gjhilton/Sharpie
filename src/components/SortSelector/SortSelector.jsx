import { css } from '../../../dist/styled-system/css';

const SortSelector = ({
	value,
	onChange,
	options,
	id = 'sort-selector',
	label = 'Sort by:',
}) => {
	return (
		<div
			className={css({
				display: 'flex',
				alignItems: 'center',
				gap: '0.5rem',
				marginBottom: '1rem',
			})}
		>
			<label
				htmlFor={id}
				className={css({
					fontSize: 'm',
					fontWeight: '600',
				})}
			>
				{label}
			</label>
			<select
				id={id}
				value={value}
				onChange={e => onChange(e.target.value)}
				className={css({
					padding: '0.5rem',
					fontSize: 'm',
					border: '1px solid {colors.ink/30}',
					borderRadius: '4px',
					backgroundColor: '{colors.paper}',
					color: '{colors.ink}',
					cursor: 'pointer',
					'&:focus': {
						outline: '2px solid {colors.toggleActive}',
						outlineOffset: '2px',
					},
				})}
			>
				{options.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default SortSelector;
