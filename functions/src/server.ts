import App from "./app";
import bodyParser from 'body-parser';
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as admin from "firebase-admin";
import HomeController from "./controllers/home";
import AuthController from "./controllers/auth";
import UserController from "./controllers/users";
import ProductController from "./controllers/products";
import CategoryController from "./controllers/category";
import CartController from "./controllers/cart";
import ReviewController from "./controllers/review";
import StripeController from "./controllers/stripe";
import HeaderItemsController from "./controllers/headerImages";


class Server {
  private app: App;


  constructor(port: number, host: string) {
    this.app = new App({
        port: port,
        host: host, // Add the host option here
        middlewares: this.initializeMiddlewares(),
        controllers: this.initializeControllers(),
    });
    // import service account file (helps to know the firebase project details)
    const serviceAccount = require("../etc/secrets/permissions.json");//config/permissions.json");

    // Intialize the firebase-admin project/account
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FB_DB_URL,
    });
    
  }

  private initializeMiddlewares(): any {
    const middlewares: any[] = [
      logger("dev"),
      cors(),
      cookieParser(),
      // app.use(express.json());

        bodyParser.json(),
        bodyParser.urlencoded({extended: true})

    ]
    return middlewares;
  }

  private initializeControllers(): any {
    const controllers: any[] = [
        new HomeController,
        new AuthController,
        new UserController,
        new ProductController,
        new CategoryController,
        new CartController,
        new ReviewController,
        new StripeController,
        new HeaderItemsController,
    ]
    return controllers;
  }

  public listen() {
    this.app.listen();
  }
}

// const server = new Server(3400);
const server = new Server(8000, "");
server.listen();

