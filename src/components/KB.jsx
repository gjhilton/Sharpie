import { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

const SPECIAL_KEYS = {
	SHIFT: '{shift}',
	LOCK: '{lock}',
};

const KB = ({ keyCallback, initialLayout = 'default' }) => {
	const [layout, setLayout] = useState(initialLayout);

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

	return (
		<div>
			<Keyboard
				layoutName={layout}
				onKeyPress={onKeyPress}
				layout={{
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
				}}
			/>
		</div>
	);
};

export default KB;
