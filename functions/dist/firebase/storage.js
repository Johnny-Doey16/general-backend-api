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
const firebase_1 = __importDefault(require("../config/firebase"));
require("firebase/compat/storage");
const sharp_1 = __importDefault(require("sharp"));
class Bucket {
    constructor() {
        this.storage = firebase_1.default.storage();
        this.storageRef = this.storage.ref();
        console.log("info", "DB connection established");
    }
    uploadImage(ref, file, metaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = {
                contentType: metaData,
            };
            try {
                console.log("info", `Uploading image with reference: ${ref}`);
                const imageRef = this.storageRef.child(ref);
                const compressedImage = yield (0, sharp_1.default)(file).resize({ height: 1920, width: 1080, fit: "contain" }).toBuffer();
                const snapshot = yield imageRef.child(`${new Date().getTime()}`).put(compressedImage, metadata);
                const downloadURL = yield snapshot.ref.getDownloadURL();
                console.log("Download URL:", downloadURL);
                return downloadURL;
            }
            catch (error) {
                console.log("fatal", `Error occurred while uploading image with reference: ${ref}. Error: ${error.message}.`);
                throw error;
            }
        });
    }
    deleteImageRef(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("info", `Deleting images with reference: ${ref}`);
                const imageRef = this.storageRef.child(ref);
                const fileNames = yield imageRef.listAll();
                yield Promise.all(fileNames.items.map((file) => {
                    console.log("Deleting");
                    return file.delete();
                }));
            }
            catch (error) {
                console.log("fatal", `Error occurred while uploading image with reference: ${ref}. Error: ${error.message}.`);
                throw error;
            }
        });
    }
    deleteImage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("info", `Deleting image with url: ${url}`);
                const imageRef = this.storageRef.child(url);
                yield imageRef.delete();
            }
            catch (error) {
                console.log("fatal", `Error occurred while deleting image with url: ${url}. Error: ${error.message}.`);
                throw error;
            }
        });
    }
}
exports.default = Bucket;
//# sourceMappingURL=storage.js.map