/**
 * Collision detection using AABB (axis-aligned bounding box)
 */

import { Player, Obstacle } from '../types/index';

/**
 * Represents a bounding box for collision detection
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Checks if two bounding boxes overlap (AABB collision detection)
 * @param box1 - First bounding box
 * @param box2 - Second bounding box
 * @returns true if the boxes overlap, false otherwise
 */
export function checkAABBCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
}

/**
 * Checks if a player collides with an obstacle
 * @param player - The player object
 * @param obstacle - The obstacle object
 * @returns true if there is a collision, false otherwise
 */
export function checkPlayerObstacleCollision(player: Player, obstacle: Obstacle): boolean {
  const playerBox: BoundingBox = {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
  };

  const obstacleBox: BoundingBox = {
    x: obstacle.x,
    y: obstacle.y,
    width: obstacle.width,
    height: obstacle.height,
  };

  return checkAABBCollision(playerBox, obstacleBox);
}

/**
 * Checks if the player collides with any obstacle in the list
 * @param player - The player object
 * @param obstacles - Array of obstacles
 * @returns the first obstacle that collides with the player, or null if no collision
 */
export function checkCollisionWithAny(player: Player, obstacles: Obstacle[]): Obstacle | null {
  for (const obstacle of obstacles) {
    if (checkPlayerObstacleCollision(player, obstacle)) {
      return obstacle;
    }
  }
  return null;
}
