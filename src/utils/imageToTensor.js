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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageFileToTensor = imageFileToTensor;
var react_native_fs_1 = __importDefault(require("react-native-fs"));
var jpeg_js_1 = __importDefault(require("jpeg-js"));
var classifier_1 = require("../services/classifier");
function imageFileToTensor(uri) {
    return __awaiter(this, void 0, void 0, function () {
        var b64, binary, bytes, i, _a, width, height, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, react_native_fs_1.default.readFile(uri.replace('file://', ''), 'base64')];
                case 1:
                    b64 = _b.sent();
                    binary = atob(b64);
                    bytes = new Uint8Array(binary.length);
                    for (i = 0; i < binary.length; i++)
                        bytes[i] = binary.charCodeAt(i);
                    _a = jpeg_js_1.default.decode(bytes.buffer, { useTArray: true }), width = _a.width, height = _a.height, data = _a.data;
                    return [2 /*return*/, resizeRgbaToRgb(data, width, height, classifier_1.MODEL_INPUT_SIZE)];
            }
        });
    });
}
/** Nearest-neighbor resize RGBA(or RGB) -> RGB target x target. */
function resizeRgbaToRgb(src, srcW, srcH, target) {
    var channels = src.length / (srcW * srcH) >= 4 ? 4 : 3;
    var out = new Uint8Array(target * target * 3);
    for (var y = 0; y < target; y++) {
        var sy = Math.floor((y * srcH) / target);
        for (var x = 0; x < target; x++) {
            var sx = Math.floor((x * srcW) / target);
            var si = (sy * srcW + sx) * channels;
            var di = (y * target + x) * 3;
            out[di] = src[si];
            out[di + 1] = src[si + 1];
            out[di + 2] = src[si + 2];
        }
    }
    return out;
}
