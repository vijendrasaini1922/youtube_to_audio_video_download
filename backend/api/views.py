from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.http import HttpResponse
from pytube import YouTube
from pydub import AudioSegment
import os
from moviepy.editor import VideoFileClip, concatenate_videoclips
import tempfile
from rest_framework import status

class DownloadAudioView(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        url = request.data.get('url')
        folder_name = 'temp_audio_files'  # Temporary folder to store audio files

        # Ensure the folder exists
        if not os.path.exists(folder_name):
            os.makedirs(folder_name)

        # Download the YouTube video
        yt = YouTube(url)
        video = yt.streams.filter(only_audio=True).first()
        downloaded_file = video.download(output_path=folder_name)

        # Extract audio from the downloaded video
        audio = AudioSegment.from_file(downloaded_file)
        audio_file = os.path.join(folder_name, yt.title + '.mp3')
        audio.export(audio_file, format='mp3')

        # Remove the downloaded video file
        os.remove(downloaded_file)

        # Return the audio file as a response
        with open(audio_file, 'rb') as f:
            response = HttpResponse(f.read(), content_type='audio/mpeg')
            response['Content-Disposition'] = f'attachment; filename="{yt.title}.mp3"'

        # Clean up by removing the saved audio file
        os.remove(audio_file)

        return response


class DownloadVideoView(APIView):

    def post(self, request):
        url = request.data.get('url')
        quality = request.data.get('quality')

        if not url or not quality:
            return Response({"error": "URL and quality are required."}, status=status.HTTP_400_BAD_REQUEST)

        yt = YouTube(url)
        stream = yt.streams.filter(res=quality, progressive=True, file_extension='mp4').first()
        
        if not stream:
            return Response({"error": f"No stream available for quality {quality}"}, status=status.HTTP_404_NOT_FOUND)
        
        with tempfile.TemporaryDirectory() as temp_dir:
            video_path = stream.download(output_path=temp_dir)
            video_clip = VideoFileClip(video_path)
            
            # Save the video to a temporary file
            output_path = os.path.join(temp_dir, f"video_{quality}.mp4")
            video_clip.write_videofile(output_path, codec="libx264", audio_codec="aac")

            # Prepare the response
            with open(output_path, 'rb') as video_file:
                response = HttpResponse(video_file.read(), content_type='video/mp4')
                response['Content-Disposition'] = f'attachment; filename="video_{quality}.mp4"'
                return response