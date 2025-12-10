import { SubSection } from './SubSection';

export default {
	title: 'Components/SubSection',
	component: SubSection,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {
		title: 'Section Title',
		children: (
			<p>
				This is the content area of the subsection. It takes up two-thirds of
				the available width while the title takes one-third.
			</p>
		),
	},
};

export const WithMultipleElements = {
	args: {
		title: 'Alphabets',
		children: (
			<>
				<p>Question bank: 196 characters from 5 alphabets.</p>
				<button>Choose alphabets</button>
			</>
		),
	},
};

export const Identify = {
	args: {
		title: 'Identify...',
		children: (
			<>
				<div>
					<label>
						<input type="radio" name="mode" /> minuscules only
					</label>
				</div>
				<div>
					<label>
						<input type="radio" name="mode" /> MAJUSCULES only
					</label>
				</div>
				<div>
					<label>
						<input type="radio" name="mode" checked readOnly /> both
					</label>
				</div>
			</>
		),
	},
};
