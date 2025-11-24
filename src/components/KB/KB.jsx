import { useState, useEffect, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { css } from '../../../dist/styled-system/css';

const SPECIAL_KEYS = {
	SHIFT: '{shift}',
	LOCK: '{lock}',
};

const KB = ({
	keyCallback,
	initialLayout = 'default',
	twentyFourLetterAlphabet = false,
	showShiftKeys = true,
}) => {
	const [layout, setLayout] = useState(initialLayout);
	const keyboardRef = useRef(null);

	const handleShift = () => {
		const newLayoutName = layout === 'default' ? 'shift' : 'default';
		setLayout(newLayoutName);
	};

	const onKeyPress = button => {
		if (button === SPECIAL_KEYS.SHIFT || button === SPECIAL_KEYS.LOCK) {
			handleShift();
		} else {
			keyCallback(button);
		}
	};

	// Handle physical keyboard
	useEffect(() => {
		const handleKeyDown = event => {
			// Ignore if target is an input element
			if (
				event.target.tagName === 'INPUT' ||
				event.target.tagName === 'TEXTAREA'
			) {
				return;
			}

			// Handle shift key for layout switching (only if shift keys are shown)
			if (event.key === 'Shift' && showShiftKeys) {
				setLayout('shift');
				return;
			}

			// Only handle letter keys
			if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
				event.preventDefault();
				keyCallback(event.key);
			}
		};

		const handleKeyUp = event => {
			// Switch back to default layout when shift is released (only if shift keys are shown)
			if (event.key === 'Shift' && showShiftKeys) {
				setLayout('default');
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [keyCallback, showShiftKeys]);

	const buttonTheme = [
		{
			class: 'hg-red',
			buttons: 'Q W E R T Y q w e r t y',
		},
		{
			class: 'hg-highlight',
			buttons: 'Q q',
		},
	];

	if (layout === 'shift') {
		buttonTheme.push({
			class: 'hg-shift-active',
			buttons: '{shift}',
		});
	}

	const keyboardLayout = twentyFourLetterAlphabet
		? {
				default: [
					'q w e r t y u/v i/j o p',
					'a s d f g h j/i k l',
					showShiftKeys
						? '{shift} z x c v/u b n m {shift}'
						: 'z x c v/u b n m',
				],
				shift: [
					'Q W E R T Y U/V I/J O P',
					'A S D F G H J/I K L',
					showShiftKeys
						? '{shift} Z X C V/U B N M {shift}'
						: 'Z X C V/U B N M',
				],
			}
		: {
				default: [
					'q w e r t y u i o p',
					'a s d f g h j k l',
					showShiftKeys
						? '{shift} z x c v b n m {shift}'
						: 'z x c v b n m',
				],
				shift: [
					'Q W E R T Y U I O P',
					'A S D F G H J K L',
					showShiftKeys
						? '{shift} Z X C V B N M {shift}'
						: 'Z X C V B N M',
				],
			};

	return (
		<div
			className={css({
				width: '100%',
				maxWidth: '100%',
				'& .simple-keyboard': {
					maxWidth: '100%',
					fontSize: { base: '12px', sm: '15px' },
					padding: { base: '0', sm: '5px' },
				},
				'& .hg-row': {
					margin: { base: '0', sm: '0' },
				},
				'& .hg-row:not(:last-child)': {
					marginBottom: { base: '0 !important', sm: '5px' },
				},
				'& .hg-row .hg-button:not(:last-child)': {
					marginRight: { base: '0 !important', sm: '5px' },
				},
				'& .hg-button': {
					height: { base: '40px', sm: '50px' },
					fontSize: { base: '18px' },
					fontWeight: { base: 'bold !important', sm: 'normal' },
					minWidth: { base: '10px', sm: '30px' },
					padding: { base: '0', sm: '5px' },
					margin: { base: '0', sm: '6px' },
					borderLeft: {
						base: '1px solid {colors.ink} !important',
						sm: '1px solid {colors.ink} !important',
					},
					borderTop: {
						base: '1px solid {colors.ink} !important',
						sm: '1px solid {colors.ink} !important',
					},
					borderRight: {
						base: '0 !important',
						sm: '1px solid {colors.ink} !important',
					},
					borderBottom: {
						base: '0 !important',
						sm: '1px solid {colors.ink} !important',
					},
				},
				'& .hg-row:last-child .hg-button': {
					borderBottom: '1px solid {colors.ink} !important',
				},
				'& .hg-button:last-child': {
					borderRight: '1px solid {colors.ink} !important',
				},
			})}
		>
			<Keyboard
				key={twentyFourLetterAlphabet ? 'twentyFour' : 'twentySix'}
				keyboardRef={r => (keyboardRef.current = r)}
				layoutName={layout}
				onKeyPress={onKeyPress}
				layout={keyboardLayout}
				buttonTheme={buttonTheme}
			/>
		</div>
	);
};

export { KB };
export default KB;
