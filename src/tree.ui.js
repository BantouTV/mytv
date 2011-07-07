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

Joshfire.define(['joshfire/class', 'joshfire/tree.ui','joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', './ted.api','./joshfire.me.api', 'joshfire/vendor/underscore'], function(Class, UITree, List, Panel, PanelManager, TEDApi,JoshmeAPI,  _) {
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
          children: [
          {
            id: 'loginButton',
            type: Panel,
            label:'Login',
            innerTemplate:'<a href="http://www.facebook.com/dialog/oauth?client_id=214358631942957&redirect_uri='+window.location+'&display=touch"><%=options.label%></a>'
          }],
          onAfterInsert: function(ui) {
            //register onclick on login button
            //iPad browser blocks facebook popup when coming from ..subscribe('input') :-(
              
                //  ui.app.fbLogin();
                // ... Forget that ...
                // Works fine in iOS Safari.. but not in a web app = launched from home screen
                // Let's try direct link
              //ui.htmlEl.onclick = function() {};
          }
        },
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
              ui.app.ui.element('/main/home/videolistpanel/videolist').publish('afterShow');
            },
            children:[
              {
                id: 'videolistpanel',
                type: Panel,
                children: [
                  {
                    id: 'videolisttitle',
                    type: Panel,
                    innerTemplate: '<div class="title-wrapper"><p class="theme-title"><%= data.label ? data.label : "Latest videos"  %></p></div>'
                  },
                  {
                    id: 'videolist',
                    type: List,
                    dataPath: '/talks/latest/',
                    incrementalRefresh: true,
                    lastItemInnerTemplate: "<button class='more'>Show more!</button>",
                    onLastItemSelect:function(me) {
                      app.data.fetch(me.dataPath, {skip: me.data.length}, function(newData) {
                          if (!newData || newData.length == 0){
                            $('#' + me.htmlId + '___lastItem', $('#' + me.htmlId)).remove();
                          }

                      });
                    },
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
                    autoScroll: true
                  }
                ]
              },
              {
                id: 'videodetail',
                type: Panel,
                hideOnBlur: true,
                template: "<div id='myTED__detailswrapper'><div style='display:none;' class='josh-type-<%=type%> josh-id-<%=id%>' id='<%= htmlId %>' data-josh-ui-path='<%= path %>'><%= htmlOuter %></div></div>",
                uiDataMaster: '/main/home/videolistpanel/videolist',
                autoShow: true,
                forceDataPathRefresh: true,

                onData: function(ui) {
                  var player = ui.app.ui.element('/main/home/videodetail/player'),
                      play = function() {
                        player.playWithStaticUrl(ui.data.video['240']);
                        player.pause();
                      };

                  if (ui.data) {
                    if (ui.data.video) {
                      play();
                    } else {
                      TEDApi.getVideo(ui.data.key, function(error, vdata) {
                        ui.data.video = _.reduce(vdata, function(m, v) { m[v.format] = { url: v.url }; return m; }, {});
                        play();
                      });
                    }
                  }
                },

                children:[
                  {
                    id: 'like',
                    type: 'Button',
                    label: 'Like'
                  },
                  {
                    id: 'player',
                    type: 'video.mediaelement',
                    autoShow: true,
                    controls: true,
                    noAutoPlay: false,
                    options: {
                      forceAspectRatio: false,
                      height: window.innerHeight
                    },
                    onAfterInsert:function(self){
                      (function timer_daemon(){
                          setTimeout(function(){
                        var video= self.htmlEl.querySelector('video');
                        if (video && !video.paused){
                           //Do your thing
                           //_app.ui.element('/main/home/videodetail).dataPath.match(/[0-9]+$/)
                           //video.currentTime
                           // _app.timer._daemon
                           var video_id=_app.ui.element('/main/home/videodetail').dataPath.match(/[0-9]+$/);
                           $('#myTED__toolbar h1').html('Now playing '+video_id+', at '+Math.floor(video.currentTime*100)/100+'s');
                          JoshmeAPI.getData(1, 3, function (err, retour){
                            console.warn('api back', err, retour)
                          })
                           
                           
                        }
                         timer_daemon();
                        } , 1000);
                      })();
                      
                    }
                  },
                  {
                    id: 'videoshortdesc',
                    type: Panel,
                    uiDataSync: '/main/home/videodetail',
                    innerTemplate:
                      '<h1><%= data.title %></h1>'+
                      '<%= data.talker ? "<h2>by "+data.talker.name+"</h2>" : "" %>'
                  },
                  {
                    id: 'info',
                    type: Panel,
                    uiDataSync:'/main/home/videodetail',
                    children: [
                      {
                        id: 'videoinfo',
                        type: Panel,
                        uiDataSync:'/main/home/videodetail',
                        innerTemplate:
                          '<h1 class="label">Summary</h1>'+
                          '<p class="description"><%= data.summary %></p>'
                      },
                      {
                        id: 'talkerinfo',
                        type: Panel,
                        uiDataSync:'/main/home/videodetail',
                        innerTemplate:
                          '<h1 class="name"><%= data.talker ? data.talker.name : "" %></h1>'+
                          '<p class="description"><%= data.talker ? data.talker.shortsummary : "" %></p>'
                      }
                    ]
                  }
                ]//fin children videodetail
              }//fin video detail
            ]//fin children home
            },//fin home
            {
              id: 'themes',
              type: Panel,
              content: '',
              onAfterShow: function(ui) {
                // propagate event to child list for scroller refresh
                ui.app.ui.element('/main/themes/themeslist').publish('afterShow');
              },
              children: [{
                id: 'themeslist',
                type: List,
                dataPath: '/themes/',
                incrementalRefresh: true,
                autoShow: true,
                // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                itemInnerTemplate: '<figure data-id="<%= item.id %>"><img src="<%= item.image ? item.image : "http://placehold.it/208x142" %>"/><figcaption><%= item.label %></figcaption></figure>',
                scroller: true,
                scrollOptions: {
                  // do scroll in only one direction
                  vScroll: bVerticalList,
                  hScroll: !bVerticalList
                },
                scrollBarClass: 'scrollbar',
                autoScroll: true,
                onSelect: function(ui, evt, data) {
                  var videolist = ui.app.ui.element('/main/home/videolistpanel/videolist');
                  videolist.setDataPath('/themes/' + data[0]);
                  
                  var token = videolist.subscribe('afterRefresh', function() {
                    videolist.selectByIndex(0);
                    videolist.unsubscribe(token);
                  });
                  ui.app.ui.element('/footer').selectByIndex(0);
                  
                  var videolisttitle = ui.app.ui.element('/main/home/videolistpanel/videolisttitle');
                  videolisttitle.setDataPath('/themes/' + data[0]);
                }
              }]
            },
            {
              id: 'favorites',
              type: Panel,
              content: ''
            }
          ]//fin children main
        },//main
        {
          id: 'footer',
          type: List,
          hideOnBlur: false,
          content: '',
          onAfterInsert: function(ui) {
            var btn = {
                  latest: document.getElementById('myTED__footer_home'),
                  themes: document.getElementById('myTED__footer_themes'),
                  favorites: document.getElementById('myTED__footer_favorites')
                },
            player  = ui.app.ui.element('/main/home/videodetail/player');
            btn.themes.onclick = function() { player.pause(); };
            btn.latest.onclick = function() { player.pause(); };
            btn.favorites.onclick = function() {
              player.pause();
              if (!app.getState('auth')) {
                app.fbLogin();
              } else {
                  //call api save prefs
              }
            };
          },
          data: [{
            id: 'home',
            label: 'Videos'
          },
          {
            id: 'themes',
            label: 'Themes'
          },
          {
            id: 'favorites',
            label: 'My favorites'
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
