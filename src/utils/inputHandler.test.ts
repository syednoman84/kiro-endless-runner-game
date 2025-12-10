/**
 * Tests for the InputHandler class
 */

import { InputHandler } from './inputHandler';

describe('InputHandler', () => {
  let inputHandler: InputHandler;
  let mockCallback: jest.Mock;
  const screenWidth = 400;

  beforeEach(() => {
    mockCallback = jest.fn();
    // Use 0 debounce for testing so touches are processed immediately
    inputHandler = new InputHandler(screenWidth, mockCallback, 0);
  });

  describe('Touch Input Processing', () => {
    it('should call callback with "left" when tapping left side of screen', () => {
      inputHandler.setGameRunning(true);
      inputHandler.handleTouchInput(100); // Left side (< 200)

      expect(mockCallback).toHaveBeenCalledWith('left');
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should call callback with "right" when tapping right side of screen', () => {
      inputHandler.setGameRunning(true);
      inputHandler.handleTouchInput(300); // Right side (> 200)

      expect(mockCallback).toHaveBeenCalledWith('right');
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should call callback with "right" when tapping at midpoint', () => {
      inputHandler.setGameRunning(true);
      inputHandler.handleTouchInput(200); // Exactly at midpoint

      expect(mockCallback).toHaveBeenCalledWith('right');
    });

    it('should not process input when game is not running', () => {
      inputHandler.setGameRunning(false);
      inputHandler.handleTouchInput(100);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should not process input when game is stopped after being started', () => {
      inputHandler.setGameRunning(true);
      inputHandler.handleTouchInput(100);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      mockCallback.mockClear();
      inputHandler.setGameRunning(false);
      inputHandler.handleTouchInput(100);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('Game Running State', () => {
    it('should track game running state correctly', () => {
      expect(inputHandler.isAcceptingInput()).toBe(false);

      inputHandler.setGameRunning(true);
      expect(inputHandler.isAcceptingInput()).toBe(true);

      inputHandler.setGameRunning(false);
      expect(inputHandler.isAcceptingInput()).toBe(false);
    });
  });

  describe('Screen Width Updates', () => {
    it('should update screen width and adjust midpoint accordingly', () => {
      inputHandler.setGameRunning(true);
      inputHandler.updateScreenWidth(800);

      // With new width of 800, midpoint is 400
      inputHandler.handleTouchInput(300); // Should be left (< 400)
      expect(mockCallback).toHaveBeenCalledWith('left');

      mockCallback.mockClear();
      inputHandler.handleTouchInput(500); // Should be right (> 400)
      expect(mockCallback).toHaveBeenCalledWith('right');
    });
  });

  describe('Edge Cases', () => {
    it('should handle touch at x=0 (far left)', () => {
      inputHandler.setGameRunning(true);
      inputHandler.handleTouchInput(0);

      expect(mockCallback).toHaveBeenCalledWith('left');
    });

    it('should handle touch at x=screenWidth (far right)', () => {
      inputHandler.setGameRunning(true);
      inputHandler.handleTouchInput(screenWidth);

      expect(mockCallback).toHaveBeenCalledWith('right');
    });

    it('should handle multiple consecutive touches', () => {
      inputHandler.setGameRunning(true);

      inputHandler.handleTouchInput(100); // left
      inputHandler.handleTouchInput(300); // right
      inputHandler.handleTouchInput(50); // left

      expect(mockCallback).toHaveBeenCalledTimes(3);
      expect(mockCallback).toHaveBeenNthCalledWith(1, 'left');
      expect(mockCallback).toHaveBeenNthCalledWith(2, 'right');
      expect(mockCallback).toHaveBeenNthCalledWith(3, 'left');
    });
  });
});
