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
const auth_1 = __importDefault(require("../firebase/auth"));
class AuthController {
    constructor() {
        this.path = "/auth";
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/register", this.validateBody("register"), this.register);
        this.router.post("/login", this.validateBody("login"), this.logIn);
        this.router.get("/logout", this.logout);
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, express_validator_1.validationResult)(req);
            const { email, password, firstName, lastName, phone } = req.body;
            if (!data.isEmpty()) {
                console.log(data.array());
                const errorMsg = data.array()[0]['path'] == "password" ? "Please enter a strong password." : "Please enter correct email format.";
                return res.status(422).json({ error: "Error occurred", message: data.array()[0].msg + " " + data.array()[0]['path'] + ". " + errorMsg });
            }
            const auth = new auth_1.default();
            yield auth.createUser({
                email: email,
                phone: phone,
                password: password,
                firstName: firstName,
                lastName: lastName
            }, res);
        });
    }
    logIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                console.log(result.array());
                return res.status(422).json({ error: "Error occurred", message: result.array()[0].msg + " " + result.array()[0]['path'] });
            }
            const { email, password, } = req.body;
            const auth = new auth_1.default();
            yield auth.loginUser(email, password, res);
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new auth_1.default().logout();
            res.status(200).json({ message: "Successfully logged out" });
        });
    }
    validateBody(type) {
        switch (type) {
            case "register":
                return [
                    (0, express_validator_1.body)("email").notEmpty().normalizeEmail().isEmail(),
                    (0, express_validator_1.body)("password").notEmpty().isStrongPassword(),
                    (0, express_validator_1.body)("firstName").notEmpty().isString(),
                    (0, express_validator_1.body)("lastName").notEmpty().isString(),
                ];
                break;
            case "login":
                return [
                    (0, express_validator_1.body)("email").notEmpty().normalizeEmail().isEmail(),
                ];
                break;
            default:
                break;
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.js.map