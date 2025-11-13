import { css } from '../../../styled-system/css';
import CharacterImage from '@components/CharacterImage/CharacterImage.jsx';
import { Section, Heading, Paragraph } from '@components/Layout/Layout.jsx';
import Toggle from '@components/Toggle/Toggle.jsx';

const LandingSectionBaselines = ({ showBaseline, setShowBaseline }) => {
	// Using Joscelyn majuscule S as the example
	// Construct path using the same pattern as getImagePath in database.js
	const baseUrl = import.meta.env.BASE_URL || '/';
	const exampleImagePath = `${baseUrl}data/Joscelyn/joscelyn-majuscule-assets/S.png`;

	return (
		<Section title={<Heading>How baselines work</Heading>}>
			<Paragraph>
				Show the approximate baseline of the characters (can be useful for
				distinguishing majuscule from minuscule).
			</Paragraph>

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

			<Paragraph>
				When enabled, a baseline appears across each character image. This
				can help distinguish between majuscule (uppercase) and minuscule
				(lowercase) forms, as minuscule characters typically sit on the
				baseline while majuscule characters may extend above it.
			</Paragraph>

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
							border: '1px solid #ccc',
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
							border: '1px solid #ccc',
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

			<Paragraph>
				<em>Example: Joscelyn majuscule S</em>
			</Paragraph>
		</Section>
	);
};

export default LandingSectionBaselines;
