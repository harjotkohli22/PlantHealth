import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, font } from '../theme';
import { Card, Button, SeverityBadge } from '../components/ui';
import { useHistory } from '../hooks/useHistory';

export default function HistoryScreen() {
  const { records, clear } = useHistory();

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
          <Card style={styles.row}>
            <Image source={{ uri: item.uri }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.crop}>{item.crop}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()} ·{' '}
                {Math.round(item.confidence * 100)}%
              </Text>
            </View>
            <SeverityBadge severity={item.severity as any} />
          </Card>
        )}
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
});
