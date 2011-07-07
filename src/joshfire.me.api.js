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
     TRUE_APIROOT_JOSHME = 'http://joshfire.com:40008/data/';
      APIROOT_JOSHME = 'http://local.myted.tv:40010/proxy/';

  return {
    query: function(url,data, callback) {
data.url = TRUE_APIROOT_JOSHME+url;
      datasource.request({
        url:APIROOT_JOSHME,
        data:data, 
        type:'post',
        cache: 'no',
        jsonp: 'callback'
      },
      function (error, json) {
        console.warn('josh api', error, 'x', json)
        if (error) {
          return callback(error, null);
        }
        return callback(null, json);
      });
    },
    getData:function(app_id, user_id, callback){
      this.query('get',{appId:app_id, userId:user_id}, callback);
    },
    setData:function(app_id, user_id, data, callback){
      this.query('set',{appId:app_id, userId:user_id, data:data}, callback);
    }  };
});
