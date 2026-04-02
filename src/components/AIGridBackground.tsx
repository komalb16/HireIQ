import { VibeBackground } from './VibeBackground';

export function AIGridBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--bg)]">
      <VibeBackground />
      {/* Vibe Layer: Subtle Core Glow for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg)_100%)] opacity-80" />
    </div>
  );
}
