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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("../constants/variables");
class Review {
    constructor(db) {
        this.db = db;
        console.log("debug", "Cart object instantiated");
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = yield this.db.insert(variables_1.DB_TABLES.REVIEW, data);
                return { statusCode: 200, status: "success" };
            }
            catch (error) {
                console.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
    getProdReviews(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewList = yield this.db.findAllById(variables_1.DB_TABLES.REVIEW, "productId", id);
                console.log("Review list", reviewList);
                if (reviewList === null || reviewList.length < 1) {
                    console.log("error", `No item gotten from cart`);
                    return { statusCode: 400, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT("category", "Category") };
                }
                const userIds = reviewList.map((obj) => obj.userId.trim());
                console.log("User ids", userIds);
                const prodList = yield this.db.findAllWithArray(variables_1.DB_TABLES.USERS, "uid", userIds);
                console.log("Product list", prodList);
                const newList = reviewList.map((item) => {
                    const user = prodList.find((user) => user.uid === item.userId);
                    return Object.assign(Object.assign({}, item), { firstName: (user === null || user === void 0 ? void 0 : user.firstName) || "", lastName: (user === null || user === void 0 ? void 0 : user.lastName) || "" });
                });
                const filteredData = newList.map((_a) => {
                    var { userId } = _a, rest = __rest(_a, ["userId"]);
                    return rest;
                });
                console.log("info", `Retrieving all Categories from db`);
                return { statusCode: 200, status: "success", data: filteredData };
            }
            catch (e) {
                console.log("error", variables_1.ERROR_MESSAGES.FETCHING_OBJECT("category", "Category"));
                return { statusCode: 401, status: "error", data: `Error ${e}`
                };
            }
        });
    }
    edit(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.update(variables_1.DB_TABLES.REVIEW, id, data);
                console.log("info", `Editing reviews with id ${id}`);
                return { statusCode: 200, status: "success" };
            }
            catch (error) {
                console.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.delete(variables_1.DB_TABLES.REVIEW, id);
                return { statusCode: 200, status: "success", message: "Successfully deleted category" };
            }
            catch (error) {
                console.log("error", error);
                return { statusCode: 401, status: "error", data: error };
            }
        });
    }
}
exports.default = Review;
//# sourceMappingURL=review.js.map