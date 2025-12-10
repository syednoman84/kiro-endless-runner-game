/**
 * Utility functions for lane validation and boundary checking
 */

const VALID_LANES = [0, 1, 2];
const MIN_LANE = 0;
const MAX_LANE = 2;

/**
 * Checks if a lane is valid (0-2)
 */
export function isValidLane(lane: number): boolean {
  return VALID_LANES.includes(lane);
}

/**
 * Clamps a lane value to valid bounds
 */
export function clampLane(lane: number): number {
  return Math.max(MIN_LANE, Math.min(MAX_LANE, lane));
}

/**
 * Validates that a lane is within bounds, returns the lane if valid or clamped value
 */
export function validateLane(lane: number): number {
  return clampLane(lane);
}

/**
 * Checks if a position is within track bounds
 */
export function isWithinTrackBounds(x: number, y: number, width: number, height: number, trackWidth: number, trackHeight: number): boolean {
  return x >= 0 && x + width <= trackWidth && y >= 0 && y + height <= trackHeight;
}
