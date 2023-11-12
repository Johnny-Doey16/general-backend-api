import express, {Request as ExpressRequest, Response} from 'express'
import DB from '../firebase/db';
import Logger from '../services/logger';
import HeaderImages from '../models/headerImages';

interface Request extends ExpressRequest {
    user?: { [key: string]: any };
  }

class HeaderItemsController {
  public path = "/header_images";
  public router = express.Router();

  constructor() {
      this.initRoutes();    
  }

  private initRoutes() {

    this.router.get("/", this.getAllHeaderItems);
  }

  async getAllHeaderItems(req: Request, res: Response): Promise<void> {
      const headerItems = new HeaderImages(new Logger("logs/app.log",), new DB());
      const result = await headerItems.getImages();
      const { data } = result;
    
      const response = {
          count: data.length,
          data: data
      };
      res.status(result.statusCode).json(response);
    
  }

}

export default HeaderItemsController