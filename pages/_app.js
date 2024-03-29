import { ThirdwebProvider, ThirdwebStorage } from "@thirdweb-dev/react";
import "../styles/globals.css";

import { NextPage } from "next";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "ethereum";

function MyApp({ Component, pageProps }) {
  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
  const secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  return (
    <>
      <ThirdwebProvider
        activeChain={activeChain}
        clientId={client_id}
        secretKey={secret}
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
