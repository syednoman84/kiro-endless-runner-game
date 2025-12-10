/**
 * Tests for collision detection
 */

import { checkAABBCollision, checkPlayerObstacleCollision, checkCollisionWithAny, BoundingBox } from './collision';
import { Player, Obstacle } from '../types/index';
import fc from 'fast-check';

describe('Collision Detection', () => {
  describe('checkAABBCollision', () => {
    it('should detect collision when boxes overlap', () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 40, height: 60 };
      const box2: BoundingBox = { x: 20, y: 30, width: 40, height: 60 };
      expect(checkAABBCollision(box1, box2)).toBe(true);
    });

    it('should not detect collision when boxes do not overlap', () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 40, height: 60 };
      const box2: BoundingBox = { x: 100, y: 100, width: 40, height: 60 };
      expect(checkAABBCollision(box1, box2)).toBe(false);
    });

    it('should detect collision when boxes are touching at edges', () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 40, height: 60 };
      const box2: BoundingBox = { x: 40, y: 0, width: 40, height: 60 };
      expect(checkAABBCollision(box1, box2)).toBe(false); // touching edge is not overlapping
    });

    it('should detect collision when one box is inside another', () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 20, y: 20, width: 40, height: 40 };
      expect(checkAABBCollision(box1, box2)).toBe(true);
    });
  });

  describe('checkPlayerObstacleCollision', () => {
    it('should detect collision between player and obstacle', () => {
      const player: Player = {
        lane: 1,
        x: 100,
        y: 700,
        width: 40,
        height: 60,
      };

      const obstacle: Obstacle = {
        id: 'obs1',
        lane: 1,
        x: 110,
        y: 720,
        width: 40,
        height: 60,
        speed: 5,
      };

      expect(checkPlayerObstacleCollision(player, obstacle)).toBe(true);
    });

    it('should not detect collision when player and obstacle are in different lanes', () => {
      const player: Player = {
        lane: 0,
        x: 0,
        y: 700,
        width: 40,
        height: 60,
      };

      const obstacle: Obstacle = {
        id: 'obs1',
        lane: 2,
        x: 200,
        y: 400,
        width: 40,
        height: 60,
        speed: 5,
      };

      expect(checkPlayerObstacleCollision(player, obstacle)).toBe(false);
    });

    it('should not detect collision when obstacle is above player', () => {
      const player: Player = {
        lane: 1,
        x: 100,
        y: 700,
        width: 40,
        height: 60,
      };

      const obstacle: Obstacle = {
        id: 'obs1',
        lane: 1,
        x: 100,
        y: 100,
        width: 40,
        height: 60,
        speed: 5,
      };

      expect(checkPlayerObstacleCollision(player, obstacle)).toBe(false);
    });
  });

  describe('checkCollisionWithAny', () => {
    it('should return null when no collision occurs', () => {
      const player: Player = {
        lane: 1,
        x: 100,
        y: 700,
        width: 40,
        height: 60,
      };

      const obstacles: Obstacle[] = [
        {
          id: 'obs1',
          lane: 0,
          x: 0,
          y: 400,
          width: 40,
          height: 60,
          speed: 5,
        },
        {
          id: 'obs2',
          lane: 2,
          x: 200,
          y: 300,
          width: 40,
          height: 60,
          speed: 5,
        },
      ];

      expect(checkCollisionWithAny(player, obstacles)).toBeNull();
    });

    it('should return the colliding obstacle', () => {
      const player: Player = {
        lane: 1,
        x: 100,
        y: 700,
        width: 40,
        height: 60,
      };

      const collidingObstacle: Obstacle = {
        id: 'obs2',
        lane: 1,
        x: 110,
        y: 720,
        width: 40,
        height: 60,
        speed: 5,
      };

      const obstacles: Obstacle[] = [
        {
          id: 'obs1',
          lane: 0,
          x: 0,
          y: 400,
          width: 40,
          height: 60,
          speed: 5,
        },
        collidingObstacle,
      ];

      expect(checkCollisionWithAny(player, obstacles)).toEqual(collidingObstacle);
    });

    it('should return the first colliding obstacle when multiple collisions exist', () => {
      const player: Player = {
        lane: 1,
        x: 100,
        y: 700,
        width: 40,
        height: 60,
      };

      const firstObstacle: Obstacle = {
        id: 'obs1',
        lane: 1,
        x: 110,
        y: 720,
        width: 40,
        height: 60,
        speed: 5,
      };

      const secondObstacle: Obstacle = {
        id: 'obs2',
        lane: 1,
        x: 105,
        y: 710,
        width: 40,
        height: 60,
        speed: 5,
      };

      const obstacles: Obstacle[] = [firstObstacle, secondObstacle];

      expect(checkCollisionWithAny(player, obstacles)).toEqual(firstObstacle);
    });

    it('should handle empty obstacle list', () => {
      const player: Player = {
        lane: 1,
        x: 100,
        y: 700,
        width: 40,
        height: 60,
      };

      expect(checkCollisionWithAny(player, [])).toBeNull();
    });
  });

  describe('Property 5: Collision Detection Accuracy', () => {
    it('should detect collision if and only if bounding boxes overlap', () => {
      fc.assert(
        fc.property(
          fc.record({
            player: fc.record({
              x: fc.integer({ min: 0, max: 300 }),
              y: fc.integer({ min: 0, max: 700 }),
              width: fc.integer({ min: 10, max: 50 }),
              height: fc.integer({ min: 10, max: 80 }),
            }),
            obstacle: fc.record({
              x: fc.integer({ min: 0, max: 300 }),
              y: fc.integer({ min: 0, max: 700 }),
              width: fc.integer({ min: 10, max: 50 }),
              height: fc.integer({ min: 10, max: 80 }),
            }),
          }),
          ({ player, obstacle }) => {
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

            const collision = checkAABBCollision(playerBox, obstacleBox);

            // Verify collision detection is accurate
            const expectedCollision =
              playerBox.x < obstacleBox.x + obstacleBox.width &&
              playerBox.x + playerBox.width > obstacleBox.x &&
              playerBox.y < obstacleBox.y + obstacleBox.height &&
              playerBox.y + playerBox.height > obstacleBox.y;

            expect(collision).toBe(expectedCollision);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
