import StageButton from './StageButton';

export default {
  title: 'Components/StageButton',
  component: StageButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The text label displayed on the button',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when button is clicked',
    },
  },
};

export const Default = {
  args: {
    label: 'Continue',
  },
};

export const Start = {
  args: {
    label: 'Start Game',
  },
};

export const Next = {
  args: {
    label: 'Next Round',
  },
};

export const Finish = {
  args: {
    label: 'Finish',
  },
};