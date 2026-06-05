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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var RootNavigator_1 = __importDefault(require("./src/navigation/RootNavigator"));
var HistoryContext_1 = require("./src/contexts/HistoryContext");
var classifier_1 = require("./src/services/classifier");
var theme_1 = require("./src/theme");
function App() {
    // Warm up the model on launch so the first scan is instant.
    (0, react_1.useEffect)(function () {
        classifier_1.classifier.load().catch(function () { });
    }, []);
    return (<react_native_gesture_handler_1.GestureHandlerRootView style={{ flex: 1 }}>
      <react_native_safe_area_context_1.SafeAreaProvider>
        <react_native_1.StatusBar barStyle="light-content" backgroundColor={theme_1.colors.bg}/>
        <HistoryContext_1.HistoryProvider>
          <RootNavigator_1.default />
        </HistoryContext_1.HistoryProvider>
      </react_native_safe_area_context_1.SafeAreaProvider>
    </react_native_gesture_handler_1.GestureHandlerRootView>);
}
