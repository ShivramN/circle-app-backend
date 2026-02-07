const winston = require("winston");
winston.transports.DailyRotateFile = require("winston-daily-rotate-file");
const levels = Object.keys(winston.config.npm.levels);

class Logs {
  constructor (filePath, printConsole) {
    var transport = new winston.transports.DailyRotateFile({
      filename: filePath + "-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "100m",
      maxFiles: "1d"
    });
    levels.forEach((standardLevel) => {
      Logs.prototype[standardLevel] = (...params) => {
        let log = "";
        params.forEach((singleParam, index) => {
          if (typeof singleParam === "object")
            singleParam = JSON.stringify(singleParam);
          log += " " + singleParam;
        });
        this.logger[standardLevel](log);
      };
    });

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} - ${level}: ${message}`;
        })
      ),
      transports: [transport],
    });

    if (printConsole === true) {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format.prettyPrint(),
            winston.format.printf((info) => {
              const level = info.level;
              const timestamp = info.timestamp;
              const message = "\x1b[33m" + info.message + "\x1b[0m";
              delete info.level;
              delete info.timestamp;
              delete info.message;
              return `${timestamp} - ${level} - ${message} : ${typeof info === "object" ? JSON.stringify(info) : info
                } ${Object.keys(info).length > 0
                  ? Object.keys(info.body).length > 0 ||
                    Object.keys(info.headers).length > 0
                    ? "\n"
                    : ""
                  : ""
                }`;
            })
          ),
        })
      );
    }
  }
}

module.exports = Logs;
