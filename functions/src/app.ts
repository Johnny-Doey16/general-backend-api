import express from "express";
import { Application } from "express";

class App {
    public app: Application;
    public port: number;
    public host: string;

    constructor(appInit: {port: number; host: string, middlewares: any; controllers: any}){
        this.app = express();
        this.port = appInit.port;
        this.host = appInit.host;

        this.middlewares(appInit.middlewares)
        this.routes(appInit.controllers);
    }

    public listen() {
        this.app.listen(this.port, this.host, () => {
            console.log(`App is running on port ${this.port} and host ${this.host}`);
            
        })
    }

    private routes(controllers: any) {
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router);
        });
    }

    private middlewares(middlewares: any) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        })
    }
}

export default App;