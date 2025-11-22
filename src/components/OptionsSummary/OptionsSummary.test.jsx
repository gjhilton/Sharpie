import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionsSummary from './OptionsSummary';
import { OPTIONS_SOURCE, DEFAULT_OPTIONS } from '@constants/options.js';

describe('OptionsSummary', () => {
	const defaultProps = {
		options: { ...DEFAULT_OPTIONS },
		optionsSource: OPTIONS_SOURCE.DEFAULTS,
		onReset: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Summary display', () => {
		it('displays game mode as both cases', () => {
			render(<OptionsSummary {...defaultProps} />);
			expect(screen.getByText(/both cases/)).toBeInTheDocument();
		});

		it('displays game mode as minuscules only', () => {
			const options = { ...DEFAULT_OPTIONS, gameMode: 'minuscule' };
			render(<OptionsSummary {...defaultProps} options={options} />);
			expect(screen.getByText(/minuscules only/)).toBeInTheDocument();
		});

		it('displays game mode as MAJUSCULES only', () => {
			const options = { ...DEFAULT_OPTIONS, gameMode: 'majuscule' };
			render(<OptionsSummary {...defaultProps} options={options} />);
			expect(screen.getByText(/MAJUSCULES only/)).toBeInTheDocument();
		});

		it('displays alphabet count singular', () => {
			const options = { ...DEFAULT_OPTIONS, enabledAlphabetIds: [1] };
			render(<OptionsSummary {...defaultProps} options={options} />);
			expect(screen.getByText(/1 alphabet/)).toBeInTheDocument();
		});

		it('displays alphabet count plural', () => {
			const options = {
				...DEFAULT_OPTIONS,
				enabledAlphabetIds: [1, 2, 3],
			};
			render(<OptionsSummary {...defaultProps} options={options} />);
			expect(screen.getByText(/3 alphabets/)).toBeInTheDocument();
		});

		it('displays baselines on', () => {
			const options = { ...DEFAULT_OPTIONS, showBaseline: true };
			render(<OptionsSummary {...defaultProps} options={options} />);
			expect(screen.getByText(/baselines on/)).toBeInTheDocument();
		});

		it('displays baselines off', () => {
			const options = { ...DEFAULT_OPTIONS, showBaseline: false };
			render(<OptionsSummary {...defaultProps} options={options} />);
			expect(screen.getByText(/baselines off/)).toBeInTheDocument();
		});

		it('displays 26 letters by default', () => {
			render(<OptionsSummary {...defaultProps} />);
			expect(screen.getByText(/26 letters/)).toBeInTheDocument();
		});

		it('displays 24 letters when enabled', () => {
			const options = {
				...DEFAULT_OPTIONS,
				twentyFourLetterAlphabet: true,
			};
			render(<OptionsSummary {...defaultProps} options={options} />);
			expect(screen.getByText(/24 letters/)).toBeInTheDocument();
		});
	});

	describe('Source display', () => {
		it('shows shared link source', () => {
			render(
				<OptionsSummary
					{...defaultProps}
					optionsSource={OPTIONS_SOURCE.QUERY_STRING}
				/>
			);
			expect(
				screen.getByText(/Loaded from shared link/)
			).toBeInTheDocument();
		});

		it('shows previous session source', () => {
			render(
				<OptionsSummary
					{...defaultProps}
					optionsSource={OPTIONS_SOURCE.LOCAL_STORAGE}
				/>
			);
			expect(
				screen.getByText(/Restored from previous session/)
			).toBeInTheDocument();
		});

		it('shows defaults source', () => {
			render(
				<OptionsSummary
					{...defaultProps}
					optionsSource={OPTIONS_SOURCE.DEFAULTS}
				/>
			);
			expect(
				screen.getByText(/Using default settings/)
			).toBeInTheDocument();
		});
	});

	describe('Reset functionality', () => {
		it('renders reset link', () => {
			render(<OptionsSummary {...defaultProps} />);
			expect(screen.getByText('Reset to defaults')).toBeInTheDocument();
		});

		it('calls onReset when reset link is clicked', async () => {
			const onReset = vi.fn();
			const user = userEvent.setup();

			render(<OptionsSummary {...defaultProps} onReset={onReset} />);

			await user.click(screen.getByText('Reset to defaults'));
			expect(onReset).toHaveBeenCalledTimes(1);
		});
	});

	describe('Copy link functionality', () => {
		it('renders copy link button', () => {
			render(<OptionsSummary {...defaultProps} />);
			expect(screen.getByText('Copy link to share')).toBeInTheDocument();
		});

		it('shows copied feedback when clicked', async () => {
			const user = userEvent.setup();

			// Mock clipboard API
			const writeTextMock = vi.fn().mockResolvedValue(undefined);
			Object.defineProperty(navigator, 'clipboard', {
				value: { writeText: writeTextMock },
				writable: true,
				configurable: true,
			});

			render(<OptionsSummary {...defaultProps} />);

			await user.click(screen.getByText('Copy link to share'));
			expect(screen.getByText('Link copied!')).toBeInTheDocument();
		});

		it('calls clipboard API with permalink', async () => {
			const user = userEvent.setup();

			// Mock clipboard API
			const writeTextMock = vi.fn().mockResolvedValue(undefined);
			Object.defineProperty(navigator, 'clipboard', {
				value: { writeText: writeTextMock },
				writable: true,
				configurable: true,
			});

			render(<OptionsSummary {...defaultProps} />);

			await user.click(screen.getByText('Copy link to share'));
			expect(writeTextMock).toHaveBeenCalled();
		});
	});
});
