import React, { CSSProperties } from "react";

export interface ProgressBarCSS extends CSSProperties {
  "--completed": number;
}

interface ProgressBar {
  completed: number;
}
export const ProgressBar = ({ completed }: ProgressBar) => {
  return (
    <div className="rounded-full w-full h-6 bg-neutral-600 overflow-hidden">
      <div
        className="progressBarInner bg-neutral-800 text-right pr-2"
        style={{ "--completed": completed } as ProgressBarCSS}
      >
        {`${completed}%`}
      </div>
    </div>
  );
};
