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
const lite_1 = require("firebase/firestore/lite");
class DB {
    constructor() {
        this.db = (0, lite_1.getFirestore)(firebase_1.default.app());
    }
    insert(table, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbRef = (0, lite_1.collection)(this.db, table);
            const docRef = (0, lite_1.doc)(dbRef);
            const id = docRef.id;
            data['id'] = id;
            (0, lite_1.setDoc)(docRef, data)
                .then((pos) => console.log("info", `Object inserted into DB. POS: ${pos}. Table: ${table} Object: ${JSON.stringify(data)}`))
                .catch((e) => console.log("fatal", `Error occurred while inserting object. Table: ${table}. Error: ${e.message}.`));
            return id;
        });
    }
    insertWithId(table, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, lite_1.setDoc)((0, lite_1.doc)(this.db, table, id), data)
                .then((pos) => console.log("info", `Object inserted into DB. POS: ${pos}. Table: ${id} Object: ${JSON.stringify(data)}`))
                .catch((e) => console.log("fatal", `Error occurred while inserting object. Table: ${id}. Error: ${e.message}.`));
        });
    }
    findAll(table, length) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("info", `Attempting to retrieve all data from table ${table}`);
            try {
                const q = (0, lite_1.query)((0, lite_1.collection)(this.db, table), (0, lite_1.limit)(length));
                const querySnapshot = yield (0, lite_1.getDocs)(q);
                const result = querySnapshot.docs.map((doc) => {
                    return doc.data();
                });
                return result;
            }
            catch (e) {
                console.log("fatal", `Error occurred while retrieving all data, from table ${table}. Error: ${e.message}.`);
                return null;
            }
        });
    }
    findAllInArray(table, column, searchId, length) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("info", `Attempting to retrieve all data from table ${table}`);
            try {
                const q = (0, lite_1.query)((0, lite_1.collection)(this.db, table), (0, lite_1.where)(column, 'array-contains', searchId), (0, lite_1.limit)(length));
                const querySnapshot = yield (0, lite_1.getDocs)(q);
                const result = querySnapshot.docs.map((doc) => {
                    return doc.data();
                });
                return result;
            }
            catch (e) {
                console.log("fatal", `Error occurred while retrieving all data, from table ${table}. Error: ${e.message}.`);
                return null;
            }
        });
    }
    findAllWithArray(table, column, ids, length) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("info", `Attempting to retrieve all data from table ${table} with values ${ids}`);
            try {
                const q = (0, lite_1.query)((0, lite_1.collection)(this.db, table), (0, lite_1.where)(column, 'in', ids), (0, lite_1.limit)(length));
                const querySnapshot = yield (0, lite_1.getDocs)(q);
                const result = querySnapshot.docs.map((doc) => {
                    return doc.data();
                });
                return result;
            }
            catch (e) {
                console.log("fatal", `Error occurred while retrieving all data, from table ${table}. Error: ${e.message}.`);
                return null;
            }
        });
    }
    findAllById(table, column, searchId, length) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("info", `Attempting to retrieve all data from table ${table}`);
            try {
                const q = (0, lite_1.query)((0, lite_1.collection)(this.db, table), (0, lite_1.where)(column, '==', searchId), (0, lite_1.limit)(length));
                const querySnapshot = yield (0, lite_1.getDocs)(q);
                const result = querySnapshot.docs.map((doc) => {
                    return doc.data();
                });
                return result;
            }
            catch (e) {
                console.log("fatal", `Error occurred while retrieving all data, from table ${table}. Error: ${e.message}.`);
                return null;
            }
        });
    }
    findById(table, column, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Attempting to retrieve Object with id, from table ${table}: ${id}`);
            try {
                const q = (0, lite_1.query)((0, lite_1.collection)(this.db, table), (0, lite_1.where)(column, "==", id));
                const querySnapshot = yield (0, lite_1.getDocs)(q);
                if (!querySnapshot.empty) {
                    const firstDocument = querySnapshot.docs[0];
                    const result = firstDocument.data();
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (e) {
                console.log(`Error occurred while retrieving data with id: ${id}, from table ${table}. Error: ${e.message}.`);
                return null;
            }
        });
    }
    update(table, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("info", `Updating object with id ${id}, in table ${table} new data: ${JSON.stringify(data)}`);
                yield (0, lite_1.updateDoc)((0, lite_1.doc)(this.db, table, id), data);
            }
            catch (e) {
                console.log("fatal", `Error occurred while Updating data with id: ${id}, in table ${table}, using object ${data}. Error: ${e.message}.`);
            }
        });
    }
    delete(table, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("info", `Deleting data with id ${id}, from table ${table}`);
                const deleteDocRef = (0, lite_1.doc)(this.db, table, id);
                yield (0, lite_1.deleteDoc)(deleteDocRef);
            }
            catch (e) {
                console.log("fatal", `Error occurred while deleting data with id ${id}, from table ${table}. Error: ${e.message}.`);
            }
        });
    }
    increase(table, id, amount, column_name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("info", `Running transaction to add ${amount} to ${column_name} with id ${id} in table ${table}`);
                const docRef = (0, lite_1.doc)(this.db, table, id);
                yield (0, lite_1.runTransaction)(this.db, (transaction) => __awaiter(this, void 0, void 0, function* () {
                    const doc = yield transaction.get(docRef);
                    if (!doc.exists()) {
                        return "error";
                    }
                    const newVal = doc.data()[column_name] + amount;
                    const newData = {};
                    newData[column_name] = newVal;
                    transaction.update(docRef, newData);
                }));
                console.log("Wallet increased");
                return "success";
            }
            catch (e) {
                console.log("fatal", `Error occurred while adding ${amount} to ${column_name} with an id of ${id}, in table ${table}. Error: ${e.message}.`);
            }
        });
    }
    decrease(table, id, amount, column_name, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const breakPoint = !limit ? 0 : limit;
                let msg = "";
                console.log("info", `Running transaction to subtract ${amount} from ${column_name} with id ${id} in table ${table}`);
                const docRef = (0, lite_1.doc)(this.db, table, id);
                yield (0, lite_1.runTransaction)(this.db, (transaction) => __awaiter(this, void 0, void 0, function* () {
                    const doc = yield transaction.get(docRef);
                    if (!doc.exists()) {
                        msg = "Object not found";
                    }
                    if (doc.data()[column_name] - amount < breakPoint) {
                        msg = "Insufficient funds";
                        console.log("Insufficient funds");
                        return;
                    }
                    const newVal = doc.data()[column_name] - amount;
                    const newData = {};
                    newData[column_name] = newVal;
                    transaction.update(docRef, newData);
                    msg = "Success";
                }));
                return msg;
            }
            catch (e) {
                console.log("fatal", `Error occurred while subtracting ${amount} from ${column_name} with an id of ${id}, in table ${table}. Error: ${e.message}.`);
            }
        });
    }
    decreaseMultiple(table, prods) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            try {
                for (let i = 0; i < prods.length; i++) {
                    const id = prods[i].id;
                    const qty = prods[i].qty;
                    const msg = yield this.decrease(table, id, qty, "qty");
                    results.push(`ID: ${id}, Result: ${msg}`);
                }
                return results;
            }
            catch (e) {
                console.log("fatal", `Error occurred while processing multiple decreases. Error: ${e.message}.`);
                return results;
            }
        });
    }
}
exports.default = DB;
//# sourceMappingURL=db.js.map