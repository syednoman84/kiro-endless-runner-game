# Design Document

## Overview

The Endless Runner Game is an iOS game built using React Native or a similar cross-platform framework. The game features a player character running down a straight track with three lanes. Obstacles continuously spawn at the top of the track and move downward. The player controls their character by tapping the left or right side of the screen to change lanes. The game tracks the player's score based on distance traveled and ends when a collision occurs. The architecture separates game logic, rendering, and input handling into distinct components.

## Architecture

The game follows a component-based architecture with clear separation of concerns:

- **Game Engine**: Core game loop that updates game state each frame
- **Input Handler**: Processes touch input and translates it to player movement commands
- **Collision Detector**: Checks for collisions between player and obstacles
- **Obstacle Manager**: Handles obstacle generation, movement, and cleanup
- **Renderer**: Displays the track, player, obstacles, and UI elements
- **State Manager**: Maintains and updates the current game state

The game loop runs at a fixed frame rate (e.g., 60 FPS) and follows this sequence:
1. Process input
2. Update game state (player position, obstacle positions, score)
3. Detect collisions
4. Render the current frame

## Components and Interfaces

### Game State
```
GameState {
  isRunning: boolean
  isPaused: boolean
  playerLane: number (0-2, representing left, center, right)
  score: number
  obstacles: Obstacle[]
  gameOver: boolean
}
```

### Player
```
Player {
  lane: number (0-2)
  x: number (calculated from lane)
  y: number (fixed at bottom of screen)
  width: number
  height: number
  
  moveLane(direction: 'left' | 'right'): void
}
```

### Obstacle
```
Obstacle {
  id: string (unique identifier)
  lane: number (0-2)
  x: number (calculated from lane)
  y: number (moves from top to bottom)
  width: number
  height: number
  speed: number (pixels per frame)
}
```

### Track
```
Track {
  width: number
  height: number
  laneCount: number (3)
  laneWidth: number (calculated as width / laneCount)
}
```

## Data Models

### Game Configuration
- **Lane Count**: 3 lanes (left, center, right)
- **Track Width**: Full screen width
- **Track Height**: Full screen height
- **Player Size**: Fixed dimensions (e.g., 40x60 pixels)
- **Obstacle Size**: Fixed dimensions (e.g., 40x60 pixels)
- **Obstacle Speed**: Constant speed moving down the track (e.g., 5 pixels per frame)
- **Spawn Rate**: New obstacle spawns every N frames (e.g., every 60 frames at 60 FPS = 1 per second)
- **Score Increment**: Points awarded per frame or per obstacle passed (e.g., 1 point per frame)

### Collision Detection
- Uses axis-aligned bounding box (AABB) collision detection
- Player bounding box: (playerX, playerY, playerWidth, playerHeight)
- Obstacle bounding box: (obstacleX, obstacleY, obstacleWidth, obstacleHeight)
- Collision occurs when boxes overlap



## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Player Lane Boundaries
*For any* game state, the player's lane must always be within valid bounds (0-2 inclusive). Moving left from lane 0 or right from lane 2 should not change the player's lane.
**Validates: Requirements 2.1, 2.2, 2.3**

### Property 2: Player Movement Consistency
*For any* sequence of left/right movement commands, the player's lane should reflect the cumulative effect of those commands, bounded by the track boundaries.
**Validates: Requirements 2.1, 2.2, 2.3**

### Property 3: Obstacle Lane Validity
*For any* generated obstacle, its lane must be within valid bounds (0-2 inclusive).
**Validates: Requirements 3.2**

### Property 4: Obstacle Downward Movement
*For any* obstacle in the game, its Y position should increase by exactly the obstacle speed each frame until it leaves the track.
**Validates: Requirements 3.3**

### Property 5: Collision Detection Accuracy
*For any* player position and obstacle position, a collision should be detected if and only if their bounding boxes overlap.
**Validates: Requirements 4.1**

### Property 6: Game Over Prevents Movement
*For any* game state where the game is over, attempting to move the player should not change the player's lane.
**Validates: Requirements 4.3**

### Property 7: Game Over Prevents Spawning
*For any* game state where the game is over, no new obstacles should be generated.
**Validates: Requirements 4.3**

### Property 8: Score Increases During Gameplay
*For any* running game state, the score should increase each frame by the expected increment amount.
**Validates: Requirements 5.1**

### Property 9: Score Resets on Restart
*For any* game that has ended and been restarted, the score should be reset to zero.
**Validates: Requirements 5.4**

### Property 10: Game State Reset on Restart
*For any* game that has ended and been restarted, the player should be positioned in the center lane and all obstacles should be cleared from the track.
**Validates: Requirements 6.2, 6.3**

### Property 11: Obstacle Cleanup
*For any* obstacle that has moved beyond the bottom of the track, it should be removed from the active obstacles list.
**Validates: Requirements 3.3**

## Error Handling

- **Invalid Lane Access**: Attempting to move to a lane outside 0-2 should be silently prevented (no error thrown, just no movement)
- **Collision During Game Over**: If a collision occurs while the game is already over, it should be ignored
- **Obstacle Generation During Game Over**: If the spawn timer triggers while the game is over, no obstacle should be created
- **Rendering Errors**: If rendering fails, the game should log the error but continue running the game loop

## Testing Strategy

### Unit Testing Approach
- Test player movement logic with specific lane transitions
- Test collision detection with known overlapping and non-overlapping positions
- Test score increment calculations
- Test game state transitions (running → game over → restart)
- Test obstacle generation and cleanup

### Property-Based Testing Approach
We will use **fast-check** (a JavaScript property-based testing library) for comprehensive property validation. Each property will be tested with a minimum of 100 iterations to ensure robustness across varied inputs.

**Property-Based Test Requirements:**
- Each correctness property will have a dedicated property-based test
- Tests will be tagged with the format: `**Feature: endless-runner-game, Property {number}: {property_text}**`
- Generators will create valid game states, player positions, obstacle configurations, and movement sequences
- Tests will verify properties hold across all generated inputs
- Minimum 100 iterations per property test

**Unit Test Requirements:**
- Test specific examples like initial game state, single movement, single collision
- Test edge cases like boundary movements, game over state transitions
- Test integration between components (e.g., movement → rendering, collision → game over)

