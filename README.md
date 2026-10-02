# Calculas Typing

A premium typing practice platform focused on speed, accuracy, and progress. Combines a cinematic 3D design system with a fully-functional typing engine.

## Features

- **Three typing modes**: Standard, Numbers, Punctuation
- **30-second typing test** with live WPM, accuracy, and errors tracking
- **Character/text highlighting** and visible cursor position
- **Restart** and **Try Again** functionality
- **History/progress** using localStorage
- **Typewriter sound effects** with volume control and sound toggle
- **Random passage generation** with auto-extension
- **Responsive design** for desktop and mobile
- **Reduced-motion support**
- **Dark modern UI** (charcoal/graphite aesthetic)

## Project Structure

```
calculas-typing/
├── index.html          # Main production page with hero section + typing test
├── app.js              # Main typing engine/application logic
├── sound.js            # Sound effects module (Web Audio API)
├── content.js          # Typing passages and modes
├── README.md           # This file
└── assets/
    ├── style.css       # Premium dark theme stylesheet
    └── videos/
        └── hero.mp4    # Hero section cinematic video
```

## Bug Fixes

### BUG 1 — TYPE BUTTON
**Problem**: The homepage "Start typing" link just scrolled to the typing test section but did not ensure the textarea was focused and interactive.

**Fix**: Added `onclick` handler to the CTA link that scrolls to the typing test section and then focuses the textarea after a brief delay, ensuring the typing interface is immediately usable.

### BUG 2 — INTRO 3D VIDEO TYPING SOUND
**Problem**: The Web Audio API AudioContext requires a user gesture to initialize. Without explicit initialization, typing sounds would not play due to browser autoplay restrictions.

**Fix**: Added `initSound()` function that creates/ensures the AudioContext exists on page load if sound was previously enabled via localStorage. This guarantees the sound system is ready when the user interacts with the page (e.g., clicks "Start typing").

## Usage

Open `index.html` in any modern browser. The typing test will auto-initialize on page load. Click "Start typing" or press Cmd/Ctrl+L to focus the input.

## Development

- All original CalculasEngine and CalculasContent functionality preserved
- Sound initialized on page load; user interaction (click/tap) unlocks AudioContext
- All three modes (Standard/Numbers/Punctuation) work correctly
- Timer, WPM, accuracy, and errors calculate based on actual typing time