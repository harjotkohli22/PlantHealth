import { useCallback, useState } from 'react';
import { useFrameProcessor } from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { Worklets } from 'react-native-worklets-core';
import { classifier, MODEL_INPUT_SIZE, Prediction } from '../services/classifier';

// Minimum fraction of pixels with leaf-green hue to consider a leaf in frame.
const LEAF_GREEN_RATIO = 0.18;

/**
 * Runs in the worklet thread — no JS bridge.
 * Counts RGB pixels that fall in the green/yellow-green range typical of leaves.
 */
function leafGreenRatio(buf: Uint8Array): number {
  'worklet';
  let green = 0;
  const pixels = buf.length / 3;
  for (let i = 0; i < buf.length; i += 3) {
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];
    // Green channel must dominate both red and blue, and have enough brightness
    if (g > r + 15 && g > b + 15 && g > 45 && g < 245) green++;
  }
  return green / pixels;
}

export function useFrameClassifier(enabled: boolean, intervalMs = 1200) {
  const { resize } = useResizePlugin();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [running, setRunning] = useState(false);
  const [isPlantDetected, setIsPlantDetected] = useState(false);

  const onResult = Worklets.createRunOnJS((p: Prediction, leafDetected: boolean) => {
    setPrediction(p);
    setIsPlantDetected(leafDetected);
    setRunning(false);
  });

  const runClassify = useCallback(
    async (buffer: Uint8Array, leafDetected: boolean) => {
      try {
        const p = await classifier.classify(buffer);
        onResult(p, leafDetected);
      } catch {
        setRunning(false);
      }
    },
    [onResult],
  );
  const runClassifyJS = Worklets.createRunOnJS(runClassify);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      if (!enabled) return;
      const now = Date.now();
      // @ts-ignore persistent shared value across frames
      if (now - (globalThis.__lastSample ?? 0) < intervalMs) return;
      // @ts-ignore
      globalThis.__lastSample = now;

      const resized = resize(frame, {
        scale: { width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE },
        pixelFormat: 'rgb',
        dataType: 'uint8',
        rotation: '90deg',
      });

      const buf = new Uint8Array(resized.buffer);
      const ratio = leafGreenRatio(buf);
      const leafDetected = ratio >= LEAF_GREEN_RATIO;

      runClassifyJS(buf, leafDetected);
    },
    [enabled, resize, runClassifyJS, intervalMs],
  );

  return { frameProcessor, prediction, running, setRunning, isPlantDetected };
}
