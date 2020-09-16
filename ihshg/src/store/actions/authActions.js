export const logIn = (credentials) => {
  return (dispatch, getState, { getFirebase}) => {
    const firebase = getFirebase();

    firebase.auth().signInWithEmailAndPassword(
      credentials.emailLogin,
      credentials.passwordLogin
    ).then(() => {
      dispatch({ type: 'LOGIN_SUCCESS' })
    }).catch((err) => {
      dispatch({ type: 'LOGIN_ERROR', err })
    });
  }
}

export const logOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase.auth().signOut().then(() => {
      dispatch({ type: 'LOGOUT_SUCCESS' })
    });
  }
}

export const signUp = (newUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    ).then((resp) => {
      return firestore.collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        initials: newUser.firstName[0] + newUser.lastName[0],
        pictureURL: null
      })
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' })
    }).catch((err) => {
      dispatch({ type: 'SIGNUP_ERROR', err })
    }).then(() => {
      const user = firebase.auth().currentUser;
      user.sendEmailVerification();
    })
  }
}

export const verifyEmail = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    const user = firebase.auth().currentUser;
    user.sendEmailVerification().then(() => {
      dispatch({ type: 'VERIFY_SUCCESS' })
    }).catch((err) => {
      dispatch({ type: 'VERIFY_ERROR', err})
    })
  }
}