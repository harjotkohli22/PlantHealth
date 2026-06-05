"use strict";
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
exports.useFrameClassifier = useFrameClassifier;
var react_1 = require("react");
var react_native_vision_camera_1 = require("react-native-vision-camera");
var vision_camera_resize_plugin_1 = require("vision-camera-resize-plugin");
var react_native_worklets_core_1 = require("react-native-worklets-core");
var classifier_1 = require("../services/classifier");
// Minimum fraction of pixels with leaf-green hue to consider a leaf in frame.
var LEAF_GREEN_RATIO = 0.18;
/**
 * Runs in the worklet thread — no JS bridge.
 * Counts RGB pixels that fall in the green/yellow-green range typical of leaves.
 */
function leafGreenRatio(buf) {
    'worklet';
    var green = 0;
    var pixels = buf.length / 3;
    for (var i = 0; i < buf.length; i += 3) {
        var r = buf[i];
        var g = buf[i + 1];
        var b = buf[i + 2];
        // Green channel must dominate both red and blue, and have enough brightness
        if (g > r + 15 && g > b + 15 && g > 45 && g < 245)
            green++;
    }
    return green / pixels;
}
function useFrameClassifier(enabled, intervalMs) {
    var _this = this;
    if (intervalMs === void 0) { intervalMs = 1200; }
    var resize = (0, vision_camera_resize_plugin_1.useResizePlugin)().resize;
    var _a = (0, react_1.useState)(null), prediction = _a[0], setPrediction = _a[1];
    var _b = (0, react_1.useState)(false), running = _b[0], setRunning = _b[1];
    var _c = (0, react_1.useState)(false), isPlantDetected = _c[0], setIsPlantDetected = _c[1];
    var onResult = react_native_worklets_core_1.Worklets.createRunOnJS(function (p, leafDetected) {
        setPrediction(p);
        setIsPlantDetected(leafDetected);
        setRunning(false);
    });
    var runClassify = (0, react_1.useCallback)(function (buffer, leafDetected) { return __awaiter(_this, void 0, void 0, function () {
        var p, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, classifier_1.classifier.classify(buffer)];
                case 1:
                    p = _b.sent();
                    onResult(p, leafDetected);
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    setRunning(false);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [onResult]);
    var runClassifyJS = react_native_worklets_core_1.Worklets.createRunOnJS(runClassify);
    var frameProcessor = (0, react_native_vision_camera_1.useFrameProcessor)(function (frame) {
        'worklet';
        var _a;
        if (!enabled)
            return;
        var now = Date.now();
        // @ts-ignore persistent shared value across frames
        if (now - ((_a = globalThis.__lastSample) !== null && _a !== void 0 ? _a : 0) < intervalMs)
            return;
        // @ts-ignore
        globalThis.__lastSample = now;
        var resized = resize(frame, {
            scale: { width: classifier_1.MODEL_INPUT_SIZE, height: classifier_1.MODEL_INPUT_SIZE },
            pixelFormat: 'rgb',
            dataType: 'uint8',
            rotation: '90deg',
        });
        var buf = new Uint8Array(resized.buffer);
        var ratio = leafGreenRatio(buf);
        var leafDetected = ratio >= LEAF_GREEN_RATIO;
        runClassifyJS(buf, leafDetected);
    }, [enabled, resize, runClassifyJS, intervalMs]);
    return { frameProcessor: frameProcessor, prediction: prediction, running: running, setRunning: setRunning, isPlantDetected: isPlantDetected };
}
