Joshfire.define(['joshfire/class', 'joshfire/tree.ui','joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', './api/ted','./api/joshfire.me', 'joshfire/vendor/underscore','templates_compiled/js/about'], function(Class, UITree, List, Panel, PanelManager, Button, TEDApi,JoshmeAPI,  _, TemplateAbout) {
  window._ = _;

  return Class(UITree, {     
    buildTree: function() {
      
      var app = this.app;
      
      // our UI definition
      var aUITree = [
        {
          id: 'main',
          type: PanelManager,
          uiMaster: '/footer',
          children: [
          {
            id: 'home',
            type: Panel,
            onAfterShow: function(ui) {
              // propagate event to child list for scroller refresh
              app.ui.element('/main/home/videodetail').publish('afterShow');
              app.ui.element('/main/home/videolistpanel/videolist').publish('afterShow');
            },
            children:[
                
                
            ]//fin children home
            },//fin home
            {
              id:"about",
              type:Panel,
              content:TemplateAbout()
            }
          ]//fin children main
        },//main
        {
          id: 'footer',
          type: List,
          hideOnBlur: false,
          content: '',
          onSelect: function(ids) {
            
            if (ids[0]!="home" && app.mainVideoListDataPath) {
              app.ui.element('/main/home/videolistpanel/videolist').setDataPath(app.mainVideoListDataPath);
            }
            
            if (ids[0]!="home") {
              app.ui.element('/main/home/videodetail/player').pause();
            }
            
          },
          data: []
        }
      ];
      return aUITree;
    }
  });
});
