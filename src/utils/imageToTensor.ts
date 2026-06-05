import RNFS from 'react-native-fs';
import jpeg from 'jpeg-js';
import { MODEL_INPUT_SIZE } from '../services/classifier';

export async function imageFileToTensor(uri: string): Promise<Uint8Array> {
  const b64 = await RNFS.readFile(uri.replace('file://', ''), 'base64');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const { width, height, data } = jpeg.decode(bytes.buffer, { useTArray: true });
  return resizeRgbaToRgb(data as Uint8Array, width, height, MODEL_INPUT_SIZE);
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
