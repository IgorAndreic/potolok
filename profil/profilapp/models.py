from django.db import models
from django.forms import ValidationError
from django.contrib.auth.models import AbstractUser


class Folder(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    public = models.BooleanField(default=False, verbose_name='Public')

    class Meta:
        verbose_name = "Folder"
        verbose_name_plural = "Folders"

    def get_full_path(self):
        path = []
        folder = self
        while folder:
            path.append(folder.name)
            folder = folder.parent
        return ' / '.join(reversed(path))

    def __str__(self):
        return self.name

class File(models.Model):
    name = models.CharField(max_length=255)
    folder = models.ForeignKey('Folder', on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='uploads/')

    def save(self, *args, **kwargs):
        if self.folder is None:
            raise ValidationError("Необходимо указать папку перед сохранением файла.")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
class Blueprint(models.Model):
    name = models.CharField(max_length=255)
    folder = models.ForeignKey('Folder', on_delete=models.CASCADE, related_name='blueprints')

    def __str__(self):
        return self.name
    
class Line(models.Model):
    blueprint = models.ForeignKey('Blueprint', on_delete=models.CASCADE, related_name='lines')
    points = models.JSONField()  
    length = models.FloatField()
    lengthmin = models.FloatField(null=True, blank=True)
    angle = models.FloatField(null=True, blank=True)
    anglemin = models.FloatField(null=True, blank=True)
    editable = models.BooleanField(default=True)
    text = models.CharField(max_length=25)
    textX = models.FloatField()
    textY = models.FloatField()
    textAngle = models.CharField(max_length=255)
    textAngleX = models.FloatField()
    textAngleY = models.FloatField()

    def __str__(self):
        return f"Line {self.id} of {self.blueprint.name}"
class Shape(models.Model):
    blueprint = models.ForeignKey('Blueprint', on_delete=models.CASCADE, related_name='shapes')
    shapeid = models.CharField(max_length=255)
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    rotation = models.FloatField()
    scaleX = models.FloatField()
    scaleY = models.FloatField()
    type = models.CharField(max_length=255)
    draggable = models.BooleanField(default=True)
    editable = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.type} shape at ({self.x}, {self.y})"


class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name='customuser',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='customuser',
    )