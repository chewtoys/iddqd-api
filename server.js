require('dotenv').load();

const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');
const JWTMiddleware = require('./middlewares/jwt');



const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const User = require('./controllers/Users');

app.post('/user', User.createUser);

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
