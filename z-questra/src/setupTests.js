import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeAll(() => {
  const gradientStub = { addColorStop: () => {} };
  HTMLCanvasElement.prototype.getContext = function getContext2d() {
    return {
      clearRect: () => {},
      fillRect: () => {},
      fillStyle: '',
      strokeStyle: '',
      globalAlpha: 1,
      lineWidth: 1,
      save: () => {},
      restore: () => {},
      translate: () => {},
      rotate: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      fill: () => {},
      stroke: () => {},
      arc: () => {},
      createRadialGradient: () => gradientStub,
      createLinearGradient: () => gradientStub,
    };
  };
});

afterEach(() => {
  cleanup();
});
