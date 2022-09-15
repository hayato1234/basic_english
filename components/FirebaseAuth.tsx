import React from "react";
import StyledFirebaseAuth from "../StyledFirebaseAuth";

import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseAuthConfig = {
  signInSuccessUrl: "/",
  signInOptions: [{ provider: GoogleAuthProvider.PROVIDER_ID }],
};

const SignInScreen = () => {
  return (
    <div
      style={{
        maxWidth: "320px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p>Please sign-in:</p>
      <StyledFirebaseAuth
        uiConfig={firebaseAuthConfig}
        firebaseAuth={getAuth()}
      />
    </div>
  );
};

export default SignInScreen;
