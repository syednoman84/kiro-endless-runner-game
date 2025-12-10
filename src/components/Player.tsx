/**
 * Player component - renders the player character
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Player as PlayerInterface } from '../types/index';

interface PlayerProps {
  player: PlayerInterface;
}

/**
 * Player component that renders the player character at the correct position
 */
export const Player: React.FC<PlayerProps> = ({ player }) => {
  const styles = StyleSheet.create({
    player: {
      position: 'absolute',
      width: player.width,
      height: player.height,
      backgroundColor: '#00ff00',
      left: player.x,
      top: player.y,
      borderRadius: 4,
    },
  });

  return <View style={styles.player} />;
};
