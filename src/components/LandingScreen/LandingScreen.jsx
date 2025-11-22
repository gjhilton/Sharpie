import { PageWidth } from '@components/Layout/Layout.jsx';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
import LandingSectionHero from '@components/LandingSectionHero/LandingSectionHero.jsx';

const LandingScreen = ({
	onSelectMode,
	onShowCatalogue,
	onShowFeedback,
	options,
	optionsSource,
	setOption,
	resetOptions,
	enabledAlphabets,
}) => {
	return (
		<PageWidth>
			<LandingSectionHero
				onSelectMode={onSelectMode}
				options={options}
				optionsSource={optionsSource}
				setOption={setOption}
				resetOptions={resetOptions}
				enabledAlphabets={enabledAlphabets}
				onShowCatalogue={onShowCatalogue}
			/>

			<SmallPrint onShowFeedback={onShowFeedback} />
		</PageWidth>
	);
};

export default LandingScreen;
