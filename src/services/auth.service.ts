import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth'

export class AuthService {
  async signInWithGoogle(): Promise<User | null> {
    if (!auth || !googleProvider) {
      console.error('Firebase Auth not configured')
      return null
    }
    try {
      const result = await signInWithPopup(auth, googleProvider)
      console.log('✅ Google sign-in successful:', {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        uid: result.user.uid
      })
      return result.user
    } catch (error) {
      console.error('❌ Google sign-in error:', error)
      return null
    }
  }

  async signOutUser(): Promise<void> {
    if (!auth) {
      console.error('Firebase Auth not configured')
      return
    }
    try {
      await signOut(auth)
      console.log('✅ User signed out successfully')
    } catch (error) {
      console.error('❌ Sign-out error:', error)
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    if (!auth) {
      callback(null)
      return () => {}
    }
    return onAuthStateChanged(auth, callback)
  }

  getCurrentUser(): User | null {
    return auth?.currentUser || null
  }
}

export const authService = new AuthService()
export default authService
