const express = require("express");
const router = express.Router();

const registerController = require("../controller/registerController");
const loginController = require("../controller/loginController");
const updateCookiesController = require("../controller/updateCookiesController");
const Authenticator = require("../middleware/auth");

router.post("/register", registerController);
router.post("/login", loginController);
//Any routes defined above this point will not have the middleware executed before they are hit.
router.use(Authenticator);
//Any routes defined after this point will have the middlware executed before they get hit
router.patch("/update-cookies", updateCookiesController);

module.exports = router;
