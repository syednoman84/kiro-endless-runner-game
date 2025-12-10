/**
 * Track component - renders the game track with lanes
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Track as TrackInterface } from '../types/index';

interface TrackProps {
  track: TrackInterface;
  children?: React.ReactNode;
}

/**
 * Track component that renders the game track background and lanes
 */
export const Track: React.FC<TrackProps> = ({ track, children }) => {
  const styles = StyleSheet.create({
    track: {
      width: track.width,
      height: track.height,
      backgroundColor: '#1a1a1a',
      position: 'relative',
      overflow: 'hidden',
    },
    laneContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    lane: {
      flex: 1,
      borderRightWidth: 2,
      borderRightColor: '#444',
    },
    lastLane: {
      flex: 1,
    },
  });

  return (
    <View style={styles.track}>
      <View style={styles.laneContainer}>
        {Array.from({ length: track.laneCount }).map((_, index) => (
          <View
            key={index}
            style={[styles.lane, index === track.laneCount - 1 && styles.lastLane]}
          />
        ))}
      </View>
      {children}
    </View>
  );
};
