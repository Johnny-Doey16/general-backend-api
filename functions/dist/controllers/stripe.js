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
const stripe_1 = __importDefault(require("../services/stripe"));
const order_1 = __importDefault(require("../models/order"));
const db_1 = __importDefault(require("../firebase/db"));
const variables_1 = require("../constants/variables");
const admin = require('firebase-admin');
class StripeController {
    constructor() {
        this.path = "/payment";
        this.router = express_1.default.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/charge", this.buy);
        this.router.get("/balance", this.balance);
    }
    buy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, express_validator_1.validationResult)(req);
            if (!data.isEmpty()) {
                return res.status(422).json({ errors: data.array() });
            }
            let amount = req.body.amount;
            const { token, desc, fullName, prods, prodNames } = req.body;
            console.log("DATA for Stripe", req.body);
            console.log("Token: ", token);
            const charge = yield new stripe_1.default().chargeCard(amount, "usd", desc, token);
            if (charge.paid) {
                yield new order_1.default(new db_1.default()).add(Object.assign({ fullName: fullName, totalAmount: amount, products: prods, time: new Date().getTime() }, charge));
                const data = yield new db_1.default().findById(variables_1.DB_TABLES.USERS, "email", "admin@kfooods.com");
                console.log("USER", data);
                const message = {
                    notification: {
                        title: 'Order Completed',
                        body: `${fullName} has placed an order of ${amount} for ${prodNames}`,
                    },
                    token: data.fcmToken,
                };
                yield admin
                    .messaging()
                    .send(message)
                    .then((response) => {
                    console.log('Successfully sent message:', response);
                })
                    .catch((error) => {
                    console.log('Error sending message:', error);
                });
                yield new db_1.default().decreaseMultiple(variables_1.DB_TABLES.PRODUCTS, prods);
            }
            return res.status(200).json(charge);
        });
    }
    balance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, express_validator_1.validationResult)(req);
            if (!data.isEmpty()) {
                return res.status(422).json({ errors: data.array() });
            }
            const bal = yield new stripe_1.default().getBalance();
            res.status(200).json(bal);
        });
    }
}
exports.default = StripeController;
//# sourceMappingURL=stripe.js.map