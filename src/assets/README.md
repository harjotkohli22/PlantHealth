# Model asset

Place your TFLite classifier here as:

    plant_disease_model.tflite

## Getting a model

**Fastest path** — use a pre-trained PlantVillage model:
1. Download a Keras/SavedModel trained on the PlantVillage dataset (38 classes),
   e.g. a MobileNetV2 or EfficientNet-Lite fine-tune.
2. Convert to TFLite (quantized for mobile):

```python
import tensorflow as tf
converter = tf.lite.TFLiteConverter.from_saved_model("saved_model_dir")
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()
open("plant_disease_model.tflite", "wb").write(tflite_model)
```

3. Input must be 224x224x3 float32, output a 38-length vector.
   If your label order differs, update LABELS in src/services/diseaseData.ts
   and MEAN/STD in src/services/classifier.ts.
