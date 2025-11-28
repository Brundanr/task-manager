import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../components/Button';

jest.mock('react-native-paper', () => ({
  ...jest.requireActual('react-native-paper'),
  useTheme: () => ({
    colors: { primary: 'blue', secondary: 'green' }
  }),
}));

describe('Button', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = render(<Button title="Click" onPress={jest.fn()} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(<Button title="Test" onPress={onPress} />);
    fireEvent.press(getByLabelText('Test'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows loading indicator when loading is true', () => {
    const { getByTestId } = render(<Button title="Load" onPress={() => {}} loading />);
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('is disabled and does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(<Button title="Disabled" onPress={onPress} disabled />);
    fireEvent.press(getByLabelText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
