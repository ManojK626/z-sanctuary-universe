'use client';

import { useEffect } from 'react';
import runtime from '../../../../../core/z_adaptive_runtime.cjs';

const api = runtime.read ? runtime : runtime.default;

function applyReading() {
  const reading = api.read(window);
  const root = document.documentElement;
  root.classList.add('z-anydevice-adaptive');
  root.setAttribute('z-layout', reading.layout);
  root.setAttribute('z-orientation', reading.orientation);
  root.setAttribute('z-pointer', reading.pointer);
  root.setAttribute('z-hover', reading.hover);
  root.setAttribute('z-motion', reading.motion);
  root.setAttribute('z-offline', reading.offline);
  root.dataset.zMeasurement = reading.source || '';
  if (reading.viewportScale == null) delete root.dataset.zViewportScale;
  else root.dataset.zViewportScale = String(reading.viewportScale);
}

export default function ZAdaptiveHost() {
  useEffect(() => {
    applyReading();
    return api.subscribe(window, applyReading);
  }, []);
  return null;
}
