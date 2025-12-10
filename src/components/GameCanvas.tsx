/**
 * GameCanvas component - main rendering component that combines all game elements
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GameState, Track as TrackInterface, Player as PlayerInterface } from '../types/index';
import { Track } from './Track';
import { Player } from './Player';
import { Obstacle } from './Obstacle';
import { ScoreDisplay } from './ScoreDisplay';
import { GameOverScreen } from './GameOverScreen';

interface GameCanvasProps {
  gameState: GameState;
  track: TrackInterface;
  player: PlayerInterface;
  onRender?: () => void;
  onRestart?: () => void;
}

/**
 * GameCanvas component that renders the entire game scene
 * Displays the track, player, all obstacles, and score
 * Shows game over screen when the game ends
 */
export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  track,
  player,
  onRender,
  onRestart,
}) => {
  // Trigger re-render when game state changes
  useEffect(() => {
    if (onRender) {
      onRender();
    }
  }, [onRender]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
    },
  });

  return (
    <View style={styles.container}>
      <Track track={track}>
        {/* Render all obstacles */}
        {gameState.obstacles.map((obstacle) => (
          <Obstacle key={obstacle.id} obstacle={obstacle} />
        ))}

        {/* Render player */}
        <Player player={player} />

        {/* Render score display */}
        <ScoreDisplay score={gameState.score} />
      </Track>

      {/* Render game over screen if game is over */}
      {gameState.gameOver && onRestart && (
        <GameOverScreen finalScore={gameState.score} onRestart={onRestart} />
      )}
    </View>
  );
};
