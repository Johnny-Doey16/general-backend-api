import { DB_TABLES, ERROR_MESSAGES } from "../constants/variables";
import DB from "../firebase/db";
// import Logger from "../services/logger";

class Review {
    
    constructor(private db: DB) {
        console.log("debug", "Cart object instantiated");
    }

    async add(data: any) {
        try {
            const id = await this.db.insert(DB_TABLES.REVIEW, data);
            // console.log("info", `Creating new Review with id ${id}`);
            return {statusCode: 200, status: "success"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }

    async getProdReviews(id: string): Promise<{statusCode: number, status: string, data: any}> {
        try {
            // Get all reviews[] in cart belonging to the user
            const reviewList: any[] = await this.db.findAllById(DB_TABLES.REVIEW, "productId", id);
            // console.log("info", `Retrieving all cart items for user: ${uid}`);
            console.log("Review list", reviewList);
            

            if (reviewList === null || reviewList.length < 1) {
                console.log("error", `No item gotten from cart`);
                return {statusCode: 400, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT("category", "Category")}
            }

            // Fetch the products data in products db (id, name, images[0], price, qty)
            const userIds = reviewList.map((obj) => obj.userId.trim());
            console.log("User ids", userIds);
            

            const prodList: any[] = await this.db.findAllWithArray(DB_TABLES.USERS, "uid", userIds);
            console.log("Product list", prodList);
            
            const newList = reviewList.map((item) => {
                const user = prodList.find((user) => user.uid === item.userId);
                return {
                  ...item,
                  firstName: user?.firstName || "",
                  lastName: user?.lastName || "",
                };
              });

            const filteredData = newList.map(({ userId, ...rest }) => rest);
        
            console.log("info", `Retrieving all Categories from db`);
        
            return {statusCode: 200, status: "success", data: filteredData};
        } catch (e) {
            console.log("error", ERROR_MESSAGES.FETCHING_OBJECT("category", "Category"));
            return {statusCode: 401, status: "error", data: `Error ${e}` //ERROR_MESSAGES.FETCHING_OBJECT("Category", "Category")
        };
        }
    }

    async edit(id: string, data: any) {
        try {
            await this.db.update(DB_TABLES.REVIEW, id, data);
            console.log("info", `Editing reviews with id ${id}`);
            return {statusCode: 200, status: "success"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }

    async delete(id: string) {
        try {
            await this.db.delete(DB_TABLES.REVIEW, id);
            // console.log("info", `Deleting category with id ${id}`);
            return {statusCode: 200, status: "success", message: "Successfully deleted category"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }
}

export default Review;
