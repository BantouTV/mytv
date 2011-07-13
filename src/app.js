Joshfire.define(['joshfire/app', 'joshfire/class', './tree.data', './tree.ui', 'joshfire/vendor/underscore', 'joshfire/utils/splashscreen'], function(App, Class, Data, UI, _, Splash) {

  return Class(App, {
    id: 'myTEDtv',
    uiClass: UI,
    dataClass: Data,
    setup: function(callback) {
      var self = this;
      
      this.splash = new Splash();
          
      if (TEDXID) {
        //Load TEDx events. setTEDxMode() will be called.
        this.data.fetch("/tedx/",false,function() {
          
        });
        
      } else {
        var videolist = self.ui.element('/main/home/videolistpanel/videolist');
        
        videolist.subscribe('data', function(ev, data, token) {
          videolist.unsubscribe(token);

          self.ui.setState('focus', '/main/home/videolistpanel/videolist');
          if (device != 'iphone' && device != 'androidphone')
            videolist.selectByIndex(0);
          self.ui.element('/footer').selectById("home");
          self.splash.remove();
        });
      }
      

      if (callback) {
        callback(null);
      }
    },
    
    //Called only in TEDx mode when list of TEDx events has been loaded.
    setTEDxMode: function(tedxinfos) {
      var self = this;
      
      if (this.tedxmeta) return;
      this.tedxmeta = tedxinfos;
      
      document.getElementsByTagName('title')[0].innerText = tedxinfos.title;
      this.ui.element('/toolbar').htmlEl.firstChild.innerText = tedxinfos.title;
      
      this.data.fetch('/tedx/', false, function(err, tedxevents) {
        
        if (tedxevents.length) {
          self.mainVideoListDataPath = "/tedx/"+tedxevents[0].id+"/";
          self.ui.element("/main/home/videolistpanel/videolist").setDataPath(self.mainVideoListDataPath);
        }
        
        
        var footerData = [{
            id: 'home',
            label: 'Videos'
        },{
            id: 'tedx',
            label: 'Events'
        }];
        /*
        if (tedxinfos.twitter) {
          footerData.push({
            id: 'twitter',
            label: 'Twitter'
          });
          
          self.ui.element('/main/twitter/twitterlist').setDataPath("/twitter/");
          
        }
        */
        self.ui.element('/footer').setData(footerData);
        
        // Auto-select if only one TEDx event
        if (tedxevents && tedxevents.length == 1) {
          self.ui.element('/footer').selectById('home');
          self.ui.element('/main/tedx/tedxlist').selectByIndex(0);
        } else {
          self.ui.element('/footer').selectById('tedx');
        }
        

        
        
        
        self.splash.remove();
      });
    }
  });
});