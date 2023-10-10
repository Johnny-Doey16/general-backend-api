import firebaseApp from "../config/firebase";
import "firebase/compat/auth";
import DB from '../firebase/db';

import Logger from "../services/logger";
import * as admin from "firebase-admin";
import { DB_TABLES } from "../constants/variables";

// https://firebase.google.com/docs/auth/web/manage-users
class FirebaseAuth {
    private logger: Logger;
    // private auth = firebaseApp.auth();
    private auth;
    constructor() {
        this.auth = firebaseApp.auth();
        this.logger = new Logger("logs/app.log");
        this.logger.log("info", "Auth Instantiated");
    }

    public async createUser(userData: any, res: any): Promise<string | null> {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);
            const user = userCredential.user;
            const uid = user.uid;
            console.log(uid);
            this.logger.log('info', `Registered user: ${uid}`);

            try {
                // Add Data to DB
                const db = new DB();
                db.insertWithId("Users", uid, {
                    "uid": uid,
                    "email": userData.email,
                    "firstName": userData.firstName,
                    "lastName": userData.lastName,
                    "phone": userData.phone,
                });
                // await this.updateProfile({
                //     "displayName": userData.firstName + " " + userData.lastName,
                //     "phoneNumber": userData.phone,
                // });
            } catch (error) {
                return res.status(400).json({message: "An error occurred while adding user to db", error: error, status: 400});
            }

            const userDelegate = user['_delegate']['stsTokenManager'];
            const accessToken =  userDelegate['accessToken'];
            
            await this.sendVerificationEmail();

            await admin.auth().setCustomUserClaims(uid, { role: "user" })
            // .then(() => {
            //     console.log('Role assigned successfully');
            // })
            // .catch((error) => {
            //     console.error('Error assigning role:', error);
            // });

            console.log("User verification status: ", user.emailVerified);

            return res.status(200).json({message: "Account created successfully. Please verify email", accessToken: accessToken, status: 200});
        } catch (error) {
            this.logger.log('error', `Error occurred while registering user: ${error}`);
            return res.status(401).json({message: "An error occurred while registering user", error: error, status: 401});
        }
    }

    public async loginUser(email: string, password: string, res: any): Promise<string | null> {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const uid = user.uid;
            let userData: any;
            console.log(uid);
            this.logger.log('info', `Signing in user: ${uid}`);

            const userDelegate = user['_delegate']['stsTokenManager'];
            const accessToken = userDelegate['accessToken'];
            const refreshToken = userDelegate['refreshToken'];
            const exp =  userDelegate['expirationTime'];

            /*if (!user.emailVerified) {
                await this.sendVerificationEmail();
            } else {
                // get user data from db
                userData = await new DB().findById(DB_TABLES.USERS, "uid", uid);
            }

            return user.emailVerified 
            ? res.status(200).json({message: "User logged in successfully", accessToken: accessToken, refreshToken: refreshToken, expiration: exp, user: userData}) 
            : res.status(201).json({message: "Please verify your account"});
            */

            return res.status(200).json({message: "User logged in successfully", accessToken: accessToken, refreshToken: refreshToken, expiration: exp, user: userData});

        } catch (error) {
            this.logger.log('error', `Error occurred while signing in user: ${error}`);
            return res.status(401).json({error: error.name, message: error.message});
        }
    }

    public async sendVerificationEmail() {
        this.auth.currentUser.sendEmailVerification().then(() => {
            console.log("Email sent");
        })
    }

    // get signed in user
    public async getLoggedInUser() {
        this.auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log("Current user is ", user);
                return this.auth.currentUser;
            } else {
                console.log("User logged out");
                return null;
            }
        });
    }

    // retrieve user profile
    public async getUserProfile() : Promise<any> {
        const user = this.auth.currentUser;
        const profile = {};
        if (user === null) {
            return null;
        }
        
        profile['uid'] = user.uid;
        profile['email'] = user.email;
        profile['username'] = user.displayName;
        profile['photoURL'] = user.photoURL;
        profile['emailVerified'] = user.emailVerified;

        return profile;
    }

    // update profile
    public async updateProfile(profile: any) : Promise<string | null> {
        try {
            this.auth.currentUser.updateProfile(profile); // {displayName: 'Tony Elumelu', photoURL: null}
            console.log("User profile updated");
        } catch (error) {
            console.log(error);
            this.logger.log('error', `Error occurred while updating profile: ${error}`);
            return null;
        }
    }

    // TODO: test update email
    public async updateEmail(email: string) : Promise<string | null> {
        try {
            this.auth.currentUser.updateEmail(email);
        } catch (error) {
            console.log(error);
            this.logger.log('error', `Error occurred while updating email: ${error}`);
            return null;
        }
    }

    // TODO: test update password
    public async updatePassword(password: string) {
        this.auth.updatePassword(password);
    }

    // sendPasswordResetEmail
    public async sendPasswordResetEmail(email: string) {
        try {
            this.logger.log('info', `Sending password reset email to ${email}`);
            this.auth.sendPasswordResetEmail(email);
        } catch (error) {
            this.logger.log('error', `Error occurred while sending password reset email: ${error}`);
        }
    }

    public async logout() {
        this.auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.auth.signOut();
                console.log("User was successfully logged out");
            } else {
                console.log("User logged out");
            }
        });
    }

    // TODO: test Delete user
    public async deleteUser() {
        this.auth.deleteUser();
    }

    /*static verifyAccessToken(req: any, res: any, next: any) {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer", "");

        firebaseApp.auth().currentUser.getIdToken().then((idToken) => {
            console.log("Id token is ", idToken);
            next();
        })
        .catch(error => {
          res.status(500).json({ error: error.message });
        });
    }

    static verifyAccessToken1(req: any, res: any, next: any) {
        console.log("Verifying token in Cognito");
        
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer", "");
    
        if (!token) {
          return res.status(401).json({ error: "Access token not provided." });
        }else {
          console.log("Access token is provided");
          
        }
    
        const jwksUrl = process.env.JWKS_URL;
    
        fetch(jwksUrl)
          .then(response => response.json())
          .then(jwks => {
            const decodedToken = jwt.decode(token, { complete: true });
            const { kid } = decodedToken?.header || {};
            const jwk = jwks.keys.find((key: any) => key.kid === kid);
            if (!jwk) {
              throw new Error('Invalid token');
            }
    
            const pem = jwkToPem(jwk);
            const verifiedToken = jwt.verify(token, pem);
            console.log(verifiedToken);
            
            req.user = verifiedToken;
            next();
          })
          .catch(error => {
            res.status(500).json({ error: error.message });
          });
      }
      */

}           

export default FirebaseAuth;