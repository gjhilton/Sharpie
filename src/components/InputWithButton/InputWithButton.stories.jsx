import { useState } from 'react';
import { InputWithButton } from './InputWithButton';

export default {
	title: 'Components/InputWithButton',
	component: InputWithButton,
	tags: ['autodocs'],
	argTypes: {
		inputId: {
			control: 'text',
			description: 'The input ID attribute',
		},
		inputType: {
			control: 'select',
			options: ['text', 'email', 'url'],
			description: 'The input type',
		},
		inputValue: {
			control: 'text',
			description: 'The input value',
		},
		inputReadOnly: {
			control: 'boolean',
			description: 'Whether the input is read-only',
		},
		buttonLabel: {
			control: 'text',
			description: 'The button label text',
		},
		buttonActive: {
			control: 'boolean',
			description:
				'Whether the button is in active state (inverted colors)',
		},
		fontFamily: {
			control: 'select',
			options: [undefined, 'monospace'],
			description: 'Font family for the input',
		},
		fontSize: {
			control: 'select',
			options: ['s', 'm', 'l'],
			description: 'Font size for input and button',
		},
	},
};

// Story: Default
export const Default = {
	args: {
		inputId: 'default-input',
		inputName: 'default',
		inputValue: 'Enter text here',
		buttonLabel: 'Submit',
		buttonOnClick: () => console.log('Button clicked'),
	},
};

// Story: Copy URL
export const CopyURL = {
	args: {
		inputId: 'url-input',
		inputName: 'url',
		inputType: 'text',
		inputValue: 'https://example.com/shareable-link?param=value',
		inputReadOnly: true,
		buttonLabel: 'Copy',
		buttonOnClick: () => console.log('Copy clicked'),
		fontFamily: 'monospace',
		fontSize: 's',
		inputOnClick: e => e.target.select(),
		inputOnFocus: e => e.target.select(),
	},
	parameters: {
		docs: {
			description: {
				story: 'Example of a URL input with copy button. Click the input to select all text.',
			},
		},
	},
};

// Story: Active Button State
export const ActiveButton = {
	args: {
		inputId: 'active-input',
		inputName: 'active',
		inputValue: 'https://example.com/link',
		inputReadOnly: true,
		buttonLabel: 'Copied!',
		buttonActive: true,
		buttonOnClick: () => console.log('Button clicked'),
		fontFamily: 'monospace',
		fontSize: 's',
	},
	parameters: {
		docs: {
			description: {
				story: 'Button in active state with inverted colors.',
			},
		},
	},
};

// Story: Email Input
export const EmailInput = {
	args: {
		inputId: 'email-input',
		inputName: 'email',
		inputType: 'email',
		inputValue: 'user@example.com',
		buttonLabel: 'Send',
		buttonOnClick: () => console.log('Send clicked'),
	},
};

// Story: Small Font Size
export const SmallFontSize = {
	args: {
		inputId: 'small-input',
		inputName: 'small',
		inputValue: 'Small text',
		buttonLabel: 'Go',
		buttonOnClick: () => console.log('Go clicked'),
		fontSize: 's',
	},
};

// Story: Large Font Size
export const LargeFontSize = {
	args: {
		inputId: 'large-input',
		inputName: 'large',
		inputValue: 'Large text',
		buttonLabel: 'Submit',
		buttonOnClick: () => console.log('Submit clicked'),
		fontSize: 'l',
	},
};

// Story: Interactive Copy Button
export const InteractiveCopy = {
	render: () => {
		const [copied, setCopied] = useState(false);
		const url = 'https://example.com/api/v1/shareable?id=12345';

		const handleCopy = async () => {
			try {
				await navigator.clipboard.writeText(url);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (err) {
				console.error('Failed to copy:', err);
			}
		};

		return (
			<InputWithButton
				inputId="interactive-copy"
				inputName="url"
				inputValue={url}
				inputReadOnly
				inputOnClick={e => e.target.select()}
				inputOnFocus={e => e.target.select()}
				buttonLabel={copied ? 'Copied!' : 'Copy'}
				buttonOnClick={handleCopy}
				buttonActive={copied}
				fontFamily="monospace"
				fontSize="s"
			/>
		);
	},
	parameters: {
		docs: {
			description: {
				story: 'Fully interactive example with working copy-to-clipboard functionality.',
			},
		},
	},
};

// Story: Long URL
export const LongURL = {
	args: {
		inputId: 'long-url',
		inputName: 'url',
		inputValue:
			'https://example.com/very/long/path/to/resource?param1=value1&param2=value2&param3=value3&param4=value4',
		inputReadOnly: true,
		buttonLabel: 'Copy',
		buttonOnClick: () => console.log('Copy clicked'),
		fontFamily: 'monospace',
		fontSize: 's',
	},
	parameters: {
		docs: {
			description: {
				story: 'Demonstrates how the input expands to fit long content while the button stays compact.',
			},
		},
	},
};

// Story: Search Input
export const SearchInput = {
	args: {
		inputId: 'search-input',
		inputName: 'search',
		inputValue: '',
		buttonLabel: 'Search',
		buttonOnClick: () => console.log('Search clicked'),
	},
	parameters: {
		docs: {
			description: {
				story: 'Can be used as a search input with a submit button.',
			},
		},
	},
};
