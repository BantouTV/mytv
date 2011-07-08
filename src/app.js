Joshfire.define(['joshfire/app', 'joshfire/class', './tree.data', './tree.ui', 'joshfire/vendor/underscore', 'joshfire/utils/splashscreen'], function(App, Class, Data, UI, _, Splash) {

  return Class(App, {
    id: 'myTEDtv',
    uiClass: UI,
    dataClass: Data,
    setup: function(callback) {
      var self = this,
          splash = new Splash(),
          videolist = self.ui.element('/main/home/videolistpanel/videolist');

      if (TEDXID) {
        setTimeout(function() {
          self.ui.element('/footer').selectById("tedx");
        },200);
        
      } else {
        videolist.subscribe('data', function(ev, data, token) {
          videolist.unsubscribe(token);
          self.ui.setState('focus', '/main/home/videolistpanel/videolist');
          if (device != 'iphone')
            videolist.selectByIndex(0);
          self.ui.element('/footer').selectById("home");
          splash.remove();
        });
      }
      

      if (callback)
        callback(null);
    },
    setTitle:function(newTitle) {
      document.getElementsByTagName("title")[0].innerHTML = newTitle;
      app.ui.element("/toolbar").htmlEl.firstChild.innerHTML = newTitle;
      
      splash.remove();
    }
  });
});
