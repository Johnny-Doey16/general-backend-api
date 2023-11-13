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
const review_1 = __importDefault(require("../models/review"));
const logger_1 = __importDefault(require("../services/logger"));
class ReviewController {
    constructor() {
        this.path = "/reviews";
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.use(auth_1.default.isAuthenticated);
        this.router.use(auth_1.default.isAuthorized({ hasRole: ['admin'], allowSameUser: true }));
        this.router.post("/", this.addNewReview);
        this.router.get("/", this.getReviews);
        this.router.patch("/", this.editReview);
        this.router.delete("/", this.deleteCategory);
    }
    addNewReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = req.query.uid;
            const { productId, rating, text } = req.body;
            const review = new review_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield review.add({
                userId: uid,
                productId: productId,
                rating: parseInt(rating),
                text: text,
                time: new Date().getTime(),
            });
            res.status(result.statusCode).json(result);
        });
    }
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.body;
            const review = new review_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield review.getProdReviews(productId);
            const { data } = result;
            const response = {
                count: data.length,
                data: data
            };
            res.status(result.statusCode).json(response);
        });
    }
    editReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const { rating, text } = req.body;
            const review = new review_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield review.edit(id, {
                rating: parseInt(rating),
                text: text,
            });
            res.status(result.statusCode).json(result);
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reviewId } = req.body;
            const review = new review_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield review.delete(reviewId);
            res.status(result.statusCode).json(result);
        });
    }
}
exports.default = ReviewController;
//# sourceMappingURL=review.js.map