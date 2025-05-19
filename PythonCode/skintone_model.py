# model.py
import torch
import torch.nn as nn
import torchvision
from torchvision import transforms, models
import cv2
from PIL import Image
import numpy as np

# Model setup
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
class_names = ['dark', 'light', 'mid-dark', 'mid-light']

# Initialize and load the model
def load_model(model_path="skin_tone_model_dict.pt"):
    model_ft = torchvision.models.resnet152(pretrained=False)
    num_ftrs = model_ft.fc.in_features
    model_ft.fc = nn.Sequential(
        nn.Dropout(0.85),
        nn.Linear(num_ftrs, 512),
        nn.Dropout(0.7),
        nn.Linear(512, 128),
        nn.Dropout(0.7),
        nn.Linear(128, 4)
    )
    model_ft = nn.DataParallel(model_ft)
    model_ft.load_state_dict(torch.load(model_path, map_location=device))
    model_ft = model_ft.to(device)
    model_ft.eval()
    return model_ft

# In skintone_model.py
# def load_model(model_path):
#     device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
#     model_ft = models.resnet18(pretrained=False)  # Update pretrained as needed
#     num_ftrs = model_ft.fc.in_features
#     model_ft.fc = nn.Linear(num_ftrs, 3)  # Adjust based on your model
#     model_ft = model_ft.to(device)
#     # Add weights_only=False
#     model_ft.load_state_dict(torch.load(model_path, map_location=device, weights_only=False))
#     model_ft.eval()
#     return model_ft


# Preprocessing function
def preprocess_image_cv2(image):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    image_tensor = transform(Image.fromarray(image))
    image_tensor = image_tensor.unsqueeze(0)
    return image_tensor

# Prediction function
def predict_skin_tone(model, image):
    with torch.no_grad():
        input_tensor = preprocess_image_cv2(image)
        input_tensor = input_tensor.to(device)
        outputs = model(input_tensor)
        _, pred = torch.max(outputs, 1)
        predicted_class = class_names[pred.item()]
    return predicted_class