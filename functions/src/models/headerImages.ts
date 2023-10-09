import { DB_TABLES, ERROR_MESSAGES } from "../constants/variables";
import DB from "../firebase/db";
import Logger from "../services/logger";

class HeaderImages {
    // images, index, title, text, id
    constructor(private logger: Logger, private db: DB) {
        this.logger.log("debug", "Header Images object instantiated");
    }

    async getImages(): Promise<{statusCode: number, status: string, data: any}> {
        console.log("ERROR OCCURRED");
        try {
            const data: any[] = await this.db.findAll(DB_TABLES.HEADER_IMAGES);

            if (data === null) {
                return {statusCode: 400, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT("Header Images", "HeaderImages")}
            }
        
            this.logger.log("info", `Retrieving all header images content from db`);
        
            return {statusCode: 200, status: "success", data: data};
        } catch (e) {
            this.logger.log("error", ERROR_MESSAGES.FETCHING_OBJECT("Header Images", "HeaderImages"));
            return {statusCode: 401, status: "error", data: ERROR_MESSAGES.FETCHING_OBJECT("Header Images", "HeaderImages")};
        }
    }
}

export default HeaderImages;