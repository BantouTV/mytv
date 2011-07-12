Joshfire.define(['joshfire/class', 'joshfire/tree.data', 'joshfire/vendor/underscore', './api/ted','./api/youtube','joshfire/utils/datasource'], function(Class, DataTree, _, API, YoutubeAPI, DataSource) {
  var urlserialize = function(obj) {
    var str = [];
    for (var p in obj) {
      str.push(p + '=' + encodeURIComponent(obj[p]));
    }
    return str.join('&');
  };


  var youtubeAPI = new YoutubeAPI();
  
  var ds = new DataSource();
  
  return Class(DataTree, {
    buildTree: function() {
      var self = this;
      var app = this.app;
      var me = app.data;

      return [
      {
        id: 'themes',
        children: function(query, childCallback) {
          API.query('Theme?page_size=' + query.limit + '&offset=' + query.skip, function(error, json) {
            if (error) return callback(error);
            childCallback(null, _.map(json.list.Theme, function(theme) {

              return {
                'id': theme.key,
                'label': theme.name,
                'image': theme.image,
                'children': function(query, cb) {
                  query['filter'] = {'theme': theme.key};
                  me.fetch('/talks/all/', query, function(err, data) {
                    cb(err, data, {'cache': 3600});
                  });
                }
              };
            }), {'cache': 3600*24});
          });
        }
      },
      {
        id: 'talks',
        children: [
          {
            'id': 'latest',
            'children': function(query, cb) {
              query['sort'] = {'date': -1};
              me.fetch('/talks/all/', query, function(err,data) {
                cb(err,data,{"cache":3600});
              });
            }
          },
          {
            id: 'favorites',
            label:'Favorites',
           /* 'children': function(query, cb) {
              // Fetch ID list from joshfire.me
              var favorites = ['agd0ZWQtYXBpcgsLEgRUYWxrGI9vDA'];
              if (!query.filter) query.filter = {};
              query.filter.id = favorites;
              me.fetch('/talks/all/', query, cb);
            }*/
          },
          {
            'id': 'all',
            'children': function(query, callback) {
              var qs = {
                'page_size': query.limit,
                'offset': query.skip
              };

              if (query.filter) {
                if (query.filter.theme) {
                  //First fetch TalkTheme ids, then ask for these ids.
                  API.query('TalkTheme?' + urlserialize(qs) + '&feq_theme=' + encodeURIComponent(query.filter.theme), function(error, json) {
                    if (error) return callback(error);
                    delete query.filter.theme;

                    query.filter.id = (json.list.TalkTheme ? (_.isArray(json.list.TalkTheme) ? _.pluck(json.list.TalkTheme, 'talk') : json.list.TalkTheme.talk) : null);
                    me.fetch('/talks/all/', query, callback);
                  });
                  return;
                }

                if (query.filter.id) {
                  if (_.isArray(query.filter.id)) {
                    qs['fin_key'] = query.filter.id.join(',');
                  } else {
                    qs['feq_key'] = query.filter.id;
                  }
                }
              }

              if (query.sort && query.sort.date) {
                //TODO are talks always released in order?
                qs['ordering'] = (query.sort.date == -1 ? '-' : '') + 'tedid';
              }

              //Send the query
              API.query('Talk?' + urlserialize(qs), function(error, json) {
                if (error) return callback(error);
                API.completeTalks(_.isArray(json.list.Talk) ? json.list.Talk : [json.list.Talk], function(error2, talks) {
                  //console.warn('got talks', talks);
                  if (error2) return callback(error);
                  //Format talks for the tree
                  callback(null, _.map(talks, function(item) {
                    return {
                      id: item.tedid,
                      label: ((item.name.indexOf(': ') == -1) ? item.name : item.name.substring(item.name.indexOf(': ') + 2)),
                      summary: item.shortsummary,
                      image: item.image,
                      talker: item.talker,
                      key: item.key,
                      duration: item.duration_postad
                    };
                  }));
                });
              });
            }
          }
        ]
      },
      {
        id: 'tedx',
        children:function(query,callback) {
          
          ds.request({
            
            // Email sylvain _at_ joshfire.com to get an invite on this spreadsheet to add your TEDx events.
            "url":"https://spreadsheets.google.com/feeds/list/0ArnpnObxnz4RdHJhSVlURUlFdk9pc09jOHkxLWRHa1E/od6/public/values?hl=fr&alt=json-in-script",
            "dataType":"jsonp",
            "cache":3600
          },function(err,data) {
            if (err) return callback(err);

            var matches = [];
            _.each(data.feed.entry,function(tedx,i) {
              if (tedx.gsx$tedxname.$t==TEDXID || !TEDXID) {

                // Show TEDx locations when in global mode
                if (!TEDXID) {
                  var eventlabel = tedx.gsx$formattedname.$t+" "+tedx.gsx$eventname.$t;
                } else {
                  var eventlabel = tedx.gsx$eventname.$t;
                  if (tedx.gsx$formattedname.$t) app.setTitle(tedx.gsx$formattedname.$t);
                }
                
                matches.push({
                  "id":i,
                  "image":tedx.gsx$eventimage.$t,
                  "label":eventlabel,
                  "children":function(q,cb) {

                    youtubeAPI.getPlaylistVideos(tedx.gsx$youtubeplaylist.$t,function(err,videos) {

                      cb(err,_.map(videos,app.data.formatTEDxData));
                    });

                  }
                });
              }
            });
            callback(null,matches,{"cache":3600});
          });
          
          
        }
      }
      ];
    
  },
  
  // Beautify the labels from YouTube
  formatTEDxData:function(talk) {
    
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
    
    
  }
}
  
  );
});
