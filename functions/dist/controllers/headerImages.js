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
const logger_1 = __importDefault(require("../services/logger"));
const headerImages_1 = __importDefault(require("../models/headerImages"));
class HeaderItemsController {
    constructor() {
        this.path = "/header_images";
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get("/", this.getAllHeaderItems);
    }
    getAllHeaderItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const headerItems = new headerImages_1.default(new logger_1.default("logs/app.log"), new db_1.default());
            const result = yield headerItems.getImages();
            const { data } = result;
            const response = {
                count: data.length,
                data: data
            };
            res.status(result.statusCode).json(response);
        });
    }
}
exports.default = HeaderItemsController;
//# sourceMappingURL=headerImages.js.map