"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmSheet = exports.ConfidenceBar = exports.SeverityBadge = exports.Button = exports.Card = exports.TrashIcon = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_svg_1 = __importStar(require("react-native-svg"));
var theme_1 = require("../theme");
var TrashIcon = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 22 : _b, _c = _a.color, color = _c === void 0 ? theme_1.colors.danger : _c;
    return (<react_native_svg_1.default width={size} height={size} viewBox="0 0 22 20" fill="none">
    <react_native_svg_1.Path d="M3 6h18" stroke={color} strokeWidth={1.8} strokeLinecap="round"/>
    <react_native_svg_1.Path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" stroke={color} strokeWidth={1.8} strokeLinecap="round"/>
    <react_native_svg_1.Rect x="5" y="6" width="14" height="14" rx="2" stroke={color} strokeWidth={1.8}/>
    <react_native_svg_1.Line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth={1.8} strokeLinecap="round"/>
    <react_native_svg_1.Line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth={1.8} strokeLinecap="round"/>
  </react_native_svg_1.default>);
};
exports.TrashIcon = TrashIcon;
var Card = function (_a) {
    var children = _a.children, style = _a.style;
    return <react_native_1.View style={[styles.card, style]}>{children}</react_native_1.View>;
};
exports.Card = Card;
var Button = function (_a) {
    var label = _a.label, onPress = _a.onPress, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, loading = _a.loading, icon = _a.icon;
    var bg = variant === 'primary' ? theme_1.colors.primary : variant === 'danger' ? theme_1.colors.danger : 'transparent';
    var fg = variant === 'ghost' ? theme_1.colors.text : '#08130C';
    return (<react_native_1.TouchableOpacity activeOpacity={0.85} onPress={onPress} disabled={loading} style={[
            styles.btn,
            {
                backgroundColor: bg,
                borderWidth: variant === 'ghost' ? 1 : 0,
                borderColor: theme_1.colors.border,
            },
        ]}>
      {loading ? (<react_native_1.ActivityIndicator color={fg}/>) : (<react_native_1.View style={styles.btnRow}>
          {icon}
          <react_native_1.Text style={[styles.btnText, { color: fg }]}>{label}</react_native_1.Text>
        </react_native_1.View>)}
    </react_native_1.TouchableOpacity>);
};
exports.Button = Button;
var SeverityBadge = function (_a) {
    var severity = _a.severity;
    return (<react_native_1.View style={[styles.badge, { backgroundColor: (0, theme_1.severityColor)(severity) + '22' }]}>
    <react_native_1.View style={[styles.dot, { backgroundColor: (0, theme_1.severityColor)(severity) }]}/>
    <react_native_1.Text style={[styles.badgeText, { color: (0, theme_1.severityColor)(severity) }]}>
      {severity.toUpperCase()}
    </react_native_1.Text>
  </react_native_1.View>);
};
exports.SeverityBadge = SeverityBadge;
var ConfidenceBar = function (_a) {
    var value = _a.value;
    return (<react_native_1.View style={styles.barTrack}>
    <react_native_1.View style={[
            styles.barFill,
            { width: "".concat(Math.round(value * 100), "%"), backgroundColor: theme_1.colors.primary },
        ]}/>
  </react_native_1.View>);
};
exports.ConfidenceBar = ConfidenceBar;
var ConfirmSheet = function (_a) {
    var visible = _a.visible, title = _a.title, message = _a.message, _b = _a.confirmLabel, confirmLabel = _b === void 0 ? 'Delete' : _b, onConfirm = _a.onConfirm, onClose = _a.onClose;
    var _c = (0, react_1.useState)(false), open = _c[0], setOpen = _c[1];
    var translateY = (0, react_1.useRef)(new react_native_1.Animated.Value(300)).current;
    var backdropOpacity = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    (0, react_1.useEffect)(function () {
        if (visible) {
            setOpen(true);
            react_native_1.Animated.parallel([
                react_native_1.Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }),
                react_native_1.Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
        }
        else {
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
                react_native_1.Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]).start(function () { return setOpen(false); });
        }
    }, [visible]);
    return (<react_native_1.Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <react_native_1.View style={react_native_1.StyleSheet.absoluteFill}>
        <react_native_1.Animated.View style={[styles.sheetBackdrop, { opacity: backdropOpacity }]}>
          <react_native_1.TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1}/>
        </react_native_1.Animated.View>
        <react_native_1.View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <react_native_1.Animated.View style={[styles.sheet, { transform: [{ translateY: translateY }] }]}>
            <react_native_1.View style={styles.handle}/>
            <react_native_1.Text style={styles.sheetTitle}>{title}</react_native_1.Text>
            {message ? <react_native_1.Text style={styles.sheetMessage}>{message}</react_native_1.Text> : null}
            <react_native_1.View style={styles.sheetActions}>
              <exports.Button label={confirmLabel} onPress={onConfirm} variant="danger"/>
              <exports.Button label="Cancel" onPress={onClose} variant="ghost"/>
            </react_native_1.View>
          </react_native_1.Animated.View>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.Modal>);
};
exports.ConfirmSheet = ConfirmSheet;
var styles = react_native_1.StyleSheet.create({
    card: {
        backgroundColor: theme_1.colors.surface,
        borderRadius: theme_1.radius.lg,
        padding: theme_1.spacing.lg,
        borderWidth: 1,
        borderColor: theme_1.colors.border,
    },
    btn: {
        borderRadius: theme_1.radius.pill,
        paddingVertical: theme_1.spacing.md,
        paddingHorizontal: theme_1.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnRow: { flexDirection: 'row', alignItems: 'center', gap: theme_1.spacing.sm },
    btnText: { fontSize: theme_1.font.body, fontWeight: '700' },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme_1.spacing.xs,
        paddingHorizontal: theme_1.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme_1.radius.pill,
        alignSelf: 'flex-start',
    },
    dot: { width: 8, height: 8, borderRadius: 4 },
    badgeText: { fontSize: theme_1.font.tiny, fontWeight: '800', letterSpacing: 0.5 },
    barTrack: {
        height: 8,
        backgroundColor: theme_1.colors.surfaceAlt,
        borderRadius: theme_1.radius.pill,
        overflow: 'hidden',
    },
    barFill: { height: 8, borderRadius: theme_1.radius.pill },
    sheetBackdrop: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { backgroundColor: 'rgba(0,0,0,0.6)' }),
    sheet: {
        backgroundColor: theme_1.colors.surface,
        borderTopLeftRadius: theme_1.radius.lg,
        borderTopRightRadius: theme_1.radius.lg,
        borderWidth: 1,
        borderColor: theme_1.colors.border,
        paddingHorizontal: theme_1.spacing.lg,
        paddingBottom: theme_1.spacing.xl,
        paddingTop: theme_1.spacing.md,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: theme_1.radius.pill,
        backgroundColor: theme_1.colors.border,
        alignSelf: 'center',
        marginBottom: theme_1.spacing.lg,
    },
    sheetTitle: {
        color: theme_1.colors.text,
        fontSize: theme_1.font.h3,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: theme_1.spacing.xs,
    },
    sheetMessage: {
        color: theme_1.colors.textDim,
        fontSize: theme_1.font.body,
        textAlign: 'center',
        marginBottom: theme_1.spacing.md,
    },
    sheetActions: { gap: theme_1.spacing.sm, marginTop: theme_1.spacing.lg },
});
