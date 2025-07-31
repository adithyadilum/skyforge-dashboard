import { useState, useEffect } from 'react'

interface DebugProfileImageProps {
  photoURL: string | null
}

export default function DebugProfileImage({ photoURL }: DebugProfileImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageInfo, setImageInfo] = useState<any>(null)

  useEffect(() => {
    if (photoURL) {
      console.log('Testing profile image URL:', photoURL)
      
      // Test if image can be loaded
      const img = new Image()
      
      img.onload = () => {
        console.log('✅ Image loaded successfully')
        setImageLoaded(true)
        setImageInfo({
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        })
      }
      
      img.onerror = (error) => {
        console.log('❌ Image failed to load:', error)
        setImageError(true)
      }
      
      img.src = photoURL
    }
  }, [photoURL])

  if (!photoURL) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">No profile picture URL provided</p>
      </div>
    )
  }

  const modifiedURL = photoURL.includes('googleusercontent.com') 
    ? photoURL.replace(/=s\d+-c/, '=s96-c')
    : photoURL

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
      <h3 className="font-semibold text-gray-900">Profile Picture Debug</h3>
      
      <div className="space-y-2 text-sm">
        <p><strong>Original URL:</strong> <span className="break-all">{photoURL}</span></p>
        <p><strong>Modified URL:</strong> <span className="break-all">{modifiedURL}</span></p>
        <p><strong>Status:</strong> 
          {imageLoaded ? ' ✅ Loaded' : imageError ? ' ❌ Failed' : ' ⏳ Loading...'}
        </p>
        {imageInfo && (
          <p><strong>Dimensions:</strong> {imageInfo.naturalWidth}x{imageInfo.naturalHeight}</p>
        )}
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">Standard:</p>
          <img
            src={photoURL}
            alt="Test"
            className="w-12 h-12 rounded-full border-2 border-gray-300"
            onLoad={() => console.log('Standard img loaded')}
            onError={() => console.log('Standard img failed')}
          />
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">No referrer:</p>
          <img
            src={photoURL}
            alt="Test Referrer"
            className="w-12 h-12 rounded-full border-2 border-green-300"
            referrerPolicy="no-referrer"
            onLoad={() => console.log('No-referrer img loaded')}
            onError={() => console.log('No-referrer img failed')}
          />
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">Modified URL:</p>
          <img
            src={modifiedURL}
            alt="Test Modified"
            className="w-12 h-12 rounded-full border-2 border-purple-300"
            referrerPolicy="no-referrer"
            onLoad={() => console.log('Modified URL img loaded')}
            onError={() => console.log('Modified URL img failed')}
          />
        </div>
      </div>

      <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
        <p><strong>Debug Notes:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-1 text-gray-700">
          <li>Check browser console for detailed error messages</li>
          <li>Verify the image URL is accessible directly in browser</li>
          <li>Google images may have CORS restrictions</li>
          <li>Modified URL removes size constraints for better loading</li>
        </ul>
      </div>
    </div>
  )
}
