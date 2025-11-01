import KB from './KB';

export default {
  title: 'Components/KB',
  component: KB,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    keyCallback: {
      action: 'key pressed',
      description: 'Function called when a key is pressed',
    },
    initialLayout: {
      control: 'select',
      options: ['default', 'shift'],
      description: 'Initial keyboard layout (default for lowercase, shift for uppercase)',
    },
  },
};

export const Default = {
  args: {},
};

export const WithCallback = {
  args: {
    keyCallback: (key) => {
      console.log('Key pressed:', key);
    },
  },
};

export const ShiftLayout = {
  args: {
    initialLayout: 'shift',
  },
  parameters: {
    docs: {
      description: {
        story: 'Keyboard with uppercase letters displayed by default (useful for Majuscule mode)',
      },
    },
  },
};