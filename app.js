const express = require("express");
const https = require("https")
app=express();

app.set('view engine', 'ejs');


const url = "https://api.wisetrout.net/jsonapi/node/page";

app.listen(3000, function(){
  console.log("Server started on port 3000");
});

app.get("/", function(req, res){
  var articles = [];
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on("data", function(data){
      console.log(data);
      const APIdata = JSON.parse(data) //Sometimes works and sometimes doesn't, why?
      console.log(APIdata);
      for(let i = 0; i<APIdata.data.length; i++){
        const article = {
          name: APIdata.data[i].attributes.title,
          id: APIdata.data[i].id};
        articles.push(article);
      }
      res.render('mainPage', {articleList: articles}); //can this be done using promises?
      //https.get is async, res.send should be executed after https.get has finished
    });
  })
})
