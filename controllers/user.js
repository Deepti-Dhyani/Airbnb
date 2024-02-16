const User = require("../models/user.js");

module.exports.renderSignupForm =  (req, res) => {
    res.render("user/signup.ejs");
  }

  module.exports.signUp = async (req, res,next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      
      req.login(registerUser, (err) => {
        if (err) {
         return next(err);
        }
        req.flash("success", "welcome to wanderlust");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", "something went wrong with signup");
      return res.redirect("/listings");
    }
  }

  module.exports.renderLogInForm = (req, res) => {
    res.render("user/login.ejs");
  };

  module.exports.postLogIn = async (req, res) => {
    req.flash("success", "welcome to wanderlust you are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); 
  };

  module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "logged your out ");
    res.redirect("/listings");
    });
  }