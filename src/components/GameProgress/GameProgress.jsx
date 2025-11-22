import { css } from '../../../styled-system/css';
import { GAME_END_MODE } from '@constants/options.js';
import { getLivesRemaining } from '@utilities/gameLogic.js';

const containerStyle = css({
	textAlign: 'center',
	fontSize: 's',
	color: 'var(--color-fg-muted)',
	minHeight: '1.5em',
	marginBottom: '0.5rem',
});

const livesStyle = css({
	display: 'flex',
	justifyContent: 'center',
	gap: '0.25rem',
});

const heartStyle = css({
	fontSize: 'm',
});

const heartLostStyle = css({
	fontSize: 'm',
	opacity: 0.3,
});

const GameProgress = ({
	gameEndMode,
	correctCount,
	incorrectCount,
	questionCount,
}) => {
	const totalAnswered = correctCount + incorrectCount;

	// ON_QUIT and SUDDEN_DEATH modes show nothing
	if (
		gameEndMode === GAME_END_MODE.ON_QUIT ||
		gameEndMode === GAME_END_MODE.SUDDEN_DEATH
	) {
		return <div className={containerStyle} />;
	}

	// FIXED_NUM mode shows question progress
	if (gameEndMode === GAME_END_MODE.FIXED_NUM) {
		const remaining = Math.max(0, questionCount - totalAnswered);
		return (
			<div className={containerStyle}>
				Question {totalAnswered + 1} of {questionCount}
				{remaining > 0 && ` (${remaining} remaining)`}
			</div>
		);
	}

	// THREE_LIVES mode shows lives remaining
	if (gameEndMode === GAME_END_MODE.THREE_LIVES) {
		const lives = getLivesRemaining(incorrectCount);
		return (
			<div className={containerStyle}>
				<div className={livesStyle}>
					{[0, 1, 2].map(i => (
						<span
							key={i}
							className={i < lives ? heartStyle : heartLostStyle}
							aria-hidden="true"
						>
							&#x2764;
						</span>
					))}
				</div>
				<span className="visually-hidden">
					{lives} {lives === 1 ? 'life' : 'lives'} remaining
				</span>
			</div>
		);
	}

	return <div className={containerStyle} />;
};

export default GameProgress;
