import * as admin from 'firebase-admin'
export const parseUser = idToken => {
  return new Promise((resolve, reject) => {
    admin.auth().verifyIdToken(idToken)
      .then((decodedToken) => {
        // console.log('decodedToken')
        resolve(decodedToken)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const getallUsers = () => {
  return new Promise((resolve, reject) => {
    admin.auth().listUsers()
      .then(function (userRecord) {
        console.log('Successfully fetched user data:', userRecord)
        resolve()
      })
      .catch(function (error) {
        console.log('Error fetching user data:', error)
        reject(error)
      })
  })
  // admin.auth().getUserByEmail('lislas@delarivagroup.com')
}
