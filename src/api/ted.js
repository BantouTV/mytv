Joshfire.define(['joshfire/utils/datasource','joshfire/vendor/underscore'], function(DataSource,_) {
  var datasource = new DataSource(),
  
      // This API is also open source on github : http://github.com/joshfire/ted-api
      // It is only temporary since TED is supposed to release an API mid-2011.
      APIROOT_TED = 'http://ted-api.appspot.com/rest/v1/json/';

  return {
    query: function(url,callback) {
      datasource.request({
        url: APIROOT_TED+url, 
        dataType: 'jsonp',
        cache: 'no',
        jsonp: 'callback'
      },
      function (error, json) {
        if (error) {
          return callback(error, null);
        }
        return callback(null, json);
      });
    },

    completeTalks: function(talks, callback) {
      var API = this;
      API.query('Talker?page_size=200&fin_key=' + encodeURIComponent(_.pluck(talks, 'talker').join(',')), function(error, json) {
        if (error) return callback(error);
        if (json.list.Talker && !_.isArray(json.list.Talker))
          json.list.Talker = [json.list.Talker];
        _.each(talks,function(talk) {
          _.each(json.list.Talker, function(talker) {
            if (talk.talker == talker.key) {
              talk.talker = talker;
            }
          });
        });
        callback(null,talks);
      });
    },

    getVideo: function(talk, callback){
      var API = this;
      API.query('Video?feq_talk=' + talk, function(error, json) {
        if (error) return callback(error);
        callback(null, json.list.Video);
      });
    }
  };
});
