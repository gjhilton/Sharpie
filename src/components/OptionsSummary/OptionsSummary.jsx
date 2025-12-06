import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { css } from '../../../dist/styled-system/css';
import { OPTIONS } from '@lib/options/schema';
import { Badge } from '@components/Badge/Badge';
import { useGameOptionsContext } from '@lib/context/GameOptionsContext';

const Strong = ({ children, isError }) => (
	<span
		className={css({
			fontWeight: 'bold',
			...(isError && { color: 'error' }),
		})}
	>
		{children}
	</span>
);

const OptionsSummary = ({ options, handCount }) => {
	const { toggleOption, cycleMode } = useGameOptionsContext();
	const navigate = useNavigate();

	const renderBadgeLabel = (labelData) => {
		const parts = [];

		if (labelData.text) parts.push(labelData.text);
		if (labelData.icon)
			parts.push(
				<Strong key="icon1" isError={labelData.icon === '✗'}>
					{labelData.icon}
				</Strong>
			);
		if (labelData.value) parts.push(<Strong key="value">{labelData.value}</Strong>);
		if (labelData.text2) parts.push(labelData.text2);
		if (labelData.icon2)
			parts.push(
				<Strong key="icon2" isError={labelData.icon2 === '✗'}>
					{labelData.icon2}
				</Strong>
			);

		return parts.length > 0 ? (
			<>
				{parts.map((part, idx) => {
					const isText2 = typeof part === 'string' && part === labelData.text2;
					const prefix = isText2 && labelData.text ? ' ' : '';
					return (
						<span key={idx}>
							{prefix}
							{typeof part === 'string' ? part + ' ' : part}
						</span>
					);
				})}
			</>
		) : null;
	};

	const badges = useMemo(() => {
		return Object.values(OPTIONS)
			.filter(option => option.badge)
			.sort((a, b) => a.badge.order - b.badge.order)
			.map(option => {
				const value = options[option.key];
				const context = { handCount };
				const labelData = option.badge.renderLabel(value, context);

				let onClick;
				if (option.badge.action === 'toggle') {
					onClick = () => toggleOption(option.key);
				} else if (option.badge.action === 'cycle') {
					onClick = cycleMode;
				} else if (option.badge.action === 'navigate') {
					onClick = () => navigate({ to: option.badge.navigationPath, search: prev => prev });
				}

				return {
					id: option.key,
					label: renderBadgeLabel(labelData),
					onClick,
				};
			});
	}, [options, handCount, toggleOption, cycleMode, navigate]);

	return (
		<div
			className={css({
				display: 'flex',
				flexWrap: 'wrap',
				gap: 'sm',
			})}
			data-testid="options-summary-badges"
		>
			{badges.map(badge => (
				<Badge
					key={badge.id}
					testId={`badge-${badge.id}`}
					onClick={badge.onClick}
				>
					{badge.label}
				</Badge>
			))}
		</div>
	);
};

export { OptionsSummary };
