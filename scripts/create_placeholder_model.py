"""
Creates a MobileNetV2-based TFLite model with ImageNet-pretrained weights
and a randomly initialized 38-class head (PlantVillage classes).

This is a DEVELOPMENT PLACEHOLDER — the plant disease head is untrained.
Replace this file with a properly fine-tuned model for production.

Usage:
    pip install tensorflow
    python scripts/create_placeholder_model.py
"""

import sys

try:
    import tensorflow as tf
except ImportError:
    print("TensorFlow not found. Install it with:")
    print("  pip install tensorflow")
    sys.exit(1)

import pathlib

NUM_CLASSES = 38
INPUT_SIZE = 224
OUT_PATH = pathlib.Path(__file__).parent.parent / "src" / "assets" / "plant_disease_model.tflite"

print(f"TensorFlow {tf.__version__}")
print("Building MobileNetV2 (ImageNet weights) + 38-class head...")

base = tf.keras.applications.MobileNetV2(
    input_shape=(INPUT_SIZE, INPUT_SIZE, 3),
    include_top=False,
    weights="imagenet",
)
base.trainable = False

inputs = tf.keras.Input(shape=(INPUT_SIZE, INPUT_SIZE, 3))
x = base(inputs, training=False)
x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.Dense(256, activation="relu")(x)
outputs = tf.keras.layers.Dense(NUM_CLASSES, activation="softmax")(x)
model = tf.keras.Model(inputs, outputs)

print(f"Parameters: {model.count_params():,}")
print("Converting to TFLite (dynamic-range quantization)...")

converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_bytes = converter.convert()

OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
OUT_PATH.write_bytes(tflite_bytes)

size_mb = len(tflite_bytes) / 1_048_576
print(f"\nSaved to: {OUT_PATH}")
print(f"Size: {size_mb:.1f} MB")
print()
print("NOTE: This model uses ImageNet-pretrained features but the")
print("plant-disease classification head is randomly initialized.")
print("For accurate predictions, fine-tune on the PlantVillage dataset.")
