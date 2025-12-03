import { css } from '../../../dist/styled-system/css';

const PADDING = '0.75rem';
const PADDING_HORIZONTAL = '1rem';
const FONT_SIZE_DEFAULT = 'm';
const BORDER_WIDTH = '1px';
const BORDER_COLOR = '{colors.ink}';
const BORDER = `${BORDER_WIDTH} solid ${BORDER_COLOR}`;
const BACKGROUND_PAPER = '{colors.paper}';
const BACKGROUND_INK = '{colors.ink}';
const COLOR_PAPER = '{colors.paper}';
const COLOR_INK = '{colors.ink}';
const TRANSITION = 'all 150ms ease-in-out';
const OUTLINE_WIDTH = '2px';
const OUTLINE = `${OUTLINE_WIDTH} solid ${BORDER_COLOR}`;
const OUTLINE_OFFSET = '2px';

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
	fontSize = FONT_SIZE_DEFAULT,
	marginBottom,
	cursor,
}) => {
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
					padding: PADDING,
					fontSize: fontSize,
					fontFamily: fontFamily,
					border: BORDER,
					borderRight: 'none',
					backgroundColor: BACKGROUND_PAPER,
					cursor: cursor,
					minWidth: 0,
					_focusVisible: {
						outline: OUTLINE,
						outlineOffset: OUTLINE_OFFSET,
					},
				})}
			/>
			<button
				type="button"
				onClick={buttonOnClick}
				className={css({
					padding: `${PADDING} ${PADDING_HORIZONTAL}`,
					border: BORDER,
					borderRight: rightButton2Label ? 'none' : BORDER,
					backgroundColor: buttonActive ? BACKGROUND_INK : BACKGROUND_PAPER,
					color: buttonActive ? COLOR_PAPER : COLOR_INK,
					cursor: 'pointer',
					fontSize: fontSize,
					fontWeight: 'bold',
					transition: TRANSITION,
					whiteSpace: 'nowrap',
					flexShrink: 0,
					_focusVisible: {
						outline: OUTLINE,
						outlineOffset: OUTLINE_OFFSET,
					},
				})}
			>
				{buttonLabel}
			</button>
			{rightButton2Label && (
				<button
					type="button"
					onClick={rightButton2OnClick}
					className={css({
						padding: `${PADDING} ${PADDING_HORIZONTAL}`,
						border: BORDER,
						backgroundColor: rightButton2Active ? BACKGROUND_INK : BACKGROUND_PAPER,
						color: rightButton2Active ? COLOR_PAPER : COLOR_INK,
						cursor: 'pointer',
						fontSize: fontSize,
						fontWeight: 'bold',
						transition: TRANSITION,
						whiteSpace: 'nowrap',
						flexShrink: 0,
						_focusVisible: {
							outline: OUTLINE,
							outlineOffset: OUTLINE_OFFSET,
						},
					})}
				>
					{rightButton2Label}
				</button>
			)}
		</div>
	);
};

export { InputWithButton };
