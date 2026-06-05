"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.severityColor = exports.font = exports.radius = exports.spacing = exports.colors = void 0;
exports.colors = {
    bg: '#0F1A14',
    surface: '#16241B',
    surfaceAlt: '#1E3326',
    primary: '#4ADE80',
    primaryDark: '#22C55E',
    accent: '#FACC15',
    danger: '#F87171',
    warn: '#FB923C',
    text: '#ECFDF5',
    textDim: '#9CC5AC',
    border: '#274A33',
};
exports.spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};
exports.radius = {
    sm: 8,
    md: 16,
    lg: 24,
    pill: 999,
};
exports.font = {
    h1: 30,
    h2: 22,
    h3: 18,
    body: 15,
    small: 13,
    tiny: 11,
};
var severityColor = function (s) {
    switch (s) {
        case 'healthy':
            return exports.colors.primary;
        case 'mild':
            return exports.colors.accent;
        case 'moderate':
            return exports.colors.warn;
        case 'severe':
            return exports.colors.danger;
    }
};
exports.severityColor = severityColor;
