import { DB_TABLES, ERROR_MESSAGES } from "../constants/variables";
import DB from "../firebase/db";
// import Logger from "../services/logger";
import Bucket from '../firebase/storage';

class Product {
    
    // constructor(private logger: Logger, private db: DB) {
    constructor(private db: DB) {
        console.log("debug", "Product object instantiated");
    }

    async getProducts(): Promise<{statusCode: number, status: string, data: any}> {
        try {
            const data: any[] = await this.db.findAll(DB_TABLES.PRODUCTS);

            if (data === null) {
                return {statusCode: 400, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT("products", "Products")}
            }
        
            console.log("info", `Retrieving all users from db`);
        
            return {statusCode: 200, status: "success", data: data};
        } catch (e) {
            console.log("error", ERROR_MESSAGES.FETCHING_OBJECT("products", "Products"));
            return {statusCode: 401, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT("products", "Products")};
        }
    }

    async getProductsByCat(id: string, length?: number): Promise<{statusCode: number, status: string, data: any}> {
        try {
            // TODO: Check if maybe to use both categoryId and categoryName
            const data: any[] = await this.db.findAllInArray(DB_TABLES.PRODUCTS, "categoryId", id);

            if (data === null) {
                return {statusCode: 400, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT("products", "Products")}
            }
        
            console.log("info", `Retrieving all products in category ${id} from db`);
        
            return {statusCode: 200, status: "success", data: data};
        } catch (e) {
            console.log("error", ERROR_MESSAGES.FETCHING_OBJECT("products", "Products"));
            return {statusCode: 401, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT("products", "Products")};
        }
    }

    async getProduct(id: string): Promise<{statusCode: number, status: string, data: any}> {
        try {
            const data = await this.db.findById(DB_TABLES.PRODUCTS, "id", id);
            if (data === null) {
                return {statusCode: 400, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT(id, "Products")}
            }
        
            console.log("info", `Retrieving all users from db`);
        
            return {statusCode: 200, status: "success", data: data};
        } catch (e) {
            console.log("error", ERROR_MESSAGES.FETCHING_OBJECT(id, "Products"));
            return {statusCode: 401, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT(id, "Products")};
        }
    }

    async editProduct(id: string, data: any) {
        try {
            await this.db.update(DB_TABLES.PRODUCTS, id, data);
            console.log("info", `Updating product with id ${id}`);
            return {statusCode: 200, status: "success"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }

    async delete(id: string) {
        try {
            await new Bucket().deleteImageRef(`${DB_TABLES.PRODUCTS}/${id}/`);
            await this.db.delete(DB_TABLES.PRODUCTS, id);
            console.log("info", `Deleting product with id ${id}`);
            return {statusCode: 200, status: "success", message: "Successfully deleted product"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }
}

export default Product;
