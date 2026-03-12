import { useEffect, useRef } from 'react';

/**
 * Returns a stable ref whose `.current` is a plain object mapping
 * lowercase key strings → boolean.  The game loop reads this directly
 * without triggering React re-renders.
 */
export function useKeyboard() {
  const keys = useRef({});

  useEffect(() => {
    const down = e => { keys.current[e.key.toLowerCase()] = true;  e.preventDefault(); };
    const up   = e => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup',   up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup',   up);
    };
  }, []);

  return keys; // stable — never recreated
}
