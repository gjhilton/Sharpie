import { useState, useEffect, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const SPECIAL_KEYS = {
	SHIFT: '{shift}',
	LOCK: '{lock}',
};

const KB = ({
	keyCallback,
	initialLayout = 'default',
	doubledLetterMode = false,
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

			// Handle shift key for layout switching
			if (event.key === 'Shift') {
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
			// Switch back to default layout when shift is released
			if (event.key === 'Shift') {
				setLayout('default');
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [keyCallback]);

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

	const keyboardLayout = doubledLetterMode
		? {
				default: [
					'q w e r t y u/v i/j o p',
					'a s d f g h j/i k l',
					'{shift} z x c v/u b n m {shift}',
				],
				shift: [
					'Q W E R T Y U/V I/J O P',
					'A S D F G H J/I K L',
					'{shift} Z X C V/U B N M {shift}',
				],
			}
		: {
				default: [
					'q w e r t y u i o p',
					'a s d f g h j k l',
					'{shift} z x c v b n m {shift}',
				],
				shift: [
					'Q W E R T Y U I O P',
					'A S D F G H J K L',
					'{shift} Z X C V B N M {shift}',
				],
			};

	return (
		<div>
			<Keyboard
				key={doubledLetterMode ? 'doubled' : 'normal'}
				keyboardRef={r => (keyboardRef.current = r)}
				layoutName={layout}
				onKeyPress={onKeyPress}
				layout={keyboardLayout}
				buttonTheme={buttonTheme}
			/>
		</div>
	);
};

export default KB;
