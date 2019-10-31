const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
const ArticleSchema = new Schema({

// ojo ===> Feel free to add more content to your database (photos, bylines, and so on).

  // `Headline` - article's title
  headline: {
    type: String,
    required: true,
    trim: true
  },
  // `Summary` - article's short summary
  summary: {
    type: String,
    // required: true,
    trim: true
  },
  // `URL` - article's original URL
  URL: {
    type: String,
    // required: true,
    lowercase: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // `Comment` is an object that stores a Comment id
  // The ref property links the ObjectId to the Comment model
  // This allows us to populate the Article with an associated Comment
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
