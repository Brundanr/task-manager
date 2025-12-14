import { registerRootComponent } from 'expo';

import App from './App';
import StorybookUIRoot from './storybook';

// Decide whether to run the main app or Storybook UI.
// To enable Storybook, start Expo with EXPO_PUBLIC_STORYBOOK=true
// (see the "storybook" script in package.json).
const shouldUseStorybook = process.env.EXPO_PUBLIC_STORYBOOK === 'true';

const RootComponent = shouldUseStorybook ? StorybookUIRoot : App;

// registerRootComponent calls AppRegistry.registerComponent('main', () => RootComponent);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(RootComponent);
