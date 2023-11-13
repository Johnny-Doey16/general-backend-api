"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../firebase/db"));
const logger_1 = __importDefault(require("../services/logger"));
const users_1 = __importDefault(require("../models/users"));
const auth_1 = __importDefault(require("../services/auth"));
class UserController {
    constructor() {
        this.path = "/users";
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.use(auth_1.default.isAuthenticated);
        this.router.get("/", auth_1.default.isAuthorized({ hasRole: ['admin'], allowSameUser: true }), this.getUser);
        this.router.get("/all", auth_1.default.isAuthorized({ hasRole: ['admin'] }), this.getUsers);
        this.router.patch("/", auth_1.default.isAuthorized({ hasRole: ['manager'], allowSameUser: true }), this.editProfile);
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = res.locals.uid;
            const user = new users_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield user.getAllUsers(uid);
            const { data } = result;
            const filteredData = data.map((_a) => {
                var { password_hash } = _a, rest = __rest(_a, ["password_hash"]);
                return rest;
            });
            const response = {
                count: filteredData.length,
                data: filteredData
            };
            res.status(result.statusCode).json(response);
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = res.locals.uid;
            const user = new users_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield user.getUser(uid);
            const { data } = result;
            const filteredData = ((_a) => {
                var { password_hash } = _a, rest = __rest(_a, ["password_hash"]);
                return rest;
            })(data);
            res.status(result.statusCode).json(filteredData);
        });
    }
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = req.query.uid;
            const user = new users_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield user.editUserProfile(uid, req.body);
            res.status(result.statusCode).json(result);
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=users.js.map