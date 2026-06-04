import { Image } from 'react-native';
import RNFS from 'react-native-fs';
import { MODEL_INPUT_SIZE } from '../services/classifier';

/**
 * Decode a still image file (from gallery or camera capture) into a
 * 224x224x3 Uint8Array suitable for the classifier.
 *
 * For the live-camera path we instead use vision-camera-resize-plugin in a
 * frame processor (see hooks/useFrameClassifier), which is far faster.
 *
 * This still-image path uses a tiny native bridge through RNFS + a JS
 * nearest-neighbor resampler as a dependency-light fallback. For production,
 * prefer `@bam.tech/react-native-image-resizer` for quality + speed.
 */
export async function imageFileToTensor(uri: string): Promise<Uint8Array> {
  const { width, height } = await getSize(uri);
  const raw = await readRgbaPixels(uri, width, height);
  return resizeRgbaToRgb(raw, width, height, MODEL_INPUT_SIZE);
}

function getSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
}

/**
 * Reads decoded RGBA bytes. In a real app this is provided by a native module
 * (e.g. vision-camera-resize-plugin's `toArrayBuffer`, or a custom decoder).
 * Here we read the base64 of a pre-decoded bitmap cache written by the camera.
 */
async function readRgbaPixels(uri: string, w: number, h: number): Promise<Uint8Array> {
  // Placeholder decode path — replace with native bitmap decode for production.
  const b64 = await RNFS.readFile(uri.replace('file://', ''), 'base64');
  const bin = globalThis.atob ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** Nearest-neighbor resize RGBA(or RGB) -> RGB target x target. */
function resizeRgbaToRgb(
  src: Uint8Array,
  srcW: number,
  srcH: number,
  target: number,
): Uint8Array {
  const channels = src.length / (srcW * srcH) >= 4 ? 4 : 3;
  const out = new Uint8Array(target * target * 3);
  for (let y = 0; y < target; y++) {
    const sy = Math.floor((y * srcH) / target);
    for (let x = 0; x < target; x++) {
      const sx = Math.floor((x * srcW) / target);
      const si = (sy * srcW + sx) * channels;
      const di = (y * target + x) * 3;
      out[di] = src[si];
      out[di + 1] = src[si + 1];
      out[di + 2] = src[si + 2];
    }
  }
  return out;
}
