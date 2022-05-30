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
  articles = [];
  //without this line every time the main page is refreshed
  //articles keep being added to article list again
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
      const chosenArticle = articles.find(element => element.id === requestedArticleId);
      if (!chosenArticle){
        //if no article with the requested id exists
        res.render('longArticle', {
            articleName: "404",
            articleContent: "Page not found"
          });
      }

      else {
        https.get(url + "/" + requestedArticleId, function(response) {
        //getting article content and article name again (not using old values
        // from get("/")). This is done in order to
        //a) refresh article content (in case there was a change after user
        // requested main page) - caching
        //b)get full article content - in case of a long article content requesting
        // article content by using simply https.get(url) will only give us a summary
        //of body.value

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
                  res.render('longArticle', {
                      articleName: APIdata.data.attributes.title,
                      articleContent: APIdata.data.attributes.body.value
                    });
                  }
                  catch (e) {
                    console.error(e.message);
                  }
                })
            })
      }

      })
