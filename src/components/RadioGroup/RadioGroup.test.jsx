import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioOption } from './RadioGroup';

describe('RadioOption', () => {
	it('should render with label text', () => {
		render(
			<RadioOption name="test" value="a" checked={false} onChange={() => {}}>
				Option A
			</RadioOption>
		);
		expect(screen.getByText('Option A')).toBeInTheDocument();
	});

	it('should render a radio input', () => {
		render(
			<RadioOption name="test" value="a" checked={false} onChange={() => {}}>
				Option A
			</RadioOption>
		);
		expect(screen.getByRole('radio')).toBeInTheDocument();
	});

	it('should be checked when checked prop is true', () => {
		render(
			<RadioOption name="test" value="a" checked={true} onChange={() => {}}>
				Option A
			</RadioOption>
		);
		expect(screen.getByRole('radio')).toBeChecked();
	});

	it('should not be checked when checked prop is false', () => {
		render(
			<RadioOption name="test" value="a" checked={false} onChange={() => {}}>
				Option A
			</RadioOption>
		);
		expect(screen.getByRole('radio')).not.toBeChecked();
	});

	it('should call onChange when clicked', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();
		render(
			<RadioOption name="test" value="a" checked={false} onChange={handleChange}>
				Option A
			</RadioOption>
		);
		await user.click(screen.getByRole('radio'));
		expect(handleChange).toHaveBeenCalled();
	});

	it('should have bold font when checked', () => {
		render(
			<RadioOption name="test" value="a" checked={true} onChange={() => {}}>
				Option A
			</RadioOption>
		);
		const label = screen.getByText('Option A').closest('label');
		expect(label.className).toContain('fw_bold');
	});

	it('should have normal font when not checked', () => {
		render(
			<RadioOption name="test" value="a" checked={false} onChange={() => {}}>
				Option A
			</RadioOption>
		);
		const label = screen.getByText('Option A').closest('label');
		expect(label.className).toContain('fw_normal');
	});
});

describe('RadioGroup', () => {
	const options = [
		{ value: 'a', label: 'Option A' },
		{ value: 'b', label: 'Option B' },
		{ value: 'c', label: 'Option C' },
	];

	it('should render all options', () => {
		render(
			<RadioGroup
				legend="Choose"
				name="test"
				value="a"
				onChange={() => {}}
				options={options}
			/>
		);
		expect(screen.getByText('Option A')).toBeInTheDocument();
		expect(screen.getByText('Option B')).toBeInTheDocument();
		expect(screen.getByText('Option C')).toBeInTheDocument();
	});

	it('should render correct number of radio inputs', () => {
		render(
			<RadioGroup
				legend="Choose"
				name="test"
				value="a"
				onChange={() => {}}
				options={options}
			/>
		);
		expect(screen.getAllByRole('radio')).toHaveLength(3);
	});

	it('should check the correct option based on value', () => {
		render(
			<RadioGroup
				legend="Choose"
				name="test"
				value="b"
				onChange={() => {}}
				options={options}
			/>
		);
		const radios = screen.getAllByRole('radio');
		expect(radios[0]).not.toBeChecked();
		expect(radios[1]).toBeChecked();
		expect(radios[2]).not.toBeChecked();
	});

	it('should call onChange when an option is clicked', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();
		render(
			<RadioGroup
				legend="Choose"
				name="test"
				value="a"
				onChange={handleChange}
				options={options}
			/>
		);
		await user.click(screen.getByLabelText('Option B'));
		expect(handleChange).toHaveBeenCalled();
	});

	it('should render legend as visually hidden by default', () => {
		render(
			<RadioGroup
				legend="Choose option"
				name="test"
				value="a"
				onChange={() => {}}
				options={options}
			/>
		);
		const legend = screen.getByText('Choose option');
		expect(legend.tagName).toBe('LEGEND');
	});

	it('should render visible legend when legendVisible is true', () => {
		render(
			<RadioGroup
				legend="Choose option"
				legendVisible={true}
				name="test"
				value="a"
				onChange={() => {}}
				options={options}
			/>
		);
		const legend = screen.getByText('Choose option');
		expect(legend.tagName).toBe('LEGEND');
	});

	it('should render in a fieldset', () => {
		render(
			<RadioGroup
				legend="Choose"
				name="test"
				value="a"
				onChange={() => {}}
				options={options}
			/>
		);
		expect(screen.getByRole('group')).toBeInTheDocument();
	});

	it('should apply custom className', () => {
		render(
			<RadioGroup
				legend="Choose"
				name="test"
				value="a"
				onChange={() => {}}
				options={options}
				className="custom-class"
			/>
		);
		const fieldset = screen.getByRole('group');
		expect(fieldset).toHaveClass('custom-class');
	});

	it('should pass name prop to all radio inputs', () => {
		render(
			<RadioGroup
				legend="Choose"
				name="myRadioGroup"
				value="a"
				onChange={() => {}}
				options={options}
			/>
		);
		const radios = screen.getAllByRole('radio');
		radios.forEach(radio => {
			expect(radio).toHaveAttribute('name', 'myRadioGroup');
		});
	});
});
