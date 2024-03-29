if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ejs = require("ejs");
const ExpressErr = require("./utils/ExpressErr.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const DB_URL = process.env.ATLASDB_URL;

async function main() {
  try {
    await mongoose.connect(DB_URL);
    console.log("connected successfully!");
  } catch (error) {
    console.log(" failed to connect", error);
  }
}

main();

const store = mongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24*3600,
});

store.on("error",() => {
  console.log("Error in mongo",err)
})
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 60 * 3,
    httponly: true,
  },
};



app.use(session(sessionOptions)); 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

 


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.get("/",(req,res) => {
  res.render("frontpage.ejs");
 })
 
app.all("*", (req, res, next) => {
  next(new ExpressErr(404, "page not found"));
});


app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong!" } = err;
 res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
