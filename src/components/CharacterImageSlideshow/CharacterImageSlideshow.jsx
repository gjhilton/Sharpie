import { useState, useEffect } from 'react';
import { CharacterImage } from '@components/CharacterImage/CharacterImage';

const DEFAULT_INTERVAL = 2000;

export const CharacterImageSlideshow = ({
	imagePaths,
	caption,
	interval = DEFAULT_INTERVAL,
	showBaseline = false,
	baselineColor = 'baseline',
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (!imagePaths || imagePaths.length === 0) return;

		const timer = setInterval(() => {
			setCurrentIndex(prevIndex => (prevIndex + 1) % imagePaths.length);
		}, interval);

		return () => clearInterval(timer);
	}, [imagePaths, interval]);

	if (!imagePaths || imagePaths.length === 0) {
		return null;
	}

	return (
		<CharacterImage
			imagePath={imagePaths[currentIndex]}
			caption={caption}
			showBaseline={showBaseline}
			baselineColor={baselineColor}
		/>
	);
};
