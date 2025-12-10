/**
 * Core type definitions for the Endless Runner Game
 */

/**
 * Represents the current state of the game
 */
export interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  playerLane: number; // 0-2, representing left, center, right
  score: number;
  obstacles: Obstacle[];
  gameOver: boolean;
}

/**
 * Represents the player character
 */
export interface Player {
  lane: number; // 0-2
  x: number; // calculated from lane
  y: number; // fixed at bottom of screen
  width: number;
  height: number;
}

/**
 * Represents an obstacle on the track
 */
export interface Obstacle {
  id: string; // unique identifier
  lane: number; // 0-2
  x: number; // calculated from lane
  y: number; // moves from top to bottom
  width: number;
  height: number;
  speed: number; // pixels per frame
}

/**
 * Represents the game track
 */
export interface Track {
  width: number;
  height: number;
  laneCount: number; // 3
  laneWidth: number; // calculated as width / laneCount
}

/**
 * Game configuration constants
 */
export interface GameConfig {
  laneCount: number;
  trackWidth: number;
  trackHeight: number;
  playerWidth: number;
  playerHeight: number;
  obstacleWidth: number;
  obstacleHeight: number;
  obstacleSpeed: number;
  spawnRate: number; // frames between spawns
  scoreIncrement: number; // points per frame
  targetFPS: number;
}
