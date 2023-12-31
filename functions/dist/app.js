"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class App {
    constructor(appInit) {
        this.app = (0, express_1.default)();
        this.port = appInit.port;
        this.host = appInit.host;
        this.middlewares(appInit.middlewares);
        this.routes(appInit.controllers);
    }
    listen() {
        this.app.listen(this.port, this.host, () => {
            console.log(`App is running on port ${this.port} and host ${this.host}`);
        });
    }
    routes(controllers) {
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router);
        });
    }
    middlewares(middlewares) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map