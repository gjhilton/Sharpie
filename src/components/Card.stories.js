import Card from './Card';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title displayed at the top of the card',
    },
    letter: {
      control: 'text',
      description: 'The letter to display in the Joscelyn font',
    },
    caption: {
      control: 'text',
      description: 'The caption displayed below the letter',
    },
  },
};

export const Default = {
  args: {
    letter: 'A',
  },
};

export const WithTitle = {
  args: {
    title: 'Letter Recognition Practice',
    letter: 'B',
  },
};

export const WithCaption = {
  args: {
    letter: 'C',
    caption: 'This is the letter C',
  },
};

export const Complete = {
  args: {
    title: 'Complete Card Example',
    letter: 'D',
    caption: 'This is the letter D',
  },
};

export const QuestionMark = {
  args: {
    title: 'Guess the Letter',
    letter: 'E',
    caption: '?',
  },
};