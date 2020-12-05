// packages import
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import morgan from "morgan";

import { AppLogger } from "../core";
import MongoDBConnect from "../app/mongo/db/db/MongoDBConnect";

// configure logger
AppLogger.stream = {
  write: function (message, encoding) {
    AppLogger.info(message, encoding);
  },
};

// database setup
if (process.env.MONGOOSE_ENABLED === "true") {
  AppLogger.debug("server MONGOOSE_ENABLED");
  new MongoDBConnect();
}

// create the app
const app = express();

// middlewares
app.use(cookieParser());
app.use("*", cors());
app.use(morgan("dev", { stream: AppLogger.stream }));
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(passport.initialize());
