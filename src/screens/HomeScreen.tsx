import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, font } from '../theme';
import { Card, Button, SeverityBadge } from '../components/ui';
import { useHistory } from '../hooks/useHistory';
import { getDiseaseInfo } from '../services/diseaseData';

export default function HomeScreen({ navigation }: any) {
  const { records } = useHistory();
  const recent = records.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>PLANT DOCTOR</Text>
            <Text style={styles.title}>Diagnose your{'\n'}plants in seconds</Text>
          </View>
          <View style={styles.leaf}>
            <Text style={{ fontSize: 30 }}>🌿</Text>
          </View>
        </View>

        <Card style={styles.heroCard}>
          <Text style={styles.heroText}>
            Point your camera at a leaf or upload a photo. On-device AI detects 38+ crop diseases —
            no internet required.
          </Text>
          <View style={styles.heroBtns}>
            <View style={{ flex: 1 }}>
              <Button label="Scan live" onPress={() => navigation.navigate('Scan')} />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                label="Upload photo"
                variant="ghost"
                onPress={() => navigation.navigate('Scan', { mode: 'upload' })}
              />
            </View>
          </View>
        </Card>

        <View style={styles.statsRow}>
          <Stat value="38+" label="Diseases" />
          <Stat value="100%" label="On-device" />
          <Stat value={`${records.length}`} label="Your scans" />
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Recent scans</Text>
          {records.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.link}>See all</Text>
            </TouchableOpacity>
          )}
        </View>

        {recent.length === 0 ? (
          <Card>
            <Text style={styles.empty}>No scans yet. Diagnose your first plant above. 🌱</Text>
          </Card>
        ) : (
          recent.map((r) => (
            <TouchableOpacity
              key={r.id}
              activeOpacity={0.75}
              onPress={() => {
                const info = getDiseaseInfo(r.label ?? `${r.crop}___${r.name}`);
                navigation.navigate('Result', {
                  uri: r.uri,
                  prediction: { info, confidence: r.confidence, topK: r.topK ?? [] },
                  saveToHistory: false,
                });
              }}>
              <Card style={styles.recentCard}>
                <Image source={{ uri: r.uri }} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.recentCrop}>{r.crop}</Text>
                  <Text style={styles.recentName}>{r.name}</Text>
                </View>
                <SeverityBadge severity={r.severity as any} />
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, gap: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { color: colors.primary, fontSize: font.tiny, fontWeight: '800', letterSpacing: 2 },
  title: { color: colors.text, fontSize: font.h1, fontWeight: '800', marginTop: spacing.xs },
  leaf: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: { gap: spacing.lg },
  heroText: { color: colors.textDim, fontSize: font.body, lineHeight: 22 },
  heroBtns: { flexDirection: 'row', gap: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { color: colors.primary, fontSize: font.h2, fontWeight: '800' },
  statLabel: { color: colors.textDim, fontSize: font.tiny, marginTop: 2 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.text, fontSize: font.h3, fontWeight: '700' },
  link: { color: colors.primary, fontSize: font.small, fontWeight: '600' },
  empty: { color: colors.textDim, fontSize: font.body, textAlign: 'center' },
  recentCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  thumb: { width: 48, height: 48, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  recentCrop: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  recentName: { color: colors.textDim, fontSize: font.small },
});
