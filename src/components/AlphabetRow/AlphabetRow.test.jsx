import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlphabetRow from './AlphabetRow';

describe('AlphabetRow', () => {
	const mockMetadata = {
		title: 'Test Alphabet',
		date: '1594',
		sourceUri: 'https://example.com/source',
		difficulty: 'medium',
	};

	it('renders toggle, date, title, and source link', () => {
		render(
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto' }}>
				<AlphabetRow
					name="TestAlphabet"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.getByRole('switch')).toBeInTheDocument();
		expect(screen.getByText('1594')).toBeInTheDocument();
		expect(screen.getByText('Test Alphabet')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'source' })).toBeInTheDocument();
	});

	it('displays correct toggle state when enabled', () => {
		render(
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto' }}>
				<AlphabetRow
					name="TestAlphabet"
					metadata={mockMetadata}
					isEnabled={true}
					onToggle={() => {}}
				/>
			</div>
		);

		const toggle = screen.getByRole('switch');
		expect(toggle).toHaveAttribute('aria-checked', 'true');
	});

	it('displays correct toggle state when disabled', () => {
		render(
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto' }}>
				<AlphabetRow
					name="TestAlphabet"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		const toggle = screen.getByRole('switch');
		expect(toggle).toHaveAttribute('aria-checked', 'false');
	});

	it('calls onToggle when toggle is clicked', async () => {
		const handleToggle = vi.fn();
		const user = userEvent.setup();

		render(
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto' }}>
				<AlphabetRow
					name="TestAlphabet"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={handleToggle}
				/>
			</div>
		);

		const toggle = screen.getByRole('switch');
		await user.click(toggle);

		expect(handleToggle).toHaveBeenCalledTimes(1);
	});

	it('renders source link with correct href', () => {
		render(
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto' }}>
				<AlphabetRow
					name="TestAlphabet"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		const link = screen.getByRole('link', { name: 'source' });
		expect(link).toHaveAttribute('href', 'https://example.com/source');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('displays date with bold font weight', () => {
		render(
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto' }}>
				<AlphabetRow
					name="TestAlphabet"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		const dateElement = screen.getByText('1594');
		expect(dateElement.tagName).toBe('SPAN');
	});

	it('handles dates with slashes', () => {
		const metadataWithSlashDate = {
			...mockMetadata,
			date: '1574/5',
		};

		render(
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto' }}>
				<AlphabetRow
					name="Hill"
					metadata={metadataWithSlashDate}
					isEnabled={true}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.getByText('1574/5')).toBeInTheDocument();
	});

	it('renders with different alphabet names', () => {
		const { rerender } = render(
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto' }}>
				<AlphabetRow
					name="NBacon"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.getByRole('switch')).toHaveAttribute('id', 'alphabet-NBacon');

		rerender(
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto' }}>
				<AlphabetRow
					name="Howard"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.getByRole('switch')).toHaveAttribute('id', 'alphabet-Howard');
	});
});
