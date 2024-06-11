from rest_framework import serializers
from .models import YouTubeURL

class YouTubeURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = YouTubeURL
        fields = '__all__'
