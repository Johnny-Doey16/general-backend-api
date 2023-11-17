import { DB_TABLES, ERROR_MESSAGES } from "../constants/variables";
import DB from "../firebase/db";
// import Logger from "../services/logger";

class User {
    
    constructor(private db: DB) {
        console.log("debug", "User object instantiated");
    }

    async getAllUsers(current_uid: string): Promise<{statusCode: number, status: string, data: any}> {
        try {
            const data: any[] = await this.db.findAll(DB_TABLES.USERS);

            if (data === null) {
                return {statusCode: 400, status: "error", data: ERROR_MESSAGES.FETCHING_ALL_USERS()}
            }
        
            console.log("info", `Retrieving all users from db`);
        
            const filteredData = data.filter((user) => user.uid !== current_uid);
        
            return {statusCode: 200, status: "success", data: filteredData};
        } catch (e) {
            console.log("error", ERROR_MESSAGES.FETCHING_ALL_USERS());
            return {statusCode: 401, status: "error", data: ERROR_MESSAGES.FETCHING_ALL_USERS()};
        }
    }

    async getUser(uid: string): Promise<{statusCode: number, status: string, data: any}> {
        try {
            const data = await this.db.findById(DB_TABLES.USERS, "uid", uid);
            if (data === null) {
                return {statusCode: 400, status: "error", data: ERROR_MESSAGES.FETCHING_USER(uid)}
            }
        
            console.log("info", `Retrieving all users from db`);
        
            return {statusCode: 200, status: "success", data: data};
        } catch (e) {
            console.log("error", ERROR_MESSAGES.FETCHING_USER(uid));
            return {statusCode: 401, status: "error", data: ERROR_MESSAGES.FETCHING_USER(uid)};
        }
    }

    async editUserProfile(uid: string, data: any) {
        try {
            await this.db.update(DB_TABLES.USERS, uid, data);
            console.log("info", `Updating user profile`);
            return {statusCode: 200, status: "success"};
        } catch (error) {
            console.log("error", error);
            return {statusCode: 401, status: "error", data: error};
        }
    }
}

export default User;
