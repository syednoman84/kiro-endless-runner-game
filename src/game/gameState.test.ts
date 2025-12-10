/**
 * Tests for game state management
 */

import {
  createInitialGameState,
  updatePlayerLane,
  addObstacle,
  removeObstacle,
  updateScore,
  setGameOver,
  resetGame,
} from './gameState';
import { Obstacle } from '../types/index';

describe('Game State Management', () => {
  describe('createInitialGameState', () => {
    it('should create a valid initial game state', () => {
      const state = createInitialGameState();
      expect(state.isRunning).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.playerLane).toBe(1);
      expect(state.score).toBe(0);
      expect(state.obstacles).toEqual([]);
      expect(state.gameOver).toBe(false);
    });
  });

  describe('updatePlayerLane', () => {
    it('should update the player lane', () => {
      const state = createInitialGameState();
      const updated = updatePlayerLane(state, 0);
      expect(updated.playerLane).toBe(0);
      expect(state.playerLane).toBe(1); // original unchanged
    });
  });

  describe('addObstacle', () => {
    it('should add an obstacle to the state', () => {
      const state = createInitialGameState();
      const obstacle: Obstacle = {
        id: 'obs1',
        lane: 0,
        x: 0,
        y: 0,
        width: 40,
        height: 60,
        speed: 5,
      };
      const updated = addObstacle(state, obstacle);
      expect(updated.obstacles).toHaveLength(1);
      expect(updated.obstacles[0]).toEqual(obstacle);
    });
  });

  describe('removeObstacle', () => {
    it('should remove an obstacle by id', () => {
      const state = createInitialGameState();
      const obstacle: Obstacle = {
        id: 'obs1',
        lane: 0,
        x: 0,
        y: 0,
        width: 40,
        height: 60,
        speed: 5,
      };
      const withObstacle = addObstacle(state, obstacle);
      const removed = removeObstacle(withObstacle, 'obs1');
      expect(removed.obstacles).toHaveLength(0);
    });
  });

  describe('updateScore', () => {
    it('should increment the score', () => {
      const state = createInitialGameState();
      const updated = updateScore(state, 10);
      expect(updated.score).toBe(10);
    });

    it('should accumulate score increments', () => {
      let state = createInitialGameState();
      state = updateScore(state, 5);
      state = updateScore(state, 3);
      expect(state.score).toBe(8);
    });
  });

  describe('setGameOver', () => {
    it('should set game over state', () => {
      const state = createInitialGameState();
      const updated = setGameOver(state);
      expect(updated.gameOver).toBe(true);
      expect(updated.isRunning).toBe(false);
    });
  });

  describe('resetGame', () => {
    it('should reset game to initial state', () => {
      let state = createInitialGameState();
      state = updateScore(state, 100);
      state = setGameOver(state);
      const reset = resetGame();
      expect(reset.score).toBe(0);
      expect(reset.gameOver).toBe(false);
      expect(reset.isRunning).toBe(false);
    });
  });
});
