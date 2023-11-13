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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_TEST_KEY);
class StripeGateway {
    constructor() { }
    createCustomer() {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield stripe.balance.retrieve();
            console.log(balance);
        });
    }
    chargeCard(amount, currency, desc, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const charge = yield stripe.charges.create({
                    amount: Math.round(amount * 100),
                    currency: currency,
                    source: token,
                    description: "Example charge for test",
                });
                console.log("Payment successful");
                console.log(charge);
                const charge_id = charge.id;
                const paid = charge.paid;
                const card = charge.payment_method;
                const method = charge.payment_method_details.type;
                const cardType = charge.payment_method_details.card.brand;
                const receipt = charge.receipt_url;
                const status = charge.status;
                const refunded = charge.refunded;
                return { "charge_id": charge_id, "paid": paid, "card": card, "method": method, "cardType": cardType, "receipt": receipt, "status": status, "refunded": refunded };
            }
            catch (err) {
                console.error('Error processing payment:', err);
                let message = 'An error occurred while processing your payment. ' + err.type + ". " + err.message;
                if (err.type === 'StripeCardError') {
                    console.log("Stripe error");
                    message = err.message;
                }
                console.log("Error occurred", message);
                return { message: err.message, error: err };
            }
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const balance = yield stripe.balance.retrieve();
                console.log(balance);
                return { "balance": balance };
            }
            catch (error) {
                console.log("Error:", error);
                return { "error": error };
            }
        });
    }
}
exports.default = StripeGateway;
//# sourceMappingURL=stripe.js.map