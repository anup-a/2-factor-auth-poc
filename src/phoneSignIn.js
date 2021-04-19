import { auth, firebase } from "./api/firebase";

import React, { useState, useEffect } from "react";
import { FirebaseAuth } from "react-firebaseui";

const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
      recaptchaParameters: {
        size: "invisible", // 'invisible' or 'compact'
      },
    },
  ], //   },
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

export const PhoneSignIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <FirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>
        Welcome
        <pre>{firebase.auth().currentUser.uid}</pre>! You are now signed-in!
      </p>
      <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    </div>
  );
};
