"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const admin = __importStar(require("firebase-admin"));
class AdminAuth {
    constructor() { }
    static isAuthenticated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization || "";
            const token = authHeader.replace("Bearer", "");
            if (!token) {
                return res.status(401).json({ error: 'Access token not provided.' });
            }
            try {
                const decodedToken = yield admin.auth().verifyIdToken(token);
                console.log("decodedToken", JSON.stringify(decodedToken));
                res.locals = Object.assign(Object.assign({}, res.locals), { uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email, email_verified: decodedToken.email_verified });
                console.log("Locals: ", res.locals);
                return next();
            }
            catch (err) {
                console.error(`${err.code} -  ${err.message}`);
                return res.status(403).send({ message: 'Unauthorized' });
            }
        });
    }
    static isAuthorized(opts) {
        return (req, res, next) => {
            const { role, email, uid, email_verified } = res.locals;
            const id = req.query.uid;
            if (!role) {
                return res.status(401).json({ error: "Role not found", message: "User doesn't have sufficient permissions" });
            }
            if (!email_verified) {
                return res.status(402).send({ error: "Email unverified", message: 'Please verify your email' });
            }
            if (opts.allowSameUser && id && uid === id) {
                console.log("Inside same user id as that passed in query");
                return next();
            }
            if (opts.hasRole.includes(role)) {
                console.log("Found user's role so allow");
                return next();
            }
            return res.status(403).json({ error: "User not authorized", message: "An unknown error occurred" });
        };
    }
}
exports.default = AdminAuth;
//# sourceMappingURL=auth.js.map