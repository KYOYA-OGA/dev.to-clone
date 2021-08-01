import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCvWJkAWmK4euzu977PkCOcwPos3DUmxTs',
  authDomain: 'nextfire-app-97d76.firebaseapp.com',
  projectId: 'nextfire-app-97d76',
  storageBucket: 'nextfire-app-97d76.appspot.com',
  messagingSenderId: '178751773405',
  appId: '1:178751773405:web:a95afc3fa0f45d93dad934',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export const increment = firebase.firestore.FieldValue.increment

// helper function to get users document
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}

export function postToJSON(doc) {
  const data = doc.data()
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
}

export const fromMillis = firebase.firestore.Timestamp.fromMillis
