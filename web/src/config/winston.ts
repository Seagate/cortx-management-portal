import { createLogger, format, transports } from 'winston';
const { combine, timestamp , json } = format;
const logger = createLogger({
  format: combine(
        timestamp(),
        json(),
      ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: process.env.LOG_FILE_PATH, 
    handleExceptions: true,
    level: process.env.LOG_LEVEL,
    //maxsize: 10485760, //10 MB
    //maxFiles: 5 
    }),
  ],
  exitOnError: false,
});

export default logger;