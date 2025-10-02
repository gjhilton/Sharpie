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