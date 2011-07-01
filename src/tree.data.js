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


Joshfire.define(['joshfire/class', 'joshfire/tree.data', 'joshfire/utils/datasource', 'joshfire/vendor/underscore'], function(Class, DataTree, DataSource, _) {
  var datasource = new DataSource();
  
  return Class(DataTree, {
    api_url: 'http://ted-api.appspot.com/rest/v1/json/',
    getVideos:function(options, callback){
      var self=this;
      datasource.request({
          url:self.api_url+'Talk?offset=1',
          dataType: 'jsonp'
        },
        function (error, videos){
       
          callback(error, videos);
        }
      );
    },
    buildTree: function() {
      var self=this;
      return [{
        id: 'videos',
        children: function(query,childCallback) {
         
         self.getVideos(null, function (error, videos){
            if (error){
              //Error retrieving talks
              return childCallback(error, null);
            }
            if (!videos.list || !videos.list.Talk){
              //Unexpected api result
              return childCallback({msg:'Unexpected api result'}, null);
            }
            if (videos.list.Talk.length === 0){
              //No videos
              return childCallback({msg:'No results'}, null);
            }
            videos= _.map(videos.list.Talk, function (item){
                return {
                  id: item.tedid,
                  label:item.name, 
                  summary:item.summary,
                  image:item.image,
                  talker:item.talker,
                  duration:item.duration_postad
                };
            });
            return childCallback(null,videos); 
        
        });

        }
      }];
    }
  });
});
