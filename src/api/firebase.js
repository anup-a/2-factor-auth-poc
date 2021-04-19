import "firebase/auth";
import firebase from "firebase/app";

require("dotenv").config();

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

if (!firebase.apps.length) {
  console.log(config);
  firebase.initializeApp(config);
  firebase.auth().settings.appVerificationDisabledForTesting = !!(
    process.env.REACT_APP_SKIP_VALIDATION === "true"
  );
  firebase.auth().useDeviceLanguage();
}

const auth = firebase.auth();
export { auth, firebase };
