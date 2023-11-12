import * as log4js from "log4js";

/**
 * @author @steve-mir
 * 
 * @method
 * - constructor(logFilePath: string): initializes the logger object with a file appender and sets the log level to 'debug'.
 * - log(level: string, msg: string): logs a message with the specified log level. It converts the level to lowercase and invokes the corresponding log method on the logger object.
 * 
 * @field
 * - logger: the logger object created by log4js.
 */
class Logger {
    public logger;
    /**
     * 
     * @param logFilePath - path to log file
     */
    constructor(logFilePath: string) {
        log4js.configure({
            appenders: { file: { type: 'file', filename: logFilePath } },
            categories: { default: { appenders: ['file'], level: 'debug' } }
          });
      
        this.logger = log4js.getLogger();
    }

    /**
    * Invokes the corresponding log method on the logger object based on the provided log level.
    * If the provided log level is not recognized, it defaults to 'info'.
    *
    * @param level - The log level.
    * @param msg - The log message.
    */
    public log(level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal', msg: string): void {
        
        const lowerCaseLevel = level.toLowerCase();
        this.logger[
            lowerCaseLevel === 'trace'
                ? 'trace'
                : lowerCaseLevel === 'debug'
                ? 'debug'
                : lowerCaseLevel === 'info'
                ? 'info'
                : lowerCaseLevel === 'warn'
                ? 'warn'
                : lowerCaseLevel === 'error'
                ? 'error'
                : lowerCaseLevel === 'fatal'
                ? 'fatal'
                : 'info'
        ](msg);
    }


}

export default Logger;
