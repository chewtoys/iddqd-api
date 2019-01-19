require('dotenv').load();

const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

const port = process.env.PORT || 3000;

app.use(fileUpload());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// app.use(bodyParser({
//   keepExtensions: true,
//   uploadDir: path.join(__dirname, '/uploads')
// }));

const User = require('./controllers/Users');
const File = require('./controllers/Files');

app.get('/ping', (req, res) => res.send('pong'));
app.post('/user/create', User.createUser);
app.post('/session', User.login);
// app.get('/test', JWTMiddleware.checkToken, controller!!!);

app.post('/upload', File.uploadFile);

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
