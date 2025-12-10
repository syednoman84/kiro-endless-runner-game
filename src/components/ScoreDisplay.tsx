/**
 * ScoreDisplay component - renders the current score
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreDisplayProps {
  score: number;
}

/**
 * ScoreDisplay component that renders the current score
 */
export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  const styles = StyleSheet.create({
    scoreContainer: {
      position: 'absolute',
      top: 20,
      left: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 8,
      zIndex: 100,
    },
    scoreText: {
      color: '#ffffff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    scoreLabel: {
      color: '#cccccc',
      fontSize: 12,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.scoreContainer}>
      <Text style={styles.scoreText}>{score}</Text>
      <Text style={styles.scoreLabel}>Score</Text>
    </View>
  );
};
