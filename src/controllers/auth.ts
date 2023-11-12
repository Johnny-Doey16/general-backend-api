import express, {Request, Response} from 'express'
import { body, validationResult } from 'express-validator';
import FirebaseAuth from '../firebase/auth';

class AuthController {
    public path = "/auth";
    public router = express.Router();

    constructor() {
        this.initRoutes();    
    }

    private initRoutes() {
        // this.router.use();
        this.router.post("/register", this.validateBody("register"), this.register);
        this.router.post("/login", this.validateBody("login"), this.logIn);
        this.router.get("/logout", this.logout);
        // this.router.get("/test", CognitoService.verifyAccessToken, (req, res) => {
        //     res.status(200).json({message: "Inside auth test"});
        // });

    }

    async register(req: Request, res: Response) {
        const data = validationResult(req);
        const {email, password, firstName, lastName, phone} = req.body;


        if (!data.isEmpty()) {
            console.log(data.array());
            const errorMsg = data.array()[0]['path'] == "password" ? "Please enter a strong password." : "Please enter correct email format."
            
            return res.status(422).json({error: "Error occurred", message: data.array()[0].msg + " " +data.array()[0]['path'] +". " + errorMsg});
            // return res.status(420).json({errors: data.array()});
        }

        const auth = new FirebaseAuth();
        await auth.createUser({
            email: email,
            phone: phone,
            password: password,
            firstName: firstName,
            lastName: lastName
        }, res);
    }

    async logIn(req: Request, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            console.log(result.array());
            
            return res.status(422).json({error: "Error occurred", message: result.array()[0].msg + " " +result.array()[0]['path']});
            // return res.status(422).json({errors: result.array()});
        }

        const {email, password,} = req.body;

        const auth = new FirebaseAuth();
        await auth.loginUser(email, password, res);
    }

    async logout(req: Request, res: Response) {
        await new FirebaseAuth().logout();
        res.status(200).json({message: "Successfully logged out"});
    }

    private validateBody(type: string) {
        switch (type) {
            case "register":
                return [
                    body("email").notEmpty().normalizeEmail().isEmail(),
                    body("password").notEmpty().isStrongPassword(),
                    // body("phone").notEmpty().isLength({min: 10}),
                    body("firstName").notEmpty().isString(),
                    body("lastName").notEmpty().isString(),
                ]
                break;

            case "login":
                return [
                    body("email").notEmpty().normalizeEmail().isEmail(),
                    // body("email").notEmpty().isLength({min: 11}),

                ]
                break;

            default:
                break;
        }
    }
}

export default AuthController