import express, {Request as ExpressRequest, Response} from 'express'
import DB from '../firebase/db';
import AdminAuth from '../services/auth';
import Review from '../models/review';
import Cart from '../models/cart';
// import Logger from '../services/logger';

interface Request extends ExpressRequest {
    user?: { [key: string]: any };
  }

class ReviewController {
  public path = "/reviews";
  public router = express.Router();

  constructor() {
      this.initRoutes();    
  }

  private initRoutes() {

    this.router.use(AdminAuth.isAuthenticated);
    this.router.use(AdminAuth.isAuthorized({ hasRole: ['admin'], allowSameUser: true}));

    this.router.post("/", this.addNewReview); // Add a review for a product
    this.router.get("/", this.getReviews); // Retrieve all reviews for a product

    this.router.patch("/", this.editReview); // Update a specific review
    this.router.delete("/", this.deleteCategory); // delete a review
  }

  async addNewReview(req: Request, res: Response) {
    const uid = req.query.uid as string;
    const {productId, rating, text} = req.body;
      
    const review = new Review(new DB());
    const result = await review.add({
      userId: uid,
      productId: productId,
      rating: parseInt(rating),
      text: text,
      time: new Date().getTime(),
    });
    res.status(result.statusCode).json(result);
  }   

  async getReviews(req: Request, res: Response): Promise<void> {
    const {productId} = req.body;

    const review = new Review(new DB());
    const result = await review.getProdReviews(productId);
    const { data } = result;

    const response = {
        count: data.length,
        data: data
    };

    res.status(result.statusCode).json(response);
  }

  async editReview(req: Request, res: Response) {
    const id = req.query.id as string;

    const {rating, text} = req.body;
      
    const review = new Review(new DB());
    const result = await review.edit(id, {
      rating: parseInt(rating),
      text: text,
    });
    res.status(result.statusCode).json(result);
  }

  async deleteCategory(req: Request, res: Response) {
    const {reviewId} = req.body;
    
    const review = new Review(new DB());
    const result = await review.delete(reviewId);
    res.status(result.statusCode).json(result);
  }

}

export default ReviewController