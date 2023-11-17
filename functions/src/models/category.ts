import { DB_TABLES, ERROR_MESSAGES } from "../constants/variables";
import DB from "../firebase/db";
// import Logger from "../services/logger";

class Category {
    
    // constructor(private logger: Logger, private db: DB) {
    constructor(private db: DB) {
        console.log("debug", "Category object instantiated");
    }

    async add(data: any) {
        try {
            const id = await this.db.insert(DB_TABLES.CATEGORY, data);
            console.log("info", `Creating new Category with id ${id}`);
            return {statusCode: 200, status: "success"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }

    async getCategories(): Promise<{statusCode: number, status: string, data: any}> {
        try {
            const data: any[] = await this.db.findAll(DB_TABLES.CATEGORY);

            if (data === null) {
                return {statusCode: 400, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT("category", "Category")}
            }
        
            // console.log("info", `Retrieving all Categories from db`);
        
            return {statusCode: 200, status: "success", data: data};
        } catch (e) {
            console.log("error", ERROR_MESSAGES.FETCHING_OBJECT("category", "Category"));
            return {statusCode: 401, status: "error", data: e.message};
        }
    }

    async getCategory(id: string): Promise<{statusCode: number, status: string, data: any}> {
        try {
            const data = await this.db.findById(DB_TABLES.CATEGORY, "id", id);
            if (data === null) {
                return {statusCode: 400, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT(id, "Category")}
            }
        
            // console.log("info", `Retrieving Category with id: ${id} from db`);
        
            return {statusCode: 200, status: "success", data: data};
        } catch (e) {
            console.log("error", e.message);
            return {statusCode: 401, status: "error", data: e.message};
        }
    }

    async editCategory(id: string, data: any) {
        try {
            await this.db.update(DB_TABLES.CATEGORY, id, data);
            console.log("info", `Updating Category with id ${id}`);
            return {statusCode: 200, status: "success"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }

    async delete(id: string) {
        try {
            await this.db.delete(DB_TABLES.CATEGORY, id);
            console.log("info", `Deleting category with id ${id}`);
            return {statusCode: 200, status: "success", message: "Successfully deleted category"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }
}

export default Category;
