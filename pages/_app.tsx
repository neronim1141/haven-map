import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../graphql/client/apolloClient";
import { NavLink } from "components/NavLink/NavLink";
import { SessionProvider, useSession } from "next-auth/react";
import { NavUser } from "components/NavLink/NavUser";
import { NextComponentType } from "next";
import { canAccess } from "features/auth/canAccess";
import { useRouter } from "next/router";
import { AuthPageOptions } from "features/auth/types";

type CustomAppProps = AppProps & {
  Component: NextComponentType & { auth?: AuthPageOptions }; // add auth type
};
function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
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
            {Component.auth ? (
              <Auth auth={Component.auth}>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </main>
        </div>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;

function Auth({
  children,
  auth,
}: {
  children: JSX.Element;
  auth: AuthPageOptions;
}): JSX.Element | null {
  const router = useRouter();
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status, data } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (data && data.user?.role && canAccess(auth.role, data.user.role)) {
    return children;
  }
  router.push(auth.unauthorized ?? "/login");
  return null;
}
