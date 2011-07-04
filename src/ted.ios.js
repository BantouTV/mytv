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

    id:'myTED',
    
    setup: function(callback) {
      var self = this;
      this.__super();

      var videodetail = self.ui.element('/videodetail');

      videodetail.subscribe('afterRefresh', function(ev, id) {
      /*
        console.warn('$$$$$$$$$$$$$ afterRefresh', videodetail.dataPath);
        console.warn(self.ui.element('/videodetail/talkerinfo'))
        console.warn(self.data.get(videodetail.dataPath));
        */
        self.ui.element('/videodetail/videoinfo').setDataPath(videodetail.dataPath);
        self.ui.element('/videodetail/talkerinfo').setDataPath(videodetail.dataPath);
      });

      callback(null, true);
    }
    

  });

});
