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
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("../constants/variables");
class User {
    constructor(logger, db) {
        this.logger = logger;
        this.db = db;
        this.logger.log("debug", "User object instantiated");
    }
    getAllUsers(current_uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.db.findAll(variables_1.DB_TABLES.USERS);
                if (data === null) {
                    return { statusCode: 400, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_ALL_USERS() };
                }
                this.logger.log("info", `Retrieving all users from db`);
                const filteredData = data.filter((user) => user.uid !== current_uid);
                return { statusCode: 200, status: "success", data: filteredData };
            }
            catch (e) {
                this.logger.log("error", variables_1.ERROR_MESSAGES.FETCHING_ALL_USERS());
                return { statusCode: 401, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_ALL_USERS() };
            }
        });
    }
    getUser(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.db.findById(variables_1.DB_TABLES.USERS, "uid", uid);
                if (data === null) {
                    return { statusCode: 400, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_USER(uid) };
                }
                this.logger.log("info", `Retrieving all users from db`);
                return { statusCode: 200, status: "success", data: data };
            }
            catch (e) {
                this.logger.log("error", variables_1.ERROR_MESSAGES.FETCHING_USER(uid));
                return { statusCode: 401, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_USER(uid) };
            }
        });
    }
    editUserProfile(uid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.update(variables_1.DB_TABLES.USERS, uid, data);
                this.logger.log("info", `Updating user profile`);
                return { statusCode: 200, status: "success" };
            }
            catch (error) {
                this.logger.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
}
exports.default = User;
//# sourceMappingURL=users.js.map