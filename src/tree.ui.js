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

Joshfire.define(['joshfire/class', 'joshfire/tree.ui','joshfire/uielements/list', 'joshfire/uielements/panel'], function(Class, UITree, List, Panel) {
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
          uiDataMaster:'/videolist',
          autoShow:true,
          forceDataPathRefresh: true,
          onAfterFocus:function(){
            console.warn('detail focused', this.data)
          },
          /*
          onAfterRefresh:function() {
            this.app.ui.element('/videodetail/videoinfo').setDataPath(videodetail.dataPath);
            this.app.ui.element('/videodetail/talkerinfo').setDataPath(videodetail.dataPath);
          },
          */
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
              innerTemplate:
              '  <img src="<%= data.image %>" />'+
              '  <p class="label"><%= data.label %></p>'+
              '  <p class="id"><%= data.id %></p>' + 
              '  <p class="duration"><%= data.duration %></p>'
            },
            {
              id:'talkerinfo',
              type: Panel,
              //content:'Infos sur talker',

              innerTemplate:
              '  <img src="<%= data.talker ? data.talker.image : \'\' %>" />'+
              '  <p class="name"><%= data.talker ? data.talker.name : "" %></p>'+
              '  <p class="key"><%= data.talker ? data.talker.key : "" %></p>'
            }
          ]
        },
        {
          id: 'footer',
          type: List,
          hideOnBlur: false,
          content: '',
          data: [{
            id: 'videosButton',
            type: 'button',
            label: 'Videos'
          },
          {
            id: 'themesButton',
            type: 'button',
            label: 'Themes'
          },
          {
            id: 'myVideosButton',
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