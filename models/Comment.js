const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentSchema object
const CommentSchema = new Schema({
  // `Body`
  body: {
    type: String,
    trim: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

// This creates our model from the above schema, using mongoose's model method
const Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;
