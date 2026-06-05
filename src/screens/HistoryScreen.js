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
exports.default = HistoryScreen;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var theme_1 = require("../theme");
var ui_1 = require("../components/ui");
var useHistory_1 = require("../hooks/useHistory");
var diseaseData_1 = require("../services/diseaseData");
function HistoryScreen(_a) {
    var navigation = _a.navigation;
    var _b = (0, useHistory_1.useHistory)(), records = _b.records, remove = _b.remove, clear = _b.clear;
    var _c = (0, react_1.useState)(null), deleteId = _c[0], setDeleteId = _c[1];
    return (<react_native_safe_area_context_1.SafeAreaView style={styles.safe} edges={['bottom']}>
      <react_native_1.FlatList contentContainerStyle={styles.list} data={records} keyExtractor={function (r) { return r.id; }} ListHeaderComponent={records.length > 0 ? (<react_native_1.View style={styles.head}>
              <react_native_1.Text style={styles.count}>{records.length} scans saved</react_native_1.Text>
              <react_native_1.TouchableOpacity onPress={clear}>
                <react_native_1.Text style={styles.clear}>Clear all</react_native_1.Text>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>) : null} ListEmptyComponent={<ui_1.Card style={{ marginTop: theme_1.spacing.xl }}>
            <react_native_1.Text style={styles.empty}>No scans yet 🌱</react_native_1.Text>
          </ui_1.Card>} renderItem={function (_a) {
            var item = _a.item;
            return (<react_native_1.TouchableOpacity activeOpacity={0.75} onPress={function () {
                    var _a, _b;
                    var info = (0, diseaseData_1.getDiseaseInfo)((_a = item.label) !== null && _a !== void 0 ? _a : "".concat(item.crop, "___").concat(item.name));
                    navigation.navigate('Result', {
                        uri: item.uri,
                        prediction: { info: info, confidence: item.confidence, topK: (_b = item.topK) !== null && _b !== void 0 ? _b : [] },
                        saveToHistory: false,
                    });
                }}>
            <ui_1.Card style={styles.row}>
              <react_native_1.Image source={{ uri: item.uri }} style={styles.thumb}/>
              <react_native_1.View style={{ flex: 1 }}>
                <react_native_1.Text style={styles.crop}>{item.crop}</react_native_1.Text>
                <react_native_1.Text style={styles.name}>{item.name}</react_native_1.Text>
                <react_native_1.Text style={styles.date}>
                  {new Date(item.date).toLocaleDateString()} · {Math.round(item.confidence * 100)}%
                </react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View>
                <ui_1.SeverityBadge severity={item.severity}/>
                <react_native_1.TouchableOpacity onPress={function (e) {
                    var _a;
                    (_a = e.stopPropagation) === null || _a === void 0 ? void 0 : _a.call(e);
                    setDeleteId(item.id);
                }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.deleteBtn}>
                  <ui_1.TrashIcon size={16}/>
                </react_native_1.TouchableOpacity>
              </react_native_1.View>
            </ui_1.Card>
          </react_native_1.TouchableOpacity>);
        }}/>
      <ui_1.ConfirmSheet visible={deleteId !== null} title="Delete scan" message="Remove this scan from history?" confirmLabel="Delete" onConfirm={function () {
            remove(deleteId);
            setDeleteId(null);
        }} onClose={function () { return setDeleteId(null); }}/>
    </react_native_safe_area_context_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme_1.colors.bg },
    list: { padding: theme_1.spacing.lg, gap: theme_1.spacing.md },
    head: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme_1.spacing.xs },
    count: { color: theme_1.colors.textDim, fontSize: theme_1.font.small },
    clear: { color: theme_1.colors.danger, fontSize: theme_1.font.small, fontWeight: '600' },
    empty: { color: theme_1.colors.textDim, textAlign: 'center', fontSize: theme_1.font.body },
    row: { flexDirection: 'row', alignItems: 'center', gap: theme_1.spacing.md, padding: theme_1.spacing.md },
    thumb: { width: 56, height: 56, borderRadius: theme_1.radius.sm, backgroundColor: theme_1.colors.surfaceAlt },
    crop: { color: theme_1.colors.textDim, fontSize: theme_1.font.tiny, fontWeight: '700', letterSpacing: 1 },
    name: { color: theme_1.colors.text, fontSize: theme_1.font.body, fontWeight: '700' },
    date: { color: theme_1.colors.textDim, fontSize: theme_1.font.tiny, marginTop: 2 },
    deleteBtn: { padding: 4, alignSelf: 'flex-end' },
});
