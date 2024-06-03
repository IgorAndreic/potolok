import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'profil.settings')
django.setup()

from models import File

# Получаем файл по ID
file_instance = File.objects.get(id=1)

# Путь к файлу
file_path = file_instance.file.path
print(file_path)