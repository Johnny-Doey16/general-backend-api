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
class HeaderImages {
    constructor(db) {
        this.db = db;
        console.log("debug", "Header Images object instantiated");
    }
    getImages() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ERROR OCCURRED");
            try {
                const data = yield this.db.findAll(variables_1.DB_TABLES.HEADER_IMAGES);
                if (data === null) {
                    return { statusCode: 400, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT("Header Images", "HeaderImages") };
                }
                console.log("info", `Retrieving all header images content from db`);
                return { statusCode: 200, status: "success", data: data };
            }
            catch (e) {
                console.log("error", variables_1.ERROR_MESSAGES.FETCHING_OBJECT("Header Images", "HeaderImages"));
                return { statusCode: 401, status: "error", data: variables_1.ERROR_MESSAGES.FETCHING_OBJECT("Header Images", "HeaderImages") };
            }
        });
    }
}
exports.default = HeaderImages;
//# sourceMappingURL=headerImages.js.map