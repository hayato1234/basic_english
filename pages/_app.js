import React from "react";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <h1>_app</h1>
      <Component {...pageProps} />
    </Layout>
  );
}

//? what is Component

export default MyApp;
