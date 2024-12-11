var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
const fs = require('fs');

var app = express();
var port = process.env.PORT || 5500;

const colors = require("./static/colors.json");

// Set up Handlebars as the view engine
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'common',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('view engine', 'handlebars');

app.use(express.static('static'));
app.use(express.json());
const scoresFilePath = path.join(__dirname, 'static', 'scores.json');

// Game page
app.get("/play", function(req, res, next) {
  res.render("game", {
    bonusColorText: colors[1].colorText,
    bonusColorID: colors[1].colorID,

    penaltyColorText: colors[0].colorText,
    penaltyColorID: colors[0].colorID,

    header: false,
    isGamePage: true
  });
});

// Leaderboard page
app.get("/leaderboard", function(req, res, next) {
  fs.readFile(scoresFilePath, 'utf-8', (err, data) => {
    let leaderboard = [];
    if (data) {
      leaderboard = JSON.parse(data);
    }
    res.render("Leaderboard", {
      leaderboard: leaderboard
    });
  });
});

// Start page
app.get("/", function(req, res, next) {
  res.render("mainPage", {
    header: true
  });
});

// Endpoint to save score after game over
app.post("/save-score", function(req, res, next) {
  const { player, score } = req.body;

  if (!player || !score) {
    return res.status(400).json({ error: "Player name and score are required." });
  }

  fs.readFile(scoresFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error("Error reading scores file:", err);
      return res.status(500).json({ error: "Failed to read scores file" });
    }

    let scores = [];
    if (data) {
      scores = JSON.parse(data);
    }
    scores.push({ player, score });
    scores.sort((a, b) => b.score - a.score);
    fs.writeFile(scoresFilePath, JSON.stringify(scores, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error("Error saving scores file:", err);
        return res.status(500).json({ error: "Failed to save scores file" });
      }
      res.json({ success: true, message: "Score saved successfully" });
    });
  });
});


// Start server
app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
