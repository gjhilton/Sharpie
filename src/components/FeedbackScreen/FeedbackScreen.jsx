import { css } from '../../../dist/styled-system/css';
import { useForm, ValidationError } from '@formspree/react';
import Button from '@components/Button/Button.jsx';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
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

const Input = ({ id, type = 'text', name, required = false }) => (
	<input
		id={id}
		type={type}
		name={name}
		required={required}
		className={css({
			padding: '0.75rem',
			fontSize: 'm',
			border: '1px solid {colors.ink}',
			borderRadius: '4px',
			backgroundColor: '{colors.paper}',
			'&:focus': {
				outline: 'none',
				borderColor: '{colors.borderFocus}',
			},
		})}
	/>
);

const Textarea = ({ id, name, required = false }) => (
	<textarea
		id={id}
		name={name}
		required={required}
		rows={6}
		className={css({
			padding: '0.75rem',
			fontSize: 'm',
			border: '1px solid {colors.ink}',
			backgroundColor: '{colors.paper}',
			resize: 'vertical',
			fontFamily: 'inherit',
			'&:focus': {
				outline: 'none',
				borderColor: '{colors.borderFocus}',
			},
		})}
	/>
);

const ThankYouMessage = ({ onReturnToMenu }) => (
	<>
		<PageTitle>Thank you.</PageTitle>
		<div>
			<Paragraph>
				Your message has been received. Thank you for helping improve
				Sharpie.
			</Paragraph>
			<Button onClick={onReturnToMenu} label="Return to Menu" />
		</div>
	</>
);

const FeedbackScreen = ({ onReturnToMenu, onShowFeedback }) => {
	const [state, handleSubmit] = useForm('xanlrkkz');

	if (state.succeeded) {
		return (
			<PageWidth>
				<ThankYouMessage onReturnToMenu={onReturnToMenu} />

				<SmallPrint />
			</PageWidth>
		);
	}

	return (
		<PageWidth>
			<PageTitle>Send Feedback</PageTitle>

			<Section title={null}>
				<Paragraph>
					Found a problem? Have suggestions to help us improve? We'd
					love to hear from you.
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
						<Button onClick={onReturnToMenu} label="Cancel" />
					</div>
				</form>
			</Section>

			<SmallPrint />
		</PageWidth>
	);
};

export default FeedbackScreen;
