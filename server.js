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

const User = require('./controllers/Users');
const File = require('./controllers/Files');
const Tag = require('./controllers/Tags');
const JWTMiddleware = require('./middlewares/jwt');

app.get('/ping', (req, res) => res.send('pong'));
app.post('/user/create', User.createUser);
app.post('/session', User.login);

app.post('/file', JWTMiddleware.checkToken, File.uploadFile);
app.delete('/file/:file_id', JWTMiddleware.checkToken, File.deleteFile);
app.get('/file/:file_id', File.getFile);
app.get('/file', File.getFiles);

app.post('/tag', JWTMiddleware.checkToken, Tag.addTag);
app.delete('/tag/:tag_id', JWTMiddleware.checkToken, Tag.deleteTag);
app.get('/tag/:tag_id', Tag.getTag);
app.get('/tag', Tag.getTags);

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
