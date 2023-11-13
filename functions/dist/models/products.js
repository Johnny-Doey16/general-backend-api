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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("../constants/variables");
const storage_1 = __importDefault(require("../firebase/storage"));
class Product {
    constructor(logger, db) {
        this.logger = logger;
        this.db = db;
        this.logger.log("debug", "Product object instantiated");
    }
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.db.findAll(variables_1.DB_TABLES.PRODUCTS);
                if (data === null) {
                    return { statusCode: 400, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT("products", "Products") };
                }
                this.logger.log("info", `Retrieving all users from db`);
                return { statusCode: 200, status: "success", data: data };
            }
            catch (e) {
                this.logger.log("error", variables_1.ERROR_MESSAGES.FETCHING_OBJECT("products", "Products"));
                return { statusCode: 401, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT("products", "Products") };
            }
        });
    }
    getProductsByCat(id, length) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.db.findAllInArray(variables_1.DB_TABLES.PRODUCTS, "categoryId", id);
                if (data === null) {
                    return { statusCode: 400, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT("products", "Products") };
                }
                this.logger.log("info", `Retrieving all products in category ${id} from db`);
                return { statusCode: 200, status: "success", data: data };
            }
            catch (e) {
                this.logger.log("error", variables_1.ERROR_MESSAGES.FETCHING_OBJECT("products", "Products"));
                return { statusCode: 401, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT("products", "Products") };
            }
        });
    }
    getProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.db.findById(variables_1.DB_TABLES.PRODUCTS, "id", id);
                if (data === null) {
                    return { statusCode: 400, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT(id, "Products") };
                }
                this.logger.log("info", `Retrieving all users from db`);
                return { statusCode: 200, status: "success", data: data };
            }
            catch (e) {
                this.logger.log("error", variables_1.ERROR_MESSAGES.FETCHING_OBJECT(id, "Products"));
                return { statusCode: 401, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT(id, "Products") };
            }
        });
    }
    editProduct(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.update(variables_1.DB_TABLES.PRODUCTS, id, data);
                this.logger.log("info", `Updating product with id ${id}`);
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
                yield new storage_1.default().deleteImageRef(`${variables_1.DB_TABLES.PRODUCTS}/${id}/`);
                yield this.db.delete(variables_1.DB_TABLES.PRODUCTS, id);
                this.logger.log("info", `Deleting product with id ${id}`);
                return { statusCode: 200, status: "success", message: "Successfully deleted product" };
            }
            catch (error) {
                this.logger.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
}
exports.default = Product;
//# sourceMappingURL=products.js.map