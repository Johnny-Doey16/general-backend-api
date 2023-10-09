import dotenv from "dotenv";
dotenv.config();
// import Stripe from "stripe";

// Setup Stripe
const stripe = require("stripe")("sk_test_51KdHyaCMX0BonwrBNWapFZE9RcQyYXAoY9M0NSiRThW5yHL70juDvCLU8DgZ03GQIPPzNfU4DQ9xEPmQ4vf1Teef00HKAHFump"); //(process.env.STRIPE_PRIVATE_TEST_KEY)
// const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');


class StripeGateway {
    constructor() {}

    public async createCustomer(){//(email :string, token :string, name :string, postalCode :string, line :string, city :string, state :string, country :string ) :Promise<void> {
        // stripe.customers.create({
        //     email: email,
        // // source: token,
        // name: name,
        // address: {
        //     line1: line,
        //     postal_code: postalCode,
        //     city: city,
        //     state: state,
        //     country: country,
        // }
        // })

        
        const balance = await stripe.balance.retrieve();
        console.log(balance);
        
    }

    public async chargeCard (amount :number, currency :string, desc :string, token: string) :Promise<any> {
        
        try {
            
            const charge = await stripe.charges.create({
                amount: Math.round(amount * 100), //(amount * 100).toFixed(2), //amount *100, // amount in cents
                currency: currency,
                source: token,
                description: "Example charge for test", //desc,
              });
            console.log("Payment successful");
            console.log(charge);

            const charge_id = charge.id;
            const paid = charge.paid;
            const card = charge.payment_method;
            const method = charge.payment_method_details.type
            const cardType = charge.payment_method_details.card.brand;
            const receipt = charge.receipt_url;
            const status = charge.status;
            const refunded = charge.refunded;

            return {"charge_id": charge_id, "paid": paid, "card": card, "method": method, "cardType": cardType, "receipt": receipt, "status": status, "refunded": refunded};
            
            
        } catch (err) {
            console.error('Error processing payment:', err);
            let message = 'An error occurred while processing your payment. '+err.type +". " +err.message;

            if (err.type === 'StripeCardError') {
                console.log("Stripe error");
                message = err.message;
            }

            console.log("Error occurred", message);

            return {message: err.message, error: err};

            
            
        }
    }

    public async getBalance() {
        try {
            const balance = await stripe.balance.retrieve();
            console.log(balance);
            return {"balance": balance};
        } catch (error) {
            console.log("Error:", error);
            return {"error": error};
        }
    }
}

export default StripeGateway;