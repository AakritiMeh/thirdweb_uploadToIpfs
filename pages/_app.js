import { ThirdwebProvider, ThirdwebStorage } from "@thirdweb-dev/react";
import "../styles/globals.css";
require("dotenv").config();

import { NextPage } from "next";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "ethereum";

function MyApp({ Component, pageProps }) {
  const env = require("dotenv");
  return (
    <>
      <ThirdwebProvider
        activeChain={activeChain}
        clientId={env.CLIENT_ID}
        secretKey={env.CLIENT_SECRET}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
      {/* <ThirdwebStorage secretkey={process.env.CLIENT_SECRET}>
        <Component {...pageProps} />
      </ThirdwebStorage> */}
    </>
  );
}

export default MyApp;
