COMPILED = false;

Joshfire = {define: function(a,b) {_ = b();}};
  
var express = require('express');
var _ = require('underscore')._;
var fs = require('fs');
var path = require('path');
var expressApp = express.createServer(),
 request = require('request');




expressApp.configure(function(){
//    app.set('views', __dirname + '/views');
    
    expressApp.use(express.logger({ format : ":method :url"}));
    expressApp.use(express.bodyParser());
    
    expressApp.use(expressApp.router);
    
    var testPath = __dirname + '/public/';
    expressApp.use(express.static(testPath));
    
  
});

var serialize = function(obj) {
  var str = [];
  for(var p in obj)
     str.push(p + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
};

var indexTemplate = require(path.join(__dirname,"templates_compiled/commonjs/index.js"));

var appServe = function(tedxid,req,res) {
  
  //Detect device
  var device = "ipad";
  if (req.param("device")) {
    device = req.param("device");
  } else {
    var ua = req.headers["user-agent"];
    if (ua.indexOf("iPad")>=0) {
      device = "ipad";
    } else if (ua.indexOf("iPhone")>=0 || ua.indexOf("iPod")>=0) {
      device = "iphone";
    }
  }
  
  
  var values = {
    "buildname":device,
    "adapter":"ios",
    "compiled":COMPILED
    
  }
  console.log(indexTemplate(values));
  res.send(indexTemplate(values));
  
  
  
};

expressApp.get('/tedx:tedxid', function(req, res){
  appServe(req.param("tedxid"),req,res);
});

expressApp.get('/', function(req, res){
  appServe(false,req,res);
});


expressApp.get('/proxy.php', function(req, res){
  res.end('Coucou');
})

expressApp.post('/proxy/', function(req, res){
    
    var rq = {'uri':req.body.url,'method':'POST'};
    console.log('requete post via proxy', req.param('url'), req.body);
    if (req.body!==undefined) {
        rq["json"] = req.body.data;
        rq["headers"] = {"Content-Type":"application/x-www-form-urlencoded"};
    } else {
        rq["headers"] = {"Content-Length":"0"};
    }
    
    console.log('proxy call', rq);
    
    request(rq,function(error, response, body) {

        res.send(body);
    });
 
});
expressApp.listen(40010);

console.log('Listening on 40010.')