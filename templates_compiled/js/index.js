Joshfire.define([],function() {return function(obj) {
var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>myTED.tv</title>\n    '); if (compiled) { __p.push('\n      <script src="/js/', buildname ,'-', adapter ,'.',compiled,'.js"></script>\n    '); } else { __p.push('\n      <script data-main="./" src="joshfire/adapters/', adapter ,'/bootstrap.js"></script>\n    '); } __p.push('\n    \n    <link rel="stylesheet" href="css/ted.', buildname ,'.css" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0" />\n    <meta name="apple-mobile-web-app-capable" content="yes" />\n    <meta name="apple-mobile-web-app-status-bar-style" content="black" />\n    <meta name="format-detection" content="telephone=no">\n    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="apple-touch-icon.png">\n  </head>\n  <body>\n    <div id="fb-root"></div>\n    <div id="splashscreen"><!--TED--></div>\n    <script>\n      Joshfire.debug = true;\n      Joshfire.require([\'src/ted.', adapter ,'\'], function(MyTedTV) {\n        Joshfire.onReady(function() {\n          TEDXID = \'', tedxid ,'\';\n          device = \'', buildname ,'\';\n          window._app = new MyTedTV();\n        });\n      });\n    </script>\n    <script src="scripts/helper.js"></script>\n    <script>\n      MBP.scaleFix();\n    </script>\n  </body>\n</html>\n');}return __p.join('');
}});