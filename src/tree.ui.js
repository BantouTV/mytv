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
          uiMaster:'/footer',
          children:[
          {
            id:'home',
            type:Panel,
            onAfterBlur:function(){console.warn('blur!!')},
            children:[
            {
<<<<<<< HEAD
                id: 'videolist',
                type: List,
                dataPath: '/talks/latest/',
                //hideOnBlur: true,
                autoShow: true,
                // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%= item.title %><br><span class="talker">by <%= item.talker.name %></span></figcaption></figure>',
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
                  // console.warn(ui.getDataById(data[0][0]));
                  // app.ui.moveTo('focus', '/videodetail');
                }
              },
              {
                id: 'videodetail',
                type: Panel,
                hideOnBlur: true,
                template: "<div id='myTED__detailswrapper'><div style='display:none;' class='josh-type-<%=type%> josh-id-<%=id%>' id='<%= htmlId %>' data-josh-ui-path='<%= path %>'><%= htmlOuter %></div></div>",
                uiDataMaster: '/main/home/videolist',
                autoShow: true,
                forceDataPathRefresh: true,
                onAfterFocus: function() {
                  // console.warn('detail focused', this.data);
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
                    options: {
                      forceAspectRatio: false,
                      height: window.innerHeight
                    }
                  },
                  {
                    id: 'videoshortdesc',
                    type: Panel,
                    innerTemplate:
                      '<h1>Video title<%= data.label %></h1>'+
                      '<h2>by <%= data.talker ? data.talker.name : "" %></h2>'
                  },
                  {
                    id: 'videoinfo',
                    type: Panel,
                    innerTemplate:
                      '<h1 class="label">Video title<%= data.label %></h1>'+
                      '<p class="description"><%= data.description %>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>'
                  },
                  {
                    id: 'talkerinfo',
                    type: Panel,
                    innerTemplate:
                      '<h1 class="name"><%= data.talker ? data.talker.name : "" %></h1>'+
                      '<p class="description"><%= data.talker ? data.talker.description : "" %>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>'
                  }
                ]//fin children videodetail
              }//fin video detail
            ]//fin children home
            }//fin home
            /**
            Bug panel manager : en ajoutant des items, erreur lors du resolve moves
            {
              id:'themes',
              type:Panel,
              content:'Lot of stuff'
=======
              id: 'like',
              type: 'Button',
              label: 'Like'
            },
            {
              id: 'player',
              type: 'video.mediaelement',
              autoShow: false,
              options: {
                forceAspectRatio: false,
                height: window.innerHeight
              }
            },
            {
              id: 'videoshortdesc',
              type: Panel,
              innerTemplate:
              '<h1>Video title<%= data.label %></h1>'+
              '<h2>by <%= data.talker ? data.talker.name : "" %></h2>'
            },
            {
              id: 'info',
              type: Panel,
              children:[
                {
                  id: 'videoinfo',
                  type: Panel,
                  innerTemplate:
                  '<h1 class="label">Video title<%= data.label %></h1>'+
                  '<p class="description"><%= data.description %>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>'
                },
                {
                  id: 'talkerinfo',
                  type: Panel,
                  innerTemplate:
                  '<h1 class="name"><%= data.talker ? data.talker.name : "" %></h1>'+
                  '<p class="description"><%= data.talker ? data.talker.description : "" %>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>'
                }
              ]
>>>>>>> 17bee75b22f441a5f154e71642878a45bbe3cdac
            }
            **/
          ]//fin children main
        },//main
        {
          id: 'footer',
          type: List,
          hideOnBlur: false,
          content: '',
          onAfterInsert:function() {
            document.getElementById("myTED__footer_myVideosButton").onclick=function() {
              
              if (!app.getState("auth")) {
                app.fbLogin();
              } else {
                alert("user id is "+app.facebookSession.uid);
              }
            }
          },
          data: [{
            id: 'videosButton',
            //type: 'button',
            label: 'Videos'
          },
          {
            id: 'themesButton',
            //type: 'button',
            label: 'Themes'
          },
          {
            id: 'myVideosButton',
            //type: 'button',
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
