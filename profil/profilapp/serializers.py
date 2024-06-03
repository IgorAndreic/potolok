from rest_framework import serializers
from .models import Folder, File, Blueprint, Line, Shape
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission

class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = ['points', 'length', 'lengthmin', 'angle', 'anglemin', 'editable', 'text', 'textX', 'textY', 'textAngle', 'textAngleX', 'textAngleY']

class ShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shape
        fields = ['shapeid', 'x', 'y', 'width', 'height', 'rotation', 'scaleX', 'scaleY', 'type', 'draggable', 'editable']

class BlueprintSerializer(serializers.ModelSerializer):
    lines = LineSerializer(many=True)
    shapes = ShapeSerializer(many=True)

    class Meta:
        model = Blueprint
        fields = ['id', 'name', 'folder', 'lines', 'shapes']

    def create(self, validated_data):
        lines_data = validated_data.pop('lines')
        shapes_data = validated_data.pop('shapes')
        blueprint = Blueprint.objects.create(**validated_data)

        for line_data in lines_data:
            Line.objects.create(blueprint=blueprint, **line_data)

        for shape_data in shapes_data:
            Shape.objects.create(blueprint=blueprint, **shape_data)

        return blueprint

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        lines_data = validated_data.pop('lines', [])
        shapes_data = validated_data.pop('shapes', [])

        # Update or create new lines
        for line_data in lines_data:
            line_id = line_data.get('id', None)
            if line_id:
                line = Line.objects.filter(id=line_id, blueprint=instance).first()
                for key, value in line_data.items():
                    setattr(line, key, value)
                line.save()
            else:
                Line.objects.create(blueprint=instance, **line_data)

        # Update or create new shapes
        for shape_data in shapes_data:
            shape_id = shape_data.get('id', None)
            if shape_id:
                shape = Shape.objects.filter(id=shape_id, blueprint=instance).first()
                for key, value in shape_data.items():
                    setattr(shape, key, value)
                shape.save()
            else:
                Shape.objects.create(blueprint=instance, **shape_data)

        return instance

class FolderSerializer(serializers.ModelSerializer):
    blueprints = BlueprintSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = ['id', 'name', 'parent', 'blueprints', 'public']

class FileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = ['id', 'name', 'folder', 'file', 'file_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

User = get_user_model()

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']

class CustomUserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin', 'groups', 'user_permissions', 'first_name', 'last_name', 'is_staff', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def create(self, validated_data):
        # Creating user with the create_user manager method ensures password is hashed
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data.get('password'),
            is_admin=validated_data.get('is_admin', False)  # Ensure the model supports is_admin
        )
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.is_admin = validated_data.get('is_admin', instance.is_admin)  # If 'is_admin' is a model field
        # Update many-to-many fields only if they are provided
        if 'groups' in validated_data:
            instance.groups.set(validated_data['groups'])
        if 'user_permissions' in validated_data:
            instance.user_permissions.set(validated_data['user_permissions'])
        instance.save()
        return instance