import React from 'react';
import { View, Text } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Card } from '../src/components/Card';
import { ThemeProvider } from '../src/context/ThemeContext';
import { lightTheme } from '../src/theme';

export default {
  title: 'Components/Card',
  component: Card,
};

const Decorator: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <PaperProvider theme={lightTheme}>
      <View style={{ padding: 16 }}>{children}</View>
    </PaperProvider>
  </ThemeProvider>
);

export const Basic = () => (
  <Decorator>
    <Card>
      <View>{/* Simple placeholder content */}</View>
    </Card>
  </Decorator>
);

export const WithText = () => (
  <Decorator>
    <Card>
      <View>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Card with text</Text>
        <Text>
          This is a simple card component displaying some text as content. Cards can hold any React
          Node inside.
        </Text>
      </View>
    </Card>
  </Decorator>
);

export const InfoCard = () => (
  <Decorator>
    <Card>
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Info</Text>
        <Text>
          You can use cards to highlight important information, actions, or summaries. Customize the
          content as needed!
        </Text>
      </View>
    </Card>
  </Decorator>
);
