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
class Order {
    constructor(db) {
        this.db = db;
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = yield this.db.insert(variables_1.DB_TABLES.ORDER, data);
                console.log("info", `Creating new Order item with id ${id}`);
                return { statusCode: 200, status: "success" };
            }
            catch (error) {
                console.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
}
exports.default = Order;
//# sourceMappingURL=order.js.map