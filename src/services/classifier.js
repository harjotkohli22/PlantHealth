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
exports.MODEL_INPUT_SIZE = exports.classifier = void 0;
var react_native_fast_tflite_1 = require("react-native-fast-tflite");
var diseaseData_1 = require("./diseaseData");
var MODEL_INPUT_SIZE = 224; // model expects 224x224x3
exports.MODEL_INPUT_SIZE = MODEL_INPUT_SIZE;
var PlantClassifier = /** @class */ (function () {
    function PlantClassifier() {
        this.model = null;
        this.loading = null;
    }
    /** Lazy-load and cache the model. GPU delegate on Android, CoreML on iOS. */
    PlantClassifier.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.model)
                    return [2 /*return*/, this.model];
                if (this.loading)
                    return [2 /*return*/, this.loading];
                this.loading = (0, react_native_fast_tflite_1.loadTensorflowModel)(require('../assets/plant_disease_model.tflite'), 'default').then(function (m) {
                    _this.model = m;
                    return m;
                });
                return [2 /*return*/, this.loading];
            });
        });
    };
    PlantClassifier.prototype.isReady = function () {
        return this.model !== null;
    };
    /**
     * Run inference on a Float32 RGB buffer already resized to 224x224.
     * `rgb` is length 224*224*3 with values 0..255.
     */
    PlantClassifier.prototype.classify = function (rgb) {
        return __awaiter(this, void 0, void 0, function () {
            var model, input, outputs, logits, probs, ranked, top;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        model = _a.sent();
                        input = this.normalize(rgb);
                        outputs = model.runSync([input]);
                        logits = outputs[0];
                        probs = softmaxIfNeeded(logits);
                        ranked = Array.from(probs)
                            .map(function (confidence, i) { var _a; return ({ label: (_a = diseaseData_1.LABELS[i]) !== null && _a !== void 0 ? _a : "class_".concat(i), confidence: confidence }); })
                            .sort(function (a, b) { return b.confidence - a.confidence; });
                        top = ranked[0];
                        return [2 /*return*/, {
                                info: (0, diseaseData_1.getDiseaseInfo)(top.label),
                                confidence: top.confidence,
                                topK: ranked.slice(0, 3),
                            }];
                }
            });
        });
    };
    PlantClassifier.prototype.normalize = function (rgb) {
        var out = new Float32Array(MODEL_INPUT_SIZE * MODEL_INPUT_SIZE * 3);
        for (var i = 0; i < out.length; i++) {
            out[i] = rgb[i] / 255;
        }
        return out;
    };
    return PlantClassifier;
}());
function softmaxIfNeeded(arr) {
    var sum = arr.reduce(function (a, b) { return a + b; }, 0);
    // already-normalized probabilities sum ~1 and are non-negative
    var looksLikeProbs = sum > 0.95 && sum < 1.05 && arr.every(function (v) { return v >= 0 && v <= 1; });
    if (looksLikeProbs)
        return arr;
    var max = -Infinity;
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var v = arr_1[_i];
        max = Math.max(max, v);
    }
    var exp = arr.map(function (v) { return Math.exp(v - max); });
    var expSum = exp.reduce(function (a, b) { return a + b; }, 0);
    return Float32Array.from(exp.map(function (v) { return v / expSum; }));
}
exports.classifier = new PlantClassifier();
