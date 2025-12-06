import { css } from '../../../dist/styled-system/css';
import { getBaseUrl } from '@lib/utilities/url';

const IMAGE_PATH = 'data/Howard/Howard-assets/e-word-7asd.png';

export const ContextImage = () => (
	<img
		src={`${getBaseUrl()}${IMAGE_PATH}`}
		alt="The word 'there' with the first 'e' highlighted in black"
		className={css({
			maxWidth: '100%',
			display: 'block',
			marginTop: 'lg',
			marginBottom: 'lg',
		})}
	/>
);
