// Grab the articles as a json
$.getJSON("/articles", function(data) {
  for (let i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].summary + "<br />" + data[i].URL + "</p>");
  }
});