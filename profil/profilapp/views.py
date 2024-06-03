from django.http import JsonResponse
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password
from rest_framework import views
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Folder, File, Blueprint, Shape, Line, CustomUser
from .serializers import FolderSerializer, FileSerializer, BlueprintSerializer, ShapeSerializer, LineSerializer, CustomUserSerializer

import logging

logger = logging.getLogger(__name__)

class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    def get_queryset(self):
        parent_id = self.request.query_params.get('parent_id', None)
        if parent_id is not None:
            if parent_id.lower() == 'null':
                return self.queryset.filter(parent__isnull=True)
            try:
                parent_id = int(parent_id)
                return self.queryset.filter(parent__id=parent_id)
            except ValueError:
                return self.queryset.none()
        return self.queryset

    def perform_create(self, serializer):
        serializer.save()

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        folder_id = self.request.data.get('folder')
        folder = get_object_or_404(Folder, id=folder_id)
        serializer.save(folder=folder)
        
class FileView(APIView):
    def get(self, request, folder_id, format=None):
        files = File.objects.filter(folder__id=folder_id)
        serializer = FileSerializer(files, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, folder_id, format=None):
        serializer = FileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlueprintViewSet(viewsets.ModelViewSet):
    queryset = Blueprint.objects.all()
    serializer_class = BlueprintSerializer

    @action(detail=True, methods=['delete'], url_path='contents')
    def delete_contents(self, request, pk=None):
        """
        Custom action to delete all contents (lines and shapes) of a specific blueprint.
        """
        try:
            with transaction.atomic():
                blueprint = self.get_object()
                # Assuming 'lines' and 'shapes' are the related names for the relationships
                blueprint.lines.all().delete()
                blueprint.shapes.all().delete()
                return Response({'status': 'contents deleted'}, status=status.HTTP_204_NO_CONTENT)
        except Blueprint.DoesNotExist:
            return Response({'error': 'Blueprint not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BlueprintView(APIView):
    def get(self, request, folder_id, format=None):
        blueprints = Blueprint.objects.filter(folder__id=folder_id)
        serializer = BlueprintSerializer(blueprints, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, folder_id, format=None):
        logger.debug("Received data: %s", request.data)
        serializer = BlueprintSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShapeViewSet(viewsets.ModelViewSet):
    queryset = Shape.objects.all()
    serializer_class = ShapeSerializer

class LineViewSet(viewsets.ModelViewSet):
    queryset = Line.objects.all()
    serializer_class = LineSerializer

def folder_path(request, folder_id):
    try:
        folder = Folder.objects.get(pk=folder_id)
        return JsonResponse({'path': folder.get_full_path()})
    except Folder.DoesNotExist:
        return JsonResponse({'error': 'Folder not found'}, status=404)


from rest_framework.decorators import api_view, parser_classes
from django.middleware.csrf import get_token

@api_view(['GET'])
def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    folder_id = request.data.get('folder')
    folder = get_object_or_404(Folder, id=folder_id)
    
    serializer = FileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(folder=folder)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None and user.is_superuser:
        login(request, user)
        return Response({'message': 'Admin login successful', 'user': {'username': user.username}})
    else:
        return Response({'message': 'Unauthorized'}, status=401)  

@api_view(['POST'])
def admin_register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    user = CustomUser.objects.create_superuser(username=username, email=email, password=password)
    return Response({'message': 'Admin registered successfully'})