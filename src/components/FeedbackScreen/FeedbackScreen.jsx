import { css } from '../../../dist/styled-system/css';
import { useNavigate } from '@tanstack/react-router';
import { useForm, ValidationError } from '@formspree/react';
import { Button } from '@components/Button/Button';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
import { Input, Textarea } from '@components/Input/Input.jsx';
import {
	PageWidth,
	PageTitle,
	Paragraph,
	Section,
} from '@components/Layout/Layout.jsx';

const FormField = ({ label, children }) => (
	<div
		className={css({
			display: 'flex',
			flexDirection: 'column',
			gap: '0.5rem',
		})}
	>
		<label
			className={css({
				fontSize: 'm',
				fontWeight: 'bold',
			})}
		>
			{label}
		</label>
		{children}
	</div>
);

const ThankYouMessage = ({ onReturnToMenu }) => (
	<>
		<PageTitle>Thank you.</PageTitle>
		<div>
			<Paragraph>
				Your message has been received. Thank you for helping improve Sharpie.
			</Paragraph>
			<Button onClick={onReturnToMenu} label="Return to Menu" />
		</div>
	</>
);

const FeedbackScreen = () => {
	const navigate = useNavigate();
	const [state, handleSubmit] = useForm('xanlrkkz');

	const handleReturnToMenu = () => navigate({ to: '/', search: prev => prev });

	if (state.succeeded) {
		return (
			<PageWidth>
				<ThankYouMessage onReturnToMenu={handleReturnToMenu} />

				<SmallPrint />
			</PageWidth>
		);
	}

	return (
		<PageWidth>
			<PageTitle>Send Feedback</PageTitle>

			<Section title={null}>
				<Paragraph>
					Found a problem? Have suggestions to help us improve? We'd love to
					hear from you.
				</Paragraph>

				<form
					onSubmit={handleSubmit}
					className={css({
						display: 'flex',
						flexDirection: 'column',
						gap: '1.5rem',
					})}
				>
					<FormField label="Name">
						<Input id="name" type="text" name="name" />
						<ValidationError
							prefix="Name"
							field="name"
							errors={state.errors}
						/>
					</FormField>

					<FormField label="Email Address">
						<Input id="email" type="email" name="email" required />
						<ValidationError
							prefix="Email"
							field="email"
							errors={state.errors}
						/>
					</FormField>

					<FormField label="Message">
						<Textarea id="message" name="message" required />
						<ValidationError
							prefix="Message"
							field="message"
							errors={state.errors}
						/>
					</FormField>

					<FormField label="What browser and OS are you using?">
						<Input id="platform" type="text" name="platform" />
						<ValidationError
							prefix="Platform"
							field="platform"
							errors={state.errors}
						/>
					</FormField>

					<div
						className={css({
							display: 'flex',
							gap: '1rem',
							marginTop: '1rem',
						})}
					>
						<Button
							hero
							type="submit"
							disabled={state.submitting}
							label={state.submitting ? 'Sending...' : 'Send'}
						/>
						<Button onClick={handleReturnToMenu} label="Cancel" />
					</div>
				</form>
			</Section>

			<SmallPrint />
		</PageWidth>
	);
};

export { FeedbackScreen };
export default FeedbackScreen;
