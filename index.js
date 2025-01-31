if (process.env.NODE_ENV !== "production") { 
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const method_override = require('method-override');
const ejsmate = require('ejs-mate');
const expressError = require('./utils/expressError.js');
const session = require('express-session');
const mongoStore = require('connect-mongo')
const flash = require('connect-flash');
const passport = require('passport');
const Localstrategy = require('passport-local')
const user = require('./models/user.js')

const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js')
const userRoutes = require('./routes/user.js')

app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"))
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = process.env.ATLAS_DB;
const port = 8080;
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("database connected");
}).catch((err) => {
    console.log(err);
})

const store = mongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})

store.on("error", () => {
    console.log("error in mongo session store",err)
})

const sessionOptions = {
    store,  
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session( sessionOptions ));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use( new Localstrategy(user.authenticate()) );
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.listen(port, () => {
    console.log(`server start at ${port}`);
})

app.get("/", (req, res) => {
    res.send("i am root");
})

app.use(( req, res, next ) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

//listing routes
app.use("/listings", listingRoutes);

//review routes
app.use("/listings/:id/reviews", reviewRoutes);

//user routes
app.use("/", userRoutes);

app.all("*",( req, res, next ) => {
    next( new expressError(404,"page not found"));
})

app.use(( err, req, res, next ) => {
    let { statusCode=500, message="something went wrong" } = err;
    res.render("listings/error.ejs",{ message })
    // res.status(statusCode).send(message);
});