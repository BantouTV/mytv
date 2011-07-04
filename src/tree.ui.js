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

Joshfire.define(['joshfire/class', 'joshfire/tree.ui','joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager'], function(Class, UITree, List, Panel, PanelManager) {
  return Class(UITree, {
    buildTree: function() {
      // UI specialization : the video list scrolls from top to bottom only on iOS
      var bVerticalList = (Joshfire.adapter === 'ios') ? true : false;

      var app = this.app;
      // our UI definition
      var aUITree = [
        {
          id: 'toolbar',
          type: Panel,
          hideOnBlur: false,
          content: '<h1>myTED.tv</h1>',
          children: [{
            id: 'backButton',
            type: 'button',
            label: 'Back'
          },
          {
            id: 'reloadButton',
            type: 'button',
            label: 'Reload'
          }]
        },
        {
          id:'main',
          type:PanelManager,
          uiMaster:'/menu',
          children:[
          {
            id:'home',
            type:Panel,
            onAfterBlur:function(){console.warn('blur!!')},
            children:[
              {
                id: 'videolist',
                type: List,
                dataPath: '/talks/latest/',
                //hideOnBlur: true,
                autoShow: true,
                // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%= item.label %></figcaption></figure>',
                scroller: true,
                scrollOptions: {
                  // do scroll in only one direction
                  vScroll: bVerticalList,
                  hScroll: !bVerticalList
                },
                scrollBarClass: 'scrollbar',
                autoScroll: true,
                //hideDelay: 5000,
                onSelect: function(ui,evt,data) {
                  console.warn(ui.getDataById(data[0][0]));
                  // app.ui.moveTo('focus', '/videodetail');
                }
              },
              {
                id: 'videodetail',
                type: Panel,
                hideOnBlur:true,
                uiDataMaster:'/main/home/videolist',
                autoShow:true,
                forceDataPathRefresh: true,
                onAfterFocus:function(){
                  console.warn('detail focused', this.data);
                },
                children:[
                  {
                    id: 'player',
                    type: 'video.mediaelement',
                    autoShow: false,
                    options:{
                      forceAspectRatio: false,
                      height: window.innerHeight
                    }
                  },
                  {
                    id:'videoinfo',
                    type: Panel,
                    //content:'Infos sur vidéo',
                    innerTemplate:'<div class="info"><p class="title"><%= data.label %></p></div>'
                  },
                  {
                    id:'talkerinfo',
                    type: Panel,
                    //content:'Infos sur talker',
                    innerTemplate:'<div class="info"><p class="talker"><%= data.talker %></p></div>'
                  }
                ]// end videodetail children
              } // end videodetail
            ]//end home children
            } // end home
             
            /**
             insert here
             
                themes view
                my content view 
                
                ,{
                    id:'themes',
                    type:Panel,
                    content:'Themes themes themes'
                  },
                  {
                    id:'my',
                    type:Panel,
                    content:'These are MY videos'
                  }
            **/
          ]//end main children
        }, //end main
        {
          id: 'menu',
          type: List,
          hideOnBlur: false,
          content: '',
          data: [{
            id: 'home',
            type: 'button',
            label: 'Videos'
          },
          {
            id: 'themes',
            type: 'button',
            label: 'Themes'
          },
          {
            id: 'my',
            type: 'button',
            label: 'My videos'
          }]
        }
      ];
      // UI specialization : the video control bar is useless on environments without a mouse
      //console.log(Joshfire.adapter);
      if(Joshfire.adapter === 'browser') {
        aUITree.push({
          id: 'controls',
          type: 'mediacontrols',
          media: '/player',
          hideDelay: 5000
        });
      }
      return aUITree;
    }
  });
});
