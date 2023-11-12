import express, {Request, Response} from 'express'
// import DB from '../firebase/db';
// import FirebaseAuth from '../firebase/auth';
// import AdminAuth from '../services/auth';
import StripeGateway from '../services/stripe';
import Mailer from '../services/mailer';
const axios = require('axios');
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

        // try {
        //     const response = await axios.get('https://api.stripe.com/v1/balance', {
        //       // Your request data goes here (if any)
        //     }, {
        //       headers: {
        //         'Authorization': `Bearer ${stripeToken}`,
        //         'Content-Type': 'application/json' // Adjust the content type if needed
        //       }
        //     });
        
        //     // Handle the response data here
        //     console.log('Response:', response.data);
        //   } catch (error) {
        //     // Handle errors here
        //     console.log(error);
            
        //     console.error('Error:', error.message);
        //   }

        // await new StripeGateway().createCustomer();



        // const db = new DB();
        // await db.insert("Home", {
        //     "user": "Tony Elumelu",
        //     "message": "Welcome to K-Foods",
        // });

        // const auth = new FirebaseAuth();
        // const uid = await auth.loginUser("john@gmail.com", "123456789");






        // console.log("Visited Home!!");

        // const stat = await new Mailer().send();
        // console.log("DONE");



        // ?Send notification
      //   const message = {
      //     notification: {
      //         title: 'Order Completed',
      //         body: 'Your order has been completed successfully.',
      //     },
      //     data : {
      //       "body": "This is my first notification"
      //     },
      //     // token: "cUX71zvKSJui5XnkIWsDxB:APA91bFD1dcmF51mZxlxHX3YvOtiI5CHeFd5QPCrj2snnvVcIZJFJafTRBBzmL058fPbCoaCYlLhGfH4gf5MagtkUs0OwxXl7B-QkBl5wi_ILyHI1XG-fvDPwY90XXtbGgE8PzAzcduc"
      //     token: "f7HwK01kS--gigjbewK1i0:APA91bFskfn38h--UyJUuXm1XkgXb7-tZ5EkfSEjTHCP9pRFZIoFl3c3V0WehW536NTulze8NNvBEkamftcgMFCFyvK-CTtOOrt2BuHDf3QRlK_KQcB9FvJxaFEW0NOAXaih-ILx0IHo",
      // };

      // await admin
      // .messaging()
      // .send(message)
      // .then((response) => {
      //     console.log('Successfully sent message:', response);
      // })
      // .catch((error) => {
      //     console.log('Error sending message:', error);
      // });
        

        return res.status(200).json({message: "👍🏼Welcome to K-Foods " +process.env.STRIPE_PRIVATE_TEST_KEY +". DONE"});//process.env.STRIPE_PRIVATE_TEST_KEY

    }

    public async getCurrentCountry() :Promise<any> {
        try {
          // Make an HTTP request to ipstack API to get the user's IP address
          const response = await axios.get(`http://api.ipstack.com/check?access_key=036761be5d7b3250203d51161f0d80a1`);
          const data = response.data;
      
          // The data object will contain information about the user's location
          // including the country.
          const country = data.country_name;
      
          return country;
        } catch (error) {
          console.error('Error fetching IP info:', error.message);
          return null;
        }
      }
      
}

export default HomeController