import ReactMarkdown from 'react-markdown';
import { css } from '../../../styled-system/css';
import { Paragraph } from '@components/Layout/Layout.jsx';

const MarkdownWithPlaceholders = ({ content, placeholders = {} }) => {
	return (
		<ReactMarkdown
			components={{
				p: ({ children }) => {
					const text = String(children);
					for (const [placeholder, component] of Object.entries(placeholders)) {
						if (text.includes(`{{${placeholder}}}`)) {
							return component;
						}
					}
					return <Paragraph>{children}</Paragraph>;
				},
				ol: ({ children }) => (
					<ol
						className={css({
							listStyleType: 'lower-roman',
							marginLeft: '1em',
							lineHeight: '1.6',
						})}
					>
						{children}
					</ol>
				),
				ul: ({ children }) => (
					<ul
						className={css({
							listStyleType: 'disc',
							marginLeft: '1em',
							lineHeight: '1.6',
						})}
					>
						{children}
					</ul>
				),
				a: ({ href, children }) => (
					<a href={href} target="_blank" rel="noopener noreferrer">
						{children}
					</a>
				),
			}}
		>
			{content}
		</ReactMarkdown>
	);
};

export default MarkdownWithPlaceholders;
