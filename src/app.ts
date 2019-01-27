import express, { Express as IExpress } from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import routes from "./routes";

const app: IExpress = express();

app.use(fileUpload());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(routes);

export default app;
