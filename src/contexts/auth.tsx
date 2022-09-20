import { Role } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import React, {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
} from "react";
import { QueryObserverResult } from "react-query";
import { trpc } from "utils/trpc";

const AuthContext = createContext<
  | {
      user: { id: number; role: Role; name: string; token: string } | undefined;
      refetch: () => Promise<
        QueryObserverResult<{
          id: number;
          name: string;
          role: Role;
          token: string;
        } | null>
      >;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";
export const AuthProvider: FunctionComponent<{
  children?: ReactNode;
}> = ({ children }) => {
  const session = useSession();
  const user = trpc.useQuery(["user.byId", { id: session.data?.user.id! }], {
    enabled: !!session.data?.user.id,
    refetchOnWindowFocus: true,
    retry: 2,
    onError: (e) => {
      signOut();
    },
  });

  return (
    <AuthContext.Provider
      value={{ user: user.data ?? undefined, refetch: user.refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx?.user) {
    return {
      user: undefined,
      canAccess: (role: Role) => false,
    };
  }
  return {
    user: ctx.user,
    canAccess: (role: Role) => canAccess(role, ctx.user?.role),
    reload: ctx?.refetch,
  };
};

export const canAccess = (requiredRole: Role, role?: Role) => {
  if (!role || getAccessLevel(requiredRole) > getAccessLevel(role))
    return false;
  return true;
};
export const getAccessLevel = (role: Role) =>
  ({
    [Role.ADMIN]: 4,
    [Role.VILLAGER]: 3,
    [Role.ALLY]: 2,
    [Role.NEED_CHECK]: 1,
  }[role]);
