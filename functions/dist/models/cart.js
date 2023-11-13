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
class Cart {
    constructor(logger, db) {
        this.logger = logger;
        this.db = db;
        this.logger.log("debug", "Cart object instantiated");
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = yield this.db.insert(variables_1.DB_TABLES.CART, data);
                this.logger.log("info", `Creating new Cart item with id ${id}`);
                return { statusCode: 200, status: "success" };
            }
            catch (error) {
                this.logger.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
    getUserCartItems(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartList = yield this.db.findAllById(variables_1.DB_TABLES.CART, "userId", uid);
                this.logger.log("info", `Retrieving all cart items for user: ${uid}`);
                if (cartList === null || cartList.length < 1) {
                    this.logger.log("error", `No item gotten from cart`);
                    return { statusCode: 400, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT("category", "Category") };
                }
                const prodIds = cartList.map((obj) => obj.productId.trim());
                const prodList = yield this.db.findAllWithArray(variables_1.DB_TABLES.PRODUCTS, "id", prodIds);
                const data = prodList.map((prod) => {
                    return {
                        name: prod.name,
                        price: prod.price,
                        qty: prod.qty,
                        image: prod.images[0],
                    };
                });
                this.logger.log("info", `Retrieving all Categories from db`);
                return { statusCode: 200, status: "success", data: data };
            }
            catch (e) {
                this.logger.log("error", variables_1.ERROR_MESSAGES.FETCHING_OBJECT("category", "Category"));
                return { statusCode: 401, status: "error", data: `Error ${e}`
                };
            }
        });
    }
    getProductsFromCart(prodIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const prodList = yield this.db.findAllWithArray(variables_1.DB_TABLES.PRODUCTS, "id", prodIds);
            this.logger.log("info", `Retrieving all Categories from db`);
            console.log("PRODUCTS", prodList);
            return { statusCode: 200, status: "Getting products successfully", products: prodList };
        });
    }
    catch(e) {
        this.logger.log("error", variables_1.ERROR_MESSAGES.FETCHING_OBJECT("category", "Category"));
        return { statusCode: 401, status: "error", data: `Error ${e}`
        };
    }
    increase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartItem = yield this.db.findById(variables_1.DB_TABLES.CART, 'id', id);
                console.log(cartItem);
                const cartQty = cartItem.qty;
                const prodItem = yield this.db.findById(variables_1.DB_TABLES.PRODUCTS, 'id', cartItem.productId);
                console.log(prodItem);
                const prodQty = prodItem.qty;
                if (cartQty + 1 > prodQty) {
                    return { statusCode: 400, status: "error", data: "Product limit exceeded" };
                }
                yield this.db.increase(variables_1.DB_TABLES.CART, id, 1, "qty");
                return { statusCode: 200, status: "success" };
            }
            catch (error) {
                this.logger.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
    decrease(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.decrease(variables_1.DB_TABLES.CART, id, 1, "qty", 1);
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
                yield this.db.delete(variables_1.DB_TABLES.CART, id);
                return { statusCode: 200, status: "success", message: "Successfully deleted category" };
            }
            catch (error) {
                this.logger.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
}
exports.default = Cart;
//# sourceMappingURL=cart.js.map