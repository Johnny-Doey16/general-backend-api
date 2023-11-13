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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const admin = __importStar(require("firebase-admin"));
const home_1 = __importDefault(require("./controllers/home"));
const auth_1 = __importDefault(require("./controllers/auth"));
const users_1 = __importDefault(require("./controllers/users"));
const products_1 = __importDefault(require("./controllers/products"));
const category_1 = __importDefault(require("./controllers/category"));
const cart_1 = __importDefault(require("./controllers/cart"));
const review_1 = __importDefault(require("./controllers/review"));
const stripe_1 = __importDefault(require("./controllers/stripe"));
const headerImages_1 = __importDefault(require("./controllers/headerImages"));
class Server {
    constructor(port, host) {
        this.app = new app_1.default({
            port: port,
            host: host,
            middlewares: this.initializeMiddlewares(),
            controllers: this.initializeControllers(),
        });
        // const serviceAccount = require("../../etc/secrets/permissions.json");
        const serviceAccount = require("./permissions.json");
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FB_DB_URL,
        });
    }
    initializeMiddlewares() {
        const middlewares = [
            (0, cors_1.default)(),
            body_parser_1.default.json(),
            body_parser_1.default.urlencoded({ extended: true })
        ];
        return middlewares;
    }
    initializeControllers() {
        const controllers = [
            new home_1.default,
            new auth_1.default,
            new users_1.default,
            new products_1.default,
            new category_1.default,
            new cart_1.default,
            new review_1.default,
            new stripe_1.default,
            new headerImages_1.default,
        ];
        return controllers;
    }
    listen() {
        this.app.listen();
    }
}
const server = new Server(8000, "");
server.listen();
//# sourceMappingURL=server.js.map