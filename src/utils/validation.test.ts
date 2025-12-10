/**
 * Tests for validation utilities
 */

import {
  isValidLane,
  clampLane,
  validateLane,
  isWithinTrackBounds,
} from './validation';

describe('Validation Utilities', () => {
  describe('isValidLane', () => {
    it('should return true for valid lanes', () => {
      expect(isValidLane(0)).toBe(true);
      expect(isValidLane(1)).toBe(true);
      expect(isValidLane(2)).toBe(true);
    });

    it('should return false for invalid lanes', () => {
      expect(isValidLane(-1)).toBe(false);
      expect(isValidLane(3)).toBe(false);
      expect(isValidLane(10)).toBe(false);
    });
  });

  describe('clampLane', () => {
    it('should return the lane if valid', () => {
      expect(clampLane(0)).toBe(0);
      expect(clampLane(1)).toBe(1);
      expect(clampLane(2)).toBe(2);
    });

    it('should clamp to min lane if below', () => {
      expect(clampLane(-1)).toBe(0);
      expect(clampLane(-10)).toBe(0);
    });

    it('should clamp to max lane if above', () => {
      expect(clampLane(3)).toBe(2);
      expect(clampLane(10)).toBe(2);
    });
  });

  describe('validateLane', () => {
    it('should validate and clamp lanes', () => {
      expect(validateLane(0)).toBe(0);
      expect(validateLane(1)).toBe(1);
      expect(validateLane(2)).toBe(2);
      expect(validateLane(-1)).toBe(0);
      expect(validateLane(3)).toBe(2);
    });
  });

  describe('isWithinTrackBounds', () => {
    it('should return true for positions within bounds', () => {
      expect(isWithinTrackBounds(0, 0, 40, 60, 400, 800)).toBe(true);
      expect(isWithinTrackBounds(180, 400, 40, 60, 400, 800)).toBe(true);
    });

    it('should return false for positions outside bounds', () => {
      expect(isWithinTrackBounds(-10, 0, 40, 60, 400, 800)).toBe(false);
      expect(isWithinTrackBounds(0, -10, 40, 60, 400, 800)).toBe(false);
      expect(isWithinTrackBounds(370, 0, 40, 60, 400, 800)).toBe(false);
      expect(isWithinTrackBounds(0, 750, 40, 60, 400, 800)).toBe(false);
    });
  });
});
