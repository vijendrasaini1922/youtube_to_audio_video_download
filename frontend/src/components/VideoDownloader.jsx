'use client'
import { useState } from 'react';
import axios from 'axios';

export default function VideoDownloader() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('360p');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/download-video/', { url, quality }, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'video/mp4' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `video_${quality}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setMessage('Download Successfull.');
      setUrl('');
    } catch (error) {
      setMessage('There was an error processing the URL.');
      console.error('There was an error processing the URL!', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">YouTube Video Downloader</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-gray-700">YouTube URL:</span>
            <input 
              type="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white border text-red-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Quality:</span>
            <select 
              value={quality} 
              onChange={(e) => setQuality(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 bg-white border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="360p">360p</option>
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </label>
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
        {loading && (
          <div className="mt-4 flex items-center text-gray-700">
            <div className="spinner mr-2"></div>
            Processing your request...
          </div>
        )}
        {message && !loading && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
