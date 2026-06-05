"use strict";
/**
 * Label map for the PlantVillage-style classifier (38 classes).
 * Index order MUST match the model's output tensor order.
 * Replace with your model's actual label order if you retrain.
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LABELS = void 0;
exports.getDiseaseInfo = getDiseaseInfo;
exports.LABELS = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry___Powdery_mildew',
    'Cherry___healthy',
    'Corn___Cercospora_leaf_spot',
    'Corn___Common_rust',
    'Corn___Northern_Leaf_Blight',
    'Corn___healthy',
    'Grape___Black_rot',
    'Grape___Esca',
    'Grape___Leaf_blight',
    'Grape___healthy',
    'Orange___Citrus_greening',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper___Bacterial_spot',
    'Pepper___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites',
    'Tomato___Target_Spot',
    'Tomato___Yellow_Leaf_Curl_Virus',
    'Tomato___Mosaic_virus',
    'Tomato___healthy',
];
var REMEDY_DB = {
    Apple_scab: {
        severity: 'moderate',
        summary: 'Fungal disease (Venturia inaequalis) causing olive-green to black velvety spots on leaves and fruit.',
        remedies: [
            'Apply a fungicide containing captan or myclobutanil at first sign.',
            'Remove and destroy fallen infected leaves to break the cycle.',
            'Prune to improve air circulation in the canopy.',
        ],
        prevention: [
            'Plant scab-resistant cultivars.',
            'Rake and dispose of leaf litter each autumn.',
            'Avoid overhead irrigation.',
        ],
    },
    Black_rot: {
        severity: 'severe',
        summary: 'Fungal infection causing leaf spots, fruit rot and cankers on branches.',
        remedies: [
            'Prune out cankered and dead wood well below the infection.',
            'Apply captan or thiophanate-methyl fungicide on a schedule.',
            'Remove mummified fruit from the tree and ground.',
        ],
        prevention: ['Sanitize pruning tools.', 'Maintain tree vigor with balanced fertilization.'],
    },
    Late_blight: {
        severity: 'severe',
        summary: 'Aggressive water-mold (Phytophthora infestans) that can destroy a crop in days under cool, wet conditions.',
        remedies: [
            'Remove and destroy infected plants immediately — do not compost.',
            'Apply chlorothalonil or copper-based fungicide preventively to remaining plants.',
            'Harvest healthy tubers/fruit early if outbreak is spreading.',
        ],
        prevention: ['Use certified disease-free seed.', 'Space plants for airflow.', 'Avoid evening watering.'],
    },
    Early_blight: {
        severity: 'moderate',
        summary: 'Fungal disease (Alternaria) producing concentric "target" rings on older leaves.',
        remedies: [
            'Remove affected lower leaves promptly.',
            'Apply chlorothalonil or mancozeb fungicide.',
            'Mulch to prevent soil splash onto foliage.',
        ],
        prevention: ['Rotate crops on a 2–3 year cycle.', 'Stake plants off the ground.'],
    },
    Powdery_mildew: {
        severity: 'mild',
        summary: 'White powdery fungal growth on leaf surfaces, thriving in warm dry days and humid nights.',
        remedies: [
            'Spray with potassium bicarbonate or a 1:10 milk-water solution.',
            'Apply sulfur-based fungicide for heavier infections.',
            'Remove the most heavily coated leaves.',
        ],
        prevention: ['Improve spacing and sunlight.', 'Avoid excess nitrogen fertilizer.'],
    },
    Common_rust: {
        severity: 'mild',
        summary: 'Reddish-brown pustules on leaf surfaces caused by Puccinia fungi.',
        remedies: ['Apply a labeled fungicide if severe.', 'Remove heavily infected leaves.'],
        prevention: ['Plant resistant hybrids.', 'Ensure good field drainage.'],
    },
    Bacterial_spot: {
        severity: 'moderate',
        summary: 'Bacterial infection causing small water-soaked spots that turn brown with yellow halos.',
        remedies: [
            'Apply copper-based bactericide early.',
            'Remove and destroy infected foliage.',
            'Avoid working with plants when wet.',
        ],
        prevention: ['Use pathogen-free seed.', 'Rotate crops.', 'Drip irrigate instead of overhead.'],
    },
    Spider_mites: {
        severity: 'mild',
        summary: 'Tiny pests causing stippling, webbing and bronzing of leaves in hot dry conditions.',
        remedies: [
            'Spray foliage forcefully with water to dislodge mites.',
            'Apply insecticidal soap or neem oil to undersides of leaves.',
            'Introduce predatory mites as biological control.',
        ],
        prevention: ['Keep plants well watered.', 'Avoid broad-spectrum insecticides that kill predators.'],
    },
    Citrus_greening: {
        severity: 'severe',
        summary: 'Incurable bacterial disease (HLB) spread by psyllids; causes blotchy mottling and bitter fruit.',
        remedies: [
            'There is no cure — remove and destroy infected trees to protect others.',
            'Control psyllid vectors with approved insecticides.',
        ],
        prevention: ['Buy certified disease-free nursery stock.', 'Monitor for and control psyllids.'],
    },
    Yellow_Leaf_Curl_Virus: {
        severity: 'severe',
        summary: 'Whitefly-transmitted virus causing upward leaf curling, yellowing and stunting.',
        remedies: [
            'Remove and bag infected plants — there is no chemical cure.',
            'Control whitefly populations with insecticidal soap or neem.',
        ],
        prevention: ['Use virus-resistant varieties.', 'Install reflective mulch and insect netting.'],
    },
    Mosaic_virus: {
        severity: 'moderate',
        summary: 'Virus causing mottled light/dark green patterns and distorted growth.',
        remedies: ['Remove infected plants.', 'Disinfect hands and tools after handling.'],
        prevention: ['Control aphid vectors.', 'Avoid tobacco use near plants (TMV).'],
    },
};
function fallback(label) {
    var _a;
    var _b = label.split('___'), crop = _b[0], rawName = _b[1];
    var healthy = /healthy/i.test(rawName !== null && rawName !== void 0 ? rawName : '');
    return {
        label: label,
        crop: (_a = crop === null || crop === void 0 ? void 0 : crop.replace(/_/g, ' ')) !== null && _a !== void 0 ? _a : 'Plant',
        name: healthy ? 'Healthy' : (rawName !== null && rawName !== void 0 ? rawName : 'Unknown').replace(/_/g, ' '),
        healthy: healthy,
        severity: healthy ? 'healthy' : 'moderate',
        summary: healthy
            ? 'No disease detected. The plant appears healthy.'
            : 'A plant condition was detected. Follow general management practices below.',
        remedies: healthy
            ? ['Keep up current care routine.', 'Continue monitoring weekly.']
            : ['Isolate the plant to limit spread.', 'Remove affected foliage.', 'Consult a local extension service.'],
        prevention: ['Water at the base, not overhead.', 'Ensure good airflow and spacing.', 'Rotate crops seasonally.'],
    };
}
function getDiseaseInfo(label) {
    var base = fallback(label);
    var key = label.split('___')[1];
    var extra = key ? REMEDY_DB[key] : undefined;
    return __assign(__assign(__assign({}, base), extra), { label: label, crop: base.crop, name: base.name, healthy: base.healthy });
}
