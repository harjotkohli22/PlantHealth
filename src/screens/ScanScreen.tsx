import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, spacing, radius, font } from '../theme';
import { Button } from '../components/ui';
import { useFrameClassifier } from '../hooks/useFrameClassifier';
import { classifier } from '../services/classifier';
import { imageFileToTensor } from '../utils/imageToTensor';

export default function ScanScreen({ navigation, route }: any) {
  const uploadMode = route?.params?.mode === 'upload';
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [live, setLive] = useState(!uploadMode);
  const [busy, setBusy] = useState(false);

  const { frameProcessor, prediction, running, setRunning } = useFrameClassifier(live);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (uploadMode) pickImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = async () => {
    if (!camera.current) return;
    try {
      setBusy(true);
      setLive(false);
      const photo = await camera.current.takePhoto({ flash: 'off' });
      const uri = `file://${photo.path}`;
      const tensor = await imageFileToTensor(uri);
      const result = await classifier.classify(tensor);
      navigation.navigate('Result', { uri, prediction: result });
    } catch (e) {
      setLive(true);
    } finally {
      setBusy(false);
    }
  };

  const pickImage = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    const asset = res.assets?.[0];
    if (!asset?.uri) {
      if (uploadMode) navigation.goBack();
      return;
    }
    try {
      setBusy(true);
      const tensor = await imageFileToTensor(asset.uri);
      const result = await classifier.classify(tensor);
      navigation.navigate('Result', { uri: asset.uri, prediction: result });
    } catch {
      alert('Failed to analyze the image. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (!device || !hasPermission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permText}>
          {!hasPermission ? 'Camera permission needed to scan plants.' : 'No camera available.'}
        </Text>
        <View style={{ height: spacing.md }} />
        <Button label="Grant permission" onPress={requestPermission} />
        <View style={{ height: spacing.sm }} />
        <Button label="Upload instead" variant="ghost" onPress={pickImage} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={live}
        photo
        frameProcessor={live ? frameProcessor : undefined}
      />

      {/* focus reticle */}
      <View style={styles.reticleWrap} pointerEvents="none">
        <View style={styles.reticle} />
        <Text style={styles.hint}>Center a single leaf in the frame</Text>
      </View>

      {/* live prediction pill */}
      {live && prediction && (
        <SafeAreaView style={styles.livePillWrap} edges={['top']}>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.livePillText}>
              {prediction.info.crop} · {prediction.info.name} ·{' '}
              {Math.round(prediction.confidence * 100)}%
            </Text>
          </View>
        </SafeAreaView>
      )}

      <SafeAreaView style={styles.controls} edges={['bottom']}>
        <TouchableOpacity style={styles.sideBtn} onPress={pickImage}>
          <Text style={styles.sideIcon}>🖼️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutter} onPress={capture} disabled={busy}>
          {busy ? <ActivityIndicator color="#08130C" /> : <View style={styles.shutterInner} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideBtn} onPress={() => setLive((v) => !v)}>
          <Text style={styles.sideIcon}>{live ? '⏸️' : '▶️'}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {running && (
        <View style={styles.analyzing} pointerEvents="none">
          <Text style={styles.analyzingText}>Analyzing…</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  permText: { color: colors.text, fontSize: font.body, textAlign: 'center' },
  reticleWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  reticle: {
    width: 260,
    height: 260,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  hint: { color: '#fff', marginTop: spacing.md, fontSize: font.small, opacity: 0.9 },
  livePillWrap: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(8,19,12,0.85)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  livePillText: { color: colors.text, fontSize: font.small, fontWeight: '600' },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  sideBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideIcon: { fontSize: 22 },
  shutter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary },
  analyzing: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    backgroundColor: 'rgba(8,19,12,0.8)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  analyzingText: { color: colors.text, fontWeight: '600' },
});
