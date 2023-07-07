from django.urls import path
from image_extraction import views

urlpatterns = [
    path('extract/', views.extract_text, name='extract_text'),
]
