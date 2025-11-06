import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import { DB } from '../data/DB.js';
import * as db from '../utilities/database.js';
import * as catalogueLogic from '../utilities/catalogueLogic.js';

const SPACING = {
	SECTION_GAP: '2rem',
	GRAPHSET_GAP: '3rem',
	CHARACTER_GAP: '1.5rem',
	IMAGE_GAP: '0.5rem',
};

const IMAGE_SIZE = '120px';

const CharacterImages = ({ character, graphs }) => (
	<div
		className={css({
			display: 'flex',
			flexDirection: 'column',
			gap: SPACING.IMAGE_GAP,
			alignItems: 'center',
		})}
	>
		<h3
			className={css({
				fontSize: '2rem',
				fontWeight: 'bold',
				margin: 0,
			})}
		>
			{character}
		</h3>
		<div
			className={css({
				display: 'flex',
				flexWrap: 'wrap',
				gap: SPACING.IMAGE_GAP,
				justifyContent: 'center',
			})}
		>
			{graphs.map((graph, idx) => {
				const imagePath = db.getImagePath(graph);
				const source = DB.sources[graph.source];
				return (
					<div
						key={idx}
						className={css({
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '0.25rem',
						})}
					>
						<div
							className={css({
								width: IMAGE_SIZE,
								height: IMAGE_SIZE,
								background: 'white',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '0.5rem',
								border: '1px solid #ddd',
								borderRadius: '4px',
							})}
						>
							<img
								src={imagePath}
								alt={`${character} - ${source?.title || 'Unknown'}`}
								className={css({
									maxWidth: '100%',
									maxHeight: '100%',
									objectFit: 'contain',
								})}
							/>
						</div>
						<span
							className={css({
								fontSize: '0.75rem',
								color: '#666',
								textAlign: 'center',
							})}
						>
							{source?.title || 'Unknown'}
						</span>
					</div>
				);
			})}
		</div>
	</div>
);

const GraphSetSection = ({ title, characters }) => (
	<div
		className={css({
			display: 'flex',
			flexDirection: 'column',
			gap: SPACING.CHARACTER_GAP,
		})}
	>
		<h2
			className={css({
				fontSize: '2.5rem',
				fontWeight: 'bold',
				margin: 0,
				textAlign: 'center',
				borderBottom: '2px solid #333',
				paddingBottom: '0.5rem',
			})}
		>
			{title}
		</h2>
		{characters.map(({ character, graphs }) => (
			<CharacterImages
				key={character}
				character={character}
				graphs={graphs}
			/>
		))}
	</div>
);

const CatalogueScreen = ({ onReturnToMenu }) => {
	const enabledGraphSets = db.getEnabledGraphSets(DB);
	const catalogueData =
		catalogueLogic.groupGraphsByGraphSetAndCharacter(enabledGraphSets);

	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				gap: SPACING.SECTION_GAP,
				padding: SPACING.SECTION_GAP,
				maxWidth: '1200px',
				margin: '0 auto',
			})}
		>
			<div
				className={css({
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				})}
			>
				<h1
					className={css({
						fontSize: '3rem',
						fontWeight: 'bold',
						margin: 0,
					})}
				>
					Character Catalogue
				</h1>
				<Button onClick={onReturnToMenu} label="Return to Menu" />
			</div>

			<div
				className={css({
					display: 'flex',
					flexDirection: 'column',
					gap: SPACING.GRAPHSET_GAP,
				})}
			>
				{catalogueData.map(graphSet => (
					<GraphSetSection
						key={graphSet.title}
						title={graphSet.title}
						characters={graphSet.characters}
					/>
				))}
			</div>
		</div>
	);
};

export default CatalogueScreen;
