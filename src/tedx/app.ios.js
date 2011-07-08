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

Joshfire.define(['./app', 'joshfire/class', 'joshfire/vendor/underscore'], function(App, Class, _) {
  return Class(App, {

    id: 'myTED',
  
    setup: function(callback) {
      var self = this;

      this.__super(function() {

        var likeButton = self.ui.element('/main/home/videodetail/like');
        likeButton.subscribe('input', function(ev, id) {
          $('#' + likeButton.htmlId).toggleClass('liked');
        });

        var loginButton = self.ui.element('/toolbar/loginButton');
        loginButton.subscribe('afterShow', function(ev, id) {
          if (!self.getState('auth')) {
            loginButton.htmlEl.firstChild.innerText = 'Login';
          } else {
            // FIXME: Do not logout, do something else
            loginButton.htmlEl.firstChild.innerText = 'Logout';
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
            self.userSession = response.session;
            self.setState("auth",true);
            self.ui.element('/toolbar/loginButton').htmlEl.firstChild.innerText='Logout';
            
            if (window.location.toString().match(/logout/)) {
             self.fbLogout();
            }
            
          } else {
            // no user session available, someone you dont know
            self.setState("auth",false);
            self.ui.element('/toolbar/loginButton').htmlEl.firstChild.innerText='Login';
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
            self.userSession = response.session;
            self.setState("auth",true);
            
          } else {
            // user is logged in, but did not grant any permissions
          }
        } else {
          // user is not logged in
        }
      }, {perms:'read_stream,publish_stream,offline_access'});
    },
    fbLogout:function(){
       FB.logout(function() {
          window.location = window.location;
        });
    }
  });
});
