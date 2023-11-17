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
const category_1 = __importDefault(require("../models/category"));
class CategoryController {
    constructor() {
        this.path = "/category";
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get("/", this.getAllCategories);
        this.router.get("/details", this.getCategory);
        this.router.post("/", auth_1.default.isAuthenticated, auth_1.default.isAuthorized({ hasRole: ['admin'] }), this.addNewCategory);
        this.router.patch("/", auth_1.default.isAuthenticated, auth_1.default.isAuthorized({ hasRole: ['admin'] }), this.editCat);
        this.router.delete("/", auth_1.default.isAuthenticated, auth_1.default.isAuthorized({ hasRole: ['admin'] }), this.deleteCategory);
    }
    addNewCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            const category = new category_1.default(new db_1.default());
            const result = yield category.add({
                name: name,
            });
            res.status(result.statusCode).json(result);
        });
    }
    getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = new category_1.default(new db_1.default());
            const result = yield category.getCategories();
            const { data } = result;
            const response = {
                count: data.length,
                data: data
            };
            res.status(result.statusCode).json(response);
        });
    }
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const category = new category_1.default(new db_1.default());
            const result = yield category.getCategory(id);
            const { data } = result;
            res.status(result.statusCode).json(data);
        });
    }
    editCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const { name } = req.body;
            const category = new category_1.default(new db_1.default());
            const result = yield category.editCategory(id, {
                name: name,
            });
            res.status(result.statusCode).json(result);
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const category = new category_1.default(new db_1.default());
            const result = yield category.delete(id);
            res.status(result.statusCode).json(result);
        });
    }
}
exports.default = CategoryController;
//# sourceMappingURL=category.js.map