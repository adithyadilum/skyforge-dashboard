import { useState } from 'react'
import { LogOut, ChevronDown, User } from 'lucide-react'
import { authService } from '../services/authService'

interface UserProfileProps {
  user: any // Firebase User type
  onSignOut: () => void
}

export default function UserProfile({ user, onSignOut }: UserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Debug user data
  console.log('UserProfile user data:', {
    displayName: user?.displayName,
    email: user?.email,
    photoURL: user?.photoURL,
    uid: user?.uid
  })

  const handleSignOut = async () => {
    await authService.signOutUser()
    onSignOut()
    setIsDropdownOpen(false)
  }

  const handleImageError = () => {
    console.log('Profile image failed to load:', user?.photoURL)
    setImageError(true)
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const renderProfileImage = () => {
    // Try to get higher quality image URL if available
    let imageUrl = user.photoURL
    if (imageUrl && imageUrl.includes('googleusercontent.com')) {
      // Remove size parameter to get full size image
      imageUrl = imageUrl.replace(/=s\d+-c/, '=s96-c')
      console.log('Modified Google image URL:', imageUrl)
    }

    if (imageUrl && !imageError) {
      return (
        <img
          src={imageUrl}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
          onError={handleImageError}
          onLoad={() => console.log('Profile image loaded successfully')}
          referrerPolicy="no-referrer"
        />
      )
    }
    
    // Fallback to initials or user icon
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-200">
        {user.displayName || user.email ? (
          <span className="text-white font-semibold text-sm">
            {getInitials(user.displayName || user.email)}
          </span>
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors max-w-[250px]"
      >
        <div className="text-right min-w-0 flex-shrink">
          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
            {user.displayName || 'User'}
          </div>
          <div className="text-xs text-gray-600 truncate max-w-[120px]" title={user.email}>
            {user.email}
          </div>
        </div>
        
        {renderProfileImage()}
        
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999]">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {(() => {
                  let imageUrl = user.photoURL
                  if (imageUrl && imageUrl.includes('googleusercontent.com')) {
                    imageUrl = imageUrl.replace(/=s\d+-c/, '=s96-c')
                  }
                  
                  return imageUrl && !imageError ? (
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                      onError={handleImageError}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-200 flex-shrink-0">
                      {user.displayName || user.email ? (
                        <span className="text-white font-semibold">
                          {getInitials(user.displayName || user.email)}
                        </span>
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                  )
                })()}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 truncate">
                    {user.displayName || 'User'}
                  </div>
                  <div className="text-sm text-gray-600 truncate" title={user.email}>
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
