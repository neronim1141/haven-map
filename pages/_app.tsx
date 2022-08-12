import React from "react";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../graphql/client/apolloClient";
import { SessionProvider } from "next-auth/react";

import { Header } from "components/Layout/header";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Hexindustries</title>
      </Head>
      <SessionProvider session={session}>
        <ApolloProvider client={apolloClient}>
          <div className="w-full h-screen flex flex-col  bg-gray-900 text-white">
            <Header />
            <main className="flex-grow flex">
              <Component {...pageProps} />
            </main>
          </div>
        </ApolloProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
