import {
	PageWidth,
	PageTitle,
	Heading,
	Paragraph,
	Section,
	VisuallyHidden,
} from './Layout';

export default {
	title: 'Layout/Components',
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export const PageWidthExample = {
	render: () => (
		<PageWidth>
			<PageTitle>Example Title</PageTitle>
			<div>
				<Paragraph>
					This demonstrates the PageWidth component with a 2-column grid
					on desktop (1fr 2fr) and single column on mobile.
				</Paragraph>
				<Paragraph>
					The left column contains titles, the right column contains
					content.
				</Paragraph>
			</div>
		</PageWidth>
	),
	parameters: {
		docs: {
			description: {
				story: 'PageWidth provides a responsive grid layout: 1 column on mobile, 2 columns (1fr 2fr) on desktop, with max-width of 800px.',
			},
		},
	},
};

export const PageTitleExample = {
	render: () => <PageTitle>This is a Page Title</PageTitle>,
	parameters: {
		docs: {
			description: {
				story: 'PageTitle renders an h1 with responsive font sizing (2rem base, 3rem desktop).',
			},
		},
	},
};

export const HeadingExample = {
	render: () => <Heading>This is a Heading</Heading>,
	parameters: {
		docs: {
			description: {
				story: 'Heading renders an h2 with consistent styling (font-size: l, bold).',
			},
		},
	},
};

export const ParagraphExample = {
	render: () => (
		<Paragraph>
			This is a paragraph with proper line height and spacing. Lorem ipsum
			dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
			incididunt ut labore et dolore magna aliqua.
		</Paragraph>
	),
	parameters: {
		docs: {
			description: {
				story: 'Paragraph renders a p tag with line-height 1.6 and bottom margin.',
			},
		},
	},
};

export const SectionExample = {
	render: () => (
		<PageWidth>
			<Section title={<Heading>Section Title</Heading>}>
				<Paragraph>
					The Section component wraps content with a title. It's
					designed to work within the PageWidth grid layout.
				</Paragraph>
				<Paragraph>
					The title appears in the left column on desktop, content in
					the right column.
				</Paragraph>
			</Section>
		</PageWidth>
	),
	parameters: {
		docs: {
			description: {
				story: 'Section creates a title/content pair that works with the PageWidth grid layout.',
			},
		},
	},
};

export const VisuallyHiddenExample = {
	render: () => (
		<div>
			<VisuallyHidden>
				This text is hidden visually but accessible to screen readers
			</VisuallyHidden>
			<p>
				There is visually hidden text above this paragraph (check the
				DOM).
			</p>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'VisuallyHidden hides content visually while keeping it accessible to screen readers.',
			},
		},
	},
};

export const FullLayoutExample = {
	render: () => (
		<PageWidth>
			<PageTitle>Main Page Title</PageTitle>
			<div>
				<Paragraph>
					This demonstrates a complete layout using all components
					together.
				</Paragraph>
			</div>

			<Section title={<Heading>First Section</Heading>}>
				<Paragraph>
					Content for the first section goes here. On desktop, the
					heading appears in the left column and this content in the
					right.
				</Paragraph>
				<ul>
					<li>List item one</li>
					<li>List item two</li>
					<li>List item three</li>
				</ul>
			</Section>

			<Section title={<Heading>Second Section</Heading>}>
				<Paragraph>
					Another section with more content. The grid layout
					automatically handles the spacing and alignment.
				</Paragraph>
			</Section>
		</PageWidth>
	),
	parameters: {
		docs: {
			description: {
				story: 'A complete example showing how all Layout components work together.',
			},
		},
	},
};
