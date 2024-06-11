import AudioDownloader from '@/components/AudioDownload'
import VideoDownloader from '@/components/VideoDownloader'
import React from 'react'

function page() {
  return (
    <div className='min-h-screen flex flex-col md:flex-row gap-8 bg-white items-center justify-center'>
      <div className='mx-8'>
      <AudioDownloader/>
      </div>
      <div className='mx-8'>
      <VideoDownloader/>
      </div>
    </div>
  )
}

export default page
