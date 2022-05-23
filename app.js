const express = require("express");
const https = require("https")
app=express();

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
        const name = APIdata.data[i].attributes.title;
        articles.push(name);
      }
      res.send("<h1>Article list:</h1><br>" + articles[0] + "<br>" + articles[1]); //can this be done using promises?
      //https.get is async, res.send should be executed after https.get has finished
    });
  })


})
