from django.urls import path
from .views import DownloadAudioView, DownloadVideoView, index
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', index, name='index'),
    path('api/download-audio/', DownloadAudioView.as_view(), name='download-audio'),
    path('api/download-video/', DownloadVideoView.as_view(), name='download_video'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
