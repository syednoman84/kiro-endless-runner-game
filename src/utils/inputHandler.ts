/**
 * Input handler for touch-based player movement
 * Translates touch events to left/right movement commands
 */

/**
 * Callback type for input events
 */
export type InputCallback = (direction: 'left' | 'right') => void;

/**
 * Input handler that processes touch input and maps it to movement commands
 */
export class InputHandler {
  private screenWidth: number;
  private callback: InputCallback;
  private isGameRunning: boolean = false;
  private lastTouchTime: number = 0;
  private touchDebounceMs: number;

  /**
   * Creates a new input handler
   * @param screenWidth - The width of the screen in pixels
   * @param callback - Callback function to execute when input is detected
   * @param debounceMs - Optional debounce time in milliseconds (default: 100)
   */
  constructor(screenWidth: number, callback: InputCallback, debounceMs: number = 100) {
    this.screenWidth = screenWidth;
    this.callback = callback;
    this.touchDebounceMs = debounceMs;
  }

  /**
   * Handles a touch event and determines if it's a left or right tap
   * Left side of screen (0 to screenWidth/2) = move left
   * Right side of screen (screenWidth/2 to screenWidth) = move right
   * @param touchX - The X coordinate of the touch event
   */
  handleTouchInput(touchX: number): void {
    // Only process input if game is running
    if (!this.isGameRunning) {
      return;
    }

    // Debounce rapid touches
    const now = Date.now();
    if (now - this.lastTouchTime < this.touchDebounceMs) {
      return;
    }
    this.lastTouchTime = now;

    const midpoint = this.screenWidth / 2;

    if (touchX < midpoint) {
      this.callback('left');
    } else {
      this.callback('right');
    }
  }

  /**
   * Sets whether the game is currently running
   * Input is only processed when the game is running
   * @param isRunning - Whether the game is running
   */
  setGameRunning(isRunning: boolean): void {
    this.isGameRunning = isRunning;
  }

  /**
   * Gets whether the input handler is currently accepting input
   */
  isAcceptingInput(): boolean {
    return this.isGameRunning;
  }

  /**
   * Updates the screen width (useful if screen orientation changes)
   * @param newScreenWidth - The new screen width in pixels
   */
  updateScreenWidth(newScreenWidth: number): void {
    this.screenWidth = newScreenWidth;
  }
}
