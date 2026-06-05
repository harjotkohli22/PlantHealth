"use strict";
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
exports.default = ResultScreen;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var theme_1 = require("../theme");
var ui_1 = require("../components/ui");
var useHistory_1 = require("../hooks/useHistory");
function ResultScreen(_a) {
    var navigation = _a.navigation, route = _a.route;
    var _b = route.params, uri = _b.uri, prediction = _b.prediction, _c = _b.saveToHistory, saveToHistory = _c === void 0 ? true : _c;
    var add = (0, useHistory_1.useHistory)().add;
    var info = prediction.info, confidence = prediction.confidence, topK = prediction.topK;
    (0, react_1.useEffect)(function () {
        if (saveToHistory)
            add(uri, prediction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var confidenceWarning = (function () {
        if (confidence >= 0.6)
            return null;
        if (info.healthy) {
            return confidence < 0.35
                ? "\u26A0\uFE0F Very low confidence \u2014 the model couldn't clearly assess your ".concat(info.crop, ". Try a well-lit, close-up photo of the leaves.")
                : "\u26A0\uFE0F Low confidence \u2014 your ".concat(info.crop, " may be healthy, but a clearer photo will give a more reliable result.");
        }
        return confidence < 0.35
            ? "\u26A0\uFE0F Very low confidence \u2014 possible ".concat(info.name, " on ").concat(info.crop, ", but the model is uncertain. Retake with better lighting and focus on the affected area.")
            : "\u26A0\uFE0F Low confidence \u2014 possible ".concat(info.name, " detected. Try a clearer, well-lit photo of the affected ").concat(info.crop, " leaf.");
    })();
    return (<react_native_safe_area_context_1.SafeAreaView style={styles.safe} edges={['bottom']}>
      <react_native_1.ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <react_native_1.Image resizeMode="contain" source={{ uri: uri }} style={styles.hero}/>

        <react_native_1.View style={styles.headerRow}>
          <react_native_1.View style={{ flex: 1 }}>
            <react_native_1.Text style={styles.crop}>{info.crop}</react_native_1.Text>
            <react_native_1.Text style={styles.name}>{info.name}</react_native_1.Text>
          </react_native_1.View>
          <ui_1.SeverityBadge severity={info.severity}/>
        </react_native_1.View>

        <ui_1.Card>
          <react_native_1.View style={styles.confRow}>
            <react_native_1.Text style={styles.confLabel}>Confidence</react_native_1.Text>
            <react_native_1.Text style={styles.confValue}>{Math.round(confidence * 100)}%</react_native_1.Text>
          </react_native_1.View>
          <ui_1.ConfidenceBar value={confidence}/>
          {confidenceWarning && <react_native_1.Text style={styles.warn}>{confidenceWarning}</react_native_1.Text>}
        </ui_1.Card>

        <ui_1.Card>
          <react_native_1.Text style={styles.sectionTitle}>What it is</react_native_1.Text>
          <react_native_1.Text style={styles.body}>{info.summary}</react_native_1.Text>
        </ui_1.Card>

        {!info.healthy && (<ui_1.Card>
            <react_native_1.Text style={styles.sectionTitle}>Treatment</react_native_1.Text>
            {info.remedies.map(function (r, i) { return (<react_native_1.View key={i} style={styles.li}>
                <react_native_1.Text style={styles.liBullet}>{i + 1}</react_native_1.Text>
                <react_native_1.Text style={styles.body}>{r}</react_native_1.Text>
              </react_native_1.View>); })}
          </ui_1.Card>)}

        <ui_1.Card>
          <react_native_1.Text style={styles.sectionTitle}>Prevention</react_native_1.Text>
          {info.prevention.map(function (r, i) { return (<react_native_1.View key={i} style={styles.li}>
              <react_native_1.Text style={styles.liDot}>•</react_native_1.Text>
              <react_native_1.Text style={styles.body}>{r}</react_native_1.Text>
            </react_native_1.View>); })}
        </ui_1.Card>

        <ui_1.Card>
          <react_native_1.Text style={styles.sectionTitle}>Other possibilities</react_native_1.Text>
          {topK.slice(1).map(function (t) { return (<react_native_1.View key={t.label} style={styles.altRow}>
              <react_native_1.Text style={styles.altName}>
                {t.label.replace(/___/g, ' · ').replace(/_/g, ' ')}
              </react_native_1.Text>
              <react_native_1.Text style={styles.altPct}>{Math.round(t.confidence * 100)}%</react_native_1.Text>
            </react_native_1.View>); })}
        </ui_1.Card>

        <react_native_1.Text style={styles.disclaimer}>
          This is an AI assessment, not a substitute for professional agronomy advice. For severe or
          spreading outbreaks, consult your local agricultural extension service.
        </react_native_1.Text>

        <ui_1.Button label="Scan another" onPress={function () { return navigation.navigate('Scan'); }}/>
        <react_native_1.View style={{ height: theme_1.spacing.sm }}/>
        <ui_1.Button label="Back to home" variant="ghost" onPress={function () { return navigation.popToTop(); }}/>
      </react_native_1.ScrollView>
    </react_native_safe_area_context_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme_1.colors.bg },
    scroll: { padding: theme_1.spacing.lg, gap: theme_1.spacing.md },
    hero: { width: '100%', height: 260, borderRadius: theme_1.radius.lg, backgroundColor: theme_1.colors.surfaceAlt },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: theme_1.spacing.md },
    crop: { color: theme_1.colors.textDim, fontSize: theme_1.font.small, fontWeight: '700', letterSpacing: 1 },
    name: { color: theme_1.colors.text, fontSize: theme_1.font.h2, fontWeight: '800' },
    confRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme_1.spacing.sm },
    confLabel: { color: theme_1.colors.textDim, fontSize: theme_1.font.small },
    confValue: { color: theme_1.colors.primary, fontSize: theme_1.font.body, fontWeight: '800' },
    warn: { color: theme_1.colors.warn, fontSize: theme_1.font.small, marginTop: theme_1.spacing.md, lineHeight: 18 },
    sectionTitle: {
        color: theme_1.colors.text,
        fontSize: theme_1.font.h3,
        fontWeight: '700',
        marginBottom: theme_1.spacing.sm,
    },
    body: { color: theme_1.colors.textDim, fontSize: theme_1.font.body, lineHeight: 22, flex: 1 },
    li: { flexDirection: 'row', gap: theme_1.spacing.sm, marginBottom: theme_1.spacing.sm, alignItems: 'flex-start' },
    liBullet: {
        color: theme_1.colors.primary,
        fontWeight: '800',
        width: 20,
        height: 20,
        textAlign: 'center',
        backgroundColor: theme_1.colors.surfaceAlt,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: theme_1.font.tiny,
        lineHeight: 20,
    },
    liDot: { color: theme_1.colors.primary, fontSize: theme_1.font.h3, lineHeight: 20 },
    altRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme_1.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme_1.colors.border,
    },
    altName: { color: theme_1.colors.textDim, fontSize: theme_1.font.small, flex: 1 },
    altPct: { color: theme_1.colors.text, fontSize: theme_1.font.small, fontWeight: '700' },
    disclaimer: {
        color: theme_1.colors.textDim,
        fontSize: theme_1.font.tiny,
        lineHeight: 16,
        fontStyle: 'italic',
        marginVertical: theme_1.spacing.sm,
    },
});
