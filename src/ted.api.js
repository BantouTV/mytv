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


Joshfire.define(['joshfire/utils/datasource','joshfire/vendor/underscore'], function(DataSource,_) {
  var datasource = new DataSource(),
    APIROOT_TED = "http://ted-api.appspot.com/rest/v1/json/";


return {

	query:function(url,callback) {
    datasource.request({
  		    url:APIROOT_TED+url, 
  		    dataType:"jsonp",
  		    cache:"no",
  		    jsonp:"callback"
		    },
  			  function (error, json){
  			  if (error){
  			    return callback(error, null);
  			  }
  			  return callback(null, json);
  			}
  		);
	},

	completeTalks:function(talks,callback) {
	    var API=this;
	    API.query("Talker?page_size=200&fin_key="+encodeURIComponent(_.pluck(talks,"talker").join(",")),function(error,json) {
	        if (error) return callback(error);

	        _.each(talks,function(talk) {
	            _.each(json.list.Talker,function(talker) {
	                if (talk.talker==talker.key) {
	                    talk.talker=talker;
	                }
	            });
	        });
	        callback(null,talks);
	    });
	},

	getVideo:function(talk,callback){
	    var API=this;
	    API.query("Video?feq_talk="+talk,function(error,json) {
	        if (error) return callback(error);
	        callback(null,json.list.Video);
	    });
	},

  	
};
});
