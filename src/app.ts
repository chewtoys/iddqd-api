import express, { Express as IExpress } from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import router from "./router";

const app: IExpress = express();

app.use(fileUpload());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(router);

export default app;
