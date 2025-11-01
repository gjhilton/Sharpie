import { css } from '../../styled-system/css';
import StageButton from './StageButton.jsx';

const ScoreScreen = ({ score, onReturnToMenu }) => {
	const { correct, incorrect, percentage, timeElapsed } = score;

	const formatTime = seconds => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		if (mins > 0) {
			return `${mins}m ${secs}s`;
		}
		return `${secs}s`;
	};

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
					<div
						className={css({
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '1rem',
							backgroundColor: '#e8f5e9',
							borderRadius: '8px',
						})}
					>
						<span
							className={css({
								fontSize: '1.2rem',
								fontWeight: 'bold',
								color: '#2e7d32',
							})}
						>
							Correct Answers
						</span>
						<span
							className={css({
								fontSize: '2rem',
								fontWeight: 'bold',
								color: '#2e7d32',
							})}
						>
							{correct}
						</span>
					</div>

					<div
						className={css({
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '1rem',
							backgroundColor: '#ffebee',
							borderRadius: '8px',
						})}
					>
						<span
							className={css({
								fontSize: '1.2rem',
								fontWeight: 'bold',
								color: '#c62828',
							})}
						>
							Incorrect Answers
						</span>
						<span
							className={css({
								fontSize: '2rem',
								fontWeight: 'bold',
								color: '#c62828',
							})}
						>
							{incorrect}
						</span>
					</div>

					<div
						className={css({
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '1rem',
							backgroundColor: '#e3f2fd',
							borderRadius: '8px',
						})}
					>
						<span
							className={css({
								fontSize: '1.2rem',
								fontWeight: 'bold',
								color: '#1565c0',
							})}
						>
							Accuracy
						</span>
						<span
							className={css({
								fontSize: '2rem',
								fontWeight: 'bold',
								color: '#1565c0',
							})}
						>
							{percentage}%
						</span>
					</div>

					<div
						className={css({
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '1rem',
							backgroundColor: '#fff3e0',
							borderRadius: '8px',
						})}
					>
						<span
							className={css({
								fontSize: '1.2rem',
								fontWeight: 'bold',
								color: '#ef6c00',
							})}
						>
							Time Taken
						</span>
						<span
							className={css({
								fontSize: '2rem',
								fontWeight: 'bold',
								color: '#ef6c00',
							})}
						>
							{formatTime(timeElapsed)}
						</span>
					</div>
				</div>
			</div>

			<div
				className={css({
					display: 'flex',
					justifyContent: 'center',
					marginTop: '2rem',
				})}
			>
				<StageButton onClick={onReturnToMenu} label="Return to Menu" />
			</div>
		</div>
	);
};

export default ScoreScreen;
