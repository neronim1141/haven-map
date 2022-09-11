import React, { CSSProperties } from "react";

export interface ProgressBarCSS extends CSSProperties {
  "--completed": number;
}

interface ProgressBar {
  completed: number;
}
export const ProgressBar = ({ completed }: ProgressBar) => {
  return (
    <div className="h-6 w-full overflow-hidden rounded-full bg-neutral-600">
      <div
        className="progressBarInner bg-neutral-800 pr-2 text-right"
        style={{ "--completed": completed } as ProgressBarCSS}
      >
        {`${completed}%`}
      </div>
    </div>
  );
};
