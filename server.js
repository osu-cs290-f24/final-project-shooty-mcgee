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
  res.render("game", {
    bonusColorText: colors[1].colorText,
    bonusColorID: colors[1].colorID,

    penaltyColorText: colors[0].colorText,
    penaltyColorID: colors[0].colorID,

    header: false,
    isGamePage: true
  })
})

// Game page
app.get("/leaderboard", function(req, res, next) {

  res.render("Leaderboard", {
    header: true,
    isGamePage: false
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