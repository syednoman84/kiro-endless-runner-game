# Endless Runner Game

A fast-paced endless runner game built with React Native and Expo. Navigate your character through three lanes, dodge obstacles, and rack up points. Built with TypeScript and thoroughly tested with property-based testing.

## Features

- **Smooth 60 FPS Gameplay** - Optimized game loop for fluid motion
- **Touch-Based Controls** - Tap left or right side of screen to move between lanes
- **Collision Detection** - AABB-based collision system for accurate obstacle detection
- **Score System** - Points accumulate as you survive longer
- **Game Over & Restart** - Instant restart to try again
- **Cross-Platform** - Runs on iOS and Android via Expo

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and build service
- **TypeScript** - Type-safe development
- **Jest** - Unit testing framework
- **fast-check** - Property-based testing library

## Project Structure

```
src/
├── game/                 # Core game logic
│   ├── gameLoop.ts      # Main game loop (60 FPS)
│   ├── gameState.ts     # Game state management
│   ├── player.ts        # Player movement logic
│   ├── obstacle.ts      # Obstacle generation and movement
│   └── collision.ts     # Collision detection
├── components/          # React Native UI components
│   ├── GameCanvas.tsx   # Main game rendering
│   ├── Player.tsx       # Player visual component
│   ├── Obstacle.tsx     # Obstacle visual component
│   ├── Track.tsx        # Game track/background
│   ├── ScoreDisplay.tsx # Score UI
│   └── GameOverScreen.tsx # Game over UI
├── utils/               # Utility functions
│   ├── inputHandler.ts  # Touch input processing
│   └── validation.ts    # Input validation
├── types/               # TypeScript type definitions
└── App.tsx              # Main app component
```

## Getting Started

### Prerequisites

- **Node.js** 20.19+ or 22.12+ (required for Vite/Expo)
- **npm** or **yarn**
- **Xcode** (for iOS development on macOS)
- **Expo Go** app (for testing on physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd endless-runner-game
   ```

2. **Install dependencies**
   ```bash
   npm install or npm install --legacy-peer-deps
   ```

3. **Verify Node.js version**
   ```bash
   node --version
   # Should be 20.19.0 or higher
   ```

## Running the Game

### Option 1: On Physical iPhone (Recommended)

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Scan the QR code**
   - Open the Camera app on your iPhone
   - Point at the QR code displayed in the terminal
   - Tap the notification that appears

3. **Play the game**
   - Tap the **left side** of the screen to move left
   - Tap the **right side** of the screen to move right
   - Dodge obstacles and survive as long as possible
   - Tap "Restart" when game over to play again

### Option 2: On iOS Simulator

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Press `i` in the terminal** to open iOS Simulator

3. Or directly run below command which will build the project and open ios Simulator:
   ```bash
   npx expo run:ios
   ```

5. **Play the game** (note: touch input works better on physical device)

### Option 3: On Android Simulator

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Press `a` in the terminal** to open Android Emulator

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run tests in watch mode
```bash
npm test -- --watch
```

## Game Controls

| Action | Control |
|--------|---------|
| Move Left | Tap left half of screen |
| Move Right | Tap right half of screen |
| Restart | Tap "Restart" button on game over screen |

## Gameplay

- **Objective**: Survive as long as possible while dodging obstacles
- **Scoring**: Earn 1 point per frame (60 points per second)
- **Difficulty**: Obstacles spawn continuously at regular intervals
- **Game Over**: Collision with any obstacle ends the game
- **Lanes**: Navigate between 3 lanes to avoid obstacles

## Architecture

### Game Loop
The game runs at 60 FPS with a frame-by-frame update cycle:
1. **Input Processing** - Read touch input from player
2. **State Update** - Update player position and obstacle positions
3. **Collision Detection** - Check for collisions with obstacles
4. **Rendering** - Draw current game state to screen

### State Management
- **GameState** - Tracks game running status, score, and obstacles
- **Player** - Manages player position and lane
- **Obstacles** - Manages all active obstacles on screen

### Input Handling
- Uses React Native's **PanResponder** for reliable touch input
- Debounced to prevent rapid repeated inputs
- Coordinates mapped to left/right movement based on screen position

## Testing

The project includes comprehensive tests:
- **103 total tests** covering all game logic
- **Unit tests** for individual components
- **Property-based tests** using fast-check for correctness validation
- **100% coverage** on core game logic modules

### Test Categories

1. **Game State Tests** - State management and transitions
2. **Player Tests** - Movement and boundary checking
3. **Obstacle Tests** - Generation, movement, and cleanup
4. **Collision Tests** - Collision detection accuracy
5. **Game Loop Tests** - Frame updates and game flow
6. **Input Handler Tests** - Touch input processing
7. **Validation Tests** - Input validation

## Performance

- **Target FPS**: 60 frames per second
- **Frame Time**: ~16.67ms per frame
- **Memory**: Optimized obstacle cleanup to prevent memory leaks
- **Battery**: Efficient rendering and input handling

## Troubleshooting

### Touch input not working
- Ensure you're using a physical iPhone (simulator has limitations)
- Try reloading the app by pressing `r` in the terminal
- Check that you're tapping the screen, not just hovering

### Game running slowly
- Close other apps on your device
- Restart the development server
- Check your network connection (Expo uses local network)

### Build errors
- Clear cache: `npx expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo: `npm install -g expo-cli@latest`

## Future Enhancements

- Difficulty progression (faster obstacles over time)
- Sound effects and music
- Different obstacle types
- Power-ups and special items
- Leaderboard/high scores
- Multiple game modes
- Visual effects and animations
