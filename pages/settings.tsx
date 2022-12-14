import React from "react";

import { getAuth, signOut } from "firebase/auth";

const settings = () => {
  return (
    <div>
      <a href="#/" role="button" onClick={() => signOut(getAuth())}>
        Logout
      </a>
    </div>
  );
};

export default settings;
