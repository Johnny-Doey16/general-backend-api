import express, {Request as ExpressRequest, Response} from 'express'
import DB from '../firebase/db';
import AdminAuth from '../services/auth';
import Cart from '../models/cart';
import Logger from '../services/logger';

interface Request extends ExpressRequest {
    user?: { [key: string]: any };
  }

class CartController {
  public path = "/cart";
  public router = express.Router();

  constructor() {
      this.initRoutes();    
  }

  private initRoutes() {

    this.router.post("/products", this.getCartProducts); // Retrieve products

    this.router.use(AdminAuth.isAuthenticated);
    this.router.use(AdminAuth.isAuthorized({ hasRole: ['admin'], allowSameUser: true}));

    this.router.post("/", this.addNewCartItem); // Add an item to the cart
    this.router.get("/", this.getCartItems); // Retrieve products in the user's cart

    this.router.patch("/add", this.increaseQty); // Update the quantity of items in the shopping cart
    this.router.patch("/sub", this.reduceQty); // Update the quantity of items in the shopping cart
    this.router.delete("/", this.deleteCategory); // remove an item from shopping cart
  }

  async addNewCartItem(req: Request, res: Response) {
    const uid = req.query.uid as string;
    const {productId} = req.body;
      
    const cart = new Cart(new Logger("logs/app.log",), new DB());
    const result = await cart.add({
      userId: uid,
      productId: productId,
      qty: 1,
    });
    res.status(result.statusCode).json(result);
  }   

  async getCartItems(req: Request, res: Response): Promise<void> {
    const uid = req.query.uid as string;

    const cart = new Cart(new Logger("logs/app.log",), new DB());
    const result = await cart.getUserCartItems(uid);
    const { data } = result;

    const response = {
        count: data.length,
        data: data
    };

    res.status(result.statusCode).json(response);
  }

  async getCartProducts(req: Request, res: Response): Promise<void> {
    const {productIds} = req.body;

    const cart = new Cart(new Logger("logs/app.log",), new DB());
    const result = await cart.getProductsFromCart(productIds);

    res.status(result.statusCode).json(result);
  }

  async increaseQty(req: Request, res: Response) {
    const uid = req.query.uid as string;
    const {cartId} = req.body;

    const cart = new Cart(new Logger("logs/app.log",), new DB());
    const result = await cart.increase(cartId);
    res.status(result.statusCode).json(result);
  }

  async reduceQty(req: Request, res: Response) {
    const {cartId} = req.body;

    const cart = new Cart(new Logger("logs/app.log",), new DB());
    const result = await cart.decrease(cartId);
    res.status(result.statusCode).json(result);
  }


  async deleteCategory(req: Request, res: Response) {
    const {cartId} = req.body;
    
    const cart = new Cart(new Logger("logs/app.log",), new DB());
    const result = await cart.delete(cartId);
    res.status(result.statusCode).json(result);
  }

}

export default CartController