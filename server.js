// import express from 'express';
// import bodyParser from 'body-parser';
// import fileUpload from 'express-fileupload';
// import User from './controllers/Users';
// import { checkToken } from './middlewares/jwt';
// import Config from './config'
//
// const app = express();
//
// app.use(fileUpload());
//
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(bodyParser.json());
//
// app.get('/ping', (req, res) => res.status(200).json({
//   msg: 'pong'
// }));
// app.post('/user/create', User.createUser);
// app.patch('/user/password', checkToken, User.changePassword);
// app.post('/user/session', User.login);
//
// // app.post('/file', checkToken, File.uploadFile);
// // app.delete('/file/:file_id', checkToken, File.deleteFile);
// // app.get('/file/:file_id', File.getFile);
// // app.get('/file', File.getFiles);
// //
// // app.post('/tag', checkToken, Tag.addTag);
// // app.delete('/tag/:tag_id', checkToken, Tag.deleteTag);
// // app.get('/tag/:tag_id', Tag.getTag);
// // app.get('/tag', Tag.getTags);
//
// // app.get('/permission', (req, res) => {});
//
// // const getSchema = (req, res) => {
// //   res.status(200).json({
// //
// //   })
// // };
// //
// // app.get('/schema', getSchema);
//
// app.listen(Config.port, () => console.log(`Server is listening on port: ${Config.port}`));
