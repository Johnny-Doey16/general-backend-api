import express, {Request, Response} from 'express'
import { validationResult } from 'express-validator';
import StripeGateway from '../services/stripe';
import Order from '../models/order';
import DB from '../firebase/db';
import { DB_TABLES } from '../constants/variables';
const admin = require('firebase-admin');


class StripeController {
    public path = "/payment";
    public router = express.Router();

    constructor() {
        this.initRoutes();    
    }

    private initRoutes() {
        // this.router.use();
        this.router.post("/charge", this.buy);
        this.router.get("/balance", this.balance);

    }

    async buy(req: Request, res: Response) {
        const data = validationResult(req);
        if (!data.isEmpty()) {
            return res.status(422).json({errors: data.array()});
        }
        let amount = req.body.amount;
        const {token, desc, fullName, prods, prodNames} = req.body;
        // amount = parseFloat(amount);
        console.log("DATA for Stripe", req.body);
        

        // let amount = 200;
        // let {token, desc, fullName, prodIds, prodNames} = req.body;


        // desc = "Buying new goods"
        // fullName = "John Doe"
        // prodIds = ["1","4"];
        // prodNames = ["Shoes", "Clothe"]

        console.log("Token: ",token);
        

        const charge = await new StripeGateway().chargeCard(amount, "usd", desc, token);

        // If charge... == success create order to be true
        if (charge.paid) {
            await new Order(new DB()).add({
                fullName: fullName,
                totalAmount: amount,
                products: prods,
                // prodIds: prodIds,
                // prodNames: prodNames,
                time: new Date().getTime(),
                ...charge
            })

            // * Get admin token from db
            const data = await new DB().findById(DB_TABLES.USERS, "email", "admin@kfooods.com");
            console.log("USER", data);
            
    
            //* send notification to admin
            const message = {
                notification: {
                    title: 'Order Completed',
                    body: `${fullName} has placed an order of ${amount} for ${prodNames}`,
                },
                token: data.fcmToken,
            };

            await admin
            .messaging()
            .send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });

            // * Reduce qty of products
            await new DB().decreaseMultiple(DB_TABLES.PRODUCTS, prods);
        }
        
        // * Send email to admin and the user with receipt
        
        return res.status(200).json(charge);
    }

    async balance(req: Request, res: Response) {
        const data = validationResult(req);
        if (!data.isEmpty()) {
            return res.status(422).json({errors: data.array()});
        }

        const bal = await new StripeGateway().getBalance();
        
        res.status(200).json(bal);
    }

}

export default StripeController