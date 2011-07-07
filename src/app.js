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
          splash = new Splash(),
          videolist = self.ui.element('/main/home/videolistpanel/videolist');

      var token = videolist.subscribe('data', function(ev, data) {
        videolist.unsubscribe(token);

        self.ui.setState('focus', '/main/home/videolistpanel/videolist');
        videolist.selectByIndex(0);
        self.ui.element('/footer').selectByIndex(0);
        
        splash.remove();
      });

      var scrollerUpdate = function() {
        if (videolist.iScroller) {
          console.error('iScroller', videolist.iScroller);

          videolist.vScrollbar = true;
          videolist.iScroller.refresh();
        }
      };

      self.ui.element('/main/home').subscribe('afterShow', scrollerUpdate);
      self.ui.element('/main/themes').subscribe('afterShow', scrollerUpdate);
           
      if (callback) {
        callback(null);
      }
    }
  });
});
