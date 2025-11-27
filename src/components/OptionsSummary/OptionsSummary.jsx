import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { css } from '../../../dist/styled-system/css';
import { OPTIONS } from '@lib/options/schema.js';
import Badge from '@components/Badge/Badge.jsx';
import { useGameOptionsContext } from '@context/GameOptionsContext.jsx';

const Strong = ({ children }) => (
	<span style={{ fontWeight: 'bold' }}>{children}</span>
);

const OptionsSummary = ({ options, alphabetCount }) => {
	const { toggleOption, cycleMode } = useGameOptionsContext();
	const navigate = useNavigate();

	// Helper to render badge label from schema
	const renderBadgeLabel = (labelData) => {
		const parts = [];

		if (labelData.text) parts.push(labelData.text);
		if (labelData.icon) parts.push(<Strong key="icon1">{labelData.icon}</Strong>);
		if (labelData.value) parts.push(<Strong key="value">{labelData.value}</Strong>);
		if (labelData.text2) parts.push(labelData.text2);
		if (labelData.icon2) parts.push(<Strong key="icon2">{labelData.icon2}</Strong>);

		return parts.length > 0 ? (
			<>
				{parts.map((part, idx) => (
					<span key={idx}>{typeof part === 'string' ? part + ' ' : part}</span>
				))}
			</>
		) : null;
	};

	// Generate badges from schema
	const badges = useMemo(() => {
		return Object.values(OPTIONS)
			.filter(option => option.badge)
			.sort((a, b) => a.badge.order - b.badge.order)
			.map(option => {
				const value = options[option.key];
				const context = { alphabetCount };
				const labelData = option.badge.renderLabel(value, context);

				// Determine onClick handler based on action type
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
	}, [options, alphabetCount, toggleOption, cycleMode, navigate]);

	return (
		<div
			className={css({
				display: 'flex',
				flexWrap: 'wrap',
				gap: '0.5rem',
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

export default OptionsSummary;
