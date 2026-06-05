"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeScreen;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var theme_1 = require("../theme");
var ui_1 = require("../components/ui");
var useHistory_1 = require("../hooks/useHistory");
var diseaseData_1 = require("../services/diseaseData");
function HomeScreen(_a) {
    var navigation = _a.navigation;
    var records = (0, useHistory_1.useHistory)().records;
    var recent = records.slice(0, 3);
    return (<react_native_safe_area_context_1.SafeAreaView style={styles.safe} edges={['top']}>
      <react_native_1.ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <react_native_1.View style={styles.header}>
          <react_native_1.View>
            <react_native_1.Text style={styles.kicker}>PLANT DOCTOR</react_native_1.Text>
            <react_native_1.Text style={styles.title}>Diagnose your{'\n'}plants in seconds</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.leaf}>
            <react_native_1.Text style={{ fontSize: 30 }}>🌿</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        <ui_1.Card style={styles.heroCard}>
          <react_native_1.Text style={styles.heroText}>
            Point your camera at a leaf or upload a photo. On-device AI detects 38+ crop diseases —
            no internet required.
          </react_native_1.Text>
          <react_native_1.View style={styles.heroBtns}>
            <react_native_1.View style={{ flex: 1 }}>
              <ui_1.Button label="Scan live" onPress={function () { return navigation.navigate('Scan'); }}/>
            </react_native_1.View>
            <react_native_1.View style={{ flex: 1 }}>
              <ui_1.Button label="Upload photo" variant="ghost" onPress={function () { return navigation.navigate('Scan', { mode: 'upload' }); }}/>
            </react_native_1.View>
          </react_native_1.View>
        </ui_1.Card>

        <react_native_1.View style={styles.statsRow}>
          <Stat value="38+" label="Diseases"/>
          <Stat value="100%" label="On-device"/>
          <Stat value={"".concat(records.length)} label="Your scans"/>
        </react_native_1.View>

        <react_native_1.View style={styles.sectionHead}>
          <react_native_1.Text style={styles.sectionTitle}>Recent scans</react_native_1.Text>
          {records.length > 0 && (<react_native_1.TouchableOpacity onPress={function () { return navigation.navigate('History'); }}>
              <react_native_1.Text style={styles.link}>See all</react_native_1.Text>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>

        {recent.length === 0 ? (<ui_1.Card>
            <react_native_1.Text style={styles.empty}>No scans yet. Diagnose your first plant above. 🌱</react_native_1.Text>
          </ui_1.Card>) : (recent.map(function (r) { return (<react_native_1.TouchableOpacity key={r.id} activeOpacity={0.75} onPress={function () {
                var _a, _b;
                var info = (0, diseaseData_1.getDiseaseInfo)((_a = r.label) !== null && _a !== void 0 ? _a : "".concat(r.crop, "___").concat(r.name));
                navigation.navigate('Result', {
                    uri: r.uri,
                    prediction: { info: info, confidence: r.confidence, topK: (_b = r.topK) !== null && _b !== void 0 ? _b : [] },
                    saveToHistory: false,
                });
            }}>
              <ui_1.Card style={styles.recentCard}>
                <react_native_1.Image source={{ uri: r.uri }} style={styles.thumb}/>
                <react_native_1.View style={{ flex: 1 }}>
                  <react_native_1.Text style={styles.recentCrop}>{r.crop}</react_native_1.Text>
                  <react_native_1.Text style={styles.recentName}>{r.name}</react_native_1.Text>
                </react_native_1.View>
                <ui_1.SeverityBadge severity={r.severity}/>
              </ui_1.Card>
            </react_native_1.TouchableOpacity>); }))}
      </react_native_1.ScrollView>
    </react_native_safe_area_context_1.SafeAreaView>);
}
var Stat = function (_a) {
    var value = _a.value, label = _a.label;
    return (<react_native_1.View style={styles.stat}>
    <react_native_1.Text style={styles.statValue}>{value}</react_native_1.Text>
    <react_native_1.Text style={styles.statLabel}>{label}</react_native_1.Text>
  </react_native_1.View>);
};
var styles = react_native_1.StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme_1.colors.bg },
    scroll: { padding: theme_1.spacing.lg, gap: theme_1.spacing.lg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    kicker: { color: theme_1.colors.primary, fontSize: theme_1.font.tiny, fontWeight: '800', letterSpacing: 2 },
    title: { color: theme_1.colors.text, fontSize: theme_1.font.h1, fontWeight: '800', marginTop: theme_1.spacing.xs },
    leaf: {
        width: 56,
        height: 56,
        borderRadius: theme_1.radius.md,
        backgroundColor: theme_1.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroCard: { gap: theme_1.spacing.lg },
    heroText: { color: theme_1.colors.textDim, fontSize: theme_1.font.body, lineHeight: 22 },
    heroBtns: { flexDirection: 'row', gap: theme_1.spacing.md },
    statsRow: { flexDirection: 'row', gap: theme_1.spacing.md },
    stat: {
        flex: 1,
        backgroundColor: theme_1.colors.surface,
        borderRadius: theme_1.radius.md,
        padding: theme_1.spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme_1.colors.border,
    },
    statValue: { color: theme_1.colors.primary, fontSize: theme_1.font.h2, fontWeight: '800' },
    statLabel: { color: theme_1.colors.textDim, fontSize: theme_1.font.tiny, marginTop: 2 },
    sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { color: theme_1.colors.text, fontSize: theme_1.font.h3, fontWeight: '700' },
    link: { color: theme_1.colors.primary, fontSize: theme_1.font.small, fontWeight: '600' },
    empty: { color: theme_1.colors.textDim, fontSize: theme_1.font.body, textAlign: 'center' },
    recentCard: { flexDirection: 'row', alignItems: 'center', gap: theme_1.spacing.md, padding: theme_1.spacing.md },
    thumb: { width: 48, height: 48, borderRadius: theme_1.radius.sm, backgroundColor: theme_1.colors.surfaceAlt },
    recentCrop: { color: theme_1.colors.text, fontSize: theme_1.font.body, fontWeight: '700' },
    recentName: { color: theme_1.colors.textDim, fontSize: theme_1.font.small },
});
