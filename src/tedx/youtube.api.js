Joshfire.define(['joshfire/class', 'joshfire/utils/datasource'],function(Class,DataSource) {
  
  
  var YoutubeAPI = Class({

      __constructor:function() {
          this.datasource = new DataSource();
      },

      request:function(url,callback) {
          return this.datasource.request({
              "url":"http://gdata.youtube.com/feeds/api/"+url,
              "dataType":"jsonp",
              "cache":true
          },function(err,data) {
              callback(err,data);
          });
      },

      getPlaylistVideos:function(playlistId,callback) {
           this.request("playlists/"+playlistId+"?alt=json-in-script",function(error,data) {
               if (error) {
                   return callback(error);
               } else {
                   return callback(null,data.feed.entry);
               }
           });
       },
       
       getUserVideos:function(userName,callback) {
         
         this.request('/users/' + userName + '/uploads?alt=json-in-script',function(error,data) {

           var videos = data.feed.entry;

           //Map YouTube's data structure to a simplier JSON array
           for (var i = 0, l = videos.length; i < l; i++) {
             videos[i] = {
               'id': videos[i].id.$t.replace(/^.*\//, ''),
               'type': 'video',
               'label': videos[i].title.$t,
               'image': videos[i].media$group.media$thumbnail ? videos[i].media$group.media$thumbnail[0].url : '',
               'url': videos[i].link[0].href.replace('http://www.youtube.com/watch?v=', '').replace(/\&.*$/, '')
             };
           }

           callback(null, videos);
         });

       } 

  
     });
     
});