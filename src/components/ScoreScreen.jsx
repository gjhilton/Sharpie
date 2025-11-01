import { css } from '../../styled-system/css';
import Button from './Button.jsx';

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
				fontSize: '1.2rem',
				fontWeight: 'bold',
				color: textColor,
			})}
		>
			{label}
		</span>
		<span
			className={css({
				fontSize: '2rem',
				fontWeight: 'bold',
				color: textColor,
			})}
		>
			{value}
		</span>
	</div>
);

const ScoreScreen = ({ score, onReturnToMenu }) => {
	const { correct, incorrect, percentage, timeElapsed } = score;

	const stats = [
		{
			label: 'Correct Answers',
			value: correct,
			bgColor: '#e8f5e9',
			textColor: '#2e7d32',
		},
		{
			label: 'Incorrect Answers',
			value: incorrect,
			bgColor: '#ffebee',
			textColor: '#c62828',
		},
		{
			label: 'Accuracy',
			value: `${percentage}%`,
			bgColor: '#e3f2fd',
			textColor: '#1565c0',
		},
		{
			label: 'Time Taken',
			value: formatTime(timeElapsed),
			bgColor: '#fff3e0',
			textColor: '#ef6c00',
		},
	];

	return (
		<div>
			<h1
				className={css({
					fontSize: '3rem',
					textAlign: 'center',
					marginBottom: '2rem',
					color: '#333',
				})}
			>
				Game Complete!
			</h1>

			<div
				className={css({
					maxWidth: '600px',
					margin: '0 auto',
					padding: '2rem',
					backgroundColor: '#f5f5f5',
					borderRadius: '12px',
					boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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

			<div
				className={css({
					display: 'flex',
					justifyContent: 'center',
					marginTop: '2rem',
				})}
			>
				<Button onClick={onReturnToMenu} label="Return to Menu" />
			</div>
		</div>
	);
};

export default ScoreScreen;
