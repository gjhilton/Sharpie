import { css } from '../../styled-system/css';
import { useState, useEffect, useRef } from 'react';
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

const Popover = ({ children, content, isVisible }) => (
	<div className={css({ position: 'relative', display: 'inline-block' })}>
		{children}
		{isVisible && (
			<div
				className={css({
					position: 'absolute',
					bottom: '100%',
					left: '50%',
					transform: 'translateX(-50%)',
					marginBottom: '0.5rem',
					padding: '0.5rem 0.75rem',
					background: '#333',
					color: 'white',
					borderRadius: '4px',
					fontSize: '0.875rem',
					whiteSpace: 'nowrap',
					zIndex: 10,
					boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
					'&::after': {
						content: '""',
						position: 'absolute',
						top: '100%',
						left: '50%',
						transform: 'translateX(-50%)',
						borderWidth: '6px',
						borderStyle: 'solid',
						borderColor: '#333 transparent transparent transparent',
					},
				})}
			>
				{content}
			</div>
		)}
	</div>
);

const ImageWithInfo = ({ character, graph }) => {
	const [showPopover, setShowPopover] = useState(false);
	const popoverRef = useRef(null);
	const imagePath = db.getImagePath(graph);
	const source = DB.sources[graph.source];

	useEffect(() => {
		const handleClickOutside = event => {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(event.target)
			) {
				setShowPopover(false);
			}
		};

		if (showPopover) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showPopover]);

	return (
		<div
			ref={popoverRef}
			className={css({
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				position: 'relative',
			})}
		>
			<Popover
				content={source?.title || 'Unknown'}
				isVisible={showPopover}
			>
				<button
					onClick={() => setShowPopover(!showPopover)}
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
						cursor: 'pointer',
						transition: 'border-color 0.2s',
						'&:hover': {
							borderColor: '#999',
						},
					})}
					aria-label={`${character} - Click to show source: ${source?.title || 'Unknown'}`}
				>
					<img
						src={imagePath}
						alt={`${character}`}
						className={css({
							maxWidth: '100%',
							maxHeight: '100%',
							objectFit: 'contain',
							pointerEvents: 'none',
						})}
					/>
				</button>
			</Popover>
		</div>
	);
};

const CharacterImages = ({ character, graphs }) => (
	<div
		className={css({
			display: 'flex',
			flexDirection: 'column',
			gap: SPACING.IMAGE_GAP,
		})}
	>
		<h3
			className={css({
				fontSize: 'l',
				fontWeight: 'bold',
				margin: 0,
			})}
		>
			{character}
		</h3>
		<div
			className={css({
				display: 'grid',
				gridTemplateColumns: 'repeat(4, 1fr)',
				gap: SPACING.IMAGE_GAP,
			})}
		>
			{graphs.map((graph, idx) => (
				<ImageWithInfo key={idx} character={character} graph={graph} />
			))}
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
				fontSize: 'l',
				fontWeight: 'bold',
				margin: 0,
				textAlign: 'left',
				borderBottom: '2px solid black',
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
