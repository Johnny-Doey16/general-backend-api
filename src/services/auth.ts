import { Request, Response } from "express";
import * as admin from 'firebase-admin'

class AdminAuth {

    constructor() {}
    static async isAuthenticated(req: Request, res: Response, next: Function) {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer", "");

        if (!token) {
        return res.status(401).json({ error: 'Access token not provided.' });
        }
        try {
            
            const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
            console.log("decodedToken", JSON.stringify(decodedToken))
            res.locals = { ...res.locals, uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email, email_verified: decodedToken.email_verified };
            // req.user = verifiedToken;
            
            console.log("Locals: ", res.locals);
            
            return next();
        }
        catch (err) {
            console.error(`${err.code} -  ${err.message}`)
            return res.status(403).send({ message: 'Unauthorized' });
        }
    }

    
    /**
     * Checks if the user is authorized based on the given options.
     *
     * @param {object} opts - The options for authorization.
     * @param {Array<'admin' | 'manager' | 'user'>} opts.hasRole - The roles allowed.
     * @param {boolean} [opts.allowSameUser] - Whether to allow the same user.
     * @return {Function} - A middleware function to check authorization.
     */
    static isAuthorized(opts: { hasRole: Array<'admin' | 'manager' | 'user'>, allowSameUser?: boolean }) {
        return (req: Request, res: Response, next: Function) => {
            const { role, email, uid, email_verified } = res.locals
            const id = req.query.uid as string;

            if (!role) {
                return res.status(401).json({error: "Role not found", message: "User doesn't have sufficient permissions"});
            }

            if (!email_verified) {
                return res.status(402).send({ error: "Email unverified", message: 'Please verify your email' });
            }
     
            if (opts.allowSameUser && id && uid === id) {
                console.log("Inside same user id as that passed in query");
                return next();
            }
     
     
            if (opts.hasRole.includes(role)) {
                console.log("Found user's role so allow");
                return next();
            }
     
            return res.status(403).json({error: "User not authorized", message: "An unknown error occurred"});
        }
    }

}

export default AdminAuth


    
