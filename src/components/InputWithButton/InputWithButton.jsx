import { css } from '../../../dist/styled-system/css';
import {
	PADDING_STANDARD,
	BORDER_STANDARD,
	FOCUS_OUTLINE,
	FOCUS_OUTLINE_OFFSET,
	TRANSITION_ALL_FAST,
	FONT_SIZE_MEDIUM
} from '@lib/constants/ui';

const PADDING_HORIZONTAL = '1rem';
const BACKGROUND_PAPER = '{colors.paper}';
const BACKGROUND_INK = '{colors.ink}';
const COLOR_PAPER = '{colors.paper}';
const COLOR_INK = '{colors.ink}';

const InputWithButton = ({
	inputId,
	inputType = 'text',
	inputName,
	inputValue,
	inputReadOnly = false,
	inputOnClick,
	inputOnFocus,
	inputOnTouchStart,
	buttonLabel,
	buttonOnClick,
	buttonActive = false,
	rightButton2Label,
	rightButton2OnClick,
	rightButton2Active = false,
	fontFamily,
	fontSize = FONT_SIZE_MEDIUM,
	marginBottom,
	cursor,
}) => {
	const commonButtonStyles = {
		padding: `${PADDING_STANDARD} ${PADDING_HORIZONTAL}`,
		border: BORDER_STANDARD,
		cursor: 'pointer',
		fontSize: fontSize,
		fontWeight: 'bold',
		transition: TRANSITION_ALL_FAST,
		whiteSpace: 'nowrap',
		flexShrink: 0,
		_focusVisible: {
			outline: FOCUS_OUTLINE,
			outlineOffset: FOCUS_OUTLINE_OFFSET,
		},
	};

	return (
		<div
			className={css({
				display: 'flex',
				alignItems: 'stretch',
				marginBottom: marginBottom,
			})}
		>
			<input
				id={inputId}
				type={inputType}
				name={inputName}
				value={inputValue}
				readOnly={inputReadOnly}
				onClick={inputOnClick}
				onFocus={inputOnFocus}
				onTouchStart={inputOnTouchStart}
				className={css({
					flex: '1',
					padding: PADDING_STANDARD,
					fontSize: fontSize,
					fontFamily: fontFamily,
					border: BORDER_STANDARD,
					borderRight: 'none',
					backgroundColor: BACKGROUND_PAPER,
					cursor: cursor,
					minWidth: 0,
					_focusVisible: {
						outline: FOCUS_OUTLINE,
						outlineOffset: FOCUS_OUTLINE_OFFSET,
					},
				})}
			/>
			<button
				type="button"
				onClick={buttonOnClick}
				className={css({
					...commonButtonStyles,
					borderRight: rightButton2Label ? 'none' : BORDER_STANDARD,
					backgroundColor: buttonActive ? BACKGROUND_INK : BACKGROUND_PAPER,
					color: buttonActive ? COLOR_PAPER : COLOR_INK,
				})}
			>
				{buttonLabel}
			</button>
			{rightButton2Label && (
				<button
					type="button"
					onClick={rightButton2OnClick}
					className={css({
						...commonButtonStyles,
						backgroundColor: rightButton2Active ? BACKGROUND_INK : BACKGROUND_PAPER,
						color: rightButton2Active ? COLOR_PAPER : COLOR_INK,
					})}
				>
					{rightButton2Label}
				</button>
			)}
		</div>
	);
};

export { InputWithButton };
