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

Joshfire.define(['joshfire/app', 'joshfire/class', './tree.data', './tree.ui', 'joshfire/vendor/underscore', 'joshfire/utils/splashscreen'], function(App, Class, Data, UI, _, Splash) {

  return Class(App, {
    id: 'myTEDtv',
    uiClass: UI,
    dataClass: Data,
    setup: function(callback) {
      var self = this,
          splash = new Splash();

      // Select first video as soon we get the data
      var videolist = self.ui.element('/main/home/videolist'),
          token = videolist.subscribe('data', _.once(function(ev, data) {

        self.ui.setState('focus', '/main/home/videolist');
        self.ui.element('/main/home/videolist').selectByIndex(0);
        self.ui.element('/footer').selectByIndex(0);
        
        splash.remove();
        videolist.unsubscribe(token);
      }));
           
      if (callback) {
        callback(null);
      }
    }
  });
});
