import React, { ReactNode } from "react";

export const ErrorMessage = ({ children }: { children: ReactNode }) => (
  <span role="alert" className="text-sm font-bold text-red-600">
    {children}
  </span>
);
