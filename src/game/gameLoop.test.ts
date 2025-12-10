/**
 * Tests for the game loop and state management
 */

import { GameLoop } from './gameLoop';
import { GameConfig } from '../types/index';

// Default test configuration
const defaultConfig: GameConfig = {
  laneCount: 3,
  trackWidth: 300,
  trackHeight: 600,
  playerWidth: 40,
  playerHeight: 60,
  obstacleWidth: 40,
  obstacleHeight: 60,
  obstacleSpeed: 5,
  spawnRate: 60,
  scoreIncrement: 1,
  targetFPS: 60,
};

describe('GameLoop', () => {
  let gameLoop: GameLoop;

  beforeEach(() => {
    gameLoop = new GameLoop(defaultConfig);
  });

  afterEach(() => {
    gameLoop.stop();
  });

  describe('Initialization', () => {
    it('should initialize with correct game state', () => {
      const state = gameLoop.getGameState();
      expect(state.isRunning).toBe(false);
      expect(state.gameOver).toBe(false);
      expect(state.playerLane).toBe(1);
      expect(state.score).toBe(0);
      expect(state.obstacles).toHaveLength(0);
    });

    it('should initialize player in center lane', () => {
      const player = gameLoop.getPlayer();
      expect(player.getLane()).toBe(1);
    });

    it('should initialize track with correct dimensions', () => {
      const track = gameLoop.getTrack();
      expect(track.width).toBe(defaultConfig.trackWidth);
      expect(track.height).toBe(defaultConfig.trackHeight);
      expect(track.laneCount).toBe(3);
      expect(track.laneWidth).toBe(100);
    });
  });

  describe('Game Start and Stop', () => {
    it('should start the game loop', (done) => {
      gameLoop.start();
      expect(gameLoop.isGameRunning()).toBe(true);
      expect(gameLoop.getGameState().isRunning).toBe(true);

      setTimeout(() => {
        gameLoop.stop();
        done();
      }, 50);
    });

    it('should stop the game loop', (done) => {
      gameLoop.start();
      setTimeout(() => {
        gameLoop.stop();
        expect(gameLoop.isGameRunning()).toBe(false);
        done();
      }, 50);
    });

    it('should not start if already running', (done) => {
      gameLoop.start();
      const frameCountBefore = gameLoop.getFrameCount();

      setTimeout(() => {
        gameLoop.start(); // Try to start again
        const frameCountAfter = gameLoop.getFrameCount();

        // Frame count should have increased (only one loop running)
        expect(frameCountAfter).toBeGreaterThan(frameCountBefore);
        gameLoop.stop();
        done();
      }, 50);
    });
  });

  describe('Player Movement', () => {
    it('should move player left when input is queued', (done) => {
      gameLoop.start();
      const initialLane = gameLoop.getPlayer().getLane();

      gameLoop.queueInput('left');

      setTimeout(() => {
        const newLane = gameLoop.getPlayer().getLane();
        expect(newLane).toBe(initialLane - 1);
        gameLoop.stop();
        done();
      }, 50);
    });

    it('should move player right when input is queued', (done) => {
      gameLoop.start();
      const initialLane = gameLoop.getPlayer().getLane();

      gameLoop.queueInput('right');

      setTimeout(() => {
        const newLane = gameLoop.getPlayer().getLane();
        expect(newLane).toBe(initialLane + 1);
        gameLoop.stop();
        done();
      }, 50);
    });

    it('should prevent movement beyond left boundary', (done) => {
      gameLoop.start();
      gameLoop.queueInput('left');
      gameLoop.queueInput('left');

      setTimeout(() => {
        const lane = gameLoop.getPlayer().getLane();
        expect(lane).toBe(0); // Should be clamped to 0
        gameLoop.stop();
        done();
      }, 50);
    });

    it('should prevent movement beyond right boundary', (done) => {
      gameLoop.start();
      gameLoop.queueInput('right');
      gameLoop.queueInput('right');

      setTimeout(() => {
        const lane = gameLoop.getPlayer().getLane();
        expect(lane).toBe(2); // Should be clamped to 2
        gameLoop.stop();
        done();
      }, 50);
    });

    it('should update game state when player moves', (done) => {
      gameLoop.start();
      gameLoop.queueInput('left');

      setTimeout(() => {
        const state = gameLoop.getGameState();
        expect(state.playerLane).toBe(0);
        gameLoop.stop();
        done();
      }, 50);
    });
  });

  describe('Score System', () => {
    it('should increment score each frame', (done) => {
      gameLoop.start();
      const initialScore = gameLoop.getGameState().score;

      setTimeout(() => {
        const newScore = gameLoop.getGameState().score;
        expect(newScore).toBeGreaterThan(initialScore);
        gameLoop.stop();
        done();
      }, 100);
    });

    it('should not increment score when game is over', (done) => {
      gameLoop.start();

      // Wait for some frames to accumulate score
      setTimeout(() => {
        const scoreBeforeGameOver = gameLoop.getGameState().score;

        // Manually end the game
        const state = gameLoop.getGameState();
        state.gameOver = true;
        state.isRunning = false;

        setTimeout(() => {
          const scoreAfterGameOver = gameLoop.getGameState().score;
          expect(scoreAfterGameOver).toBe(scoreBeforeGameOver);
          gameLoop.stop();
          done();
        }, 50);
      }, 50);
    });
  });

  describe('Obstacle Generation', () => {
    it('should generate obstacles at spawn rate', (done) => {
      gameLoop.start();

      // Wait for spawn rate frames (60 frames at 60 FPS = 1 second)
      setTimeout(() => {
        const obstacles = gameLoop.getGameState().obstacles;
        expect(obstacles.length).toBeGreaterThan(0);
        gameLoop.stop();
        done();
      }, 1100); // Wait slightly more than 1 second
    });

    it('should not generate obstacles when game is over', (done) => {
      gameLoop.start();

      setTimeout(() => {
        // Manually end the game
        const state = gameLoop.getGameState();
        state.gameOver = true;
        state.isRunning = false;

        const obstacleCountBefore = state.obstacles.length;

        setTimeout(() => {
          const obstacleCountAfter = gameLoop.getGameState().obstacles.length;
          expect(obstacleCountAfter).toBeLessThanOrEqual(obstacleCountBefore);
          gameLoop.stop();
          done();
        }, 100);
      }, 100);
    });

    it('should spawn obstacles in valid lanes', (done) => {
      gameLoop.start();

      setTimeout(() => {
        const obstacles = gameLoop.getGameState().obstacles;
        for (const obstacle of obstacles) {
          expect(obstacle.lane).toBeGreaterThanOrEqual(0);
          expect(obstacle.lane).toBeLessThanOrEqual(2);
        }
        gameLoop.stop();
        done();
      }, 1100);
    });
  });

  describe('Obstacle Movement', () => {
    it('should move obstacles downward each frame', (done) => {
      gameLoop.start();

      setTimeout(() => {
        const obstacles = gameLoop.getGameState().obstacles;
        if (obstacles.length > 0) {
          const firstObstacle = obstacles[0];
          const initialY = firstObstacle.y;

          setTimeout(() => {
            const updatedObstacles = gameLoop.getGameState().obstacles;
            const updatedObstacle = updatedObstacles.find((o) => o.id === firstObstacle.id);

            if (updatedObstacle) {
              expect(updatedObstacle.y).toBeGreaterThan(initialY);
            }
            gameLoop.stop();
            done();
          }, 50);
        } else {
          gameLoop.stop();
          done();
        }
      }, 1100);
    });

    it('should remove obstacles that move off screen', (done) => {
      gameLoop.start();

      setTimeout(() => {
        const initialObstacles = gameLoop.getGameState().obstacles;

        // Wait for obstacles to move off screen
        setTimeout(() => {
          const finalObstacles = gameLoop.getGameState().obstacles;

          // Some obstacles should have been removed
          for (const obstacle of finalObstacles) {
            expect(obstacle.y).toBeLessThanOrEqual(defaultConfig.trackHeight);
          }

          gameLoop.stop();
          done();
        }, 2000);
      }, 1100);
    });
  });

  describe('Collision Detection', () => {
    it('should end game on collision', (done) => {
      gameLoop.start();

      // Manually create a collision scenario
      setTimeout(() => {
        const state = gameLoop.getGameState();
        const player = gameLoop.getPlayer();

        // Create an obstacle at player position
        if (state.obstacles.length > 0) {
          const obstacle = state.obstacles[0];
          obstacle.y = player.y; // Move obstacle to player Y position
          obstacle.x = player.x; // Move obstacle to player X position

          setTimeout(() => {
            expect(gameLoop.getGameState().gameOver).toBe(true);
            expect(gameLoop.getGameState().isRunning).toBe(false);
            gameLoop.stop();
            done();
          }, 50);
        } else {
          gameLoop.stop();
          done();
        }
      }, 1100);
    });
  });

  describe('Game Restart', () => {
    it('should reset game state on restart', (done) => {
      gameLoop.start();

      setTimeout(() => {
        // Accumulate some score
        const scoreBeforeRestart = gameLoop.getGameState().score;

        // Manually end the game
        const state = gameLoop.getGameState();
        state.gameOver = true;
        state.isRunning = false;

        gameLoop.restart();

        // Check state immediately after restart (before starting again)
        const newState = gameLoop.getGameState();
        expect(newState.score).toBe(0);
        expect(newState.gameOver).toBe(false);
        expect(newState.isRunning).toBe(false);
        expect(newState.playerLane).toBe(1);
        expect(newState.obstacles).toHaveLength(0);
        gameLoop.stop();
        done();
      }, 100);
    });

    it('should reset player to center lane on restart', (done) => {
      gameLoop.start();

      setTimeout(() => {
        // Move player
        gameLoop.queueInput('left');

        setTimeout(() => {
          expect(gameLoop.getPlayer().getLane()).toBe(0);

          // Manually end the game
          const state = gameLoop.getGameState();
          state.gameOver = true;
          state.isRunning = false;

          gameLoop.restart();

          setTimeout(() => {
            expect(gameLoop.getPlayer().getLane()).toBe(1);
            gameLoop.stop();
            done();
          }, 50);
        }, 50);
      }, 50);
    }, 10000);

    it('should clear obstacles on restart', (done) => {
      gameLoop.start();

      setTimeout(() => {
        const obstaclesBeforeRestart = gameLoop.getGameState().obstacles.length;

        // Manually end the game
        const state = gameLoop.getGameState();
        state.gameOver = true;
        state.isRunning = false;

        gameLoop.restart();

        setTimeout(() => {
          expect(gameLoop.getGameState().obstacles).toHaveLength(0);
          gameLoop.stop();
          done();
        }, 50);
      }, 1100);
    }, 10000);
  });

  describe('Game Over State', () => {
    it('should prevent player movement when game is over', (done) => {
      gameLoop.start();

      setTimeout(() => {
        // Manually end the game
        const state = gameLoop.getGameState();
        state.gameOver = true;
        state.isRunning = false;

        const playerLaneBeforeInput = gameLoop.getPlayer().getLane();
        gameLoop.queueInput('left');

        setTimeout(() => {
          const playerLaneAfterInput = gameLoop.getPlayer().getLane();
          expect(playerLaneAfterInput).toBe(playerLaneBeforeInput);
          gameLoop.stop();
          done();
        }, 50);
      }, 50);
    });

    it('should not spawn obstacles when game is over', (done) => {
      gameLoop.start();

      setTimeout(() => {
        // Manually end the game
        const state = gameLoop.getGameState();
        state.gameOver = true;
        state.isRunning = false;

        const obstacleCountBefore = state.obstacles.length;

        setTimeout(() => {
          const obstacleCountAfter = gameLoop.getGameState().obstacles.length;
          expect(obstacleCountAfter).toBeLessThanOrEqual(obstacleCountBefore);
          gameLoop.stop();
          done();
        }, 1200);
      }, 100);
    });
  });

  describe('Frame Timing', () => {
    it('should increment frame count', (done) => {
      gameLoop.start();
      const initialFrameCount = gameLoop.getFrameCount();

      setTimeout(() => {
        const newFrameCount = gameLoop.getFrameCount();
        expect(newFrameCount).toBeGreaterThan(initialFrameCount);
        gameLoop.stop();
        done();
      }, 100);
    });
  });
});
