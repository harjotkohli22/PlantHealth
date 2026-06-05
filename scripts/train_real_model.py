"""
Fine-tunes MobileNetV2 on the PlantVillage 38-class dataset and exports TFLite.

Requirements:
    pip install tensorflow kaggle

Kaggle dataset: "emmarex/plantdisease"
  - Contains PlantVillage colour images in 38 subdirectories
  - Each subdirectory name matches the LABELS list in diseaseData.ts

Usage:
    1. Set up your Kaggle API key (~/.kaggle/kaggle.json)
    2. python scripts/train_real_model.py

The final model is written to src/assets/plant_disease_model.tflite
"""

import subprocess, sys, pathlib, os

def install(pkg):
    subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])

try:
    import tensorflow as tf
except ImportError:
    print("Installing tensorflow...")
    install("tensorflow")
    import tensorflow as tf

try:
    import kaggle  # noqa
except ImportError:
    print("Installing kaggle...")
    install("kaggle")

import zipfile

ROOT = pathlib.Path(__file__).parent.parent
DATASET_DIR = ROOT / "scripts" / "_plantvillage_data"
OUT_PATH = ROOT / "src" / "assets" / "plant_disease_model.tflite"

INPUT_SIZE = 224
BATCH_SIZE = 32
EPOCHS_HEAD = 5      # train head only
EPOCHS_FINE = 10     # unfreeze top layers and fine-tune

# ── 1. Download dataset ────────────────────────────────────────────────────────
if not DATASET_DIR.exists():
    print("Downloading PlantVillage dataset from Kaggle...")
    DATASET_DIR.mkdir(parents=True, exist_ok=True)
    subprocess.check_call([
        "kaggle", "datasets", "download",
        "-d", "emmarex/plantdisease",
        "-p", str(DATASET_DIR),
    ])
    zip_path = DATASET_DIR / "plantdisease.zip"
    print("Extracting...")
    with zipfile.ZipFile(zip_path) as z:
        z.extractall(DATASET_DIR)
    zip_path.unlink()

# The extracted folder varies; find the directory that contains class subdirs
data_root = next(
    (p for p in DATASET_DIR.rglob("*") if p.is_dir() and len(list(p.iterdir())) >= 38),
    DATASET_DIR,
)
print(f"Data root: {data_root}  ({len(list(data_root.iterdir()))} classes)")

# ── 2. Build tf.data pipelines ─────────────────────────────────────────────────
train_ds = tf.keras.utils.image_dataset_from_directory(
    data_root,
    validation_split=0.15,
    subset="training",
    seed=42,
    image_size=(INPUT_SIZE, INPUT_SIZE),
    batch_size=BATCH_SIZE,
)
val_ds = tf.keras.utils.image_dataset_from_directory(
    data_root,
    validation_split=0.15,
    subset="validation",
    seed=42,
    image_size=(INPUT_SIZE, INPUT_SIZE),
    batch_size=BATCH_SIZE,
)

num_classes = len(train_ds.class_names)
print(f"Classes found: {num_classes}")
print(train_ds.class_names)

AUTOTUNE = tf.data.AUTOTUNE

def preprocess(img, label):
    img = tf.cast(img, tf.float32)
    # ImageNet normalization (matches classifier.ts MEAN/STD)
    mean = tf.constant([0.485, 0.456, 0.406]) * 255.0
    std  = tf.constant([0.229, 0.224, 0.225]) * 255.0
    img = (img - mean) / std
    return img, label

augment = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
])

train_ds = (
    train_ds
    .map(lambda x, y: (augment(x, training=True), y), num_parallel_calls=AUTOTUNE)
    .map(preprocess, num_parallel_calls=AUTOTUNE)
    .prefetch(AUTOTUNE)
)
val_ds = val_ds.map(preprocess, num_parallel_calls=AUTOTUNE).prefetch(AUTOTUNE)

# ── 3. Model ───────────────────────────────────────────────────────────────────
base = tf.keras.applications.MobileNetV2(
    input_shape=(INPUT_SIZE, INPUT_SIZE, 3),
    include_top=False,
    weights="imagenet",
)
base.trainable = False

inputs  = tf.keras.Input(shape=(INPUT_SIZE, INPUT_SIZE, 3))
x       = base(inputs, training=False)
x       = tf.keras.layers.GlobalAveragePooling2D()(x)
x       = tf.keras.layers.Dense(256, activation="relu")(x)
x       = tf.keras.layers.Dropout(0.3)(x)
outputs = tf.keras.layers.Dense(num_classes, activation="softmax")(x)
model   = tf.keras.Model(inputs, outputs)

# ── 4. Phase 1 — train head only ──────────────────────────────────────────────
model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-3),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
print(f"\n── Phase 1: head only ({EPOCHS_HEAD} epochs) ──")
model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS_HEAD)

# ── 5. Phase 2 — fine-tune top layers ─────────────────────────────────────────
base.trainable = True
# Freeze all except the last 30 layers
for layer in base.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-4),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
print(f"\n── Phase 2: fine-tune top 30 layers ({EPOCHS_FINE} epochs) ──")
model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS_FINE)

# ── 6. Export TFLite ───────────────────────────────────────────────────────────
print("\nConverting to TFLite...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_bytes = converter.convert()

OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
OUT_PATH.write_bytes(tflite_bytes)

size_mb = len(tflite_bytes) / 1_048_576
print(f"\nSaved: {OUT_PATH}  ({size_mb:.1f} MB)")
print("Done! Copy the .tflite file into src/assets/ and rebuild the app.")
