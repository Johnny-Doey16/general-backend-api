import { DB_TABLES, ERROR_MESSAGES } from "../constants/variables";
import DB from "../firebase/db";
import Logger from "../services/logger";

class Order {
    // id, fullName, date, totalAmount, status, prodIds, prodNames.
    constructor(private db: DB) {}

    async add(data: any) {
        try {
            const id = await this.db.insert(DB_TABLES.ORDER, data);
            console.log("info", `Creating new Order item with id ${id}`);
            return {statusCode: 200, status: "success"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }
}

export default Order;