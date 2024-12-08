var path = require('path')
var express = require('express')
var exphbs = require('express-handlebars')

var app = express()
var port = process.env.PORT || 5500

const colors = require("./static/colors.json")

// Set up Handlebars as the view engine
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'common',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'handlebars')

app.use(express.static('static'))

const hbs = exphbs.create({
  partialsDir: path.join(__dirname, 'views/partials') //Tell Handlebars where to find partials
});



// Game page
app.get("/play", function(req, res, next) {

  console.log(colors[0].colorText)

  res.render("game", {
    colorText: colors[1].colorText,
    colorID: colors[1].colorID,
    header: false,
    isGamePage: true
  })
})

// Start and leaderboard page
app.get("/", function(req, res, next) {
  res.render("mainPage", {
    header: true
  })
})

app.listen(port, function () {
  console.log("== Server is listening on port", port)
})