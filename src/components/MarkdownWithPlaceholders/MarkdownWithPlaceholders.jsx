import ReactMarkdown from 'react-markdown';
import { css } from '../../../dist/styled-system/css';
import { Paragraph } from '@components/Layout/Layout';

const LIST_STYLE_ORDERED = 'lower-roman';
const LIST_STYLE_UNORDERED = 'disc';
const LIST_MARGIN_LEFT = '1em';
const LIST_LINE_HEIGHT = '1.6';
const LINK_TARGET = '_blank';
const LINK_REL = 'noopener noreferrer';

const MarkdownWithPlaceholders = ({ content, placeholders = {} }) => {
	return (
		<ReactMarkdown
			components={{
				p: ({ children }) => {
					const text = String(children);
					for (const [placeholder, component] of Object.entries(
						placeholders
					)) {
						if (text.includes(`{{${placeholder}}}`)) {
							return component;
						}
					}
					return <Paragraph>{children}</Paragraph>;
				},
				ol: ({ children }) => (
					<ol
						className={css({
							listStyleType: LIST_STYLE_ORDERED,
							marginLeft: LIST_MARGIN_LEFT,
							lineHeight: LIST_LINE_HEIGHT,
						})}
					>
						{children}
					</ol>
				),
				ul: ({ children }) => (
					<ul
						className={css({
							listStyleType: LIST_STYLE_UNORDERED,
							marginLeft: LIST_MARGIN_LEFT,
							lineHeight: LIST_LINE_HEIGHT,
						})}
					>
						{children}
					</ul>
				),
				a: ({ href, children }) => (
					<a href={href} target={LINK_TARGET} rel={LINK_REL}>
						{children}
					</a>
				),
			}}
		>
			{content}
		</ReactMarkdown>
	);
};

export { MarkdownWithPlaceholders };
