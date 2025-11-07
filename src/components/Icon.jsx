import { css } from '../../styled-system/css';

const Icon = ({
	icon,
	size = 24,
	colour = 'currentColor',
	weight = 2,
	className = '',
}) => {
	const svgStyles = {
		display: 'inline-block',
		fill: 'none',
		strokeLinecap: 'round',
		strokeMiterlimit: '10',
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
			viewBox="0 0 24 24"
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

export default Icon;

export const ICON_TYPE = {
	CROSS: {
		path: 'M6 6l12 12M18 6L6 18',
	},
	TICK: {
		path: 'M4 13l5 5L20 7',
	},
};
