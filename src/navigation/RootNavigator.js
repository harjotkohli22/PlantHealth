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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootNavigator;
var react_1 = __importDefault(require("react"));
var native_1 = require("@react-navigation/native");
var native_stack_1 = require("@react-navigation/native-stack");
var theme_1 = require("../theme");
var HomeScreen_1 = __importDefault(require("../screens/HomeScreen"));
var ScanScreen_1 = __importDefault(require("../screens/ScanScreen"));
var ResultScreen_1 = __importDefault(require("../screens/ResultScreen"));
var HistoryScreen_1 = __importDefault(require("../screens/HistoryScreen"));
var Stack = (0, native_stack_1.createNativeStackNavigator)();
var navTheme = __assign(__assign({}, native_1.DefaultTheme), { colors: __assign(__assign({}, native_1.DefaultTheme.colors), { background: theme_1.colors.bg, card: theme_1.colors.bg, text: theme_1.colors.text }) });
function RootNavigator() {
    return (<native_1.NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: theme_1.colors.bg },
            headerTintColor: theme_1.colors.text,
            headerTitleStyle: { fontWeight: '800', fontSize: theme_1.font.h3 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: theme_1.colors.bg },
        }}>
        <Stack.Screen name="Home" component={HomeScreen_1.default} options={{ headerShown: false }}/>
        <Stack.Screen name="Scan" component={ScanScreen_1.default} options={{ headerTransparent: true, headerTitle: '', headerTintColor: '#fff' }}/>
        <Stack.Screen name="Result" component={ResultScreen_1.default} options={{ title: 'Diagnosis' }}/>
        <Stack.Screen name="History" component={HistoryScreen_1.default} options={{ title: 'Scan History' }}/>
      </Stack.Navigator>
    </native_1.NavigationContainer>);
}
