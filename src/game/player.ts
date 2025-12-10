/**
 * Player class for managing player state and movement
 */

import { Player as PlayerInterface } from '../types/index';
import { validateLane } from '../utils/validation';

/**
 * Player class with movement logic
 */
export class Player implements PlayerInterface {
  lane: number;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(
    initialLane: number = 1,
    x: number = 0,
    y: number = 0,
    width: number = 40,
    height: number = 60
  ) {
    this.lane = validateLane(initialLane);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Moves the player left or right by one lane
   * @param direction - 'left' or 'right'
   * @param isGameRunning - whether the game is currently running
   * @returns true if movement was successful, false otherwise
   */
  moveLane(direction: 'left' | 'right', isGameRunning: boolean = true): boolean {
    // Movement only works when game is running
    if (!isGameRunning) {
      return false;
    }

    let newLane = this.lane;

    if (direction === 'left') {
      newLane = this.lane - 1;
    } else if (direction === 'right') {
      newLane = this.lane + 1;
    }

    // Validate and clamp the new lane
    const validatedLane = validateLane(newLane);

    // Check if the lane actually changed (i.e., we didn't hit a boundary)
    if (validatedLane === this.lane) {
      return false;
    }

    this.lane = validatedLane;
    return true;
  }

  /**
   * Gets the player's current lane
   */
  getLane(): number {
    return this.lane;
  }

  /**
   * Sets the player's lane directly (with validation)
   */
  setLane(lane: number): void {
    this.lane = validateLane(lane);
  }
}
