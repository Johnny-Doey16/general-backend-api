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
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../firebase/db"));
const auth_1 = __importDefault(require("../services/auth"));
const products_1 = __importDefault(require("../models/products"));
const multer_1 = __importDefault(require("multer"));
const storage_1 = __importDefault(require("../firebase/storage"));
const variables_1 = require("../constants/variables");
class ProductController {
    constructor() {
        this.path = "/products";
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        const storage = multer_1.default.memoryStorage();
        const upload = (0, multer_1.default)({ storage: storage });
        this.router.get("/", this.getAllProducts);
        this.router.get("/category", this.getProdCat);
        this.router.get("/details", this.getProductDetails);
        this.router.post("/", upload.array('images', 4), auth_1.default.isAuthenticated, auth_1.default.isAuthorized({ hasRole: ['admin'] }), this.addNewProduct);
        this.router.patch("/", auth_1.default.isAuthenticated, auth_1.default.isAuthorized({ hasRole: ['admin'] }), this.editProd);
        this.router.delete("/", auth_1.default.isAuthenticated, auth_1.default.isAuthorized({ hasRole: ['admin'] }), this.deleteProduct);
    }
    addNewProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, express_validator_1.validationResult)(req);
            if (!data.isEmpty()) {
                return res.status(422).json({ errors: data.array() });
            }
            const { name, price, qty, desc } = req.body;
            const urls = [];
            const db = new db_1.default();
            const id = yield db.insert(variables_1.DB_TABLES.PRODUCTS, {
                name: name,
                price: parseFloat(price),
                desc: desc,
                qty: parseInt(qty),
                rating: 0,
                categoryId: ["1", "2", "3"],
                categoryName: ["food", "provision", "vegetables"],
                time: new Date().getTime(),
            });
            const uploadPromises = req.files.map((file) => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const storage = new storage_1.default();
                    yield storage.uploadImage(`${variables_1.DB_TABLES.PRODUCTS}/${id}`, file.buffer, file.mimetype).then((r) => {
                        urls.push(r);
                    });
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            })));
            try {
                yield Promise.all(uploadPromises);
                console.log("urls", urls);
                db.update(variables_1.DB_TABLES.PRODUCTS, id, { images: urls });
                return res.status(200).json({ name: req.body.name, urls: urls });
            }
            catch (error) {
                return res.status(500).json({ error: 'Error occurred during file upload' });
            }
        });
    }
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Inside get products");
            const product = new products_1.default(new db_1.default());
            const result = yield product.getProducts();
            const { data } = result;
            console.log("RESULT", result);
            const response = {
                count: data.length,
                data: data
            };
            res.status(result.statusCode).json(response);
        });
    }
    getProdCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const product = new products_1.default(new db_1.default());
            const result = yield product.getProductsByCat(id);
            const { data } = result;
            const response = {
                count: data.length,
                data: data
            };
            res.status(result.statusCode).json(response);
        });
    }
    getProductDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const product = new products_1.default(new db_1.default());
            const result = yield product.getProduct(id);
            const { data } = result;
            res.status(result.statusCode).json(data);
        });
    }
    editProd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const { name, price, qty, desc } = req.body;
            const product = new products_1.default(new db_1.default());
            const result = yield product.editProduct(id, {
                name: name,
                desc: desc,
                price: parseFloat(price),
                qty: parseInt(qty),
            });
            res.status(result.statusCode).json(result);
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const product = new products_1.default(new db_1.default());
            const result = yield product.delete(id);
            res.status(result.statusCode).json(result);
        });
    }
}
exports.default = ProductController;
//# sourceMappingURL=products.js.map