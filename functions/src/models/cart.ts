import { DB_TABLES, ERROR_MESSAGES } from "../constants/variables";
import DB from "../firebase/db";
// import Logger from "../services/logger";

class Cart {
    
    // constructor(private logger: Logger, private db: DB) {
    constructor(private db: DB) {
        console.log("debug", "Cart object instantiated");
    }

    async add(data: any) {
        try {
            const id = await this.db.insert(DB_TABLES.CART, data);
            console.log("info", `Creating new Cart item with id ${id}`);
            return {statusCode: 200, status: "success"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }

    async getUserCartItems(uid: string): Promise<{statusCode: number, status: string, data: any}> {
        try {
            // Get all products[] in cart belonging to the user
            const cartList: any[] = await this.db.findAllById(DB_TABLES.CART, "userId", uid);
            console.log("info", `Retrieving all cart items for user: ${uid}`);

            if (cartList === null || cartList.length < 1) {
                console.log("error", `No item gotten from cart`);
                return {statusCode: 400, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT("category", "Category")}
            }

            // Fetch the products data in products db (id, name, images[0], price, qty)
            const prodIds = cartList.map((obj) => obj.productId.trim());

            const prodList: any[] = await this.db.findAllWithArray(DB_TABLES.PRODUCTS, "id", prodIds);
            
            const data = prodList.map((prod) => {
                return {
                  name: prod.name,
                  price: prod.price,
                  qty: prod.qty,
                  image: prod.images[0],
                };
              });
        
            console.log("info", `Retrieving all Categories from db`);
        
            return {statusCode: 200, status: "success", data: data};
        } catch (e) {
            console.log("error", ERROR_MESSAGES.FETCHING_OBJECT("category", "Category"));
            return {statusCode: 401, status: "error", data: `Error ${e}` //ERROR_MESSAGES.FETCHING_OBJECT("Category", "Category")
        };
        }
    }

    async getProductsFromCart(prodIds: string[]) {
        // Fetch the products data in products db (id, name, images[0], price, qty)
        // const prodIds = cartList.map((obj) => obj.productId.trim());

        const prodList: any[] = await this.db.findAllWithArray(DB_TABLES.PRODUCTS, "id", prodIds);
        
        // const data = prodList.map((prod) => {
        //     return {
        //       name: prod.name,
        //       price: prod.price,
        //       qty: prod.qty,
        //       image: prod.images[0],
        //     };
        //   });
    
        console.log("info", `Retrieving all Categories from db`);
        console.log("PRODUCTS", prodList);
        
    
        return {statusCode: 200, status: "Getting products successfully", products: prodList};
    } catch (e) {
        console.log("error", ERROR_MESSAGES.FETCHING_OBJECT("category", "Category"));
        return {statusCode: 401, status: "error", data: `Error ${e}` //ERROR_MESSAGES.FETCHING_OBJECT("Category", "Category")
    };
    // }
    }

    async increase(id: string) {
        try {
            // Get qty of prod
            const cartItem = await this.db.findById(DB_TABLES.CART, 'id', id);
            console.log(cartItem);
            const cartQty = cartItem.qty;
            
            const prodItem = await this.db.findById(DB_TABLES.PRODUCTS, 'id', cartItem.productId);
            console.log(prodItem);
            const prodQty = prodItem.qty;

            if (cartQty+1 > prodQty) {
                return {statusCode: 400, status: "error", data: "Product limit exceeded"};
            }

            // Increase by 1 if not > prod qty
            await this.db.increase(DB_TABLES.CART, id, 1, "qty");

            // console.log("info", `Increasing Category with id ${id}`);
            return {statusCode: 200, status: "success"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }

    async decrease(id: string) {
        try {
            await this.db.decrease(DB_TABLES.CART, id, 1, "qty", 1);

            // console.log("info", `Increasing Category with id ${id}`);
            return {statusCode: 200, status: "success"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }

    async delete(id: string) {
        try {
            await this.db.delete(DB_TABLES.CART, id);
            // console.log("info", `Deleting category with id ${id}`);
            return {statusCode: 200, status: "success", message: "Successfully deleted category"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }
}

export default Cart;
