/**
 * Obstacle component - renders a single obstacle
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Obstacle as ObstacleInterface } from '../types/index';

interface ObstacleProps {
  obstacle: ObstacleInterface;
}

/**
 * Obstacle component that renders a single obstacle at the correct position
 */
export const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  const styles = StyleSheet.create({
    obstacle: {
      position: 'absolute',
      width: obstacle.width,
      height: obstacle.height,
      backgroundColor: '#ff0000',
      left: obstacle.x,
      top: obstacle.y,
      borderRadius: 4,
    },
  });

  return <View style={styles.obstacle} />;
};
