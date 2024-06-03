from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Folder, File, Blueprint, Line, Shape, CustomUser

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'public', 'get_full_path']

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ['name', 'folder', 'file']

@admin.register(Blueprint)
class BlueprintAdmin(admin.ModelAdmin):
    list_display = ['name', 'folder', 'lines']

@admin.register(Line)
class LineAdmin(admin.ModelAdmin):
    list_display = ['blueprint', 'points', 'length', 'lengthmin', 'angle', 'anglemin', 'editable', 'text', 'textX', 'textY', 'textAngle', 'textAngleX', 'textAngleY']   

@admin.register(Shape)
class ShapeAdmin(admin.ModelAdmin):
    list_display = ['blueprint', 'x', 'y', 'width', 'height', 'type', 'draggable', 'editable']


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('is_admin',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('is_admin',)}),
    )
    (None, {'fields': ('is_admin',)}),
admin.site.register(CustomUser, CustomUserAdmin)
    
