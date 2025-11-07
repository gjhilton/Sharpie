import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import SmallPrint from './SmallPrint.jsx';
import { Heading } from './Layout.jsx';

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

const MistakeCard = ({ graph, imagePath }) => (
	<div
		className={css({
			padding: '1rem',
			textAlign: 'center',
		})}
	>
		<img
			src={imagePath}
			alt={graph.character}
			className={css({
				maxWidth: '100%',
				height: 'auto',
				padding: '1rem',
			})}
		/>
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

const ScoreScreen = ({ score, onReturnToMenu, onShowFeedback }) => {
	const {
		correct,
		incorrect,
		percentage,
		timeElapsed,
		mistakes = [],
	} = score;

	const stats = [
		{
			label: 'Correct Answers',
			value: correct,
		},
		{
			label: 'Incorrect Answers',
			value: incorrect,
			textColor: '#ff0000',
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
							gridTemplateColumns:
								'repeat(auto-fill, minmax(150px, 1fr))',
							gap: '1rem',
						})}
					>
						{mistakes.map((mistake, index) => (
							<MistakeCard
								key={index}
								graph={mistake.graph}
								imagePath={mistake.imagePath}
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
				})}
			>
				<Button onClick={onReturnToMenu} label="Return to Menu" />
			</div>

			<div
				className={css({
					maxWidth: '600px',
					margin: '2rem auto',
					padding: '0 2rem',
				})}
			>
				<SmallPrint onShowFeedback={onShowFeedback} />
			</div>
		</div>
	);
};

export default ScoreScreen;
