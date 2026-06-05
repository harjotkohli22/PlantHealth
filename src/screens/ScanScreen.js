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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScanScreen;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var react_native_vision_camera_1 = require("react-native-vision-camera");
var react_native_image_picker_1 = require("react-native-image-picker");
var theme_1 = require("../theme");
var ui_1 = require("../components/ui");
var useFrameClassifier_1 = require("../hooks/useFrameClassifier");
var classifier_1 = require("../services/classifier");
var imageToTensor_1 = require("../utils/imageToTensor");
var react_2 = require("react");
var RETICLE_SIZE = 260;
var CORNER_LEN = 28;
var CORNER_THICK = 3;
function ScanScreen(_a) {
    var _this = this;
    var _b;
    var navigation = _a.navigation, route = _a.route;
    var uploadMode = ((_b = route === null || route === void 0 ? void 0 : route.params) === null || _b === void 0 ? void 0 : _b.mode) === 'upload';
    var _c = (0, react_native_vision_camera_1.useCameraPermission)(), hasPermission = _c.hasPermission, requestPermission = _c.requestPermission;
    var device = (0, react_native_vision_camera_1.useCameraDevice)('back');
    var camera = (0, react_1.useRef)(null);
    var _d = (0, react_2.useState)(!uploadMode), live = _d[0], setLive = _d[1];
    var _e = (0, react_2.useState)(false), busy = _e[0], setBusy = _e[1];
    var _f = (0, useFrameClassifier_1.useFrameClassifier)(live), frameProcessor = _f.frameProcessor, prediction = _f.prediction, running = _f.running, setRunning = _f.setRunning, isPlantDetected = _f.isPlantDetected;
    // 0 = no plant, 1 = plant detected
    var detected = (0, react_native_reanimated_1.useSharedValue)(0);
    // 0..1 repeating scan line
    var scanY = (0, react_native_reanimated_1.useSharedValue)(0);
    (0, react_1.useEffect)(function () {
        detected.value = (0, react_native_reanimated_1.withTiming)(isPlantDetected ? 1 : 0, { duration: 400 });
    }, [isPlantDetected, detected]);
    (0, react_1.useEffect)(function () {
        if (!live)
            return;
        scanY.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(1, { duration: 1600, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) }), (0, react_native_reanimated_1.withTiming)(0, { duration: 1600, easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease) })), -1);
    }, [live, scanY]);
    var cornerColor = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        borderColor: (0, react_native_reanimated_1.interpolateColor)(detected.value, [0, 1], ['rgba(255,255,255,0.55)', '#4ade80']),
    }); });
    var scanLineStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        top: scanY.value * RETICLE_SIZE,
        opacity: live ? 0.55 : 0,
    }); });
    (0, react_1.useEffect)(function () {
        if (!hasPermission)
            requestPermission();
    }, [hasPermission, requestPermission]);
    (0, react_1.useEffect)(function () {
        if (uploadMode)
            pickImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var capture = function () { return __awaiter(_this, void 0, void 0, function () {
        var photo, uri, tensor, result, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!camera.current)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 7]);
                    setBusy(true);
                    setLive(false);
                    return [4 /*yield*/, camera.current.takePhoto({ flash: 'off' })];
                case 2:
                    photo = _b.sent();
                    uri = "file://".concat(photo.path);
                    return [4 /*yield*/, (0, imageToTensor_1.imageFileToTensor)(uri)];
                case 3:
                    tensor = _b.sent();
                    return [4 /*yield*/, classifier_1.classifier.classify(tensor)];
                case 4:
                    result = _b.sent();
                    navigation.navigate('Result', { uri: uri, prediction: result });
                    return [3 /*break*/, 7];
                case 5:
                    _a = _b.sent();
                    setLive(true);
                    return [3 /*break*/, 7];
                case 6:
                    setBusy(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var pickImage = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, asset, tensor, result, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, react_native_image_picker_1.launchImageLibrary)({ mediaType: 'photo', quality: 1 })];
                case 1:
                    res = _c.sent();
                    asset = (_b = res.assets) === null || _b === void 0 ? void 0 : _b[0];
                    if (!(asset === null || asset === void 0 ? void 0 : asset.uri)) {
                        if (uploadMode)
                            navigation.goBack();
                        return [2 /*return*/];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 5, 6, 7]);
                    setBusy(true);
                    return [4 /*yield*/, (0, imageToTensor_1.imageFileToTensor)(asset.uri)];
                case 3:
                    tensor = _c.sent();
                    return [4 /*yield*/, classifier_1.classifier.classify(tensor)];
                case 4:
                    result = _c.sent();
                    navigation.navigate('Result', { uri: asset.uri, prediction: result });
                    return [3 /*break*/, 7];
                case 5:
                    _a = _c.sent();
                    alert('Failed to analyze the image. Please try again.');
                    return [3 /*break*/, 7];
                case 6:
                    setBusy(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    if (!device || !hasPermission) {
        return (<react_native_safe_area_context_1.SafeAreaView style={styles.center}>
        <react_native_1.Text style={styles.permText}>
          {!hasPermission ? 'Camera permission needed to scan plants.' : 'No camera available.'}
        </react_native_1.Text>
        <react_native_1.View style={{ height: theme_1.spacing.md }}/>
        <ui_1.Button label="Grant permission" onPress={requestPermission}/>
        <react_native_1.View style={{ height: theme_1.spacing.sm }}/>
        <ui_1.Button label="Upload instead" variant="ghost" onPress={pickImage}/>
      </react_native_safe_area_context_1.SafeAreaView>);
    }
    var hintText = live
        ? isPlantDetected
            ? '🌿 Leaf detected — tap to analyze'
            : 'Center a single leaf in the frame'
        : 'Live preview paused';
    return (<react_native_1.View style={styles.root}>
      <react_native_vision_camera_1.Camera ref={camera} style={react_native_1.StyleSheet.absoluteFill} device={device} isActive={live} photo frameProcessor={live ? frameProcessor : undefined}/>

      {/* animated corner-bracket reticle */}
      <react_native_1.View style={styles.reticleWrap} pointerEvents="none">
        <react_native_1.View style={styles.reticleArea}>
          {/* corners */}
          <react_native_reanimated_1.default.View style={[styles.corner, styles.tl, cornerColor]}/>
          <react_native_reanimated_1.default.View style={[styles.corner, styles.tr, cornerColor]}/>
          <react_native_reanimated_1.default.View style={[styles.corner, styles.bl, cornerColor]}/>
          <react_native_reanimated_1.default.View style={[styles.corner, styles.br, cornerColor]}/>

          {/* scan line */}
          <react_native_reanimated_1.default.View style={[styles.scanLine, scanLineStyle]}/>
        </react_native_1.View>

        <react_native_1.Text style={styles.hint}>{hintText}</react_native_1.Text>
      </react_native_1.View>

      {/* live prediction pill */}
      {live && prediction && (<react_native_safe_area_context_1.SafeAreaView style={styles.livePillWrap} edges={['top']}>
          <react_native_1.View style={[styles.livePill, isPlantDetected && styles.livePillActive]}>
            <react_native_1.View style={[styles.liveDot, isPlantDetected && styles.liveDotActive]}/>
            <react_native_1.Text style={styles.livePillText}>
              {prediction.info.crop} · {prediction.info.name} ·{' '}
              {Math.round(prediction.confidence * 100)}%
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_safe_area_context_1.SafeAreaView>)}

      <react_native_safe_area_context_1.SafeAreaView style={styles.controls} edges={['bottom']}>
        <react_native_1.TouchableOpacity style={styles.sideBtn} onPress={pickImage}>
          <react_native_1.Text style={styles.sideIcon}>🖼️</react_native_1.Text>
        </react_native_1.TouchableOpacity>

        <react_native_1.TouchableOpacity style={[styles.shutter, isPlantDetected && styles.shutterActive]} onPress={capture} disabled={busy}>
          {busy ? (<react_native_1.ActivityIndicator color="#08130C"/>) : (<react_native_1.View style={[styles.shutterInner, isPlantDetected && styles.shutterInnerActive]}/>)}
        </react_native_1.TouchableOpacity>

        <react_native_1.TouchableOpacity style={styles.sideBtn} onPress={function () { return setLive(function (v) { return !v; }); }}>
          <react_native_1.Text style={styles.sideIcon}>{live ? '⏸️' : '▶️'}</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_safe_area_context_1.SafeAreaView>

      {running && (<react_native_1.View style={styles.analyzing} pointerEvents="none">
          <react_native_1.Text style={styles.analyzingText}>Analyzing…</react_native_1.Text>
        </react_native_1.View>)}
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    root: { flex: 1, backgroundColor: '#000' },
    center: {
        flex: 1,
        backgroundColor: theme_1.colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme_1.spacing.xl,
    },
    permText: { color: theme_1.colors.text, fontSize: theme_1.font.body, textAlign: 'center' },
    reticleWrap: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { alignItems: 'center', justifyContent: 'center' }),
    reticleArea: {
        width: RETICLE_SIZE,
        height: RETICLE_SIZE,
        overflow: 'hidden',
    },
    // corner brackets — each is positioned at a corner, L-shaped via border
    corner: {
        position: 'absolute',
        width: CORNER_LEN,
        height: CORNER_LEN,
        borderColor: 'rgba(255,255,255,0.55)',
    },
    tl: {
        top: 0,
        left: 0,
        borderTopWidth: CORNER_THICK,
        borderLeftWidth: CORNER_THICK,
        borderTopLeftRadius: 4,
    },
    tr: {
        top: 0,
        right: 0,
        borderTopWidth: CORNER_THICK,
        borderRightWidth: CORNER_THICK,
        borderTopRightRadius: 4,
    },
    bl: {
        bottom: 0,
        left: 0,
        borderBottomWidth: CORNER_THICK,
        borderLeftWidth: CORNER_THICK,
        borderBottomLeftRadius: 4,
    },
    br: {
        bottom: 0,
        right: 0,
        borderBottomWidth: CORNER_THICK,
        borderRightWidth: CORNER_THICK,
        borderBottomRightRadius: 4,
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#4ade80',
    },
    hint: { color: '#fff', marginTop: theme_1.spacing.md, fontSize: theme_1.font.small, opacity: 0.9 },
    livePillWrap: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
    livePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme_1.spacing.sm,
        backgroundColor: 'rgba(8,19,12,0.85)',
        paddingHorizontal: theme_1.spacing.md,
        paddingVertical: theme_1.spacing.sm,
        borderRadius: theme_1.radius.pill,
        marginTop: theme_1.spacing.md,
    },
    livePillActive: { backgroundColor: 'rgba(22,60,30,0.92)' },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme_1.colors.primary },
    liveDotActive: { backgroundColor: '#4ade80' },
    livePillText: { color: theme_1.colors.text, fontSize: theme_1.font.small, fontWeight: '600' },
    controls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: theme_1.spacing.lg,
        paddingTop: theme_1.spacing.lg,
    },
    sideBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sideIcon: { fontSize: 22 },
    shutter: {
        width: 78,
        height: 78,
        borderRadius: 39,
        backgroundColor: theme_1.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    shutterActive: {
        borderColor: '#4ade80',
        shadowColor: '#4ade80',
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 8,
    },
    shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: theme_1.colors.primary },
    shutterInnerActive: { backgroundColor: '#16a34a' },
    analyzing: {
        position: 'absolute',
        alignSelf: 'center',
        top: '45%',
        backgroundColor: 'rgba(8,19,12,0.8)',
        paddingHorizontal: theme_1.spacing.lg,
        paddingVertical: theme_1.spacing.sm,
        borderRadius: theme_1.radius.pill,
    },
    analyzingText: { color: theme_1.colors.text, fontWeight: '600' },
});
