import React, { ReactNode } from "react";
import { Container, Row, Col } from "reactstrap";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import ErrorMessage from "../components/ErrorMessage";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../utils/initAuth";
import { DB_USER_DATA, UNITS } from "../utils/staticValues";
import { history } from "../types/userType";

const user = () => {
  const currUser = getAuth().currentUser;
  if (!currUser)
    return <ErrorMessage message={"user not found"} backURL={"/"} />;
  const [userData, userDataLoading, userDataError] = useDocument(
    doc(db, DB_USER_DATA, currUser.uid),
    {}
  );
  const [user, loading, error] = useAuthState(getAuth());

  //i- return missed data for each unit that exists, return "-" if no data found at all
  const missedVocabData: ReactNode =
    userData && userData.data()?.vocab.missedIds ? (
      UNITS.map((unit) => {
        const unitName = "unit" + unit;
        let missed = "-";
        //i- if missed vocabs exit for the unit, add the list
        if (userData.data()?.vocab.missedIds[unitName]) {
          missed = userData.data()?.vocab.missedIds[unitName];
        }
        return <p key={unit}>{`Unit${unit} : ${missed}`}</p>;
      })
    ) : (
      <p>-</p>
    );

  //i- return fav data for each unit that exists, return "-" if no fav found at all
  const favVocabData: ReactNode =
    userData && userData.data()?.vocab.favorite ? (
      UNITS.map((unit) => {
        const unitName = "unit" + unit;
        if (userData.data()?.vocab.favorite[unitName]) {
          return (
            <p>{`Unit${unit} : ${
              userData.data()?.vocab.favorite[unitName]
            }`}</p>
          );
        }
        return <></>;
      })
    ) : (
      <p>-</p>
    );

  return (
    <Container>
      {loading ? (
        <p>loading...</p>
      ) : error || !user ? (
        <ErrorMessage message={error?.message} backURL={"/"} />
      ) : (
        <>
          <h1>Profile</h1>
          <hr />
          <Row style={{ display: "flex", alignItems: "center" }}>
            <Col md="1">
              {user.photoURL && (
                <img
                  style={{ borderRadius: "10px", maxWidth: "50px" }}
                  src={user.photoURL}
                />
              )}
            </Col>
            <Col className="ms-2">
              <h2 style={{ verticalAlign: "center" }}>{user.displayName}</h2>
            </Col>
          </Row>
          <hr />
          <h2>History Data</h2>
          {userData?.data() &&
            userData
              .data()
              ?.history.map((h: history) => (
                <span className="me-2 border border-primary">{`${h.type} - ${h.unitData[0]}`}</span>
              ))}
          <hr />
          <h2>Vocabulary Data</h2>
          <h5>お気に入り</h5>
          <Row>
            <Col>{favVocabData}</Col>
          </Row>
          <h5 className="mt-3">間違えた単語</h5>
          <Row>
            <Col>{missedVocabData}</Col>
          </Row>
          <hr />
          <h2>Grammar Data</h2>
          <p>-</p>
        </>
      )}
    </Container>
  );
};

export default user;
