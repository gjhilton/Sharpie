import { useState } from 'react';
import { css } from '../../../styled-system/css';
import { OPTIONS_SOURCE } from '@constants/options.js';
import { buildPermalink } from '@utilities/optionsStorage.js';

const GAME_MODE_LABELS = {
	all: 'both cases',
	minuscule: 'minuscules only',
	majuscule: 'MAJUSCULES only',
};

const SOURCE_LABELS = {
	[OPTIONS_SOURCE.QUERY_STRING]: 'Loaded from shared link',
	[OPTIONS_SOURCE.LOCAL_STORAGE]: 'Restored from previous session',
	[OPTIONS_SOURCE.DEFAULTS]: 'Using default settings',
};

const OptionsSummary = ({ options, optionsSource, onReset }) => {
	const [copied, setCopied] = useState(false);

	const alphabetCount = options.enabledAlphabetIds.length;
	const modeLabel = GAME_MODE_LABELS[options.gameMode] || options.gameMode;
	const letterCount = options.twentyFourLetterAlphabet ? '24' : '26';
	const baselineLabel = options.showBaseline ? 'on' : 'off';

	const handleCopyLink = async () => {
		const permalink = buildPermalink(options);
		try {
			await navigator.clipboard.writeText(permalink);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback for browsers that don't support clipboard API
			const textarea = document.createElement('textarea');
			textarea.value = permalink;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div
			className={css({
				marginBottom: '1.5rem',
				padding: '1rem',
				background: '{colors.paper}',
				border: '1px solid {colors.ink/10}',
				borderRadius: '4px',
			})}
		>
			<div
				className={css({
					marginBottom: '0.75rem',
					fontSize: 'm',
					lineHeight: '1.6',
				})}
			>
				<strong>Current settings:</strong> {modeLabel}, {alphabetCount}{' '}
				{alphabetCount === 1 ? 'alphabet' : 'alphabets'}, baselines{' '}
				{baselineLabel}, {letterCount} letters
			</div>
			<div
				className={css({
					fontSize: 's',
					color: '{colors.ink/70}',
					marginBottom: '0.75rem',
				})}
			>
				{SOURCE_LABELS[optionsSource]}
			</div>
			<div
				className={css({
					display: 'flex',
					gap: '1rem',
					flexWrap: 'wrap',
				})}
			>
				<a
					href="#"
					onClick={e => {
						e.preventDefault();
						onReset();
					}}
					className={css({
						fontSize: 's',
						color: '{colors.ink}',
						textDecoration: 'underline',
						cursor: 'pointer',
						'&:hover': {
							color: '{colors.toggleActive}',
						},
					})}
				>
					Reset to defaults
				</a>
				<button
					type="button"
					onClick={handleCopyLink}
					className={css({
						fontSize: 's',
						color: '{colors.ink}',
						background: 'none',
						border: 'none',
						textDecoration: 'underline',
						cursor: 'pointer',
						padding: '0',
						'&:hover': {
							color: '{colors.toggleActive}',
						},
					})}
				>
					{copied ? 'Link copied!' : 'Copy link to share'}
				</button>
			</div>
		</div>
	);
};

export default OptionsSummary;
