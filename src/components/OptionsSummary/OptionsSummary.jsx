import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { css } from '../../../dist/styled-system/css';
import { serializeOptions } from '@lib/options/serializer.js';
import InputWithButton from '@components/InputWithButton/InputWithButton.jsx';
import Badge from '@components/Badge/Badge.jsx';
import { useGameOptionsContext } from '@context/GameOptionsContext.jsx';

const Strong = ({ children }) => (
	<span style={{ fontWeight: 'bold' }}>{children}</span>
);

const OptionsSummary = ({ options, alphabetCount, onShowCatalogue }) => {
	const { toggleOption, cycleMode } = useGameOptionsContext();
	const [copySuccess, setCopySuccess] = useState(false);
	const [showQR, setShowQR] = useState(false);
	const qrRef = useRef(null);

	// Generate shareable URL
	const generateURL = () => {
		const serialized = serializeOptions(options);
		const params = new URLSearchParams(serialized);
		const queryString = params.toString();
		const baseUrl = `${window.location.origin}${window.location.pathname}`;
		return queryString ? `${baseUrl}?${queryString}` : baseUrl;
	};

	const shareableURL = generateURL();

	// Generate badge data
	const badges = [
		{
			id: 'mode',
			label:
				options.mode === 'all' ? (
					<>
						minuscules <Strong>✓</Strong> MAJUSCULES <Strong>✓</Strong>
					</>
				) : options.mode === 'minuscule' ? (
					<>
						minuscules <Strong>✓</Strong> MAJUSCULES <Strong>✗</Strong>
					</>
				) : (
					<>
						minuscules <Strong>✗</Strong> MAJUSCULES <Strong>✓</Strong>
					</>
				),
			onClick: cycleMode,
		},
		{
			id: 'alphabets',
			label: (
				<>
					Alphabets <Strong>{alphabetCount}</Strong>
				</>
			),
			onClick: onShowCatalogue,
		},
		{
			id: 'letters',
			label: options.twentyFourLetterAlphabet ? (
				<>Letters <Strong>24</Strong></>
			) : (
				<>Letters <Strong>26</Strong></>
			),
			onClick: () => toggleOption('twentyFourLetterAlphabet'),
		},
		{
			id: 'baseline',
			label: options.showBaseline ? (
				<>Baseline <Strong>✓</Strong></>
			) : (
				<>Baseline <Strong>✗</Strong></>
			),
			onClick: () => toggleOption('showBaseline'),
		},
	];

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
		<div
			className={css({
				marginTop: '1rem',
			})}
			data-testid="options-summary"
		>
			{/* Badges */}
			<div
				className={css({
					display: 'flex',
					flexWrap: 'wrap',
					gap: '0.5rem',
					marginBottom: '1rem',
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
							Download QR Code
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default OptionsSummary;
