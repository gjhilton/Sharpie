import { css } from '../../../dist/styled-system/css';
import {
	FOCUS_OUTLINE_TOGGLE,
	FOCUS_OUTLINE_OFFSET,
	OPACITY_DISABLED,
	OPACITY_ENABLED,
	FONT_SIZE_MEDIUM,
	KEY_SPACE,
	KEY_ENTER
} from '@lib/constants/ui';

const GAP = '0.75rem';
const MARGIN_BOTTOM = '1rem';
const TOGGLE_WIDTH = '51px';
const TOGGLE_HEIGHT = '31px';
const TOGGLE_BORDER_RADIUS = '31px';
const TRANSITION_BACKGROUND = 'background-color 0.25s ease-in-out';
const TRANSITION_LEFT = 'left 0.25s ease-in-out';
const SCALE_ACTIVE = 'scale(0.98)';
const KNOB_TOP = '2px';
const KNOB_LEFT_UNCHECKED = '2px';
const KNOB_LEFT_CHECKED = '22px';
const KNOB_SIZE = '27px';
const KNOB_BORDER_RADIUS = '50%';
const KNOB_BOX_SHADOW = '0 3px 8px {colors.ink/15}, 0 1px 1px {colors.ink/16}';

const Toggle = ({
	id,
	label,
	children,
	checked,
	onChange,
	disabled = false,
}) => {
	const handleKeyDown = e => {
		if (e.key === KEY_SPACE || e.key === KEY_ENTER) {
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
				gap: GAP,
				marginBottom: MARGIN_BOTTOM,
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
					width: TOGGLE_WIDTH,
					height: TOGGLE_HEIGHT,
					borderRadius: TOGGLE_BORDER_RADIUS,
					backgroundColor: checked
						? '{colors.toggleActive}'
						: '{colors.toggleInactive}',
					border: 'none',
					cursor: disabled ? 'not-allowed' : 'pointer',
					transition: TRANSITION_BACKGROUND,
					opacity: disabled ? OPACITY_DISABLED : OPACITY_ENABLED,
					flexShrink: 0,
					'&:focus': {
						outline: FOCUS_OUTLINE_TOGGLE,
						outlineOffset: FOCUS_OUTLINE_OFFSET,
					},
					'&:active:not(:disabled)': {
						transform: SCALE_ACTIVE,
					},
				})}
			>
				<span
					className={css({
						position: 'absolute',
						top: KNOB_TOP,
						left: checked ? KNOB_LEFT_CHECKED : KNOB_LEFT_UNCHECKED,
						width: KNOB_SIZE,
						height: KNOB_SIZE,
						borderRadius: KNOB_BORDER_RADIUS,
						backgroundColor: '{colors.paper}',
						boxShadow: KNOB_BOX_SHADOW,
						transition: TRANSITION_LEFT,
					})}
				/>
			</button>
			<label
				htmlFor={id}
				onClick={() => onChange(!checked)}
				className={css({
					fontSize: FONT_SIZE_MEDIUM,
					cursor: disabled ? 'not-allowed' : 'pointer',
					opacity: disabled ? OPACITY_DISABLED : OPACITY_ENABLED,
				})}
			>
				{labelContent}
			</label>
		</div>
	);
};

export { Toggle };
