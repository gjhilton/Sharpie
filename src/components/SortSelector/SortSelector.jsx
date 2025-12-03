import { css } from '../../../dist/styled-system/css';

const GAP = '0.5rem';
const MARGIN_BOTTOM = '1rem';
const FONT_SIZE = 'm';
const FONT_WEIGHT = '600';
const PADDING = '0.5rem';
const BORDER = '1px solid {colors.ink/30}';
const BORDER_RADIUS = '4px';
const BACKGROUND_COLOR = '{colors.paper}';
const COLOR = '{colors.ink}';
const OUTLINE = '2px solid {colors.toggleActive}';
const OUTLINE_OFFSET = '2px';
const DEFAULT_ID = 'sort-selector';
const DEFAULT_LABEL = 'Sort by:';

const SortSelector = ({
	value,
	onChange,
	options,
	id = DEFAULT_ID,
	label = DEFAULT_LABEL,
}) => {
	return (
		<div
			className={css({
				display: 'flex',
				alignItems: 'center',
				gap: GAP,
				marginBottom: MARGIN_BOTTOM,
			})}
		>
			<label
				htmlFor={id}
				className={css({
					fontSize: FONT_SIZE,
					fontWeight: FONT_WEIGHT,
				})}
			>
				{label}
			</label>
			<select
				id={id}
				value={value}
				onChange={e => onChange(e.target.value)}
				className={css({
					padding: PADDING,
					fontSize: FONT_SIZE,
					border: BORDER,
					borderRadius: BORDER_RADIUS,
					backgroundColor: BACKGROUND_COLOR,
					color: COLOR,
					cursor: 'pointer',
					'&:focus': {
						outline: OUTLINE,
						outlineOffset: OUTLINE_OFFSET,
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

export { SortSelector };
export default SortSelector;
