# 🌿 plant-health-lib

A comprehensive React Native library for on-device plant disease detection. Point the camera at a leaf (or upload a photo) and a quantized TFLite model classifies 38+ crop diseases — fully offline, no backend.

## Installation

```bash
npm install plant-health-lib
# or
yarn add plant-health-lib
```

## Quick Start

```typescript
import { useFrameClassifier, useHistory } from 'plant-health-lib/hooks';
import { getDiseaseInfo } from 'plant-health-lib/services';
import { classifyImage } from 'plant-health-lib/utils';
```

## Features

- ✅ **38+ Disease Classes** – Comprehensive crop disease database
- ✅ **TensorFlow Lite Integration** – Fast GPU-accelerated inference
- ✅ **Live Camera Detection** – Real-time classification from camera frames
- ✅ **Offline Operation** – No backend required, fully on-device
- ✅ **TypeScript Support** – Full type safety included
- ✅ **History Tracking** – AsyncStorage-backed scan history

## Stack

| Concern | Library |
|---|---|
| AI inference | `react-native-fast-tflite` (GPU/CoreML delegates) |
| Camera + live frames | `react-native-vision-camera` + `vision-camera-resize-plugin` |
| Frame-processor threading | `react-native-worklets-core`, `react-native-reanimated` |
| Navigation | `@react-navigation/native-stack` |
| Persistence | `@react-native-async-storage/async-storage` |
| Gallery upload | `react-native-image-picker` |

## Architecture

```
App.tsx                      warms up the model on launch
src/
  navigation/RootNavigator   Home → Scan → Result, + History
  screens/
    HomeScreen               dashboard, recent scans, entry points
    ScanScreen               live camera w/ throttled frame classification + capture/upload
    ResultScreen             diagnosis, confidence, treatment, prevention, top-K
    HistoryScreen            saved scans
  services/
    classifier.ts            loads .tflite, normalizes input, runs inference, softmax + top-K
    diseaseData.ts           38-class label map + remedy/prevention knowledge base
  hooks/
    useFrameClassifier.ts    vision-camera frame processor → resize (GPU) → TFLite on worklet
    useHistory.ts            AsyncStorage-backed scan history
  utils/imageToTensor.ts     still-image decode + resize to 224×224×3
  components/ui.tsx          Card, Button, SeverityBadge, ConfidenceBar
  theme/                     design tokens
```

**Two inference paths:** live camera frames run through the GPU resize plugin inside a worklet (fast, ~1 fps throttled); still captures/uploads go through `imageToTensor`. Both feed the same `classifier.classify()`.

## Usage

### Using the Frame Classifier Hook (Live Camera)

```typescript
import { useFrameClassifier } from 'plant-health-lib/hooks';
import { getDiseaseInfo } from 'plant-health-lib/services';

export function ScanComponent() {
  const { classify, isLoading, lastResult } = useFrameClassifier();

  useEffect(() => {
    if (lastResult) {
      const disease = getDiseaseInfo(lastResult.label);
      console.log(`Detected: ${disease.name} (${lastResult.confidence}%)`);
    }
  }, [lastResult]);

  return (
    <CameraView
      onFrame={(frame) => classify(frame)}
      // ... camera props
    />
  );
}
```

### Using the History Hook

```typescript
import { useHistory } from 'plant-health-lib/hooks';

const { scans, addScan, clearHistory } = useHistory();
```

### Classifying Images

```typescript
import { classifyImage } from 'plant-health-lib/utils';
import { classifier } from 'plant-health-lib/services';

const result = await classifyImage(imagePath);
// result: { label: string; confidence: number; }
```

## API Reference

### Hooks

- **`useFrameClassifier()`** – Real-time frame classification from camera
  - Returns: `{ classify(frame), isLoading, lastResult }`

- **`useHistory()`** – Manage scan history with AsyncStorage
  - Returns: `{ scans, addScan(result), clearHistory() }`

### Services

- **`classifier.classify(tensor)`** – Classify a TensorFlow tensor
- **`getDiseaseInfo(label)`** – Get remedy/prevention data for a disease

### Utils

- **`classifyImage(path)`** – Load and classify a still image from file path

### Components

- **`<UI.Card />`** – Styled card component
- **`<UI.Button />`** – Button component
- **`<UI.SeverityBadge />`** – Disease severity indicator
- **`<UI.ConfidenceBar />`** – Confidence visualization

## Setting Up the Model

The library expects `src/assets/plant_disease_model.tflite`:
- **Input:** `[1, 224, 224, 3]` float32
- **Output:** `[1, 38]` (logits or probabilities)
- **Labels:** Must match `LABELS` in `src/services/diseaseData.ts`

Train on PlantVillage dataset using MobileNetV2 or EfficientNet-Lite, then convert with TFLite converter. See `src/assets/README.md` for details.

## Building from Source

```bash
npm install
npm run build
```

The compiled library will be in `lib/`.

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT

## Notes / Production Hardening

- The remedy text is general guidance — maintain an on-screen disclaimer; it's not a substitute for professional agricultural advice.
- For production, replace the JS image resampler with a native bitmap decoder for better performance.
- Tune `MEAN`/`STD` in `classifier.ts` to match your training normalization.

