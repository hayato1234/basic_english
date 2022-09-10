import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Link to="/grammar">
        <button>Learn Grammar</button>
      </Link>
    </>
  );
};

export default Home;
