/**
 * Tests for Obstacle class and ObstacleManager
 */

import { Obstacle, ObstacleManager } from './obstacle';

describe('Obstacle Class', () => {
  describe('Constructor', () => {
    it('should create an obstacle with provided values', () => {
      const obstacle = new Obstacle('obs-1', 1, 50, 100, 40, 60, 5);
      expect(obstacle.id).toBe('obs-1');
      expect(obstacle.lane).toBe(1);
      expect(obstacle.x).toBe(50);
      expect(obstacle.y).toBe(100);
      expect(obstacle.width).toBe(40);
      expect(obstacle.height).toBe(60);
      expect(obstacle.speed).toBe(5);
    });

    it('should create an obstacle with default values', () => {
      const obstacle = new Obstacle('obs-1', 1, 50);
      expect(obstacle.y).toBe(0);
      expect(obstacle.width).toBe(40);
      expect(obstacle.height).toBe(60);
      expect(obstacle.speed).toBe(5);
    });

    it('should clamp lane to valid bounds', () => {
      const obstacleLeft = new Obstacle('obs-1', -1, 50);
      expect(obstacleLeft.lane).toBe(0);

      const obstacleRight = new Obstacle('obs-2', 5, 50);
      expect(obstacleRight.lane).toBe(2);
    });
  });

  describe('moveDown', () => {
    it('should increase Y position by speed', () => {
      const obstacle = new Obstacle('obs-1', 1, 50, 100, 40, 60, 5);
      obstacle.moveDown();
      expect(obstacle.y).toBe(105);
    });

    it('should move down multiple times', () => {
      const obstacle = new Obstacle('obs-1', 1, 50, 0, 40, 60, 5);
      obstacle.moveDown();
      obstacle.moveDown();
      obstacle.moveDown();
      expect(obstacle.y).toBe(15);
    });

    it('should work with different speeds', () => {
      const obstacle = new Obstacle('obs-1', 1, 50, 0, 40, 60, 10);
      obstacle.moveDown();
      expect(obstacle.y).toBe(10);
    });
  });

  describe('isOffScreen', () => {
    it('should return false when obstacle is on screen', () => {
      const obstacle = new Obstacle('obs-1', 1, 50, 100, 40, 60, 5);
      expect(obstacle.isOffScreen(800)).toBe(false);
    });

    it('should return true when obstacle has moved beyond track height', () => {
      const obstacle = new Obstacle('obs-1', 1, 50, 850, 40, 60, 5);
      expect(obstacle.isOffScreen(800)).toBe(true);
    });

    it('should return false when obstacle is exactly at track height', () => {
      const obstacle = new Obstacle('obs-1', 1, 50, 800, 40, 60, 5);
      expect(obstacle.isOffScreen(800)).toBe(false);
    });
  });

  describe('getLane', () => {
    it('should return the obstacle lane', () => {
      const obstacle = new Obstacle('obs-1', 2, 50);
      expect(obstacle.getLane()).toBe(2);
    });
  });

  describe('getY', () => {
    it('should return the Y position', () => {
      const obstacle = new Obstacle('obs-1', 1, 50, 150);
      expect(obstacle.getY()).toBe(150);
    });
  });
});

