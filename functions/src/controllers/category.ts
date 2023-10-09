import express, {Request as ExpressRequest, Response} from 'express'
import DB from '../firebase/db';
import AdminAuth from '../services/auth';
import Category from '../models/category';
import Logger from '../services/logger';

interface Request extends ExpressRequest {
    user?: { [key: string]: any };
  }

class CategoryController {
  public path = "/category";
  public router = express.Router();

  constructor() {
      this.initRoutes();    
  }

  private initRoutes() {

    this.router.get("/", this.getAllCategories);
    this.router.get("/details", this.getCategory);
    this.router.post("/", AdminAuth.isAuthenticated, AdminAuth.isAuthorized({ hasRole: ['admin']}), this.addNewCategory);
    this.router.patch("/", AdminAuth.isAuthenticated, AdminAuth.isAuthorized({ hasRole: ['admin']}), this.editCat);
    this.router.delete("/", AdminAuth.isAuthenticated, AdminAuth.isAuthorized({ hasRole: ['admin']}), this.deleteCategory);
  }

    

  async addNewCategory(req: Request, res: Response) {
    const {name} = req.body;
      
    const category = new Category(new Logger("logs/app.log",), new DB());
    const result = await category.add({
      name: name,
    });
    res.status(result.statusCode).json(result);
  }   
    

  async getAllCategories(req: Request, res: Response): Promise<void> {

      const category = new Category(new Logger("logs/app.log",), new DB());
      const result = await category.getCategories();
      const { data } = result;
  
      const response = {
          count: data.length,
          data: data
      };
  
      res.status(result.statusCode).json(response);
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    const id = req.query.id as string;

    const category = new Category(new Logger("logs/app.log",), new DB());
    const result = await category.getCategory(id);
    const { data } = result;

    res.status(result.statusCode).json(data);
  }

  async editCat(req: Request, res: Response) {
    const id = req.query.id as string;

    const {name} = req.body;
      
    const category = new Category(new Logger("logs/app.log",), new DB());
    const result = await category.editCategory(id, {
      name: name,
    });
    res.status(result.statusCode).json(result);
  }


  async deleteCategory(req: Request, res: Response) {
    const id = req.query.id as string;
    
    const category = new Category(new Logger("logs/app.log",), new DB());
    const result = await category.delete(id);
    res.status(result.statusCode).json(result);
  }

}

export default CategoryController