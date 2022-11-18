import { getAuth } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import UnitList from "../../components/UnitList";

const styles = require("../../styles/Vocab.module.css");
const vocabulary = () => {
  const [user, loading, error] = useAuthState(getAuth());

  return (
    <div className={styles.unit_body}>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <UnitList user={user} />
      ) : (
        <UnitList user={null} />
      )}
    </div>
  );
};

export default vocabulary;
