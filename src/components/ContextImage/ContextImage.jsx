import { css } from '../../../dist/styled-system/css';
import { getBaseUrl } from '@lib/utilities/url.js';

const ContextImage = () => (
	<img
		src={`${getBaseUrl()}data/Howard/Howard-assets/e-word-7asd.png`}
		alt="The word 'there' with the first 'e' highlighted in black"
		className={css({
			maxWidth: '100%',
			display: 'block',
			marginTop: '1rem',
			marginBottom: '1rem',
		})}
	/>
);

export default ContextImage;
