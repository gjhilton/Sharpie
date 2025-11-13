import { useState, useEffect } from 'react';
import CharacterImage from '@components/CharacterImage/CharacterImage.jsx';

const CharacterImageSlideshow = ({
	imagePaths,
	caption,
	graph,
	interval = 2000,
	showBaseline = false,
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
			graph={graph}
			showBaseline={showBaseline}
		/>
	);
};

export default CharacterImageSlideshow;
