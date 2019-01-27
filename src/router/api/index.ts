const router = require("express").Router();
import user from "./user";

router.use("/user", user);

export default router;
