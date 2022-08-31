import pino, { Logger } from "pino";
const pinoLogger = pino({
  level: process.env.NEXT_PUBLIC_PINO_LOG_LEVEL ?? "info",
  base: undefined,
  timestamp: false,

  transport: {
    target: "pino-pretty",
  },
});

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var logger: Logger | undefined;
}

const pinoGlobal =
  global.logger ||
  pino({
    level: process.env.NEXT_PUBLIC_PINO_LOG_LEVEL ?? "info",
    base: undefined,
    timestamp: false,

    transport: {
      target: "pino-pretty",
    },
  });

if (process.env.NODE_ENV !== "production") global.logger = pinoGlobal;

export const logger = {
  log: (msg: string) => pinoGlobal.info(msg),
  error: (e: unknown) => pinoGlobal.error(e),
};
