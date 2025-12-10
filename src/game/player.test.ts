/**
 * Tests for Player class and movement logic
 */

import { Player } from './player';

describe('Player Class', () => {
  describe('Constructor', () => {
    it('should create a player with default values', () => {
      const player = new Player();
      expect(player.lane).toBe(1); // center lane
      expect(player.width).toBe(40);
      expect(player.height).toBe(60);
    });

    it('should create a player with custom values', () => {
      const player = new Player(0, 10, 20, 50, 70);
      expect(player.lane).toBe(0);
      expect(player.x).toBe(10);
      expect(player.y).toBe(20);
      expect(player.width).toBe(50);
      expect(player.height).toBe(70);
    });

    it('should clamp initial lane to valid bounds', () => {
      const playerLeft = new Player(-1);
      expect(playerLeft.lane).toBe(0);

      const playerRight = new Player(5);
      expect(playerRight.lane).toBe(2);
    });
  });

  describe('moveLane', () => {
    it('should move player left when game is running', () => {
      const player = new Player(1); // center
      const result = player.moveLane('left', true);
      expect(result).toBe(true);
      expect(player.lane).toBe(0);
    });

    it('should move player right when game is running', () => {
      const player = new Player(1); // center
      const result = player.moveLane('right', true);
      expect(result).toBe(true);
      expect(player.lane).toBe(2);
    });

    it('should prevent movement when game is not running', () => {
      const player = new Player(1);
      const result = player.moveLane('left', false);
      expect(result).toBe(false);
      expect(player.lane).toBe(1); // unchanged
    });

    it('should prevent movement beyond left boundary', () => {
      const player = new Player(0); // leftmost lane
      const result = player.moveLane('left', true);
      expect(result).toBe(false);
      expect(player.lane).toBe(0); // unchanged
    });

    it('should prevent movement beyond right boundary', () => {
      const player = new Player(2); // rightmost lane
      const result = player.moveLane('right', true);
      expect(result).toBe(false);
      expect(player.lane).toBe(2); // unchanged
    });

    it('should allow multiple consecutive movements', () => {
      const player = new Player(1);
      player.moveLane('left', true);
      expect(player.lane).toBe(0);
      player.moveLane('right', true);
      expect(player.lane).toBe(1);
      player.moveLane('right', true);
      expect(player.lane).toBe(2);
    });

    it('should return false when attempting to move beyond boundaries', () => {
      const player = new Player(0);
      const result = player.moveLane('left', true);
      expect(result).toBe(false);
    });
  });

  describe('getLane', () => {
    it('should return the current lane', () => {
      const player = new Player(1);
      expect(player.getLane()).toBe(1);
      player.moveLane('left', true);
      expect(player.getLane()).toBe(0);
    });
  });

  describe('setLane', () => {
    it('should set the lane directly', () => {
      const player = new Player(0);
      player.setLane(2);
      expect(player.lane).toBe(2);
    });

    it('should clamp invalid lanes when setting', () => {
      const player = new Player(1);
      player.setLane(-1);
      expect(player.lane).toBe(0);
      player.setLane(5);
      expect(player.lane).toBe(2);
    });
  });
});
