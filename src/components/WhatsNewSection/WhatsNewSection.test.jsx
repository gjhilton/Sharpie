import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WhatsNewSection from './WhatsNewSection';

vi.mock('@components/SubSection/SubSection.jsx', () => ({
	default: ({ title, children }) => (
		<section>
			<h3>{title}</h3>
			{children}
		</section>
	),
}));

vi.mock('@components/Changelog/Changelog.jsx', () => ({
	Changelog: () => (
		<dl data-testid="changelog">
			<dt>v1.0.0</dt>
			<dd>Initial release</dd>
		</dl>
	),
}));

describe('WhatsNewSection', () => {
	it('renders Changelog subsection', () => {
		render(<WhatsNewSection />);

		expect(screen.getByText('Changelog')).toBeInTheDocument();
	});

	it('renders Changelog component', () => {
		render(<WhatsNewSection />);

		expect(screen.getByTestId('changelog')).toBeInTheDocument();
	});
});
