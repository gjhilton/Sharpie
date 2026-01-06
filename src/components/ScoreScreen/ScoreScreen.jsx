import { useNavigate, useRouterState } from '@tanstack/react-router';
import { css } from '../../../dist/styled-system/css';
import { Button } from '@components/Button/Button';
import { SmallPrint } from '@components/SmallPrint/SmallPrint';
import { Heading } from '@components/Layout/Layout';
import { CharacterImage } from '@components/CharacterImage/CharacterImage';
import { useEnterKey } from '@lib/hooks/useEnterKey';
import { useGameOptions } from '@lib/hooks/useGameOptions';

const SECONDS_PER_MINUTE = 60;

const formatTime = seconds => {
	const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
	const secs = seconds % SECONDS_PER_MINUTE;
	if (mins > 0) {
		return `${mins}m ${secs}s`;
	}
	return `${secs}s`;
};

const STAT_CARD_PADDING = 'lg';
const STAT_CARD_BORDER_RADIUS = '8px';
const STAT_LABEL_FONT_SIZE = 'm';
const STAT_VALUE_FONT_SIZE = 'xl';

const StatCard = ({ label, value, bgColor, textColor }) => (
	<div
		className={css({
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: STAT_CARD_PADDING,
			backgroundColor: bgColor,
			borderRadius: STAT_CARD_BORDER_RADIUS,
		})}
	>
		<span
			className={css({
				fontSize: STAT_LABEL_FONT_SIZE,
				fontWeight: 'bold',
				color: textColor,
			})}
		>
			{label}
		</span>
		<span
			className={css({
				fontSize: STAT_VALUE_FONT_SIZE,
				fontWeight: 'bold',
				color: textColor,
			})}
		>
			{value}
		</span>
	</div>
);

const MISTAKE_CARD_PADDING = 'lg';
const MISTAKE_IMAGE_HEIGHT = '150px';
const MISTAKE_IMAGE_MARGIN_BOTTOM = 'sm';
const MISTAKE_LABEL_FONT_SIZE = 'm';
const MISTAKE_LABEL_MARGIN_TOP = 'sm';

const MistakeCard = ({ graph, imagePath, showBaseline }) => (
	<div
		className={css({
			padding: MISTAKE_CARD_PADDING,
			textAlign: 'center',
		})}
	>
		<div
			className={css({
				height: MISTAKE_IMAGE_HEIGHT,
				marginBottom: MISTAKE_IMAGE_MARGIN_BOTTOM,
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
				fontSize: MISTAKE_LABEL_FONT_SIZE,
				fontWeight: 'bold',
				marginTop: MISTAKE_LABEL_MARGIN_TOP,
			})}
		>
			{graph.character}
		</div>
	</div>
);

const DEFAULT_SCORE = {
	correct: 0,
	incorrect: 0,
	percentage: 0,
	timeElapsed: 0,
	mistakes: [],
};

const CONTAINER_MAX_WIDTH = '600px';
const CONTAINER_PADDING = '3xl';
const GRID_GAP = '2xl';
const MISTAKES_MAX_WIDTH = '800px';
const MISTAKES_MARGIN_TOP = '3xl';
const MISTAKES_HEADING_MARGIN_BOTTOM = '2xl';
const MISTAKES_GRID_MIN_WIDTH = '150px';
const MISTAKES_GRID_GAP = 'lg';
const BUTTON_MARGIN_TOP = '3xl';
const BUTTON_PADDING_HORIZONTAL = '3xl';
const FOOTER_MARGIN_VERTICAL = '3xl';
const FOOTER_PADDING_HORIZONTAL = '3xl';

const ScoreScreen = () => {
	const navigate = useNavigate();
	const routerState = useRouterState();
	const { options } = useGameOptions();

	const score = routerState.location.state?.score || DEFAULT_SCORE;

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
					maxWidth: CONTAINER_MAX_WIDTH,
					margin: '0 auto',
					padding: CONTAINER_PADDING,
				})}
			>
				<div
					className={css({
						display: 'grid',
						gap: GRID_GAP,
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
						maxWidth: MISTAKES_MAX_WIDTH,
						marginTop: MISTAKES_MARGIN_TOP,
						marginLeft: 'auto',
						marginRight: 'auto',
						marginBottom: 0,
						padding: CONTAINER_PADDING,
					})}
				>
					<Heading
						className={css({
							textAlign: 'left',
							marginBottom: MISTAKES_HEADING_MARGIN_BOTTOM,
						})}
					>
						Letters to Review
					</Heading>
					<div
						className={css({
							display: 'grid',
							gridTemplateColumns: `repeat(auto-fill, minmax(${MISTAKES_GRID_MIN_WIDTH}, 1fr))`,
							gap: MISTAKES_GRID_GAP,
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
					marginTop: BUTTON_MARGIN_TOP,
					paddingLeft: { base: BUTTON_PADDING_HORIZONTAL, sm: 0 },
					paddingRight: { base: BUTTON_PADDING_HORIZONTAL, sm: 0 },
				})}
			>
				<Button onClick={handleReturnToMenu} label="Return to Menu" />
			</div>

			<div
				className={css({
					maxWidth: CONTAINER_MAX_WIDTH,
					marginTop: FOOTER_MARGIN_VERTICAL,
					marginBottom: FOOTER_MARGIN_VERTICAL,
					marginLeft: 'auto',
					marginRight: 'auto',
					paddingLeft: FOOTER_PADDING_HORIZONTAL,
					paddingRight: FOOTER_PADDING_HORIZONTAL,
				})}
			>
				<SmallPrint onShowFeedback={handleShowFeedback} />
			</div>
		</div>
	);
};

export { ScoreScreen };
