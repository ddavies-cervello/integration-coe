import React from "react";
import type { AppProps /*, AppContext */ } from "next/app";
import "./index.css";
import "./styles.scss";
import "@fortawesome/fontawesome-free/css/all.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
