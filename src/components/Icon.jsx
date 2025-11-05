const Icon = props => {
	const styles = {
		path: {
			stroke: props.colour ? props.colour : 'currentColor',
			strokeWidth: props.weight
		},
		svg: {
			display: 'inline-block',
			fill: 'none',
			strokeLinecap: 'round',
			strokeMiterlimit: '10',
			verticalAlign: 'middle'
		}
	}

	return (
		<svg
			className='Icon'
			style={styles.svg}
			width={`${props.size}px`}
			height={`${props.size}px`}
			viewBox='0 0 24 24'
		>
			<path vectorEffect='non-scaling-stroke' style={styles.path} d={props.icon.path} />
		</svg>
	)
}

export default Icon

export const ICON_TYPE = {
	CROSS: {
		names: [],
		path: 'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zM8.5 8.9l7 6.9m-7 0l7-6.9'
	},
	INFO: {
		names: [],
		path: 'M12 11v5m0-7V8m0-6a10 10 0 1 0 0 20 10 10 0 1 0 0-20z'
	},
	TICK: {
		names: [],
		path: 'M4 13l5 5L20 7'
	},
}
