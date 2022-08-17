import dataCache from "memory-cache";
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var dataCache: any;
}

export const cache = global.dataCache || dataCache;

if (process.env.NODE_ENV !== "production") global.dataCache = dataCache;
