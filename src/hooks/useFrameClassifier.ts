import { useCallback, useState } from 'react';
import { useFrameProcessor } from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { Worklets } from 'react-native-worklets-core';
import { classifier, MODEL_INPUT_SIZE, Prediction } from '../services/classifier';

/**
 * Live classification at a throttled rate directly on camera frames.
 * Uses vision-camera-resize-plugin (GPU) to crop+resize on the native side,
 * then hands the buffer to the TFLite model on a worklet thread.
 */
export function useFrameClassifier(enabled: boolean, intervalMs = 1200) {
  const { resize } = useResizePlugin();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [running, setRunning] = useState(false);

  const onResult = Worklets.createRunOnJS((p: Prediction) => {
    setPrediction(p);
    setRunning(false);
  });

  const runClassify = useCallback(
    async (buffer: Uint8Array) => {
      try {
        const p = await classifier.classify(buffer);
        onResult(p);
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
      // throttle: only sample one frame roughly every intervalMs
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

      runClassifyJS(new Uint8Array(resized.buffer));
    },
    [enabled, resize, runClassifyJS, intervalMs],
  );

  return { frameProcessor, prediction, running, setRunning };
}
