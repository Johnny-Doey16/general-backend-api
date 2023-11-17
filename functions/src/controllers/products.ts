import express, {Request as ExpressRequest, Response} from 'express'
import { validationResult } from 'express-validator';
import DB from '../firebase/db';
import AdminAuth from '../services/auth';
import Product from '../models/products';
import { RequestHandler } from "express";
import multer, { File } from 'multer';
import Bucket from '../firebase/storage';
import Logger from '../services/logger';
import { DB_TABLES } from '../constants/variables';

interface Request extends ExpressRequest {
    files: any;
    user?: { [key: string]: any };
  }

class ProductController {
  public path = "/products";
  public router = express.Router();
  private middleware: RequestHandler | undefined;

  constructor() {
      this.initRoutes();    
  }

  private initRoutes() {
    const storage = multer.memoryStorage();
    const upload = multer({storage: storage});

    this.router.get("/", this.getAllProducts);
    this.router.get("/category", this.getProdCat);
    this.router.get("/details", this.getProductDetails);
    this.router.post("/", upload.array('images', 4), AdminAuth.isAuthenticated, AdminAuth.isAuthorized({ hasRole: ['admin']}), this.addNewProduct);
    this.router.patch("/", AdminAuth.isAuthenticated, AdminAuth.isAuthorized({ hasRole: ['admin']}), this.editProd);
    this.router.delete("/", AdminAuth.isAuthenticated, AdminAuth.isAuthorized({ hasRole: ['admin']}), this.deleteProduct);
  }

    

  async addNewProduct(req: Request, res: Response) {
    const data = validationResult(req);
    if (!data.isEmpty()) {
      return res.status(422).json({ errors: data.array() });
    }

    const {name, price, qty, desc} = req.body;
    // TODO: Add categories
  
    const urls: string[] = [];
    const db = new DB();

    // Add data to db
    const id = await db.insert(DB_TABLES.PRODUCTS, {
      name: name,
      price: parseFloat(price),
      desc: desc,
      qty: parseInt(qty),
      rating: 0,
      categoryId: ["1", "2", "3"],
      categoryName: ["food", "provision", "vegetables"],
      time: new Date().getTime(),
    });
  
    // Create a Promise to handle the upload process
    const uploadPromises = req.files.map((file) => new Promise<void>(async (resolve, reject) => {
      try {
        const storage = new Bucket();
        await storage.uploadImage(`${DB_TABLES.PRODUCTS}/${id}`, file.buffer, file.mimetype).then((r) =>{
            urls.push(r);
        });
        resolve();
        
      } catch (error) {
        reject(error);
      }

    }));
  
    try {
      // Wait for all the upload promises to resolve
      await Promise.all(uploadPromises);
      console.log("urls", urls);

      // Update products db
      db.update(DB_TABLES.PRODUCTS, id, {images: urls});
      
      return res.status(200).json({ name: req.body.name, urls: urls });
    } catch (error) {
      return res.status(500).json({ error: 'Error occurred during file upload' });
    }
  }   
    

  async getAllProducts(req: Request, res: Response): Promise<void> {
      const start = Date.now();
      const used = process.memoryUsage();
      console.log(`Memory usage: ${JSON.stringify(used)}`);
      /********************************************************* */

      const product = new Product(new Logger("logs/app.log",), new DB());
      const result = await product.getProducts();
      const { data } = result;
      console.log("RESULT", result);
  
      const response = {
          count: data.length,
          data: data
      };

      //**REMOVE***************************************************************/

      const end = Date.now();
      const durationSeconds = (end - start) / 1000;
      
  
      const after = process.memoryUsage();
      console.log(`Memory usage after function execution: ${JSON.stringify(after)}`);

      const memoryBefore = used.heapUsed / 1024 / 1024; // Convert bytes to MB
      const memoryAfter = after.heapUsed / 1024 / 1024; // Convert bytes to MB
      const memoryUsed = memoryAfter - memoryBefore;

      console.log(`Memory used by function: ${memoryUsed.toFixed(2)} MB`);

      const gbSeconds = (memoryUsed / 1024) * durationSeconds;
      console.log(`GB-seconds used: ${gbSeconds}`);

      //*****************************************************************/
      res.status(result.statusCode).json(response);
  }

  async getProdCat(req: Request, res: Response): Promise<void> {
    const id = req.query.id as string;

    const product = new Product(new Logger("logs/app.log",), new DB());
    const result = await product.getProductsByCat(id);
    const { data } = result;

    const response = {
        count: data.length,
        data: data
    };

    res.status(result.statusCode).json(response);
}

  async getProductDetails(req: Request, res: Response): Promise<void> {
      const id = req.query.id as string;

      const product = new Product(new Logger("logs/app.log",), new DB());
      const result = await product.getProduct(id);
      const { data } = result;

      res.status(result.statusCode).json(data);
  }

  async editProd(req: Request, res: Response) {
    const id = req.query.id as string;

    const {name, price, qty, desc} = req.body;
      
    const product = new Product(new Logger("logs/app.log",), new DB());
    const result = await product.editProduct(id, {
      name: name,
      desc: desc,
      price: parseFloat(price),
      qty: parseInt(qty),
    });
    res.status(result.statusCode).json(result);
  }


  async deleteProduct(req: Request, res: Response) {
    const id = req.query.id as string;
    
    const product = new Product(new Logger("logs/app.log",), new DB());
    const result = await product.delete(id);
    res.status(result.statusCode).json(result);
  }

}

export default ProductController