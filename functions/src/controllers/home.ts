import express, {Request, Response} from 'express'
// import DB from '../firebase/db';
// import FirebaseAuth from '../firebase/auth';
// import AdminAuth from '../services/auth';
import StripeGateway from '../services/stripe';
import Mailer from '../services/mailer';
// const axios = require('axios');
const admin = require('firebase-admin');


class HomeController {
    public path = "/";
    public router = express.Router();

    constructor() {
        this.initRoutes();    
    }

    private initRoutes() {
        this.router.get("/",
        // AdminAuth.isAuthenticated,
        // AdminAuth.isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
        // AdminAuth.isAuthorized({ hasRole: ['user'], allowSameUser: false }), - any user can access this
        this.home
        );

        this.router.post("/",this.card);
    }

    async card(req: Request, res: Response){
        console.log("Visited Home");
        const {token, id} = req.body;

        console.log("Token is", token, id);
        
        // await new StripeGateway().chargeCard(100000, "usd", "Testing stripe payment", "tok_1NY9riCMX0BonwrBarXWY3K7");
        
        res.status(200).json({message: "👍🏼Welcome to K-Foods "+token});

    }

    async home(req: Request, res: Response) {

        // const stripeToken = 'sk_test_51KdHyaCMX0BonwrBNWapFZE9RcQyYXAoY9M0NSiRTh₩5yHL70juDvCLU8DgZ03GQIPPzNfU4DQ9xEPmQ4vf1TeeF00HKAHFump';
        // const stripeToken  ='sk_test_4eC39HqLyjWDarjtT1zdp7dc';
        

        return res.status(200).json({message: "👍🏼Welcome to K-Foods have fun shopping" +process.env.STRIPE_PRIVATE_TEST_KEY +". DONE"});//process.env.STRIPE_PRIVATE_TEST_KEY

    }

    // public async getCurrentCountry() :Promise<any> {
    //     try {
    //       // Make an HTTP request to ipstack API to get the user's IP address
    //       const response = await axios.get(`http://api.ipstack.com/check?access_key=036761be5d7b3250203d51161f0d80a1`);
    //       const data = response.data;
      
    //       // The data object will contain information about the user's location
    //       // including the country.
    //       const country = data.country_name;
      
    //       return country;
    //     } catch (error) {
    //       console.error('Error fetching IP info:', error.message);
    //       return null;
    //     }
    //   }
      
}

export default HomeController