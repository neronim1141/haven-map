import React from "react";

import "styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../../graphql/client/apolloClient";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";

import { Header } from "src/components/Layout/header";
import Head from "next/head";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "~/server/routers";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { wsLink, createWSClient } from "@trpc/client/links/wsLink";
import { loggerLink } from "@trpc/client/links/loggerLink";

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
            <main className="flex-grow flex overflow-y-auto">
              <Component {...pageProps} />
            </main>
          </div>
        </ApolloProvider>
      </SessionProvider>
    </>
  );
}

function getEndingLink() {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `http://localhost:3000/api/trpc`,
    });
  }
  const client = createWSClient({
    url: "ws://localhost:3001",
  });
  return wsLink<AppRouter>({
    client,
  });
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === "development" &&
              typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        getEndingLink(),
      ],
      transformer: superjson,

      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
