import React from 'react';
import { getStorybookUI } from '@storybook/react-native';

// Import stories - MUST be imported before getStorybookUI
import './storybook.requires';

// Get Storybook UI - Initialize at module level to avoid recursion
// Don't use configure() as it may cause issues
const StorybookUIRoot = getStorybookUI();

export default StorybookUIRoot;

