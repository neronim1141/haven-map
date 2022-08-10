import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../graphql/apolloClient";
import { NavLink } from "components/NavLink/NavLink";
import { SessionProvider } from "next-auth/react";
import { NavUser } from "components/NavLink/NavUser";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <div className="w-full h-screen flex flex-col ">
          <header className="flex border-b-4 border-black bg-gray-600">
            <nav className="flex gap-1 p-2">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/map">Map</NavLink>
            </nav>
            <NavUser />
          </header>
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
        </div>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;
