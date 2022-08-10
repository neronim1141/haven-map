import pino from "pino";
const logger = pino({
  level: process.env.NEXT_PUBLIC_PINO_LOG_LEVEL ?? "info",
  base: undefined,
  timestamp: false,

  transport: {
    target: "pino-pretty",
  },
});

export const log = (msg: string) => logger.info(msg);
export const error = (e: unknown) => logger.error(e);
