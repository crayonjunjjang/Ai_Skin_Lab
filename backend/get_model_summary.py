import os
os.environ['TF_USE_LEGACY_KERAS'] = '1' # Gradio에서 작동했던 플래그 사용
import tensorflow as tf
from tensorflow.keras.models import load_model

MODEL_PATH = 'model/keras.h5' # 모델 경로 수정

try:
    model = load_model(MODEL_PATH, compile=False)
    model.summary()
except Exception as e:
    print(f"Error loading model for summary: {e}")