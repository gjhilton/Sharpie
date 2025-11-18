import { css } from '../../../styled-system/css';
import CharacterImage from '@components/CharacterImage/CharacterImage.jsx';
import { Section, Heading } from '@components/Layout/Layout.jsx';
import Toggle from '@components/Toggle/Toggle.jsx';
import MarkdownWithPlaceholders from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx';
import baselinesContent from '@data/baselines.md?raw';

const LandingSectionBaselines = ({ showBaseline, setShowBaseline }) => {
	const baseUrl = import.meta.env.BASE_URL || '/';
	const exampleImagePath = `${baseUrl}data/Joscelyn/joscelyn-majuscule-assets/S.png`;

	const placeholders = {
		BASELINE_TOGGLE: (
			<div
				className={css({
					marginTop: '1rem',
					marginBottom: '1rem',
				})}
			>
				<Toggle
					id="baseline-toggle"
					label="Show baselines"
					checked={showBaseline}
					onChange={setShowBaseline}
				/>
			</div>
		),
		BASELINE_EXAMPLES: (
			<div
				className={css({
					display: 'grid',
					gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
					gap: '2rem',
					marginTop: '2rem',
					marginBottom: '1rem',
				})}
			>
				<div>
					<div
						className={css({
							fontWeight: 'bold',
							textAlign: 'center',
							marginBottom: '0.5rem',
						})}
					>
						Without baseline
					</div>
					<div
						className={css({
							height: '300px',
							border: '1px solid {colors.border}',
						})}
					>
						<CharacterImage
							imagePath={exampleImagePath}
							caption="Joscelyn majuscule S"
							showBaseline={false}
						/>
					</div>
				</div>

				<div>
					<div
						className={css({
							fontWeight: 'bold',
							textAlign: 'center',
							marginBottom: '0.5rem',
						})}
					>
						With baseline
					</div>
					<div
						className={css({
							height: '300px',
							border: '1px solid {colors.border}',
						})}
					>
						<CharacterImage
							imagePath={exampleImagePath}
							caption="Joscelyn majuscule S with baseline"
							showBaseline={true}
						/>
					</div>
				</div>
			</div>
		),
	};

	return (
		<Section title={<Heading>Baselines</Heading>}>
			<MarkdownWithPlaceholders
				content={baselinesContent}
				placeholders={placeholders}
			/>
		</Section>
	);
};

export default LandingSectionBaselines;
