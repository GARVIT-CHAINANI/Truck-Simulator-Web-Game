# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Ambient Music System

A minimal built-in music player has been added to the game:

1. **Three built‑in slots** – located in `public/music/ambient1.mp3`,
   `ambient2.mp3` and `ambient3.mp3`.  Replace these placeholder files with
   real royalty‑free audio (they are currently empty text files).
2. **Switch button** – click **Next** in the UI to cycle through tracks.
3. **Local upload** – click **Upload** and select a `.mp3` file from your
   machine; the uploaded track is added to the rotation and loops smoothly.
4. **Play/Pause toggle** – controls audio playback.  Browsers may block
   autoplay until the user interacts (clicking any button will start audio).

The UI is intentionally small and sits in the top-right of the game viewport.
Playback runs via an HTMLAudioElement so it never blocks the game loop.
