//jshint esversion:6

// Requirements
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();



// Static Content on each webpage
const homeStartingContent = "Welcome! Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const aboutContent = "The Financial Scoop, started in hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Interested in working with us? Get in touch at celerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to a new database
mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@cluster0.e0jml.mongodb.net/" + process.env.DB_NAME + "?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });

// Create a new postSchema that contains a title and content
const postSchema = {
  title: String,
  content: String
};

// Create a new mongoose model using the schema to define posts collection
const Post = mongoose.model("Post", postSchema);

// Find all the posts in the posts collection and render that in the home.ejs file
app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

// Render compose form/content on compose page
app.get("/compose", function (req, res) {
  res.render("compose");
});

// Create a new post document using mongoose model
app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  // Save the document to database instead of pushing to the posts array
  // Callback to the save method to only redirect to the home page once save is complete with no errors
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

// home.ejs file: change the href of the anchor tag based on the post id instead of the post name
// and change the express route parameter to postId instead
app.get("/posts/:postId", function (req, res) {
  // constant to store the postId parameter value
  const requestedPostId = req.params.postId;
  // use the findOne() method to find the post with a matching id in the posts collection
  Post.findOne({ _id: requestedPostId }, function (err, post) {
    // matching post is found, render its title and content in the post.ejs page.
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

// Render about content on About page
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

// Render contact content on Contact page
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

// Server
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});