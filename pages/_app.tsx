import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../graphql/client/apolloClient";
import { NavLink } from "components/NavLink/NavLink";
import { SessionProvider } from "next-auth/react";
import { NavUser } from "components/NavLink/NavUser";

import { Role } from "@prisma/client";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <div className="w-full h-screen flex flex-col  bg-gray-900 text-white">
          <header className="flex shadow-2xl bg-gray-700 p-2">
            <nav className="flex gap-1 ">
              <NavLink requiredRole={Role.ADMIN} href="/map/1/6/0/0">
                Map
              </NavLink>
              <NavLink href="/admin">admin</NavLink>
            </nav>
            <NavUser />
          </header>
          <main className="flex-grow flex">
            <Component {...pageProps} />
          </main>
        </div>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;
