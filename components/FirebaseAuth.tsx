import React from "react";
import StyledFirebaseAuth from "../StyledFirebaseAuth";

import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { Col, Container, Row } from "reactstrap";

const styles = require("../styles/Layout.module.css");

const firebaseAuthConfig = {
  signInSuccessUrl: "/",
  signInOptions: [{ provider: GoogleAuthProvider.PROVIDER_ID }],
};

const SignInScreen = () => {
  return (
    <div className={styles.login}>
      <Container>
        <Row>
          <Col>
            <h5 style={{ textAlign: "center" }}>
              Register free or Login using a Google account to get personalized
              learning experience!
            </h5>
          </Col>
        </Row>
        <p style={{ textAlign: "center" }}>
          間違えた問題を記録したり、全てのコンテンツにアクセスするためにはGoogleアカウントで無料で登録・ログインしよう！
        </p>
        <StyledFirebaseAuth
          uiConfig={firebaseAuthConfig}
          firebaseAuth={getAuth()}
        />
      </Container>
    </div>
  );
};

export default SignInScreen;
