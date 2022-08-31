import React from "react";

import "styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";

import { Header } from "src/components/Layout/header";
import Head from "next/head";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "~/server/routers";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const { APP_URL } = publicRuntimeConfig;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Hexindustries</title>
      </Head>
      <SessionProvider session={session}>
        <div className="w-full h-screen flex flex-col  bg-gray-900 text-white">
          <Header />
          <main className="flex-grow flex overflow-y-auto">
            <Component {...pageProps} />
          </main>
        </div>
      </SessionProvider>
    </>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = (APP_URL ?? "http://localhost:3000") + "/api/trpc";
    return {
      url,
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
