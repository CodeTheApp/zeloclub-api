import winston from 'winston';
const { combine, timestamp, json, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} ${level}: ${message} ${
    Object.keys(metadata).length ? JSON.stringify(metadata) : ''
  }`;
});

export const logger = winston.createLogger({
  level: 'debug',
  format: combine(timestamp(), colorize(), customFormat),
  defaultMeta: { service: 'api-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});
