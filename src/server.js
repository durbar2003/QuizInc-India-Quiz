const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const exphbs = require("express-handlebars");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);

// Load config
require("dotenv").config({
  path: `${__dirname}/config/config.env`,
});

// Passport config
require("./config/passport")(passport);

app.use(cors());
app.use(express.json());
app.use(routes);

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      math: function (lvalue, operator, rvalue) {
        lvalue = parseInt(lvalue);
        rvalue = parseInt(rvalue);
        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue
        } [operator];
      }
    }
  })
);
app.set("view engine", ".hbs");

// Session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(`${__dirname}/public`));

const DB = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database opened"));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Form submission
app.use(bodyParser.urlencoded({
  extended: true
}));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

app.listen(process.env.PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}...`
  );
});