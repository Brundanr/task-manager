import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useThemeMode } from '../context/ThemeContext';

export const ComponentShowcase: React.FC = () => {
  const { theme } = useThemeMode();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Component Showcase
      </Text>

      {/* Button Examples */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Buttons
      </Text>
      
      <View style={styles.section}>
        <Button 
          title="Primary Button" 
          onPress={() => console.log('Primary pressed')} 
          variant="primary" 
        />
        <View style={styles.spacer} />
        <Button 
          title="Secondary Button" 
          onPress={() => console.log('Secondary pressed')} 
          variant="secondary" 
        />
        <View style={styles.spacer} />
        <Button 
          title="Outlined Button" 
          onPress={() => console.log('Outlined pressed')} 
          variant="outlined" 
        />
        <View style={styles.spacer} />
        <Button 
          title="Disabled Button" 
          onPress={() => {}} 
          variant="primary" 
          disabled 
        />
        <View style={styles.spacer} />
        <Button 
          title="Loading Button" 
          onPress={() => {}} 
          variant="primary" 
          loading 
        />
      </View>

      {/* Card Examples */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Cards
      </Text>
      
      <View style={styles.section}>
        <Card>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Basic Card
            </Text>
            <Text style={[styles.cardText, { color: theme.colors.text }]}>
              This is a basic card component with some content inside.
            </Text>
          </View>
        </Card>
        
        <View style={styles.spacer} />
        
        <Card onPress={() => console.log('Card pressed')}>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Pressable Card
            </Text>
            <Text style={[styles.cardText, { color: theme.colors.text }]}>
              Tap this card to trigger an action.
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  spacer: {
    height: 10,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

