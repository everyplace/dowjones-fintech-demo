var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , request = require('request');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/headlines', function(req, res){

  var section = 424
    , url = 'http://betawebapi.dowjones.com/fintech/articles/api/v1/source/'+section+'/?count=20'

  request.get(url, function(err, response, body) {
    var parsedBody = JSON.parse(body);


    res.render('headlines', {
      title: "Hello, headline module",
      data: parsedBody
    });
  });

});

app.get('/article/:guid', function(req, res){
var url = 'http://betaweb.dowjones.com/api/parse/?guid='+req.params.guid;
  
  request.get(url, function(err, response, body) {
    parsedBody = JSON.parse(body);

    res.render('article', {
      title: "Hello, article module",
      data: parsedBody
    });
  });
  
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Dow Jones FinTech Demo App listening on port " + app.get('port'));
});
