import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HandRow from './HandRow';

describe('HandRow', () => {
	const mockMetadata = {
		title: 'Test Hand',
		date: '1594',
		sourceUri: 'https://example.com/source',
		difficulty: 'medium',
	};

	it('renders toggle, date, title, and source link', () => {
		render(
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="TestHand"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.getByRole('switch')).toBeInTheDocument();
		expect(screen.getByText('1594')).toBeInTheDocument();
		expect(screen.getByText('Test Hand')).toBeInTheDocument();
		expect(
			screen.getByRole('link', { name: 'source' })
		).toBeInTheDocument();
	});

	it('displays correct toggle state when enabled', () => {
		render(
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="TestHand"
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
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="TestHand"
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
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="TestHand"
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
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="TestHand"
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
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="TestHand"
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
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="Hill"
					metadata={metadataWithSlashDate}
					isEnabled={true}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.getByText('1574/5')).toBeInTheDocument();
	});

	it('renders with different hand names', () => {
		const { rerender } = render(
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="NBacon"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.getByRole('switch')).toHaveAttribute(
			'id',
			'hand-NBacon'
		);

		rerender(
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="Howard"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.getByRole('switch')).toHaveAttribute(
			'id',
			'hand-Howard'
		);
	});

	it('displays letter counts when provided', () => {
		const metadataWithCounts = {
			...mockMetadata,
			majuscules: 26,
			minuscules: 26,
		};

		render(
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="TestHand"
					metadata={metadataWithCounts}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.getByText(/\(52 characters: 26 minuscule, 26 majuscule\)/)).toBeInTheDocument();
	});

	it('does not display letter counts when not provided', () => {
		render(
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="TestHand"
					metadata={mockMetadata}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.queryByText(/characters:/)).not.toBeInTheDocument();
		expect(screen.queryByText(/minuscule/)).not.toBeInTheDocument();
		expect(screen.queryByText(/majuscule/)).not.toBeInTheDocument();
	});

	it('handles zero letter counts', () => {
		const metadataWithZeroCounts = {
			...mockMetadata,
			majuscules: 0,
			minuscules: 0,
		};

		render(
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="TestHand"
					metadata={metadataWithZeroCounts}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.queryByText(/characters:/)).not.toBeInTheDocument();
		expect(screen.queryByText(/minuscule/)).not.toBeInTheDocument();
		expect(screen.queryByText(/majuscule/)).not.toBeInTheDocument();
	});

	it('displays mixed letter counts correctly', () => {
		const metadataWithMixedCounts = {
			...mockMetadata,
			majuscules: 73,
			minuscules: 125,
		};

		render(
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto auto',
				}}
			>
				<HandRow
					name="TestHand"
					metadata={metadataWithMixedCounts}
					isEnabled={false}
					onToggle={() => {}}
				/>
			</div>
		);

		expect(screen.getByText(/\(198 characters: 125 minuscule, 73 majuscule\)/)).toBeInTheDocument();
	});
});
