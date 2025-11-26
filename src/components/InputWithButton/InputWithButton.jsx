import { css } from '../../../dist/styled-system/css';

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
	fontFamily,
	fontSize = 'm',
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
					padding: '0.75rem',
					fontSize: fontSize,
					fontFamily: fontFamily,
					border: '1px solid {colors.ink}',
					borderRight: 'none',
					backgroundColor: '{colors.paper}',
					cursor: cursor,
					minWidth: 0,
					_focusVisible: {
						outline: '2px solid {colors.ink}',
						outlineOffset: '2px',
					},
				})}
			/>
			<button
				type="button"
				onClick={buttonOnClick}
				className={css({
					padding: '0.75rem 1rem',
					border: '1px solid {colors.ink}',
					backgroundColor: buttonActive ? '{colors.ink}' : '{colors.paper}',
					color: buttonActive ? '{colors.paper}' : '{colors.ink}',
					cursor: 'pointer',
					fontSize: fontSize,
					fontWeight: 'bold',
					transition: 'all 150ms ease-in-out',
					whiteSpace: 'nowrap',
					flexShrink: 0,
					_focusVisible: {
						outline: '2px solid {colors.ink}',
						outlineOffset: '2px',
					},
				})}
			>
				{buttonLabel}
			</button>
		</div>
	);
};

export default InputWithButton;
