import React from "react";
import "../styles/globals.css";
import Layout from "../components/Layout";
import "../utils/initAuth";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
