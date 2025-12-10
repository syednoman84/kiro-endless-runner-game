/**
 * GameOverScreen component - displays game over UI with final score and restart button
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameOverScreenProps {
  finalScore: number;
  onRestart: () => void;
}

/**
 * GameOverScreen component that displays the game over screen
 * Shows the final score and a restart button
 */
export const GameOverScreen: React.FC<GameOverScreenProps> = ({ finalScore, onRestart }) => {
  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    container: {
      alignItems: 'center',
      padding: 30,
      backgroundColor: '#2a2a2a',
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#ff6b6b',
    },
    title: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#ff6b6b',
      marginBottom: 20,
      textAlign: 'center',
    },
    scoreLabel: {
      fontSize: 18,
      color: '#cccccc',
      marginBottom: 10,
      textAlign: 'center',
    },
    scoreValue: {
      fontSize: 56,
      fontWeight: 'bold',
      color: '#4ecdc4',
      marginBottom: 30,
      textAlign: 'center',
    },
    restartButton: {
      backgroundColor: '#4ecdc4',
      paddingHorizontal: 40,
      paddingVertical: 15,
      borderRadius: 10,
      marginTop: 20,
    },
    restartButtonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1a1a1a',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Game Over</Text>
        <Text style={styles.scoreLabel}>Final Score</Text>
        <Text style={styles.scoreValue}>{finalScore}</Text>
        <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
          <Text style={styles.restartButtonText}>Restart Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
