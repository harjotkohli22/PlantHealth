import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, font } from '../theme';
import { Card, SeverityBadge, ConfirmSheet, TrashIcon } from '../components/ui';
import { useHistory } from '../hooks/useHistory';
import { getDiseaseInfo } from '../services/diseaseData';

export default function HistoryScreen({ navigation }: any) {
  const { records, remove, clear } = useHistory();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        contentContainerStyle={styles.list}
        data={records}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={
          records.length > 0 ? (
            <View style={styles.head}>
              <Text style={styles.count}>{records.length} scans saved</Text>
              <TouchableOpacity onPress={clear}>
                <Text style={styles.clear}>Clear all</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <Card style={{ marginTop: spacing.xl }}>
            <Text style={styles.empty}>No scans yet 🌱</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              const info = getDiseaseInfo(item.label ?? `${item.crop}___${item.name}`);
              navigation.navigate('Result', {
                uri: item.uri,
                prediction: { info, confidence: item.confidence, topK: item.topK ?? [] },
                saveToHistory: false,
              });
            }}
          >
            <Card style={styles.row}>
              <Image source={{ uri: item.uri }} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.crop}>{item.crop}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.date}>
                  {new Date(item.date).toLocaleDateString()} · {Math.round(item.confidence * 100)}%
                </Text>
              </View>
              <View>
                <SeverityBadge severity={item.severity as any} />
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation?.();
                    setDeleteId(item.id);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.deleteBtn}
                >
                  <TrashIcon size={16} />
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
      <ConfirmSheet
        visible={deleteId !== null}
        title="Delete scan"
        message="Remove this scan from history?"
        confirmLabel="Delete"
        onConfirm={() => {
          remove(deleteId!);
          setDeleteId(null);
        }}
        onClose={() => setDeleteId(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.lg, gap: spacing.md },
  head: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  count: { color: colors.textDim, fontSize: font.small },
  clear: { color: colors.danger, fontSize: font.small, fontWeight: '600' },
  empty: { color: colors.textDim, textAlign: 'center', fontSize: font.body },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  thumb: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  crop: { color: colors.textDim, fontSize: font.tiny, fontWeight: '700', letterSpacing: 1 },
  name: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  date: { color: colors.textDim, fontSize: font.tiny, marginTop: 2 },
  deleteBtn: { padding: 4, alignSelf: 'flex-end' },
});
