/**
 * Game loop implementation for the Endless Runner Game
 * Manages the main game loop running at 60 FPS with frame-by-frame updates
 */

import { GameState, GameConfig, Track } from '../types/index';
import { Player } from './player';
import { Obstacle, ObstacleManager } from './obstacle';
import {
  createInitialGameState,
  updatePlayerLane,
  addObstacle,
  removeObstacle,
  updateScore,
  setGameOver,
  resetGame,
} from './gameState';
import { checkCollisionWithAny } from './collision';

/**
 * Game loop controller that manages the main game loop
 */
export class GameLoop {
  private gameState: GameState;
  private player: Player;
  private obstacleManager: ObstacleManager;
  private track: Track;
  private config: GameConfig;
  private isRunning: boolean = false;
  private frameCount: number = 0;
  private timerId: NodeJS.Timeout | null = null;
  private lastFrameTime: number = 0;
  private frameTime: number; // milliseconds per frame for 60 FPS
  private inputQueue: Array<'left' | 'right'> = [];

  constructor(config: GameConfig) {
    this.config = config;
    this.frameTime = 1000 / config.targetFPS; // ~16.67ms for 60 FPS

    // Initialize game state
    this.gameState = createInitialGameState();

    // Initialize player at center lane
    const laneWidth = config.trackWidth / config.laneCount;
    const playerX = laneWidth * this.gameState.playerLane + (laneWidth - config.playerWidth) / 2;
    const playerY = config.trackHeight - config.playerHeight - 10;
    this.player = new Player(
      this.gameState.playerLane,
      playerX,
      playerY,
      config.playerWidth,
      config.playerHeight
    );

    // Initialize track
    this.track = {
      width: config.trackWidth,
      height: config.trackHeight,
      laneCount: config.laneCount,
      laneWidth: laneWidth,
    };

    // Initialize obstacle manager
    this.obstacleManager = new ObstacleManager(
      config.spawnRate,
      config.obstacleWidth,
      config.obstacleHeight,
      config.obstacleSpeed
    );
  }

  /**
   * Starts the game loop
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.gameState.isRunning = true;
    this.gameState.gameOver = false;
    this.frameCount = 0;
    this.inputQueue = [];

    // Use setInterval for consistent frame timing
    this.timerId = setInterval(() => {
      if (this.isRunning) {
        this.gameLoop();
      }
    }, this.frameTime);
  }

  /**
   * Stops the game loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Main game loop - runs each frame
   */
  private gameLoop = (): void => {
    this.update();
    this.frameCount++;
  };

  /**
   * Updates game state for one frame
   * Sequence: input → state update → collision detection → cleanup
   */
  private update(): void {
    if (!this.gameState.isRunning || this.gameState.gameOver) {
      return;
    }

    // Step 1: Process input
    this.processInput();

    // Step 2: Update game state
    this.updateGameState();

    // Step 3: Collision detection
    this.detectCollisions();

    // Step 4: Cleanup (remove off-screen obstacles)
    this.cleanupObstacles();
  }

  /**
   * Processes queued input commands
   */
  private processInput(): void {
    while (this.inputQueue.length > 0) {
      const direction = this.inputQueue.shift();
      if (direction) {
        this.movePlayer(direction);
      }
    }
  }

  /**
   * Moves the player in the specified direction
   */
  private movePlayer(direction: 'left' | 'right'): void {
    const oldLane = this.player.getLane();
    const moved = this.player.moveLane(direction, this.gameState.isRunning);

    if (moved) {
      const newLane = this.player.getLane();
      this.gameState = updatePlayerLane(this.gameState, newLane);

      // Update player X position based on new lane
      const laneWidth = this.track.laneWidth;
      this.player.x = laneWidth * newLane + (laneWidth - this.config.playerWidth) / 2;
    }
  }

  /**
   * Updates all game state elements for the current frame
   */
  private updateGameState(): void {
    // Update obstacles
    const updatedObstacles = this.obstacleManager.updateObstacles(
      this.gameState.obstacles as Obstacle[]
    );
    this.gameState.obstacles = updatedObstacles;

    // Spawn new obstacles if needed
    if (this.obstacleManager.shouldSpawn()) {
      const laneWidth = this.track.laneWidth;
      const newObstacle = this.obstacleManager.createObstacle(0, -this.config.obstacleHeight);

      // Calculate X position based on lane
      const obstacleX = laneWidth * newObstacle.lane + (laneWidth - this.config.obstacleWidth) / 2;
      newObstacle.x = obstacleX;

      this.gameState = addObstacle(this.gameState, newObstacle);
    }

    // Increment score each frame
    this.gameState = updateScore(this.gameState, this.config.scoreIncrement);
  }

  /**
   * Detects collisions between player and obstacles
   */
  private detectCollisions(): void {
    const collidedObstacle = checkCollisionWithAny(this.player, this.gameState.obstacles);

    if (collidedObstacle) {
      this.endGame();
    }
  }

  /**
   * Removes obstacles that have moved off screen
   */
  private cleanupObstacles(): void {
    const cleanedObstacles = this.obstacleManager.removeOffScreenObstacles(
      this.gameState.obstacles as Obstacle[],
      this.track.height
    );
    this.gameState.obstacles = cleanedObstacles;
  }

  /**
   * Ends the game
   */
  private endGame(): void {
    this.gameState = setGameOver(this.gameState);
    this.gameState.isRunning = false;
  }

  /**
   * Restarts the game
   */
  restart(): void {
    this.stop();
    this.gameState = resetGame();
    this.player.setLane(1); // center lane
    const laneWidth = this.track.laneWidth;
    this.player.x = laneWidth * 1 + (laneWidth - this.config.playerWidth) / 2;
    this.player.y = this.config.trackHeight - this.config.playerHeight - 10;
    this.obstacleManager.resetSpawnCounter();
    this.inputQueue = [];
    this.frameCount = 0;
    // Don't start automatically - let the caller decide when to start
  }

  /**
   * Queues a player movement input
   */
  queueInput(direction: 'left' | 'right'): void {
    this.inputQueue.push(direction);
  }

  /**
   * Gets the current game state
   */
  getGameState(): GameState {
    return this.gameState;
  }

  /**
   * Gets the current player object
   */
  getPlayer(): Player {
    return this.player;
  }

  /**
   * Gets the current track
   */
  getTrack(): Track {
    return this.track;
  }

  /**
   * Gets the current frame count
   */
  getFrameCount(): number {
    return this.frameCount;
  }

  /**
   * Checks if the game loop is running
   */
  isGameRunning(): boolean {
    return this.isRunning;
  }
}
