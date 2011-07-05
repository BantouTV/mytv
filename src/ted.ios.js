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

Joshfire.define(['./app', 'joshfire/class', './ted.api', 'joshfire/vendor/underscore'], function(App, Class, API, _) {
  return Class(App, {

    id: 'myTED',
  
    setup: function(callback) {
      var self = this;

      this.__super(function() {

        var videodetail = self.ui.element('/main/home/videodetail');

        videodetail.subscribe('afterRefresh', function(ev, id) {
          
          self.ui.element('/main/home/videodetail/videoshortdesc').setDataPath(videodetail.dataPath);
          self.ui.element('/main/home/videodetail/info/videoinfo').setDataPath(videodetail.dataPath);
          self.ui.element('/main/home/videodetail/info/talkerinfo').setDataPath(videodetail.dataPath);
          
          var player = self.ui.element('/main/home/videodetail/player');

          if (videodetail.data) {
            if (videodetail.data.video) {
              player.play(videodetail.data.video['240']);
              player.pause();
            } else {
              var edata = videodetail.data;
              API.getVideo(edata.key, function(error, vdata) {
                edata.video = _.reduce(vdata, function(m, v) { m[v.format] = { url: v.url }; return m; }, {});
                player.play(edata.video['240']);
                player.pause();
              });
            }
          }
        });

        self.fbInit(callback);
      });
    },
  
    fbInit: function(callback) {
      var self = this;
      
      window.fbAsyncInit = function() {
        FB.init({appId: 214358631942957, status: true, cookie: true, xfbml: true});
        
        //TODO on iPad this is not fired sometimes.
        FB.getLoginStatus(function(response) {

          if (response.session) {
            // logged in and connected user, someone you know
            self.facebookSession = response.session;
            self.setState("auth",true);
            
            if (window.location.toString().match(/logout/)) {
              FB.logout(function() {
                window.location = window.location;
              });
            }
            
          } else {
            // no user session available, someone you dont know
            self.setState("auth",false);
          }
        });
      };
      
      var e = document.createElement('script'); e.async = true;
      e.src = "http://connect.facebook.net/en_US/all.js"; // + (Joshfire.debug?'//static.ak.fbcdn.net/connect/en_US/core.debug.js':'//connect.facebook.net/en_US/all.js');
      document.getElementById('fb-root').appendChild(e);
      
      callback();
    },
  
    fbLogin:function() {
      var self = this;
      
      if (!FB) return;
    
      FB.login(function(response) {
        if (response.session) {
          if (response.perms) {
            
            // user is logged in and granted some permissions.
            // perms is a comma separated list of granted permissions
            self.facebookSession = response.session;
            self.setState("auth",true);
            
          } else {
            // user is logged in, but did not grant any permissions
          }
        } else {
          // user is not logged in
        }
      }, {perms:'read_stream,publish_stream,offline_access'});
    }
  });
});
