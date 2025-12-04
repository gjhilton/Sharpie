import MarkdownWithPlaceholders from './MarkdownWithPlaceholders';
import { Toggle } from '@components/Toggle/Toggle';
import { Button } from '@components/Button/Button';
import { css } from '../../../dist/styled-system/css';

export default {
	title: 'Components/MarkdownWithPlaceholders',
	component: MarkdownWithPlaceholders,
	parameters: {
		layout: 'padded',
	},
};

export const SimpleParagraph = {
	args: {
		content: 'This is a simple paragraph with some text.',
	},
};

export const WithEmphasis = {
	args: {
		content: 'This text has *emphasis* and **strong** formatting.',
	},
};

export const OrderedList = {
	args: {
		content: `1. First step in the process
2. Second step with more details
3. Third step to complete
4. Final step`,
	},
};

export const UnorderedList = {
	args: {
		content: `- First item in the list
- Second item with some details
- Third item
- Fourth item`,
	},
};

export const WithLinks = {
	args: {
		content: `Here are some useful resources:

- [Google](https://google.com) - Search engine
- [GitHub](https://github.com) - Code hosting
- [MDN](https://developer.mozilla.org) - Web documentation`,
	},
};

export const MultipleParagraphs = {
	args: {
		content: `First paragraph with some introductory text.

Second paragraph that provides more details about the topic.

Third paragraph to wrap things up.`,
	},
};

export const WithSinglePlaceholder = {
	args: {
		content: `Configure your settings below:

{{TOGGLE}}

Changes will take effect immediately.`,
		placeholders: {
			TOGGLE: (
				<div
					className={css({
						marginTop: '1rem',
						marginBottom: '1rem',
					})}
				>
					<Toggle
						id="example-toggle"
						label="Enable feature"
						checked={false}
						onChange={() => {}}
					/>
				</div>
			),
		},
	},
};

export const WithMultiplePlaceholders = {
	args: {
		content: `Choose your mode:

{{BUTTONS}}

Or configure advanced options:

{{TOGGLE}}

Your preferences will be saved automatically.`,
		placeholders: {
			BUTTONS: (
				<div
					className={css({
						display: 'flex',
						gap: '1rem',
						marginBottom: '1rem',
					})}
				>
					<Button label="Option A" onClick={() => {}} />
					<Button label="Option B" onClick={() => {}} />
				</div>
			),
			TOGGLE: (
				<div
					className={css({
						marginTop: '1rem',
						marginBottom: '1rem',
					})}
				>
					<Toggle
						id="advanced-toggle"
						label="Advanced mode"
						checked={true}
						onChange={() => {}}
					/>
				</div>
			),
		},
	},
};

export const ComplexContent = {
	args: {
		content: `# Welcome

This is a *comprehensive* example showing various **markdown features**.

{{ACTION_BUTTON}}

## Features included:

1. Text formatting with *emphasis* and **strong**
2. Links to [external resources](https://example.com)
3. Placeholder replacement
4. Lists (both ordered and unordered)

### Additional notes:

- This component handles all standard markdown
- Placeholders use the \`{{NAME}}\` syntax
- Links automatically open in new tabs`,
		placeholders: {
			ACTION_BUTTON: (
				<div
					className={css({
						marginTop: '1rem',
						marginBottom: '1rem',
					})}
				>
					<Button label="Get Started" hero onClick={() => {}} />
				</div>
			),
		},
	},
};
