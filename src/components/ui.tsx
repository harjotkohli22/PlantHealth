import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius, font, severityColor } from '../theme';
import type { Severity } from '../services/diseaseData';

export const Card: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => <View style={[styles.card, style]}>{children}</View>;

export const Button: React.FC<{
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
}> = ({ label, onPress, variant = 'primary', loading, icon }) => {
  const bg =
    variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : 'transparent';
  const fg = variant === 'ghost' ? colors.text : '#08130C';
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={loading}
      style={[
        styles.btn,
        { backgroundColor: bg, borderWidth: variant === 'ghost' ? 1 : 0, borderColor: colors.border },
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.btnRow}>
          {icon}
          <Text style={[styles.btnText, { color: fg }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => (
  <View style={[styles.badge, { backgroundColor: severityColor(severity) + '22' }]}>
    <View style={[styles.dot, { backgroundColor: severityColor(severity) }]} />
    <Text style={[styles.badgeText, { color: severityColor(severity) }]}>
      {severity.toUpperCase()}
    </Text>
  </View>
);

export const ConfidenceBar: React.FC<{ value: number }> = ({ value }) => (
  <View style={styles.barTrack}>
    <View
      style={[
        styles.barFill,
        { width: `${Math.round(value * 100)}%`, backgroundColor: colors.primary },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btn: {
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  btnText: { fontSize: font.body, fontWeight: '700' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  badgeText: { fontSize: font.tiny, fontWeight: '800', letterSpacing: 0.5 },
  barTrack: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: radius.pill },
});
