import React, { ReactNode } from "react";
import { Container, Row, Col } from "reactstrap";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import ErrorMessage from "../components/ErrorMessage";

const user = () => {
  const [user, loading, error] = useAuthState(getAuth());

  return (
    <Container>
      {loading ? (
        <p>loading...</p>
      ) : error || !user ? (
        <ErrorMessage message={error?.message} backURL={"/"} />
      ) : (
        <>
          <h1>Profile</h1>
          <Row style={{ display: "flex", alignItems: "center" }}>
            <Col md="1">
              {user.photoURL && (
                <img style={{ borderRadius: "10px" }} src={user.photoURL} />
              )}
            </Col>
            <Col className="ms-2" md="10">
              <h2 style={{ verticalAlign: "center" }}>{user.displayName}</h2>
            </Col>
          </Row>
          <hr />
          <h1>History</h1>
          <Row></Row>
        </>
      )}
    </Container>
  );
};

export default user;
