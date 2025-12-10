/**
 * Obstacle class for managing obstacle state and movement
 */

import { Obstacle as ObstacleInterface } from '../types/index';
import { validateLane } from '../utils/validation';

/**
 * Obstacle class with movement logic
 */
export class Obstacle implements ObstacleInterface {
  id: string;
  lane: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;

  constructor(
    id: string,
    lane: number,
    x: number,
    y: number = 0,
    width: number = 40,
    height: number = 60,
    speed: number = 5
  ) {
    this.id = id;
    this.lane = validateLane(lane);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  /**
   * Moves the obstacle downward by its speed
   */
  moveDown(): void {
    this.y += this.speed;
  }

  /**
   * Checks if the obstacle has moved beyond the bottom of the track
   */
  isOffScreen(trackHeight: number): boolean {
    return this.y > trackHeight;
  }

  /**
   * Gets the obstacle's current lane
   */
  getLane(): number {
    return this.lane;
  }

  /**
   * Gets the obstacle's current Y position
   */
  getY(): number {
    return this.y;
  }
}

/**
 * Obstacle manager for handling obstacle generation and movement
 */
export class ObstacleManager {
  private spawnCounter: number = 0;
  private spawnRate: number;
  private nextId: number = 0;
  private obstacleWidth: number;
  private obstacleHeight: number;
  private obstacleSpeed: number;

  constructor(
    spawnRate: number = 60,
    obstacleWidth: number = 40,
    obstacleHeight: number = 60,
    obstacleSpeed: number = 5
  ) {
    this.spawnRate = spawnRate;
    this.obstacleWidth = obstacleWidth;
    this.obstacleHeight = obstacleHeight;
    this.obstacleSpeed = obstacleSpeed;
  }

  /**
   * Updates all obstacles by moving them down
   */
  updateObstacles(obstacles: Obstacle[]): Obstacle[] {
    return obstacles.map((obstacle) => {
      const updated = new Obstacle(
        obstacle.id,
        obstacle.lane,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height,
        obstacle.speed
      );
      updated.moveDown();
      return updated;
    });
  }

  /**
   * Removes obstacles that have moved off screen
   */
  removeOffScreenObstacles(obstacles: Obstacle[], trackHeight: number): Obstacle[] {
    return obstacles.filter((obstacle) => !obstacle.isOffScreen(trackHeight));
  }

  /**
   * Checks if a new obstacle should be spawned
   */
  shouldSpawn(): boolean {
    this.spawnCounter++;
    if (this.spawnCounter >= this.spawnRate) {
      this.spawnCounter = 0;
      return true;
    }
    return false;
  }

  /**
   * Generates a random lane (0-2)
   */
  private getRandomLane(): number {
    return Math.floor(Math.random() * 3);
  }

  /**
   * Creates a new obstacle with a random lane
   */
  createObstacle(x: number, y: number = 0): Obstacle {
    const lane = this.getRandomLane();
    const id = `obstacle-${this.nextId++}`;
    return new Obstacle(
      id,
      lane,
      x,
      y,
      this.obstacleWidth,
      this.obstacleHeight,
      this.obstacleSpeed
    );
  }

  /**
   * Resets the spawn counter (useful for testing)
   */
  resetSpawnCounter(): void {
    this.spawnCounter = 0;
  }
}