describe('ObstacleManager', () => {
  describe('Constructor', () => {
    it('should create manager with default values', () => {
      const manager = new ObstacleManager();
      expect(manager).toBeDefined();
    });

    it('should create manager with custom values', () => {
      const manager = new ObstacleManager(30, 50, 70, 8);
      expect(manager).toBeDefined();
    });
  });

  describe('shouldSpawn', () => {
    it('should return false initially', () => {
      const manager = new ObstacleManager(60);
      expect(manager.shouldSpawn()).toBe(false);
    });

    it('should return true after spawnRate frames', () => {
      const manager = new ObstacleManager(3);
      expect(manager.shouldSpawn()).toBe(false);
      expect(manager.shouldSpawn()).toBe(false);
      expect(manager.shouldSpawn()).toBe(true);
    });

    it('should reset counter after spawning', () => {
      const manager = new ObstacleManager(2);
      expect(manager.shouldSpawn()).toBe(false); // counter = 1
      expect(manager.shouldSpawn()).toBe(true); // counter = 2, spawn and reset
      expect(manager.shouldSpawn()).toBe(false); // counter = 1
      expect(manager.shouldSpawn()).toBe(true); // counter = 2, spawn and reset
    });
  });

  describe('createObstacle', () => {
    it('should create an obstacle with valid lane', () => {
      const manager = new ObstacleManager();
      const obstacle = manager.createObstacle(100, 0);
      expect(obstacle.lane).toBeGreaterThanOrEqual(0);
      expect(obstacle.lane).toBeLessThanOrEqual(2);
    });

    it('should create obstacles with unique IDs', () => {
      const manager = new ObstacleManager();
      const obs1 = manager.createObstacle(100, 0);
      const obs2 = manager.createObstacle(100, 0);
      expect(obs1.id).not.toBe(obs2.id);
    });

    it('should use provided x and y coordinates', () => {
      const manager = new ObstacleManager();
      const obstacle = manager.createObstacle(150, 50);
      expect(obstacle.x).toBe(150);
      expect(obstacle.y).toBe(50);
    });

    it('should use configured obstacle dimensions and speed', () => {
      const manager = new ObstacleManager(60, 50, 70, 8);
      const obstacle = manager.createObstacle(100, 0);
      expect(obstacle.width).toBe(50);
      expect(obstacle.height).toBe(70);
      expect(obstacle.speed).toBe(8);
    });
  });

  describe('updateObstacles', () => {
    it('should move all obstacles down', () => {
      const manager = new ObstacleManager();
      const obs1 = new Obstacle('obs-1', 0, 50, 0, 40, 60, 5);
      const obs2 = new Obstacle('obs-2', 1, 100, 50, 40, 60, 5);
      const obstacles = [obs1, obs2];

      const updated = manager.updateObstacles(obstacles);
      expect(updated[0].y).toBe(5);
      expect(updated[1].y).toBe(55);
    });

    it('should not modify original obstacles', () => {
      const manager = new ObstacleManager();
      const obs = new Obstacle('obs-1', 0, 50, 0, 40, 60, 5);
      const obstacles = [obs];

      manager.updateObstacles(obstacles);
      expect(obs.y).toBe(0); // original unchanged
    });

    it('should handle empty obstacle list', () => {
      const manager = new ObstacleManager();
      const updated = manager.updateObstacles([]);
      expect(updated).toEqual([]);
    });
  });

  describe('removeOffScreenObstacles', () => {
    it('should remove obstacles beyond track height', () => {
      const manager = new ObstacleManager();
      const obs1 = new Obstacle('obs-1', 0, 50, 100, 40, 60, 5);
      const obs2 = new Obstacle('obs-2', 1, 100, 850, 40, 60, 5);
      const obstacles = [obs1, obs2];

      const filtered = manager.removeOffScreenObstacles(obstacles, 800);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('obs-1');
    });

    it('should keep obstacles on screen', () => {
      const manager = new ObstacleManager();
      const obs = new Obstacle('obs-1', 0, 50, 100, 40, 60, 5);
      const obstacles = [obs];

      const filtered = manager.removeOffScreenObstacles(obstacles, 800);
      expect(filtered).toHaveLength(1);
    });

    it('should handle empty obstacle list', () => {
      const manager = new ObstacleManager();
      const filtered = manager.removeOffScreenObstacles([], 800);
      expect(filtered).toEqual([]);
    });
  });

  describe('resetSpawnCounter', () => {
    it('should reset spawn counter', () => {
      const manager = new ObstacleManager(3);
      manager.shouldSpawn();
      manager.shouldSpawn();
      manager.resetSpawnCounter();
      expect(manager.shouldSpawn()).toBe(false);
    });
  });
});
