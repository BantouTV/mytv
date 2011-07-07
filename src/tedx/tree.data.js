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
  
  var youtubeAPI = new YoutubeAPI();
  
  var TEDXID = "paris";
  
  return Class(DataTree, {
    
    setup:function(callback) {
      var self = this;
      
      //all rows
      this.tedxdata = [];
      
      //filtered version
      this.tedxmeta = false;
      
      this.__super(function(err) {
        
        ds.request({
          "url":"https://spreadsheets.google.com/feeds/list/0ArnpnObxnz4RdHJhSVlURUlFdk9pc09jOHkxLWRHa1E/od6/public/values?hl=fr&alt=json-in-script",
          "dataType":"jsonp",
        },function(err,data) {
          if (err) return callback(err);
          self.tedxdata = data.feed.entry;
          console.log(self.tedxdata);
          callback();
        });
        
      });
      
    },
    
    formatData:function(talk) {
      
      
      //remove event name
      var label = talk.label;
      
      //strip "TEDx XYZ 20xx"
      label = label.replace(/tedx( )?([a-z0-9]+)( 20[0-9]{2})?/ig,"");
      
      //strip dates
      label = label.replace(/[0-9]{2,4}\/[0-9]{2}\/[0-9]{2,4}/g,"");
      
      //Trim
      label = label.replace(/^[ \-\:]+/,"");
      label = label.replace(/[ \-\:]+$/,"");
      
      //Try to extract talker name, before the first " - "
      if (label.indexOf(" - ")>0) {
        talk.talker = {name:label.substring(0,label.indexOf(" - "))};
        label = label.substring(label.indexOf(" - ")+3);
      }
      
      //Trim again
      label = label.replace(/^[ \-\:]+/,"");
      label = label.replace(/[ \-\:]+$/,"");
      
      
      talk.label = label;
      
      return talk;
      
      
    },
    
    buildTree: function() {
      var self = this;
      var app = this.app;
      var me = app.data;

      return [
        { 
          id: 'themes',
          children:function(query,callback) {
            var matches = [];
            _.each(self.tedxdata,function(tedx,i) {
              if (tedx.gsx$tedxname.$t==TEDXID) {
                if (!self.tedxmeta) {
                  self.tedxmeta = {
                    "id":TEDXID,
                    "name":tedx.gsx$formattedname.$t
                  };
                }
                matches.push({
                  "id":i,
                  "image":tedx.gsx$eventimage.$t,
                  "label":tedx.gsx$eventname.$t,
                  "children":function(q,cb) {

                    youtubeAPI.getPlaylistVideos(tedx.gsx$youtubeplaylist.$t,function(err,videos) {
                      
                      cb(err,_.map(videos,self.formatData));
                    });
                    
                  }
                })
              }
            });
            callback(null,matches);
          }
        },
        {
          id: 'talks',
          children: [
            {
              'id': 'latest',
              'children':[
                {
                  "id":"test"
                }
              ]
            }
          ]
        }
        
      
      ];
      
    }
  });
});
