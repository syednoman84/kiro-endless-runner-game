/**
 * Game state management and initialization
 */

import { GameState, Obstacle } from '../types/index';

/**
 * Creates an initial game state
 */
export function createInitialGameState(): GameState {
  return {
    isRunning: false,
    isPaused: false,
    playerLane: 1, // center lane
    score: 0,
    obstacles: [],
    gameOver: false,
  };
}

/**
 * Updates the player's lane in the game state
 */
export function updatePlayerLane(state: GameState, newLane: number): GameState {
  return {
    ...state,
    playerLane: newLane,
  };
}

/**
 * Adds an obstacle to the game state
 */
export function addObstacle(state: GameState, obstacle: Obstacle): GameState {
  return {
    ...state,
    obstacles: [...state.obstacles, obstacle],
  };
}

/**
 * Removes an obstacle from the game state by ID
 */
export function removeObstacle(state: GameState, obstacleId: string): GameState {
  return {
    ...state,
    obstacles: state.obstacles.filter((obs) => obs.id !== obstacleId),
  };
}

/**
 * Updates the score in the game state
 */
export function updateScore(state: GameState, increment: number): GameState {
  return {
    ...state,
    score: state.score + increment,
  };
}

/**
 * Sets the game over state
 */
export function setGameOver(state: GameState): GameState {
  return {
    ...state,
    gameOver: true,
    isRunning: false,
  };
}

/**
 * Resets the game state for a new game
 */
export function resetGame(): GameState {
  return createInitialGameState();
}
