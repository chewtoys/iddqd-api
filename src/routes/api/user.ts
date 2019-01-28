import User from "../../controllers/User";
import { checkToken } from "../../middlewares/jwt";

const router = require("express").Router();

router.post("/create", User.createUser);

router.post("/session", User.login);
router.get("/session/refresh", checkToken, User.refreshToken);

router.delete("/logout", checkToken, User.logout);
router.delete("/logout/all", checkToken, User.logoutOfAllSessions);

router.patch("/password", checkToken, User.changePassword);
router.delete("/password/reset"); // step one
router.put("/password/reset"); // step two

router.get("/email/check", User.checkEmailExist);

export default router;
