require('dotenv').load();

const express = require("express");
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const User = require('./controllers/Users');

app.post('/user/create', User.createUser);
app.post('/session', User.login);
// app.get('/test', JWTMiddleware.checkToken, controller!!!);

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
