'use client'
import { useState } from 'react';
import axios from 'axios';

export default function AudioDownloader() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/download-audio/', { url }, {
        responseType: 'blob',  // Important to handle binary data
      });

      // Create a URL for the blob data
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create an anchor element and trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'audio.mp3');  // Set default file name
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">YouTube URL to MP3 Downloader</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-gray-700">YouTube URL:</span>
            <input 
              type="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white text-red-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-indigo-600 font-semibold text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
