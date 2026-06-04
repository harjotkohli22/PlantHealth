import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, font } from '../theme';
import { Card, Button, SeverityBadge, ConfidenceBar } from '../components/ui';
import { useHistory } from '../hooks/useHistory';
import type { Prediction } from '../services/classifier';

export default function ResultScreen({ navigation, route }: any) {
  const { uri, prediction } = route.params as { uri: string; prediction: Prediction };
  const { add } = useHistory();
  const { info, confidence, topK } = prediction;

  useEffect(() => {
    add(uri, prediction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lowConfidence = confidence < 0.6;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image source={{ uri }} style={styles.hero} />

        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.crop}>{info.crop}</Text>
            <Text style={styles.name}>{info.name}</Text>
          </View>
          <SeverityBadge severity={info.severity} />
        </View>

        <Card>
          <View style={styles.confRow}>
            <Text style={styles.confLabel}>Confidence</Text>
            <Text style={styles.confValue}>{Math.round(confidence * 100)}%</Text>
          </View>
          <ConfidenceBar value={confidence} />
          {lowConfidence && (
            <Text style={styles.warn}>
              ⚠️ Low confidence — try a clearer, well-lit photo of a single affected leaf.
            </Text>
          )}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>What it is</Text>
          <Text style={styles.body}>{info.summary}</Text>
        </Card>

        {!info.healthy && (
          <Card>
            <Text style={styles.sectionTitle}>Treatment</Text>
            {info.remedies.map((r, i) => (
              <View key={i} style={styles.li}>
                <Text style={styles.liBullet}>{i + 1}</Text>
                <Text style={styles.body}>{r}</Text>
              </View>
            ))}
          </Card>
        )}

        <Card>
          <Text style={styles.sectionTitle}>Prevention</Text>
          {info.prevention.map((r, i) => (
            <View key={i} style={styles.li}>
              <Text style={styles.liDot}>•</Text>
              <Text style={styles.body}>{r}</Text>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Other possibilities</Text>
          {topK.slice(1).map((t) => (
            <View key={t.label} style={styles.altRow}>
              <Text style={styles.altName}>{t.label.replace(/___/g, ' · ').replace(/_/g, ' ')}</Text>
              <Text style={styles.altPct}>{Math.round(t.confidence * 100)}%</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.disclaimer}>
          This is an AI assessment, not a substitute for professional agronomy advice. For severe or
          spreading outbreaks, consult your local agricultural extension service.
        </Text>

        <Button label="Scan another" onPress={() => navigation.navigate('Scan')} />
        <View style={{ height: spacing.sm }} />
        <Button label="Back to home" variant="ghost" onPress={() => navigation.popToTop()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, gap: spacing.md },
  hero: { width: '100%', height: 260, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  crop: { color: colors.textDim, fontSize: font.small, fontWeight: '700', letterSpacing: 1 },
  name: { color: colors.text, fontSize: font.h2, fontWeight: '800' },
  confRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  confLabel: { color: colors.textDim, fontSize: font.small },
  confValue: { color: colors.primary, fontSize: font.body, fontWeight: '800' },
  warn: { color: colors.warn, fontSize: font.small, marginTop: spacing.md, lineHeight: 18 },
  sectionTitle: { color: colors.text, fontSize: font.h3, fontWeight: '700', marginBottom: spacing.sm },
  body: { color: colors.textDim, fontSize: font.body, lineHeight: 22, flex: 1 },
  li: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'flex-start' },
  liBullet: {
    color: colors.primary,
    fontWeight: '800',
    width: 20,
    height: 20,
    textAlign: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    overflow: 'hidden',
    fontSize: font.tiny,
    lineHeight: 20,
  },
  liDot: { color: colors.primary, fontSize: font.h3, lineHeight: 20 },
  altRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  altName: { color: colors.textDim, fontSize: font.small, flex: 1 },
  altPct: { color: colors.text, fontSize: font.small, fontWeight: '700' },
  disclaimer: {
    color: colors.textDim,
    fontSize: font.tiny,
    lineHeight: 16,
    fontStyle: 'italic',
    marginVertical: spacing.sm,
  },
});
