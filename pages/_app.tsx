import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../graphql/apolloClient";
import Link from "next/link";
import { NavLink } from "components/NavLink/NavLink";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="w-full h-screen flex flex-col ">
        <header className="flex border-b-4 border-black bg-gray-600">
          <nav className="flex gap-1 p-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/map">Map</NavLink>
          </nav>
        </header>
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default MyApp;
