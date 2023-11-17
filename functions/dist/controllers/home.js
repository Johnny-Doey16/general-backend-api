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
const admin = require('firebase-admin');
class HomeController {
    constructor() {
        this.path = "/";
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get("/", this.home);
        this.router.post("/", this.card);
    }
    card(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Visited Home");
            const { token, id } = req.body;
            console.log("Token is", token, id);
            res.status(200).json({ message: "👍🏼Welcome to K-Foods " + token });
        });
    }
    home(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).json({ message: "👍🏼Welcome to K-Foods have fun shopping" + process.env.STRIPE_PRIVATE_TEST_KEY + ". DONE" });
        });
    }
}
exports.default = HomeController;
//# sourceMappingURL=home.js.map