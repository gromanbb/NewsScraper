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
    let results = [];

    // Select each element in the HTML body from which you want information.
    // $(".assetWrapper").each(function (i, element) {
    $("article").each(function (i, element) {
      let title = $(this).find("h2").text().trim();
      //OJO let abstract = $(this).find("p").text().trim();
      let abstract = "";
      $(this).find("p").each(function(j, elm) {
        abstract += $(elm).text().trim() + "\n";
      });
      let url = "https://www.nytimes.com/" + $(this).find("a").attr("href");

      // console.log("title: ", title);
      // console.log("abstract: ", abstract);
      // console.log("url: ", url);

      // Push article's data into the results array defined earlier
      results.push({
        headline: title,
        summary: abstract,
        URL: url
      });
    });

    // Create Articles using the `results` array built from scraping
    db.Article.insertMany(results)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, log it
        console.log(err);
      });

    // Send a message to the client
    res.send("Scrape Complete");
    // OJO
    res.redirect("/");
  });
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbArticle);
      const hbsObject = {
        articles: dbArticle
      };
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
