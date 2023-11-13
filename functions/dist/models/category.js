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
class Category {
    constructor(logger, db) {
        this.logger = logger;
        this.db = db;
        this.logger.log("debug", "Category object instantiated");
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = yield this.db.insert(variables_1.DB_TABLES.CATEGORY, data);
                this.logger.log("info", `Creating new Category with id ${id}`);
                return { statusCode: 200, status: "success" };
            }
            catch (error) {
                this.logger.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.db.findAll(variables_1.DB_TABLES.CATEGORY);
                if (data === null) {
                    return { statusCode: 400, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT("category", "Category") };
                }
                return { statusCode: 200, status: "success", data: data };
            }
            catch (e) {
                this.logger.log("error", variables_1.ERROR_MESSAGES.FETCHING_OBJECT("category", "Category"));
                return { statusCode: 401, status: "error", data: e.message };
            }
        });
    }
    getCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.db.findById(variables_1.DB_TABLES.CATEGORY, "id", id);
                if (data === null) {
                    return { statusCode: 400, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT(id, "Category") };
                }
                return { statusCode: 200, status: "success", data: data };
            }
            catch (e) {
                this.logger.log("error", e.message);
                return { statusCode: 401, status: "error", data: e.message };
            }
        });
    }
    editCategory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.update(variables_1.DB_TABLES.CATEGORY, id, data);
                this.logger.log("info", `Updating Category with id ${id}`);
                return { statusCode: 200, status: "success" };
            }
            catch (error) {
                this.logger.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.delete(variables_1.DB_TABLES.CATEGORY, id);
                this.logger.log("info", `Deleting category with id ${id}`);
                return { statusCode: 200, status: "success", message: "Successfully deleted category" };
            }
            catch (error) {
                this.logger.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
}
exports.default = Category;
//# sourceMappingURL=category.js.map