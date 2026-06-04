# 🌿 Plant Doctor

On-device plant disease detection for React Native CLI. Point the camera at a leaf (or upload a photo) and a quantized TFLite model classifies 38+ crop diseases — fully offline, no backend.

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

## Setup

```bash
# 1. Scaffold (if starting fresh) then drop these files in
npx @react-native-community/cli init PlantDoctor
# copy src/, App.tsx, index.js, configs over

# 2. Install deps
npm install

# 3. Add the model
#    Put your classifier at src/assets/plant_disease_model.tflite
#    (see src/assets/README.md for how to train/convert one)

# 4. iOS pods
npm run pods

# 5. Permissions
#    Android: merge native-config/AndroidManifest.snippet.xml
#    iOS:     merge native-config/Info.plist.snippet.xml

# 6. Run
npm run android   # or: npm run ios
```

## The model

The app expects `src/assets/plant_disease_model.tflite`:
- **Input:** `[1, 224, 224, 3]` float32
- **Output:** `[1, 38]` (logits or probabilities — the classifier auto-detects and applies softmax if needed)
- **Labels:** order must match `LABELS` in `src/services/diseaseData.ts`

Train on the PlantVillage dataset (MobileNetV2/EfficientNet-Lite is a good mobile backbone) and convert with `tf.lite.TFLiteConverter`. Full instructions in `src/assets/README.md`.

## Notes / production hardening

- `utils/imageToTensor.ts` uses a dependency-light JS resampler as a fallback; for production swap in a native bitmap decoder (e.g. `@bam.tech/react-native-image-resizer`) for speed and quality.
- Tune `MEAN`/`STD` in `classifier.ts` to match your training normalization.
- The remedy text is general guidance — keep the on-screen disclaimer; it's not a substitute for an agronomist.
