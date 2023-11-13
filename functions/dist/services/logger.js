"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = __importStar(require("log4js"));
class Logger {
    constructor(logFilePath) {
        log4js.configure({
            appenders: { file: { type: 'file', filename: logFilePath } },
            categories: { default: { appenders: ['file'], level: 'debug' } }
        });
        this.logger = log4js.getLogger();
    }
    log(level, msg) {
        const lowerCaseLevel = level.toLowerCase();
        this.logger[lowerCaseLevel === 'trace'
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
                                : 'info'](msg);
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map