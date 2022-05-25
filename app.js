const express = require("express");
const https = require("https")
app = express();

app.set('view engine', 'ejs');


const url = "https://api.wisetrout.net/jsonapi/node/page";
var articles = [];

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

app.get("/", function(req, res) {
  https.get(url, function(response) {

    var APIdata = {};
    var rawData = "";
    response.on('data', (chunk) => {
      rawData += chunk;
    });
    // HTTP response object can receive multiple 'data' events,
    //each time getting only chunk of the full data
    // used example from https://nodejs.org/api/http.html ("http.get")
    //to accumulate data events
    response.on('end', () => {
      try {
        APIdata = JSON.parse(rawData);
        //console.log(APIdata);

        for (let i = 0; i < APIdata.data.length; i++) {
          const article = {
            name: APIdata.data[i].attributes.title,
            id: APIdata.data[i].id,
            content: APIdata.data[i].attributes.body.value
          };
          articles.push(article);
        }
        res.render('mainPage', {
          articleList: articles
        });

      } catch (e) {
        console.error(e.message);
      }
    })
  });
})

app.get("/page/:id", function(req, res) {
  //show page of the article that has an id equal to <:id>
  const requestedArticleId = req.params.id;
  chosenArticle = articles.find(element => element.id === requestedArticleId);
  res.render("longArticle", {
    articleName: chosenArticle.name,
    articleContent: chosenArticle.content
  })
})
