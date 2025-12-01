/** @type {import('@storybook/react-native').StorybookConfig} */
module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-ondevice-actions', '@storybook/addon-ondevice-controls'],
};
