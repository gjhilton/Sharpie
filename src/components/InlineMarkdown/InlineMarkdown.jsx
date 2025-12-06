import ReactMarkdown from 'react-markdown';

// Renders markdown content inline without paragraph wrappers
export const InlineMarkdown = ({ content, children }) => (
	<ReactMarkdown
		components={{
			p: ({ children }) => <>{children}</>,
		}}
	>
		{content || children}
	</ReactMarkdown>
);
