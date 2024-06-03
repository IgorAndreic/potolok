from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FolderViewSet, FileViewSet, FileView, BlueprintViewSet, BlueprintView, ShapeViewSet, LineViewSet, folder_path, csrf, upload_file, admin_login, admin_register


router = DefaultRouter()
router.register(r'folders', FolderViewSet)
router.register(r'files', FileViewSet)
router.register(r'blueprints', BlueprintViewSet)
router.register(r'shapes', ShapeViewSet)
router.register(r'lines', LineViewSet)


urlpatterns = [
    path('csrf/', csrf, name='csrf'),
    path('', include(router.urls)),
    path('folders/<int:folder_id>/files/', FileView.as_view()),
    path('folders/<int:folder_id>/blueprints/', BlueprintView.as_view()),
    path('admin/login/', admin_login, name='admin-login'),
    path('admin/register/', admin_register, name='admin-register'),
    path('folders/<int:folder_id>/path/', folder_path),
    path('upload/', upload_file, name='upload_file'),
    # Add custom action for deleting blueprint contents
    path('blueprints/<int:pk>/contents/', BlueprintViewSet.as_view({
        'delete': 'delete_contents'
    }), name='blueprint-contents-delete'),
]
