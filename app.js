const express = require("express");
const session = require("express-session");
const taskRoutes = require("./routes/taskroutes");
const passport = require("./authentication/passport");
const connectEnsureLogin = require("connect-ensure-login");
const authRoutes = require("./routes/auth");
const app = express();
const db = require("./db");
require("dotenv").config();

// connect to mongodb
db.connectToMongodb();

// middlewares
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

// serve static files
app.use(express.static("."));

// routes
app.use("/", authRoutes);

// ensure user is logged in before they can task route
app.use(
  "/tasks",
  connectEnsureLogin.ensureLoggedIn({
    redirectTo: "/login",
    setReturnTo: false,
  }),
  taskRoutes
);

app.get("/", (req, res) => {
  res.redirect("/login");
});

// middleware for views templates
app.set("view engine", "ejs");
app.set("views", "./views");

// define the port number and connect to an event listener
PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
