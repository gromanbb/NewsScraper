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

// A GET route for retrieving data from the db
router.get("/", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({ deleted: false })
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
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

// A GET route for scraping Crain's Chicago Business website
router.get("/scrape", function (req, res) {
  // Grab the body of the html with axios
  axios.get("https://www.chicagobusiness.com").then(function (response) {
    // Load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    //OJO console.log("$Cheerio ==> ", $("div.view-content").find("div.views-row").html());

    // An empty array to save the data that we'll scrape
    let results = [];
    let title = "";
    let url = "";
    let abstract = "";

    // Select each element in the HTML body from which you want information.
    $("div.view-content").find("div.views-row").each(function (i, element) {
      title = $(this).find("div.middle-article-headline").find("a").text().trim();
      url = "https://www.chicagobusiness.com" + $(this).find("div.middle-article-headline").find("a").attr("href");
      abstract = $(this).find("div.feature-article-summary").find("a").find("p").text().trim();

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
  });
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({deleted: false})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbArticle);
      const hbsObject = {
        articles: dbArticle
      };
      res.render("index", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
