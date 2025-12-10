/**
 * Main App component - integrates all game components and manages the game lifecycle
 * Connects game loop to React component lifecycle, input handling, and rendering
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, GestureResponderEvent, PanResponder } from 'react-native';
import { GameLoop } from './game/gameLoop';
import { InputHandler } from './utils/inputHandler';
import { GameCanvas } from './components/GameCanvas';
import { GameState, Track, Player, GameConfig } from './types/index';

/**
 * Main App component that orchestrates the entire game
 * Manages game loop lifecycle, input handling, and state synchronization with React
 */
export const App: React.FC = () => {
  // Get screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Game configuration - memoized to prevent infinite loops
  const gameConfig = React.useMemo<GameConfig>(() => ({
    laneCount: 3,
    trackWidth: screenWidth,
    trackHeight: screenHeight,
    playerWidth: 40,
    playerHeight: 60,
    obstacleWidth: 40,
    obstacleHeight: 60,
    obstacleSpeed: 5,
    spawnRate: 60, // spawn every 60 frames at 60 FPS = 1 per second
    scoreIncrement: 1, // 1 point per frame
    targetFPS: 60,
  }), [screenWidth, screenHeight]);

  // Refs to maintain game loop and input handler across renders
  const gameLoopRef = useRef<GameLoop | null>(null);
  const inputHandlerRef = useRef<InputHandler | null>(null);
  const panResponderRef = useRef<any>(null);
  const lastTouchTimeRef = useRef<number>(0);

  // State for React re-renders
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game loop and input handler on mount
  useEffect(() => {
    // Create game loop
    const gameLoop = new GameLoop(gameConfig);
    gameLoopRef.current = gameLoop;

    // Initialize state from game loop
    setGameState(gameLoop.getGameState());
    setTrack(gameLoop.getTrack());
    setPlayer(gameLoop.getPlayer());

    // Create input handler with callback to queue input in game loop
    const inputHandler = new InputHandler(screenWidth, (direction) => {
      if (gameLoopRef.current) {
        gameLoopRef.current.queueInput(direction);
      }
    });
    inputHandlerRef.current = inputHandler;

    // Create PanResponder for touch handling
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        // Handle touch start
        const touchX = evt.nativeEvent.touches[0]?.pageX ?? 0;
        handleTouchInput(touchX);
      },
      onPanResponderMove: (evt) => {
        // Handle touch move
        const touchX = evt.nativeEvent.touches[0]?.pageX ?? 0;
        handleTouchInput(touchX);
      },
      onPanResponderRelease: (evt) => {
        // Handle touch end
        const touchX = evt.nativeEvent.changedTouches[0]?.pageX ?? 0;
        handleTouchInput(touchX);
      },
    });
    panResponderRef.current = panResponder;

    // Cleanup on unmount
    return () => {
      if (gameLoopRef.current) {
        gameLoopRef.current.stop();
      }
    };
  }, [screenWidth, gameConfig]);

  // Handle game state updates from game loop
  // This callback is called each frame to sync game state with React
  const handleGameStateUpdate = useCallback(() => {
    if (gameLoopRef.current) {
      const updatedGameState = gameLoopRef.current.getGameState();
      const updatedPlayer = gameLoopRef.current.getPlayer();

      setGameState(updatedGameState);
      setPlayer(updatedPlayer);

      // Update input handler's game running state
      if (inputHandlerRef.current) {
        inputHandlerRef.current.setGameRunning(updatedGameState.isRunning);
      }
    }
    
    // Schedule next update
    requestAnimationFrame(handleGameStateUpdate);
  }, []);

  // Start game on first render
  useEffect(() => {
    if (!gameStarted && gameLoopRef.current) {
      gameLoopRef.current.start();
      if (inputHandlerRef.current) {
        inputHandlerRef.current.setGameRunning(true);
      }
      setGameStarted(true);
    }
  }, [gameStarted]);

  // Handle touch input - determine direction based on tap position
  const handleTouchInput = useCallback((touchX: number) => {
    if (!gameLoopRef.current?.isGameRunning()) {
      return;
    }

    // Debounce rapid touches (100ms)
    const now = Date.now();
    if (now - lastTouchTimeRef.current < 100) {
      return;
    }
    lastTouchTimeRef.current = now;

    // Determine direction based on which half of screen was touched
    const midpoint = screenWidth / 2;
    const direction = touchX < midpoint ? 'left' : 'right';
    
    console.log('Touch detected - X:', touchX, 'Midpoint:', midpoint, 'Direction:', direction);
    
    // Queue the input
    if (gameLoopRef.current) {
      gameLoopRef.current.queueInput(direction);
    }
  }, [screenWidth]);

  // Handle restart
  const handleRestart = useCallback(() => {
    if (gameLoopRef.current) {
      gameLoopRef.current.restart();
      gameLoopRef.current.start();

      // Update state immediately
      setGameState(gameLoopRef.current.getGameState());
      setPlayer(gameLoopRef.current.getPlayer());

      if (inputHandlerRef.current) {
        inputHandlerRef.current.setGameRunning(true);
      }
    }
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    gameContainer: {
      flex: 1,
      width: screenWidth,
      height: screenHeight,
    },
  });

  // Don't render until game is initialized
  if (!gameState || !track || !player) {
    return <View style={styles.container} />;
  }

  return (
    <View
      style={styles.container}
      {...panResponderRef.current?.panHandlers}
    >
      <View style={styles.gameContainer}>
        <GameCanvas
          gameState={gameState}
          track={track}
          player={player}
          onRender={handleGameStateUpdate}
          onRestart={handleRestart}
        />
      </View>
    </View>
  );
};

export default App;
