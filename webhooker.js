var app = require('express').createServer()
    , Diffbot = require('diffbot').Diffbot;

app.get('/', function(req, res){
  res.send('hello world');
});


// look to the DIFFBOT_TOKEN environmetn variable
// for the develop token
var token = process.env.DIFFBOT_TOKEN;
var diffbot = new Diffbot(token);

// TODO: make this regex less evil.
app.get(/^\/diffbot\/(.*)/, function(req, res){
    var payload =  {uri: req.params[0],
                    comments: true,
                    stats: true,
                    summary: true,
                    tags: true};
    diffbot.article(payload, function(err, response) {
        var filename = "attachment; filename=\"" + response.title +"\".json";
        console.log(response.title);
        res.send(JSON.stringify(response), {'Content-Disposition': filename});
    });
});

//TODO: create handler for the twitter redirector
//app.get()

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});