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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../config/firebase"));
require("firebase/compat/auth");
const db_1 = __importDefault(require("../firebase/db"));
const admin = __importStar(require("firebase-admin"));
const variables_1 = require("../constants/variables");
class FirebaseAuth {
    constructor() {
        this.auth = firebase_1.default.auth();
        console.log("info", "Auth Instantiated");
    }
    createUser(userData, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userCredential = yield this.auth.createUserWithEmailAndPassword(userData.email, userData.password);
                const user = userCredential.user;
                const uid = user.uid;
                console.log('info', `Registered user: ${uid}`);
                try {
                    const db = new db_1.default();
                    db.insertWithId("Users", uid, {
                        "uid": uid,
                        "email": userData.email,
                        "firstName": userData.firstName,
                        "lastName": userData.lastName,
                        "phone": userData.phone,
                    });
                }
                catch (error) {
                    return res.status(400).json({ message: "An error occurred while adding user to db", error: error, status: 400 });
                }
                const userDelegate = user['_delegate']['stsTokenManager'];
                const accessToken = userDelegate['accessToken'];
                yield this.sendVerificationEmail();
                yield admin.auth().setCustomUserClaims(uid, { role: "user" })
                    .then(() => {
                    console.log('Role assigned successfully');
                })
                    .catch((error) => {
                    console.error('Error assigning role:', error);
                });
                console.log("User verification status: ", user.emailVerified);
                return res.status(200).json({ message: "Account created successfully. Please verify email", accessToken: accessToken, status: 200 });
            }
            catch (error) {
                console.log('error', `Error occurred while registering user: ${error}`);
                return res.status(401).json({ message: "An error occurred while registering user", error: error, status: 401 });
            }
        });
    }
    loginUser(email, password, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userCredential = yield this.auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                const uid = user.uid;
                let userData;
                console.log('info', `Signing in user: ${uid}`);
                const userDelegate = user['_delegate']['stsTokenManager'];
                const accessToken = userDelegate['accessToken'];
                const refreshToken = userDelegate['refreshToken'];
                const exp = userDelegate['expirationTime'];
                if (!user.emailVerified) {
                    yield this.sendVerificationEmail();
                }
                else {
                    userData = yield new db_1.default().findById(variables_1.DB_TABLES.USERS, "uid", uid);
                }
                return user.emailVerified
                    ? res.status(200).json({ message: "User logged in successfully", accessToken: accessToken, refreshToken: refreshToken, expiration: exp, user: userData })
                    : res.status(201).json({ message: "Please verify your account" });
            }
            catch (error) {
                console.log('error', `Error occurred while signing in user: ${error}`);
                return res.status(401).json({ error: error.name, message: error.message });
            }
        });
    }
    sendVerificationEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            this.auth.currentUser.sendEmailVerification().then(() => {
                console.log("Email sent");
            });
        });
    }
    getLoggedInUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.auth.onAuthStateChanged((user) => __awaiter(this, void 0, void 0, function* () {
                if (user) {
                    console.log("Current user is ", user);
                    return this.auth.currentUser;
                }
                else {
                    console.log("User logged out");
                    return null;
                }
            }));
        });
    }
    getUserProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.auth.currentUser;
            const profile = {};
            if (user === null) {
                return null;
            }
            profile['uid'] = user.uid;
            profile['email'] = user.email;
            profile['username'] = user.displayName;
            profile['photoURL'] = user.photoURL;
            profile['emailVerified'] = user.emailVerified;
            return profile;
        });
    }
    updateProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.auth.currentUser.updateProfile(profile);
                console.log("User profile updated");
            }
            catch (error) {
                console.log(error);
                console.log('error', `Error occurred while updating profile: ${error}`);
                return null;
            }
        });
    }
    updateEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.auth.currentUser.updateEmail(email);
            }
            catch (error) {
                console.log(error);
                console.log('error', `Error occurred while updating email: ${error}`);
                return null;
            }
        });
    }
    updatePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.auth.updatePassword(password);
        });
    }
    sendPasswordResetEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('info', `Sending password reset email to ${email}`);
                this.auth.sendPasswordResetEmail(email);
            }
            catch (error) {
                console.log('error', `Error occurred while sending password reset email: ${error}`);
            }
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.auth.onAuthStateChanged((user) => __awaiter(this, void 0, void 0, function* () {
                if (user) {
                    this.auth.signOut();
                    console.log("User was successfully logged out");
                }
                else {
                    console.log("User logged out");
                }
            }));
        });
    }
    deleteUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.auth.deleteUser();
        });
    }
}
exports.default = FirebaseAuth;
//# sourceMappingURL=auth.js.map