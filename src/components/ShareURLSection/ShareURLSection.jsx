import { useState, useRef, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import ReactMarkdown from 'react-markdown';
import { css } from '../../../dist/styled-system/css';
import { Paragraph } from '@components/Layout/Layout';
import SubSection from '@components/SubSection/SubSection';
import { InputWithButton } from '@components/InputWithButton/InputWithButton';
import { serializeOptions } from '@lib/options/serializer';
import shareURLContent from '@data/share-url.md?raw';

const COPY_SUCCESS_TIMEOUT = 2000;
const QR_SIZE = 200;
const QR_LEVEL = 'M';
const QR_DOWNLOAD_FILENAME = 'secretary-settings-qr.png';
const QR_PADDING = '1rem';
const QR_BORDER = '1px solid {colors.ink}';
const QR_BACKGROUND = 'white';
const QR_MARGIN_TOP = '0';
const QR_MARGIN_BOTTOM = '0.75rem';
const QR_BUTTON_MARGIN_TOP = '0.5rem';
const BUTTON_PADDING = '0.5rem 1rem';
const BUTTON_BORDER = '1px solid {colors.ink}';
const BUTTON_BACKGROUND = '{colors.paper}';
const BUTTON_COLOR = '{colors.ink}';
const BUTTON_FONT_SIZE = 's';
const BUTTON_TRANSITION = 'all 150ms ease-in-out';
const BUTTON_SCALE_HOVER = 'scale(1.02)';
const BUTTON_SCALE_ACTIVE = 'scale(0.98)';
const BUTTON_OUTLINE = '2px solid {colors.ink}';
const BUTTON_OUTLINE_OFFSET = '2px';
const CANVAS_FILL_STYLE = 'white';
const INPUT_MARGIN_BOTTOM_SHOW_QR = '0';
const INPUT_MARGIN_BOTTOM_HIDE_QR = '0.75rem';

const ShareURLSection = ({ options }) => {
	const [copySuccess, setCopySuccess] = useState(false);
	const [showQR, setShowQR] = useState(false);
	const qrRef = useRef(null);

	const shareableURL = useMemo(() => {
		const serialized = serializeOptions(options);
		const params = new URLSearchParams(serialized);
		const queryString = params.toString();
		const baseUrl = `${window.location.origin}${window.location.pathname}`;
		return queryString ? `${baseUrl}?${queryString}` : baseUrl;
	}, [options]);

	const handleCopy = async () => {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(shareableURL);
			} else {
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
			setTimeout(() => setCopySuccess(false), COPY_SUCCESS_TIMEOUT);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	const handleToggleQR = () => {
		setShowQR(prev => !prev);
	};

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
			ctx.fillStyle = CANVAS_FILL_STYLE;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0);

			canvas.toBlob(blob => {
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = QR_DOWNLOAD_FILENAME;
				a.click();
				URL.revokeObjectURL(url);
			});
		};

		img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
	};

	return (
		<SubSection title="Share settings">
			<Paragraph>
				<ReactMarkdown
					components={{
						p: ({ children }) => <>{children}</>,
					}}
				>
					{shareURLContent}
				</ReactMarkdown>
			</Paragraph>

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
				marginBottom={showQR ? INPUT_MARGIN_BOTTOM_SHOW_QR : INPUT_MARGIN_BOTTOM_HIDE_QR}
				cursor="text"
				buttonLabel={copySuccess ? 'Copied!' : 'Copy'}
				buttonOnClick={handleCopy}
				buttonActive={copySuccess}
				rightButton2Label={showQR ? 'Hide QR' : 'QR'}
				rightButton2OnClick={handleToggleQR}
				rightButton2Active={showQR}
			/>

			{showQR && (
				<div
					ref={qrRef}
					className={css({
						marginTop: QR_MARGIN_TOP,
						padding: QR_PADDING,
						border: QR_BORDER,
						borderTop: 'none',
						backgroundColor: QR_BACKGROUND,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: QR_MARGIN_BOTTOM,
					})}
				>
					<QRCodeSVG value={shareableURL} size={QR_SIZE} level={QR_LEVEL} />
					<div
						className={css({
							marginTop: QR_BUTTON_MARGIN_TOP,
							textAlign: 'center',
						})}
					>
						<button
							type="button"
							onClick={handleDownloadQR}
							className={css({
								padding: BUTTON_PADDING,
								border: BUTTON_BORDER,
								backgroundColor: BUTTON_BACKGROUND,
								color: BUTTON_COLOR,
								cursor: 'pointer',
								fontSize: BUTTON_FONT_SIZE,
								fontWeight: 'bold',
								transition: BUTTON_TRANSITION,
								_hover: {
									transform: BUTTON_SCALE_HOVER,
								},
								_active: {
									transform: BUTTON_SCALE_ACTIVE,
								},
								_focusVisible: {
									outline: BUTTON_OUTLINE,
									outlineOffset: BUTTON_OUTLINE_OFFSET,
								},
							})}
						>
							Download
						</button>
					</div>
				</div>
			)}
		</SubSection>
	);
};

export { ShareURLSection };
export default ShareURLSection;
