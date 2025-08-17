const ctx = new (window.AudioContext || window.webkitAudioContext)();

export const playWinSound = () => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "sine"; // Pleasant tone
  oscillator.frequency.setValueAtTime(600, ctx.currentTime); // Starting frequency
  oscillator.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3); // Ascending pitch
  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5); // Fade out

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.5);
};

export const playFailSound = () => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "square"; // Harsher tone
  oscillator.frequency.setValueAtTime(300, ctx.currentTime); // Low frequency
  oscillator.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.4); // Descending pitch
  gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); // Fade out

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.4);
};

export const playClickSound = () => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "triangle"; // Soft click
  oscillator.frequency.setValueAtTime(1000, ctx.currentTime); // High pitch
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1); // Quick fade

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
};

export const playRoundTransitionSound = () => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "sine"; // Smooth chime
  oscillator.frequency.setValueAtTime(500, ctx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.2); // Slight rise
  gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3); // Fade out

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.3);
};