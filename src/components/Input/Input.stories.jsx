import { Input, Textarea } from './Input';

export default {
	title: 'Components/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		id: {
			control: 'text',
			description: 'The input ID attribute',
		},
		name: {
			control: 'text',
			description: 'The input name attribute',
		},
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'url', 'tel'],
			description: 'The input type',
		},
		required: {
			control: 'boolean',
			description: 'Whether the input is required',
		},
		readOnly: {
			control: 'boolean',
			description: 'Whether the input is read-only',
		},
		value: {
			control: 'text',
			description: 'The input value',
		},
	},
};

// Story: Default Input
export const DefaultInput = {
	args: {
		id: 'default-input',
		name: 'default',
		type: 'text',
	},
};

// Story: Email Input
export const EmailInput = {
	args: {
		id: 'email-input',
		name: 'email',
		type: 'email',
		value: 'user@example.com',
	},
};

// Story: Required Input
export const RequiredInput = {
	args: {
		id: 'required-input',
		name: 'required',
		type: 'text',
		required: true,
	},
};

// Story: Read-Only Input
export const ReadOnlyInput = {
	args: {
		id: 'readonly-input',
		name: 'readonly',
		type: 'text',
		value: 'This is read-only',
		readOnly: true,
	},
};

// Story: Custom Width
export const CustomWidth = {
	args: {
		id: 'custom-width',
		name: 'custom',
		type: 'text',
		value: 'Half width',
		width: '50%',
	},
};

// Story: Monospace Font
export const MonospaceFont = {
	args: {
		id: 'monospace',
		name: 'monospace',
		type: 'text',
		value: 'https://example.com/api/v1/endpoint',
		fontFamily: 'monospace',
	},
};

// Story: URL Input with Auto-Select
export const URLWithAutoSelect = {
	args: {
		id: 'url-input',
		name: 'url',
		type: 'text',
		value: 'https://example.com/shareable-link?param=value',
		readOnly: true,
		fontFamily: 'monospace',
		onClick: e => e.target.select(),
		onFocus: e => e.target.select(),
	},
	parameters: {
		docs: {
			description: {
				story: 'Click or focus the input to auto-select the entire URL',
			},
		},
	},
};

// Story: Default Textarea
export const DefaultTextarea = {
	render: args => <Textarea {...args} />,
	args: {
		id: 'default-textarea',
		name: 'message',
	},
};

// Story: Textarea with Content
export const TextareaWithContent = {
	render: args => <Textarea {...args} />,
	args: {
		id: 'textarea-content',
		name: 'message',
		defaultValue: 'This is a multi-line\ntextarea with\nsome content.',
	},
};

// Story: Required Textarea
export const RequiredTextarea = {
	render: args => <Textarea {...args} />,
	args: {
		id: 'required-textarea',
		name: 'message',
		required: true,
	},
};

// Story: Form Example
export const FormExample = {
	render: () => (
		<form
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				maxWidth: '400px',
			}}
		>
			<div>
				<label
					htmlFor="name"
					style={{
						display: 'block',
						marginBottom: '0.5rem',
						fontWeight: 'bold',
					}}
				>
					Name
				</label>
				<Input id="name" name="name" type="text" required />
			</div>

			<div>
				<label
					htmlFor="email"
					style={{
						display: 'block',
						marginBottom: '0.5rem',
						fontWeight: 'bold',
					}}
				>
					Email
				</label>
				<Input id="email" name="email" type="email" required />
			</div>

			<div>
				<label
					htmlFor="message"
					style={{
						display: 'block',
						marginBottom: '0.5rem',
						fontWeight: 'bold',
					}}
				>
					Message
				</label>
				<Textarea id="message" name="message" required />
			</div>

			<button
				type="submit"
				style={{ padding: '0.75rem', cursor: 'pointer' }}
			>
				Submit
			</button>
		</form>
	),
	parameters: {
		docs: {
			description: {
				story: 'Example of Input and Textarea components used in a form',
			},
		},
	},
};
