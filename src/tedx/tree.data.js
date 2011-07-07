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

Joshfire.define(['joshfire/class', 'joshfire/tree.data', 'joshfire/vendor/underscore','joshfire/utils/datasource','./youtube.api'], function(Class, DataTree, _, DataSource, YoutubeAPI) {
  var urlserialize = function(obj) {
    var str = [];
    for (var p in obj) {
      str.push(p + '=' + encodeURIComponent(obj[p]));
    }
    return str.join('&');
  };
  
  var ds = new DataSource();
  
  return Class(DataTree, {
    
    setup:function(callback) {
      var self = this;
      
      this.__super(function(err) {
        
        ds.request({
          "url":"https://spreadsheets.google.com/feeds/list/0ArnpnObxnz4RdHJhSVlURUlFdk9pc09jOHkxLWRHa1E/od6/public/values?hl=fr&alt=json-in-script",
          "dataType":"jsonp",
        },function(err,data) {
          if (err) return callback(err);
          self.tedxdata = data.feed.entry;
          callback();
        });
        
      });
      
    },
    
    
    buildTree: function() {
      var self = this;
      var app = this.app;
      var me = app.data;

      return [
        { 
          id: 'themes'
        },
        id: 'talks',
        children: [
          {
            'id': 'latest',
            'children':[]
          }
        ]
      
      ];
      
    }
  });
});
