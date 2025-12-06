import { css } from '../../../dist/styled-system/css';

const DEFAULT_SIZE = 24;
const DEFAULT_COLOUR = 'currentColor';
const DEFAULT_WEIGHT = 2;
const VIEWBOX = '0 0 24 24';
const STROKE_MITERLIMIT = '10';

const Icon = ({
	icon,
	size = DEFAULT_SIZE,
	colour = DEFAULT_COLOUR,
	weight = DEFAULT_WEIGHT,
	className = '',
}) => {
	const svgStyles = {
		display: 'inline-block',
		fill: 'none',
		strokeLinecap: 'round',
		strokeMiterlimit: STROKE_MITERLIMIT,
		verticalAlign: 'middle',
	};

	const pathStyles = {
		stroke: colour,
		strokeWidth: weight,
	};

	return (
		<svg
			style={svgStyles}
			className={className}
			width={`${size}px`}
			height={`${size}px`}
			viewBox={VIEWBOX}
			aria-hidden="true"
			role="img"
		>
			<path
				vectorEffect="non-scaling-stroke"
				style={pathStyles}
				d={icon.path}
			/>
		</svg>
	);
};

export const ICON_TYPE = {
	CROSS: {
		path: 'M6 6l12 12M18 6L6 18',
	},
	TICK: {
		path: 'M4 13l5 5L20 7',
	},
};

export { Icon };
