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
      datasource.request({
        url:APIROOT_JOSHME,
        data:{'data':data,'url':TRUE_APIROOT_JOSHME+url}, 
        type:'POST',
        cache: 'no',
        jsonp: 'callback'
      },
      function (error, retour) {
        if (error) {
          return callback(error, null);
        }
        var json={};
        try{
          json=JSON.parse(retour);
        }
        catch(e){
          console.error('invalid json', retour);
          
        }
        return callback(null, json);
      });
    },
    getData:function(app, user_id, callback){
      this.query('get',{appId:app.id, userId:user_id}, callback);
    },
    setData:function(app, user_id, data, callback){
      this.query('set',{appId:app.id, userId:user_id, data:data}, function(){
        console.warn('user session', app.userSession.mytv, data)
        callback();
      });
    }  };
});
