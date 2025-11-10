import { GamePresentation, CorrectAnswer, IncorrectAnswer, Unanswered } from './GamePresentation.jsx';
import { STATUS } from '../utilities/gameLogic.js';

export default {
	title: 'Components/GamePresentation',
	component: GamePresentation,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
};

// Mock solution data
const mockSolution = {
	graph: {
		img: 'Joscelyn/joscelyn-minuscule-assets/i.png',
		character: 'i',
		source: 'Joscelyn',
	},
	imagePath: '/data/Joscelyn/joscelyn-minuscule-assets/i.png',
};

const mockSolutionJ = {
	graph: {
		img: 'Joscelyn/joscelyn-minuscule-assets/j.png',
		character: 'j',
		source: 'Joscelyn',
	},
	imagePath: '/data/Joscelyn/joscelyn-minuscule-assets/j.png',
};

// Full GamePresentation stories
export const AwaitingAnswer = {
	args: {
		currentSolution: mockSolution,
		attempt: null,
		attemptImagePaths: [],
		attemptStatus: STATUS.NONE,
		acceptedAsDoubled: false,
		doubledLetterMode: false,
		initialKeyboardLayout: 'default',
		onKeyPress: () => console.log('Key pressed'),
		onNextLetter: () => console.log('Next letter'),
		onEndGame: () => console.log('End game'),
	},
};

export const CorrectAnswerNormal = {
	args: {
		currentSolution: mockSolution,
		attempt: 'i',
		attemptImagePaths: ['/data/Joscelyn/joscelyn-minuscule-assets/i.png'],
		attemptStatus: STATUS.CORRECT,
		acceptedAsDoubled: false,
		doubledLetterMode: false,
		initialKeyboardLayout: 'default',
		onKeyPress: () => console.log('Key pressed'),
		onNextLetter: () => console.log('Next letter'),
		onEndGame: () => console.log('End game'),
	},
};

export const CorrectAnswerDoubledLetterMode = {
	args: {
		currentSolution: mockSolutionJ,
		attempt: 'i',
		attemptImagePaths: ['/data/Joscelyn/joscelyn-minuscule-assets/i.png'],
		attemptStatus: STATUS.CORRECT,
		acceptedAsDoubled: true,
		doubledLetterMode: true,
		initialKeyboardLayout: 'default',
		onKeyPress: () => console.log('Key pressed'),
		onNextLetter: () => console.log('Next letter'),
		onEndGame: () => console.log('End game'),
	},
};

export const IncorrectAnswerExample = {
	args: {
		currentSolution: mockSolution,
		attempt: 'j',
		attemptImagePaths: ['/data/Joscelyn/joscelyn-minuscule-assets/j.png'],
		attemptStatus: STATUS.INCORRECT,
		acceptedAsDoubled: false,
		doubledLetterMode: false,
		initialKeyboardLayout: 'default',
		onKeyPress: () => console.log('Key pressed'),
		onNextLetter: () => console.log('Next letter'),
		onEndGame: () => console.log('End game'),
	},
};

export const WithDoubledLetterKeyboard = {
	args: {
		currentSolution: mockSolution,
		attempt: null,
		attemptImagePaths: [],
		attemptStatus: STATUS.NONE,
		acceptedAsDoubled: false,
		doubledLetterMode: true,
		initialKeyboardLayout: 'default',
		onKeyPress: () => console.log('Key pressed'),
		onNextLetter: () => console.log('Next letter'),
		onEndGame: () => console.log('End game'),
	},
};

// Individual component stories
export const CorrectAnswerComponent = {
	render: () => (
		<CorrectAnswer
			solution={mockSolution}
			onNext={() => console.log('Next clicked')}
			acceptedAsDoubled={false}
		/>
	),
};

export const CorrectAnswerWith24LetterMode = {
	render: () => (
		<CorrectAnswer
			solution={mockSolutionJ}
			onNext={() => console.log('Next clicked')}
			acceptedAsDoubled={true}
		/>
	),
};

export const IncorrectAnswerComponent = {
	render: () => (
		<IncorrectAnswer
			solution={mockSolution}
			attempt="j"
			attemptImagePaths={['/data/Joscelyn/joscelyn-minuscule-assets/j.png']}
			onNext={() => console.log('Next clicked')}
		/>
	),
};

export const UnansweredComponent = {
	render: () => <Unanswered solution={mockSolution} />,
};
