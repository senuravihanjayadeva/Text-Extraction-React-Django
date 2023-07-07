from django.http import JsonResponse
import pytesseract
from PIL import Image

def extract_text(request):
    if request.method == 'POST' and request.FILES['image']:
        image = request.FILES['image']
        print(image)
        img = Image.open(image)
        text = pytesseract.image_to_string(img)
        return JsonResponse({'text': text})
    else:
        return JsonResponse({'error': 'No image file provided.'})
