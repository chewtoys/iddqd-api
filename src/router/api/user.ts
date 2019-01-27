import User from "../../controllers/Users";
import { checkToken } from "../../middlewares/jwt";

const router = require('express').Router();

router.post('/create', User.createUser);
router.patch('/password', checkToken, User.changePassword);
router.post('/session', User.login);
router.delete('/logout', checkToken, User.logout);
router.delete('/logout/all', checkToken, User.logoutOfAllSessions);

export default router;
