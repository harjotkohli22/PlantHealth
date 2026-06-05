import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import Svg, { Path, Rect, Line } from 'react-native-svg';
import { colors, spacing, radius, font, severityColor } from '../theme';
import type { Severity } from '../services/diseaseData';

export const TrashIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 22,
  color = colors.danger,
}) => (
  <Svg width={size} height={size} viewBox="0 0 22 20" fill="none">
    <Path d="M3 6h18" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Path
      d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Rect x="5" y="6" width="14" height="14" rx="2" stroke={color} strokeWidth={1.8} />
    <Line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

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
        {
          backgroundColor: bg,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: colors.border,
        },
      ]}
    >
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

export const ConfirmSheet: React.FC<{
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ visible, title, message, confirmLabel = 'Delete', onConfirm, onClose }) => {
  const [open, setOpen] = useState(false);
  const translateY = useRef(new Animated.Value(300)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setOpen(true);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setOpen(false));
    }
  }, [visible]);

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.sheetBackdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
        </Animated.View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{title}</Text>
            {message ? <Text style={styles.sheetMessage}>{message}</Text> : null}
            <View style={styles.sheetActions}>
              <Button label={confirmLabel} onPress={onConfirm} variant="danger" />
              <Button label="Cancel" onPress={onClose} variant="ghost" />
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

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
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: font.h3,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  sheetMessage: {
    color: colors.textDim,
    fontSize: font.body,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  sheetActions: { gap: spacing.sm, marginTop: spacing.lg },
});
