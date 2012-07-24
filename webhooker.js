var app = require('express').createServer()
    , Diffbot = require('diffbot').Diffbot
    , fs = require('fs');

app.get('/', function(req, res){
  res.send('hello world');
});


// look to the DIFFBOT_TOKEN environmetn variable
// for the develop token
var DIFFBOT_TOKEN = process.env.DIFFBOT_TOKEN;
var diffbot = new Diffbot(DIFFBOT_TOKEN);

// Where to save diffbot result files
var DATA_DIRECTORY = process.env.DATA_DIRECTORY

// TODO: make this regex less evil.
app.get(/^\/diffbot\/(.*)/, function(req, res){
    var payload =  {uri: req.params[0],
                    comments: true,
                    stats: true,
                    summary: true,
                    tags: true};
    //res.send(JSON.stringify(payload));
    var date = new Date().toISOString()
    res.send(JSON.stringify(payload), {'Content-Disposition': date + ".json"});
    diffbot.article(payload, function(err, response) {
        var filename = new Date() + response.title +"\".json";
        //console.log(response.title);
        fs.writeFile(DATA_DIRECTORY + filename, JSON.stringify(response), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    });
});


// Twitter redirector app
app.get(/^\/twitter\/https?:\/\/twitter.com\/([A-Za-z0-9_]+)\/status\/([0-9]+)/, function(req, res){
    var url = "https://api.twitter.com/1/statuses/show/" + req.params[1] + ".json";
    console.log(url);
    res.redirect(url);
})


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});