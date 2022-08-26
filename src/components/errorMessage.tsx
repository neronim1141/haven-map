import React, { ReactNode } from "react";

export const ErrorMessage = ({ children }: { children: ReactNode }) => (
  <span role="alert" className="text-sm text-red-600 font-bold">
    {children}
  </span>
);
