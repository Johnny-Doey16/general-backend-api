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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../firebase/db"));
const auth_1 = __importDefault(require("../services/auth"));
const cart_1 = __importDefault(require("../models/cart"));
const logger_1 = __importDefault(require("../services/logger"));
class CartController {
    constructor() {
        this.path = "/cart";
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/products", this.getCartProducts);
        this.router.use(auth_1.default.isAuthenticated);
        this.router.use(auth_1.default.isAuthorized({ hasRole: ['admin'], allowSameUser: true }));
        this.router.post("/", this.addNewCartItem);
        this.router.get("/", this.getCartItems);
        this.router.patch("/add", this.increaseQty);
        this.router.patch("/sub", this.reduceQty);
        this.router.delete("/", this.deleteCategory);
    }
    addNewCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = req.query.uid;
            const { productId } = req.body;
            const cart = new cart_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield cart.add({
                userId: uid,
                productId: productId,
                qty: 1,
            });
            res.status(result.statusCode).json(result);
        });
    }
    getCartItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = req.query.uid;
            const cart = new cart_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield cart.getUserCartItems(uid);
            const { data } = result;
            const response = {
                count: data.length,
                data: data
            };
            res.status(result.statusCode).json(response);
        });
    }
    getCartProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productIds } = req.body;
            const cart = new cart_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield cart.getProductsFromCart(productIds);
            res.status(result.statusCode).json(result);
        });
    }
    increaseQty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = req.query.uid;
            const { cartId } = req.body;
            const cart = new cart_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield cart.increase(cartId);
            res.status(result.statusCode).json(result);
        });
    }
    reduceQty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cartId } = req.body;
            const cart = new cart_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield cart.decrease(cartId);
            res.status(result.statusCode).json(result);
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cartId } = req.body;
            const cart = new cart_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield cart.delete(cartId);
            res.status(result.statusCode).json(result);
        });
    }
}
exports.default = CartController;
//# sourceMappingURL=cart.js.map