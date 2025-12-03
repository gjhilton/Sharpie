import { useNavigate, useRouterState } from '@tanstack/react-router';
import { css } from '../../../dist/styled-system/css';
import { Button } from '@components/Button/Button';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
import { Heading } from '@components/Layout/Layout.jsx';
import { CharacterImage } from '@components/CharacterImage/CharacterImage';
import { useEnterKey } from '@lib/hooks/useEnterKey.js';
import { useGameOptions } from '@lib/hooks/useGameOptions.js';

const formatTime = seconds => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	if (mins > 0) {
		return `${mins}m ${secs}s`;
	}
	return `${secs}s`;
};

const StatCard = ({ label, value, bgColor, textColor }) => (
	<div
		className={css({
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: '1rem',
			backgroundColor: bgColor,
			borderRadius: '8px',
		})}
	>
		<span
			className={css({
				fontSize: 'm',
				fontWeight: 'bold',
				color: textColor,
			})}
		>
			{label}
		</span>
		<span
			className={css({
				fontSize: 'xl',
				fontWeight: 'bold',
				color: textColor,
			})}
		>
			{value}
		</span>
	</div>
);

const MistakeCard = ({ graph, imagePath, showBaseline }) => (
	<div
		className={css({
			padding: '1rem',
			textAlign: 'center',
		})}
	>
		<div
			className={css({
				height: '150px',
				marginBottom: '0.5rem',
			})}
		>
			<CharacterImage
				imagePath={imagePath}
				caption={graph.character}
				showBaseline={showBaseline}
			/>
		</div>
		<div
			className={css({
				fontSize: 'm',
				fontWeight: 'bold',
				marginTop: '0.5rem',
			})}
		>
			{graph.character}
		</div>
	</div>
);

const ScoreScreen = () => {
	const navigate = useNavigate();
	const routerState = useRouterState();
	const { options } = useGameOptions();

	// Get score from router state, or use empty defaults
	const score = routerState.location.state?.score || {
		correct: 0,
		incorrect: 0,
		percentage: 0,
		timeElapsed: 0,
		mistakes: [],
	};

	const { correct, incorrect, percentage, timeElapsed, mistakes = [] } = score;
	const { showBaseline } = options;

	const handleReturnToMenu = () => navigate({ to: '/', search: prev => prev });
	const handleShowFeedback = () => navigate({ to: '/feedback', search: prev => prev });

	useEnterKey(handleReturnToMenu);

	const stats = [
		{
			label: 'Correct Answers',
			value: correct,
		},
		{
			label: 'Incorrect Answers',
			value: incorrect,
			textColor: '{colors.error}',
		},
		{
			label: 'Accuracy',
			value: `${percentage}%`,
		},
		{
			label: 'Time Taken',
			value: formatTime(timeElapsed),
		},
	];

	return (
		<div>
			<div
				className={css({
					maxWidth: '600px',
					margin: '0 auto',
					padding: '2rem',
				})}
			>
				<div
					className={css({
						display: 'grid',
						gap: '1.5rem',
					})}
				>
					{stats.map((stat, index) => (
						<StatCard
							key={index}
							label={stat.label}
							value={stat.value}
							bgColor={stat.bgColor}
							textColor={stat.textColor}
						/>
					))}
				</div>
			</div>

			{mistakes.length > 0 && (
				<div
					className={css({
						maxWidth: '800px',
						margin: '2rem auto 0',
						padding: '2rem',
					})}
				>
					<Heading
						className={css({
							textAlign: 'left',
							marginBottom: '1.5rem',
						})}
					>
						Letters to Review
					</Heading>
					<div
						className={css({
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
							gap: '1rem',
						})}
					>
						{mistakes.map((mistake, index) => (
							<MistakeCard
								key={index}
								graph={mistake.graph}
								imagePath={mistake.imagePath}
								showBaseline={showBaseline}
							/>
						))}
					</div>
				</div>
			)}

			<div
				className={css({
					display: 'flex',
					justifyContent: 'center',
					marginTop: '2rem',
					padding: { base: '0 2rem', sm: '0' },
				})}
			>
				<Button onClick={handleReturnToMenu} label="Return to Menu" />
			</div>

			<div
				className={css({
					maxWidth: '600px',
					margin: '2rem auto',
					padding: '0 2rem',
				})}
			>
				<SmallPrint onShowFeedback={handleShowFeedback} />
			</div>
		</div>
	);
};

export { ScoreScreen };
export default ScoreScreen;
