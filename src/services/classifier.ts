import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';
import { LABELS, getDiseaseInfo, DiseaseInfo } from './diseaseData';

export interface Prediction {
  info: DiseaseInfo;
  confidence: number;          // 0..1 of top class
  topK: { label: string; confidence: number }[];
}

const MODEL_INPUT_SIZE = 224; // model expects 224x224x3
// PlantVillage / ImageNet style normalization. Adjust to match your training.
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

class PlantClassifier {
  private model: TensorflowModel | null = null;
  private loading: Promise<TensorflowModel> | null = null;

  /** Lazy-load and cache the model. GPU delegate on Android, CoreML on iOS. */
  async load(): Promise<TensorflowModel> {
    if (this.model) return this.model;
    if (this.loading) return this.loading;

    this.loading = loadTensorflowModel(
      require('../assets/plant_disease_model.tflite'),
      'default',
    ).then((m) => {
      this.model = m;
      return m;
    });

    return this.loading;
  }

  isReady() {
    return this.model !== null;
  }

  /**
   * Run inference on a Float32 RGB buffer already resized to 224x224.
   * `rgb` is length 224*224*3 with values 0..255.
   */
  async classify(rgb: Float32Array | Uint8Array): Promise<Prediction> {
    const model = await this.load();

    const input = this.normalize(rgb);
    const outputs = model.runSync([input]);
    const logits = outputs[0] as Float32Array;

    const probs = softmaxIfNeeded(logits);
    const ranked = Array.from(probs)
      .map((confidence, i) => ({ label: LABELS[i] ?? `class_${i}`, confidence }))
      .sort((a, b) => b.confidence - a.confidence);

    const top = ranked[0];
    return {
      info: getDiseaseInfo(top.label),
      confidence: top.confidence,
      topK: ranked.slice(0, 3),
    };
  }

  private normalize(rgb: Float32Array | Uint8Array): Float32Array {
    const out = new Float32Array(MODEL_INPUT_SIZE * MODEL_INPUT_SIZE * 3);
    for (let i = 0; i < out.length; i++) {
      const c = i % 3;
      out[i] = (rgb[i] / 255 - MEAN[c]) / STD[c];
    }
    return out;
  }
}

function softmaxIfNeeded(arr: Float32Array): Float32Array {
  const sum = arr.reduce((a, b) => a + b, 0);
  // already-normalized probabilities sum ~1 and are non-negative
  const looksLikeProbs = sum > 0.95 && sum < 1.05 && arr.every((v) => v >= 0 && v <= 1);
  if (looksLikeProbs) return arr;

  let max = -Infinity;
  for (const v of arr) max = Math.max(max, v);
  const exp = arr.map((v) => Math.exp(v - max));
  const expSum = exp.reduce((a, b) => a + b, 0);
  return Float32Array.from(exp.map((v) => v / expSum));
}

export const classifier = new PlantClassifier();
export { MODEL_INPUT_SIZE };
