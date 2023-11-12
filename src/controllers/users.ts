import express, {Request as ExpressRequest, Response} from 'express'
import DB from '../firebase/db';
import Logger from '../services/logger';
import { RequestHandler } from "express";
import User from '../models/users';
import AdminAuth from '../services/auth';

interface Request extends ExpressRequest {
    user?: { [key: string]: any };
  }

class UserController {
    public path = "/users";
    public router = express.Router();
    private middleware: RequestHandler | undefined;

    constructor() {
        this.initRoutes();    
    }

    private initRoutes() {
        this.router.use(AdminAuth.isAuthenticated);
        this.router.get("/", AdminAuth.isAuthorized({ hasRole: ['admin'], allowSameUser: true }), this.getUser);
        this.router.get("/all", AdminAuth.isAuthorized({ hasRole: ['admin']}), this.getUsers);
        this.router.patch("/", AdminAuth.isAuthorized({ hasRole: ['manager'], allowSameUser: true }), this.editProfile);
    }
    

    async getUsers(req: Request, res: Response): Promise<void> {
        const uid = res.locals.uid;

        const user = new User(new Logger("logs/app.log",), new DB());
        const result = await user.getAllUsers(uid);
        const { data } = result;
    
        const filteredData = data.map(({ password_hash, ...rest }) => rest);
    
        const response = {
            count: filteredData.length,
            data: filteredData
        };
    
        res.status(result.statusCode).json(response);
    }


    /**
     * Asynchronously gets a user with the given ID from the database and returns it as a JSON object.
     * if uid is not provided, returns the currently logged in user
     *
     * @param {Request} req - Express.js request object containing the query parameters.
     * @param {Response} res - Express.js response object to be used to send the JSON response.
     * @return {Promise<void>} - Promise that resolves when the user is successfully retrieved and sent as a JSON object.
     */
    async getUser(req: Request, res: Response): Promise<void> {
        // const uid = req.query.uid as string == null ? req.user.username : req.query.uid as string;
        const uid = res.locals.uid;
    
        const user = new User(new Logger("logs/app.log",), new DB());
        const result = await user.getUser(uid);
        const { data } = result;
    
        const filteredData = (({ password_hash, ...rest }) => rest)(data);
    
        res.status(result.statusCode).json(filteredData);
    }

    async editProfile(req: Request, res: Response) {
        const uid = req.query.uid as string;
        
        const user = new User(new Logger("logs/app.log",), new DB());
        const result = await user.editUserProfile(uid, req.body);
        res.status(result.statusCode).json(result);
    }

    
}

export default UserController