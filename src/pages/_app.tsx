import React from "react";

import "styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";

import { Header } from "src/components/Layout/header";
import Head from "next/head";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "~/server/routers";
import favicon from "../../public/favicon.ico";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "~/contexts/auth";
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Hexindustries</title>
        <link rel="shortcut icon" href={favicon.src} />
      </Head>
      <SessionProvider session={session}>
        <AuthProvider>
          <div className="flex min-h-screen w-full flex-col bg-neutral-900 text-white ">
            <Header />
            <main className="flex flex-grow overflow-y-auto">
              <Component {...pageProps} />
            </main>
          </div>
        </AuthProvider>
      </SessionProvider>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        draggable
        pauseOnHover
        theme="dark"
        closeOnClick
      />
    </>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = "/api/trpc";
    return {
      url,
      transformer: superjson,

      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: { staleTime: 30 * 1000, refetchOnWindowFocus: false },
        },
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
