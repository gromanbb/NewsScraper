// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const keys = require("./keys.js");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 8080;

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

console.log("process.env.MONGODB_URI: ", process.env.MONGODB_URI);
// If deployed, use the deployed database. Otherwise use the local Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraperdb";
console.log("MONGODB_URI: ", MONGODB_URI);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Set Handlebars.
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
const routes = require("./controllers/Controller.js");
app.use(routes);

// Start our server so that it can begin listening to client requests.
app.listen(PORT);
// app.listen(PORT, function() {
//   // Log (server-side) when our server has started
//   console.log("Server listening on: http://localhost:" + PORT);
// });
