const express = require("express");
const router = express.Router();

// Import the models to use their mongoose functions.
const db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Create all our routes and set up logic within those routes where required.
// A GET route for scraping the echoJS website
router.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // Select each element in the HTML body from which you want information.
    $("article").each(function (i, element) {
      // Save these results in an object that we'll push into the results array we defined earlier
      //results.push($(element).children().contents().toArray());
      results.push($(element));
      for (let j = 0; j < results.length; j++) {
        console.log("results[j]: " + results[j] + "==> j:" + j);
      }
      //results.push($(element).children().text());
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log("results[0]: ", results[0]);
    console.log("results[1]: ", results[1]);
    console.log("results[2]: ", results[2]);
    //console.log("results[0].children[0]: ", results[0].children[0]);

  });
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
  res.render("index");
});

// Export routes for server.js to use.
module.exports = router;
