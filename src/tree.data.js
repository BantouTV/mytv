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
  return Class(DataTree, {
    buildTree: function() {
      var self=this;
      return [
      //latest talks, displayed on home screen
      {
        id: 'latest',
        children: function(query,childCallback) {
         
         API.getLatestTalks(20, function (error, videos){
             if (error){
              //Error retrieving talks
              return childCallback(error, null);
            }
            if (videos.length === 0){
              //No videos
              return childCallback({msg:'No results'}, null);
            }
            videos= _.map(videos, function (item){
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
        
        });//end api

        }//end latest children
      },
      //details on a specific video : video itself, talk info, speaker info
      {
        id:'video',
        children:function(query, childCallback){
          console.warn('query', query)
        }//end video children
        
      }
      
      ];
    }
  });
});
