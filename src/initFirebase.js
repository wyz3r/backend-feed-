import * as admin from 'firebase-admin'

export const initialFireAdmin = () => {
  const serviceAccount = {
    projectId: process.env.NODE_FIREBASE_ID,
    clientEmail: process.env.NODE_FIREBASE_CLIENTEMAIL,
    privateKey: process.env.NODE_FIREBASE_PRIVATEKEY
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NODE_FIREBASE_URL
  })
}
initialFireAdmin()
