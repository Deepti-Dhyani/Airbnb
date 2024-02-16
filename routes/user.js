const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(WrapAsync(userController.signUp)
);

router.route("/login")
.get( userController.renderLogInForm)
.post( saveRedirectUrl,
  passport.authenticate( "local",
{ failureRedirect: "/login", failureFlash: true }),
  userController.postLogIn
);

router.get("/logout", userController.logOut);

module.exports = router;
