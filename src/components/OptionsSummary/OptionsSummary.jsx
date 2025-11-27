import { useState, useRef, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from '@tanstack/react-router';
import { css } from '../../../dist/styled-system/css';
import { serializeOptions } from '@lib/options/serializer.js';
import { OPTIONS } from '@lib/options/schema.js';
import InputWithButton from '@components/InputWithButton/InputWithButton.jsx';
import Badge from '@components/Badge/Badge.jsx';
import { useGameOptionsContext } from '@context/GameOptionsContext.jsx';

const Strong = ({ children }) => (
	<span style={{ fontWeight: 'bold' }}>{children}</span>
);

// Badges component - extracted to prevent state issues
const OptionsBadges = ({ options, alphabetCount }) => {
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

// URL Section component - extracted to maintain state properly
const URLSection = ({ options }) => {
	const [copySuccess, setCopySuccess] = useState(false);
	const [showQR, setShowQR] = useState(false);
	const qrRef = useRef(null);

	// Generate shareable URL
	const shareableURL = useMemo(() => {
		const serialized = serializeOptions(options);
		const params = new URLSearchParams(serialized);
		const queryString = params.toString();
		const baseUrl = `${window.location.origin}${window.location.pathname}`;
		return queryString ? `${baseUrl}?${queryString}` : baseUrl;
	}, [options]);

	// Copy to clipboard
	const handleCopy = async () => {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(shareableURL);
			} else {
				// Fallback for older browsers
				const textarea = document.createElement('textarea');
				textarea.value = shareableURL;
				textarea.style.position = 'fixed';
				textarea.style.opacity = '0';
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
			}
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	// Toggle QR code display
	const handleToggleQR = () => {
		setShowQR(prev => !prev);
	};

	// Download QR code
	const handleDownloadQR = () => {
		if (!qrRef.current) return;

		const svg = qrRef.current.querySelector('svg');
		if (!svg) return;

		const svgData = new XMLSerializer().serializeToString(svg);
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new Image();

		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0);

			canvas.toBlob(blob => {
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'secretary-settings-qr.png';
				a.click();
				URL.revokeObjectURL(url);
			});
		};

		img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
	};

	return (
		<>
			{/* URL input with Copy and QR buttons */}
			<InputWithButton
				inputId="shareable-url"
				inputType="text"
				inputReadOnly
				inputValue={shareableURL}
				inputOnClick={e => e.target.select()}
				inputOnFocus={e => e.target.select()}
				inputOnTouchStart={e => {
					e.target.focus();
					e.target.select();
				}}
				fontFamily="monospace"
				fontSize="s"
				marginBottom={showQR ? '0' : '0.75rem'}
				cursor="text"
				buttonLabel={copySuccess ? 'Copied!' : 'Copy'}
				buttonOnClick={handleCopy}
				buttonActive={copySuccess}
				rightButton2Label={showQR ? 'Hide QR' : 'QR'}
				rightButton2OnClick={handleToggleQR}
				rightButton2Active={showQR}
			/>

			{/* QR Code display - full width box centered underneath URL field */}
			{showQR && (
				<div
					ref={qrRef}
					className={css({
						marginTop: '0',
						padding: '1rem',
						border: '1px solid {colors.ink}',
						borderTop: 'none',
						backgroundColor: 'white',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					})}
				>
					<QRCodeSVG value={shareableURL} size={200} level="M" />
					<div
						className={css({
							marginTop: '0.5rem',
							textAlign: 'center',
						})}
					>
						<button
							type="button"
							onClick={handleDownloadQR}
							className={css({
								padding: '0.5rem 1rem',
								border: '1px solid {colors.ink}',
								backgroundColor: '{colors.paper}',
								color: '{colors.ink}',
								cursor: 'pointer',
								fontSize: 's',
								fontWeight: 'bold',
								transition: 'all 150ms ease-in-out',
								_hover: {
									transform: 'scale(1.02)',
								},
								_active: {
									transform: 'scale(0.98)',
								},
								_focusVisible: {
									outline: '2px solid {colors.ink}',
									outlineOffset: '2px',
								},
							})}
						>
							Download
						</button>
					</div>
				</div>
			)}
		</>
	);
};

// Main component that returns both parts
const OptionsSummary = ({ options, alphabetCount }) => {
	return {
		badges: <OptionsBadges options={options} alphabetCount={alphabetCount} />,
		urlSection: <URLSection options={options} />,
	};
};

export default OptionsSummary;
