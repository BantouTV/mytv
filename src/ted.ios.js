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

Joshfire.define(['./app', 'joshfire/class'], function(App, Class) {
  return Class(App, {
    id: 'myTED',
    setup: function(callback) {
      var self = this;
      this.__super();
      var videodetail = self.ui.element('/main/home/videodetail');
      videodetail.subscribe('afterRefresh', function(ev, id) {
        self.ui.element('/main/home/videodetail/videoshortdesc').setDataPath(videodetail.dataPath);
        self.ui.element('/main/home/videodetail/videoinfo').setDataPath(videodetail.dataPath);
        self.ui.element('/main/home/videodetail/talkerinfo').setDataPath(videodetail.dataPath);
      });
      callback(null, true);
    }
  });
});