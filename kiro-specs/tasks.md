# Implementation Plan

- [x] 1. Set up project structure and core game types
  - Initialize React Native project with TypeScript support
  - Create directory structure: `src/game`, `src/components`, `src/types`, `src/utils`, `src/tests`
  - Define TypeScript interfaces for GameState, Player, Obstacle, and Track
  - Set up testing framework (Jest with fast-check for property-based testing)
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 2. Implement core game state management
  - Create GameState interface and initial state factory
  - Implement state update functions (updatePlayerLane, addObstacle, removeObstacle, updateScore, setGameOver, resetGame)
  - Create utility functions for lane validation and boundary checking
  - _Requirements: 1.1, 2.1, 2.3, 5.1, 6.2_

- [ ]* 2.1 Write property test for player lane boundaries
  - **Feature: endless-runner-game, Property 1: Player Lane Boundaries**
  - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 3. Implement player movement logic
  - Create Player class with moveLane method
  - Implement left/right movement with boundary checking
  - Ensure movement only works when game is running
  - _Requirements: 2.1, 2.2, 2.3_

- [ ]* 3.1 Write property test for player movement consistency
  - **Feature: endless-runner-game, Property 2: Player Movement Consistency**
  - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 4. Implement collision detection
  - Create collision detection function using AABB (axis-aligned bounding box)
  - Test collision between player and obstacles
  - Integrate collision detection into game loop
  - _Requirements: 4.1_

- [ ]* 4.1 Write property test for collision detection accuracy
  - **Feature: endless-runner-game, Property 5: Collision Detection Accuracy**
  - **Validates: Requirements 4.1**

- [x] 5. Implement obstacle generation and movement
  - Create Obstacle class with movement logic
  - Implement obstacle spawning at regular intervals
  - Ensure obstacles spawn in random valid lanes
  - Implement obstacle downward movement each frame
  - _Requirements: 3.1, 3.2, 3.3_

- [ ]* 5.1 Write property test for obstacle lane validity
  - **Feature: endless-runner-game, Property 3: Obstacle Lane Validity**
  - **Validates: Requirements 3.2**

- [ ]* 5.2 Write property test for obstacle downward movement
  - **Feature: endless-runner-game, Property 4: Obstacle Downward Movement**
  - **Validates: Requirements 3.3**

- [ ]* 5.3 Write property test for obstacle cleanup
  - **Feature: endless-runner-game, Property 11: Obstacle Cleanup**
  - **Validates: Requirements 3.3**

- [x] 6. Implement score system
  - Create score increment logic (points per frame)
  - Implement score reset on game restart
  - Track score in game state
  - _Requirements: 5.1, 5.2, 5.4_

- [ ]* 6.1 Write property test for score increases during gameplay
  - **Feature: endless-runner-game, Property 8: Score Increases During Gameplay**
  - **Validates: Requirements 5.1**

- [ ]* 6.2 Write property test for score resets on restart
  - **Feature: endless-runner-game, Property 9: Score Resets on Restart**
  - **Validates: Requirements 5.4**

- [x] 7. Implement game loop and state management
  - Create main game loop that runs at 60 FPS
  - Implement frame-by-frame updates: input → state update → collision detection → render
  - Implement game over detection and state transition
  - Implement game restart logic
  - _Requirements: 1.2, 4.2, 4.3, 6.2_

- [ ]* 7.1 Write property test for game over prevents movement
  - **Feature: endless-runner-game, Property 6: Game Over Prevents Movement**
  - **Validates: Requirements 4.3**

- [ ]* 7.2 Write property test for game over prevents spawning
  - **Feature: endless-runner-game, Property 7: Game Over Prevents Spawning**
  - **Validates: Requirements 4.3**

- [ ]* 7.3 Write property test for game state reset on restart
  - **Feature: endless-runner-game, Property 10: Game State Reset on Restart**
  - **Validates: Requirements 6.2, 6.3**

- [x] 8. Implement input handling
  - Create touch input handler for left/right screen taps
  - Map touch input to player movement commands
  - Ensure input only affects game when running
  - _Requirements: 2.1, 2.2_

- [x] 9. Implement rendering system
  - Create React components for Track, Player, Obstacle, and Score display
  - Implement game canvas/view that renders each frame
  - Display player character in correct lane
  - Display all obstacles with correct positions
  - Display current score
  - _Requirements: 1.1, 1.2, 1.3, 5.3_

- [x] 10. Implement game over UI and restart functionality
  - Create game over screen component
  - Display final score on game over screen
  - Implement restart button
  - Wire restart button to reset game state
  - _Requirements: 4.2, 5.3, 6.1, 6.2_

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Integrate all components into main game screen
  - Connect game loop to React component lifecycle
  - Wire input handler to touch events
  - Wire game state updates to component re-renders
  - Ensure smooth 60 FPS gameplay
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3_

- [x] 13. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

