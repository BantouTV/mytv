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

Joshfire.define(['joshfire/class', 'joshfire/tree.data', 'joshfire/vendor/underscore', './ted.api'], function(Class, DataTree, _, API) {
  var urlserialize = function(obj) {
    var str = [];
    for (var p in obj) {
      str.push(p + '=' + encodeURIComponent(obj[p]));
    }
    return str.join('&');
  };
  
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
            console.error("THEME", theme);
              return {
                'id': theme.key,
                'label': theme.name,
                'image': theme.image,
                'children': function(query, cb) {
                  query['filter'] = {'theme': theme.key};
                  console.error('WAZAAAAAAAAAAAAA', data);
                  me.fetch('/talks/all/', query, function(err, data) {
                    console.error('HERREEEEEE', data);
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
            'id': 'favorites',
            'children': function(query, cb) {
              // Fetch ID list from joshfire.me
              var favorites = ['agd0ZWQtYXBpcgsLEgRUYWxrGI9vDA'];
              if (!query.filter) query.filter = {};
              query.filter.id = favorites;
              me.fetch('/talks/all/', query, cb);
            }
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
                    query.filter.id = _.pluck(json.list.TalkTheme, 'talk');
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
                      title: item.name.substring(item.name.indexOf(': ') + 2),
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
      }];
    }
  });
});
