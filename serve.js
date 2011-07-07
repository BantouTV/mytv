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


Joshfire = {define: function(a,b) {_ = b();}};
  

var express = require('express');
var fs = require('fs');
var expressApp = express.createServer(),
 request = require('request');

testPath = __dirname + '/';
expressApp.use(express.static(testPath));

var serialize = function(obj) {
  var str = [];
  for(var p in obj)
     str.push(p + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
};



expressApp.get('/proxy.php', function(req, res){
  res.end('Coucou');
})

expressApp.post('/proxy.php', function(req, res){
    
    var rq = {'uri':req.param("url"),'method':'POST'};
    console.log('requete post via proxy', req.param('url'), req.body);
    if (req.body!==undefined) {
        rq["body"] = serialize(req.body);
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