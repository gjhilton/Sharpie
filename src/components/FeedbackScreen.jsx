import { css } from '../../styled-system/css';
import { useForm, ValidationError } from '@formspree/react';
import Button from './Button.jsx';
import SmallPrint from './SmallPrint.jsx';

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
			border: '2px solid black',
			borderRadius: '4px',
			backgroundColor: 'white',
			'&:focus': {
				outline: 'none',
				borderColor: '#333',
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
			border: '2px solid black',
			borderRadius: '4px',
			backgroundColor: 'white',
			resize: 'vertical',
			fontFamily: 'inherit',
			'&:focus': {
				outline: 'none',
				borderColor: '#333',
			},
		})}
	/>
);

const ThankYouMessage = ({ onReturnToMenu }) => (
	<div
		className={css({
			textAlign: 'center',
			padding: '2rem',
		})}
	>
		<h2
			className={css({
				fontSize: 'xl',
				fontWeight: 'bold',
				marginBottom: '1rem',
			})}
		>
			Thank you for your feedback!
		</h2>
		<p
			className={css({
				fontSize: 'm',
				marginBottom: '2rem',
			})}
		>
			Your message has been received. We appreciate you taking the time to
			help us improve.
		</p>
		<Button onClick={onReturnToMenu} label="Return to Menu" />
	</div>
);

const FeedbackScreen = ({ onReturnToMenu, onShowFeedback }) => {
	const [state, handleSubmit] = useForm('xanlrkkz');

	if (state.succeeded) {
		return (
			<div
				className={css({
					display: 'flex',
					flexDirection: 'column',
					maxWidth: '90%',
					desktop: {
						maxWidth: '800px',
					},
					margin: '0 auto 2rem',
					padding: '2rem 0',
				})}
			>
				<ThankYouMessage onReturnToMenu={onReturnToMenu} />
				<SmallPrint onShowFeedback={onShowFeedback} />
			</div>
		);
	}

	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				maxWidth: '90%',
				desktop: {
					maxWidth: '800px',
				},
				margin: '0 auto 2rem',
				padding: '2rem 0',
			})}
		>
			<h1
				className={css({
					fontSize: '3rem',
					fontWeight: 'bold',
					marginBottom: '1rem',
				})}
			>
				Send Feedback
			</h1>

			<p
				className={css({
					fontSize: 'm',
					marginBottom: '2rem',
				})}
			>
				Have a bug to report, content to flag, or a suggestion to make?
				We'd love to hear from you.
			</p>

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

				<div
					className={css({
						display: 'flex',
						gap: '1rem',
						marginTop: '1rem',
					})}
				>
					<Button
						type="submit"
						disabled={state.submitting}
						label={
							state.submitting ? 'Sending...' : 'Send Feedback'
						}
					/>
					<Button onClick={onReturnToMenu} label="Cancel" />
				</div>
			</form>

			<div
				className={css({
					marginTop: '3rem',
				})}
			>
				<SmallPrint onShowFeedback={onShowFeedback} />
			</div>
		</div>
	);
};

export default FeedbackScreen;
