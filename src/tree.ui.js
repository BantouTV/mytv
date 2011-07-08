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

Joshfire.define(['joshfire/class', 'joshfire/tree.ui','joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', './ted.api','./joshfire.me.api', 'joshfire/vendor/underscore'], function(Class, UITree, List, Panel, PanelManager, Button, TEDApi,JoshmeAPI,  _) {
  window._ = _;

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
            content:'Wait...'
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
                    innerTemplate: '<p class="theme-title"><%= data.label ? data.label : "Latest videos"  %></p>'
                  },
                  {
                    id: 'videolist',
                    type: List,
                    dataPath: TEDXID?false:'/talks/latest/',
                    incrementalRefresh: true,
                    lastItemInnerTemplate: "<button class='more'>Show more!</button>",
                    onLastItemSelect:function(me) {
                      $('#' + me.htmlId + '___lastItem button', $('#' + me.htmlId)).html("Loading...");
                      app.data.fetch(me.dataPath, {skip: me.data.length}, function(newData) {
                          if (!newData || newData.length == 0){
                            $('#' + me.htmlId + '___lastItem', $('#' + me.htmlId)).remove();
                          }
                      });
                    },
                    onSelect: function(ui, type, data) {
                      if (device == 'iphone') {
                        ui.app.ui.element('/main/home/videodetail').show();
                        ui.app.ui.element('/main/home/videodetail/close').show();
                        ui.app.ui.element('/main/home/videolistpanel').hide();
                      }
                    },
                    autoShow: true,
                    // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                    itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%= item.label %><br><span class="talker"><%= item.talker?"by "+item.talker.name:"" %></span></figcaption></figure>',
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
                autoShow: (device != 'iphone'),
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
                    //like icon
                    if (ui.app.userSession && ui.app.userSession.mytv && ui.app.userSession.mytv.favorites){
                       if (!ui.app.data.get('/talks/favorites/')){
                         //Update my favs
                          ui.app.data.set('/talks/favorites/', 
                            _.select(ui.app.data.get('/talks/all/'), 
                              function (item){
                                return _.contains(ui.app.userSession.mytv.favorites, item.id);
                              }
                            )
                          );
                        }
                      
                      if (_.include(ui.app.userSession.mytv.favorites, ui.data.id)){
                         $('#'+ui.app.ui.element('/main/home/videodetail/like').htmlId).addClass('liked');
                      }
                      else{
                         $('#'+ui.app.ui.element('/main/home/videodetail/like').htmlId).removeClass('liked');
                      }
                                          }
                    else{
                       $('#'+ui.app.ui.element('/main/home/videodetail/like').htmlId).removeClass('liked');
                    }
                  }
                  ui.app.ui.element('/main/favorites/favlist').setDataPath('/talks/favorites');
                  
                },
                children:[
                  {
                    id: 'like',
                    type: Button,
                    label: 'Like'
                  },
                  {
                    id: 'close',
                    type: Button,
                    label: 'Back',
                    autoShow: false,
                    onSelect: function(ui, type, data, token) {
                      ui.app.ui.element('/main/home/videodetail/player').pause();
                      ui.app.ui.element('/main/home/videodetail').hide();
                      ui.app.ui.element('/main/home/videolistpanel').show();
                    }
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
                        var video= self.app.ui.element('/main/home/videodetail/player').htmlEl.querySelector('video');
                        if (self.app.userSession && video && !video.paused){
                           //Do your thing
                           var video_id=self.app.ui.element('/main/home/videodetail').dataPath.match(/[0-9]+$/)[0];
                            JoshmeAPI.setData(self.app,self.app.userSession.uid, {currentVideo:video_id, time:Math.floor(video.currentTime*100)/100}, function (err, retour){
                          });
                           
                           
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
                      '<h1><%= data.label %></h1>'+
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
              autoShow:false,
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
                  
                  if (device != 'iphone') {
                    var token = videolist.subscribe('afterRefresh', function() {
                      videolist.selectByIndex(0);
                      videolist.unsubscribe(token);
                    });
                  }

                  ui.app.ui.element('/footer').selectByIndex(0);
                  
                  var videolisttitle = ui.app.ui.element('/main/home/videolistpanel/videolisttitle');
                  videolisttitle.setDataPath('/themes/' + data[0]);
                }
              }]
            },
            {
              id: 'tedx',
              type: Panel,
              content: '',
              autoShow:false,
              onAfterShow: function(ui) {
                // propagate event to child list for scroller refresh
                ui.app.ui.element('/main/tedx/tedxlist').publish('afterShow');
              },
              children: [{
                id: 'tedxlist',
                type: List,
                dataPath: '/tedx/',
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
                  videolist.setDataPath('/tedx/' + data[0]);
            
                  if (device != 'iphone') {
                    var token = videolist.subscribe('afterRefresh', function() {
                      videolist.selectByIndex(0);
                      videolist.unsubscribe(token);
                    });
                  }
                  
                  ui.app.ui.element('/footer').selectByIndex(0);
            
                  var videolisttitle = ui.app.ui.element('/main/home/videolistpanel/videolisttitle');
                  videolisttitle.setDataPath('/tedx/' + data[0]);
                }
              }]
            },
            {
              id: 'favorites',
              type: Panel,
              autoShow:false,
              children: [
                {
                  id: 'mytitle',
                  type: Panel,
                  innerTemplate: '<div class="title-wrapper"><p class="theme-title">My favorites</p></div><div class="fav-not-connected"><h3>You should be connected !</a></h3></div><div class="fav-zero-favs"><h3>No favorites yet !</a></h3></div>'
                },
                {
                  id: 'favlist',
                  type: List,
                  autoShow: true,
                  // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                  itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%= item.label %><br><span class="talker"><%= item.talker?"by "+item.talker.name:"" %></span></figcaption></figure>',
                  scroller: true,
                  scrollOptions: {
                    // do scroll in only one direction
                    vScroll: bVerticalList,
                    hScroll: !bVerticalList
                  },
                  scrollBarClass: 'scrollbar',
                  autoScroll: true,
                  onSelect:function(ui,event, data){
                    var video_id = data[0][0],path='/talks/latest/';
                    //Change videolist dataPath
                     var videolist = ui.app.ui.element('/main/home/videolistpanel/videolist');
                      videolist.setDataPath('/talks/favorites');

                    //Change video dataPath
                    var video = app.data.get(path+video_id);
                    if (!video){
                      path='/talks/all/';
                      video = app.data.get(path+video_id);
                    }
                    if (!video){
                      alert('An error occured - unable to play video '+video_id);
                      return false;
                    }

                    app.ui.element('/main/home/videodetail').setDataPath(path+video_id);
                    //Change main view
                    app.ui.element('/footer').selectByIndex(0);
                    
                    
                    var videolisttitle = ui.app.ui.element('/main/home/videolistpanel/videolisttitle');
                    videolisttitle.setDataPath('/talks/favorites');
                  }
                }
              ],
              onAfterShow:function(ui){
                  ui.app.ui.element('/main/home/videodetail/player').player.pause();
                  if (!ui.app.getState('auth')) {
                    $('#'+ui.htmlId+' .fav-zero-favs').hide();
                    ui.app.fbLogin();
                  } else {
                    $('#'+ui.htmlId+' .fav-not-connected').hide();
                    if (ui.app.ui.element('/main/favorites/favlist').data.length>0){
                      $('#'+ui.htmlId+' .fav-zero-favs').hide();
                    }
                    //OK here come your videos
                   // ui.app.ui.element('/main/favorites').htmlEl.innerHTML = '<h3>Favs to show</h3>'+JSON.stringify(ui.app.userSession.mytv.favorites);
                  }
              }
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
            id: 'tedx',
            label: 'TEDx'
          },
          {
            id: 'favorites',
            label: 'My favorites'
          }]
        }
      ];
      // UI specialization : the video control bar is useless on environments without a mouse
      //console.log(Joshfire.adapter);
      if (Joshfire.adapter === 'browser') {
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
