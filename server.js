/*!
 * Joshfire Framework 0.9.0
 * http://framework.joshfire.com/
 *
 * Copyright 2011, Joshfire
 * Dual licensed under the GPL Version 2 and a Commercial license.
 * http://framework.joshfire.com/license
 *
 * Date: Wed Jun 29 16:25:37 2011
 */

COMPILED = false;

Joshfire = {define: function(a,b) {_ = b();}};

var express = require('express');
var _ = require('underscore')._;
var fs = require('fs');

var path = require('path');
var expressApp = express.createServer(),
 request = require('request');

expressApp.configure(function() {
//    app.set('views', __dirname + '/views');
    
    expressApp.use(express.logger({ format : ":method :url"}));
    expressApp.use(express.bodyParser());
    
    expressApp.use(expressApp.router);
    
    var testPath = __dirname + '/public/';
    expressApp.use(express.static(testPath));
});

var serialize = function(obj) {
  var str = [];
  for(var p in obj) {
   str.push(p + '=' + encodeURIComponent(obj[p]));
  }
  return str.join('&');
};

var indexTemplate = require(path.join(__dirname,"templates_compiled/commonjs/index.js"));

var appServe = function(tedxid,req,res) {
  
  //Detect device
  var device = "web";
  if (req.param("device")) {
    device = req.param("device");
  } else {
    var ua = req.headers["user-agent"];
    if (ua.indexOf('iPad') >= 0) {
      device = 'ipad';
    } else if (ua.indexOf('iPhone') >= 0 || ua.indexOf('iPod') >= 0) {
      device = 'iphone';
    } else if (ua.indexOf('Android') >= 0 && ua.indexOf('Mobile') >= 0) {
      device = 'androidphone';
    } else if (ua.indexOf('Android') >= 0 && ua.indexOf('Mobile') == -1) {
      device = 'androidtablet';
    }
    
  }
  
  if (device=="web") {
    res.send("Sorry, currently you must access this app with an iPad, iPhone or iPod. Check back again soon for the web version. (<a href='?device=ipad'>I don't care it's broken, show me the ipad version on the web.</a>)");
    return;
  }
  
  var values = {
    "buildname":device,
    //"adapter":device=='android' ? 'android' : "ios",
    adapter:'ios',
    "compiled":COMPILED,
    "tedxid":tedxid
    
  }
  
  res.send(indexTemplate(values));
};

expressApp.get('/tedx:tedxid', function(req, res){
  appServe(req.param("tedxid"),req,res);
});

expressApp.get('/ted', function(req, res){
  appServe('',req,res);
});

expressApp.get('/', function(req, res){
  res.redirect("https://github.com/joshfire/mytv");
});

// Allow CORS
expressApp.options('/proxy/', function(req, res) {
  res.send('', { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With' }, 200);
});

expressApp.all('/proxy/', function(req, res) {
  console.warn('received request');
  var rq = {'uri': req.body.url, 'method': 'POST'};

  console.log('requete post via proxy', req.param('url'), req.body);
  if (req.body !== undefined) {
    rq['json'] = req.body.data;
    rq['headers'] = {'Content-Type': 'application/x-www-form-urlencoded'};
  } else {
    rq['headers'] = {'Content-Length': '0'};
  }
  
  console.log('proxy call', rq);
  request(rq, function(error, response, body) {
    res.send(body, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With' });
  });
});

expressApp.listen(40010);
console.log('Listening on 40010.');
