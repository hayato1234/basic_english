import React, { ReactNode } from "react";
import { Container, Row, Col } from "reactstrap";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import ErrorMessage from "../components/ErrorMessage";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../utils/initAuth";
import { DB_USER_DATA, UNITS } from "../utils/staticValues";

const user = () => {
  const currUser =
    getAuth().currentUser !== null ? getAuth().currentUser : { uid: "" };
  const [userData, userDataLoading, userDataError] = useDocument(
    doc(db, DB_USER_DATA, currUser!.uid),
    {}
  );
  const [user, loading, error] = useAuthState(getAuth());

  const missedVocabData: ReactNode = UNITS.map((unit) => {
    let missed = "-";
    const unitName = "unit" + unit;
    if (userData && userData.data()?.vocab.missedIds[unitName]) {
      missed = userData.data()?.vocab.missedIds[unitName];
    }
    return <p key={unit}>{`Unit${unit} : ${missed}`}</p>;
  });

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
          <h2>History</h2>
          {userData && <p>{userData.data()?.history.type.unit[0]}</p>}
          <h2>Vocabulary</h2>
          <h5>お気に入り</h5>
          <h5>間違えた単語</h5>
          <Row>
            <Col>{missedVocabData}</Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default user;
