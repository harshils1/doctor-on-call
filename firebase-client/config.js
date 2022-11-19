import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyBd3RZI7V4ywxOhyfC5FpzZIwi5RD3jkFc',
  authDomain: 'doctor-on-call-a29c4.firebaseapp.com',
  projectId: 'doctor-on-call-a29c4',
  storageBucket: 'doctor-on-call-a29c4.appspot.com',
  messagingSenderId: '333577350910',
  appId: '1:333577350910:web:d10ee1abf77d49d154bfaf',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const fn = getFunctions(app)

if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectFirestoreEmulator(db, 'localhost', 8086)
    connectFunctionsEmulator(fn, 'localhost', 6001)
  } catch (e) {
    // fail silently on subsequent server executions
  }
}
