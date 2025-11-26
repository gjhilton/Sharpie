import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { css } from '../../../dist/styled-system/css';
import { serializeOptions } from '@lib/options/serializer.js';
import { useGameOptionsContext } from '@context/GameOptionsContext.jsx';

const OptionsSummary = ({ options, alphabetCount }) => {
	const { resetOptions } = useGameOptionsContext();
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
				options.mode === 'all'
					? 'ALL'
					: options.mode === 'minuscule'
						? 'minuscules only'
						: 'MAJUSCULES only',
		},
		{
			id: 'alphabets',
			label: `${alphabetCount} alphabet${alphabetCount === 1 ? '' : 's'}`,
		},
		{
			id: 'letters',
			label: options.twentyFourLetterAlphabet
				? '24 letters'
				: '26 letters',
		},
		{
			id: 'baseline',
			label: options.showBaseline ? 'Baselines ON' : 'Baselines OFF',
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

	// Reset to defaults
	const handleReset = () => {
		if (
			window.confirm(
				'Reset all settings to defaults? This will clear your current configuration.'
			)
		) {
			resetOptions();
		}
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
					<span
						key={badge.id}
						className={css({
							display: 'inline-block',
							padding: '0.25rem 0.75rem',
							border: '1px solid {colors.ink}',
							borderRadius: '4px',
							fontSize: 's',
							backgroundColor: '{colors.paper}',
							whiteSpace: 'nowrap',
						})}
						data-testid={`badge-${badge.id}`}
					>
						{badge.label}
					</span>
				))}
			</div>

			{/* Shareable link label */}
			<label
				htmlFor="shareable-url"
				className={css({
					display: 'block',
					fontSize: 's',
					marginBottom: '0.5rem',
					fontWeight: 'bold',
				})}
			>
				Shareable link:
			</label>

			{/* URL input */}
			<input
				id="shareable-url"
				type="text"
				readOnly
				value={shareableURL}
				className={css({
					width: '100%',
					padding: '0.5rem',
					border: '1px solid {colors.ink}',
					borderRadius: '4px',
					fontFamily: 'monospace',
					fontSize: 's',
					backgroundColor: '{colors.paper}',
					marginBottom: '0.75rem',
					cursor: 'text',
					_focusVisible: {
						outline: '2px solid {colors.ink}',
						outlineOffset: '2px',
					},
				})}
				onClick={e => e.target.select()}
			/>

			{/* Action buttons */}
			<div
				className={css({
					display: 'flex',
					flexWrap: 'wrap',
					gap: '0.5rem',
					alignItems: 'center',
				})}
			>
				<button
					type="button"
					onClick={handleCopy}
					className={css({
						padding: '0.5rem 1rem',
						border: '1px solid {colors.ink}',
						borderRadius: '4px',
						backgroundColor: copySuccess
							? '{colors.ink}'
							: '{colors.paper}',
						color: copySuccess ? '{colors.paper}' : '{colors.ink}',
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
					{copySuccess ? 'Copied!' : 'Copy'}
				</button>

				<button
					type="button"
					onClick={handleToggleQR}
					className={css({
						padding: '0.5rem 1rem',
						border: '1px solid {colors.ink}',
						borderRadius: '4px',
						backgroundColor: showQR
							? '{colors.ink}'
							: '{colors.paper}',
						color: showQR ? '{colors.paper}' : '{colors.ink}',
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
					{showQR ? 'Hide QR Code' : 'Show QR Code'}
				</button>

				<button
					type="button"
					onClick={handleReset}
					className={css({
						padding: '0.5rem 1rem',
						border: '1px solid {colors.ink}',
						borderRadius: '4px',
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
					Reset to Defaults
				</button>
			</div>

			{/* QR Code display */}
			{showQR && (
				<div
					ref={qrRef}
					className={css({
						marginTop: '1rem',
						padding: '1rem',
						border: '1px solid {colors.ink}',
						borderRadius: '4px',
						backgroundColor: 'white',
						display: 'inline-block',
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
								borderRadius: '4px',
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
