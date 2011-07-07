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

Joshfire.define(['joshfire/app', 'joshfire/class', './tree.data', '../tree.ui', 'joshfire/vendor/underscore', 'joshfire/utils/splashscreen'], function(App, Class, Data, UI, _, Splash) {

  return Class(App, {
    id: 'myTEDtv',
    uiClass: UI,
    dataClass: Data,
    setup: function(callback) {
      var self = this;
      self.splash = new Splash();
      
      var videolist = self.ui.element('/main/home/videolistpanel/videolist');

      videolist.subscribe('data', function(ev, data, token) {
        videolist.unsubscribe(token); 
        self.finishInit();
      });
      
      setTimeout(function() {
        self.finishInit()
      },2000);

      if (callback)
        callback(null);
    },
    
    finishInit:function() {
      var self = this;
      
      var videolist = self.ui.element('/main/home/videolistpanel/videolist');
      
      //todo check if only one event
      self.ui.setState('focus', '/main/themes');
      self.ui.element('/footer').selectByIndex(1);
      self.splash.remove();
      
    }
  });
});
