import React from 'react';
import { css } from '../../../styled-system/css';
import Toggle from '@components/Toggle/Toggle.jsx';

const AlphabetRow = ({ name, metadata, isEnabled, onToggle }) => {
	return (
		<React.Fragment>
			<Toggle id={`alphabet-${name}`} checked={isEnabled} onChange={onToggle} />
			<span className={css({ fontWeight: '900' })}>{metadata.date}</span>
			<span>{metadata.title}</span>
			<a
				href={metadata.sourceUri}
				target="_blank"
				rel="noopener noreferrer"
				className={css({
					color: '{colors.ink}',
					textDecoration: 'underline',
					'&:hover': {
						color: '{colors.toggleActive}',
					},
				})}
			>
				source
			</a>
		</React.Fragment>
	);
};

export default AlphabetRow;
