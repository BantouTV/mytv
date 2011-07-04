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


Joshfire.define(['joshfire/class', 'joshfire/tree.ui','joshfire/uielements/List', 'joshfire/uielements/Panel'], function(Class, UITree, List, Panel) {
  return Class(UITree, {

    buildTree: function() {
      
      // UI specialization : the video list scrolls from top to bottom only on iOS
      if(Joshfire.adapter === 'ios') {
        var bVerticalList = true;
      } else {
        var bVerticalList = false;
      }
      
      var app = this.app;
      
      // our UI definition
      var aUITree = [
        {
          id:'toolbar',
          type:'panel',
          hideOnBlur:false,
          content:'<h1>This is our toolbar</h1>',
          children:[{
            id:'buttonone',
            type:'button',
            label:'button #1'
          },
          {
            id:'buttontwo',
            type:'button',
            label:'button #2'
          }]
          
        },
        {
          id: 'videolist',
          type: 'list',
          dataPath: '/latest/',
          
          hideOnBlur:true,
          autoShow:true,
          // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
          itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%=item.label%></figcaption></figure>',
          scroller: true,
          scrollOptions: {
            // do scroll in only one direction
            vScroll: bVerticalList,
            hScroll: !bVerticalList
          },
          scrollBarClass: 'scrollbar',
          autoScroll: true,
          hideDelay: 5000,
          onSelect: function(ui,evt,data) {
            console.warn(ui.getDataById(data[0][0]));
            app.ui.moveTo('focus', '/videodetail');
//            app.ui.element('/videodetail/player').play(ui.getDataById(data[0][0]));
          }
        },
        {
          id:'videodetail',
          type:'panel',
          hideOnBlur:true,
        //  uiDataMaster:'/videolist',
          autoShow:true,
          onAfterFocus:function(){
            console.warn('detail focused', this.data)
          },
          children:[
            {
               id: 'player',
                type: 'video.mediaelement',
                autoShow: false,
                options:{
                  forceAspectRatio:false,
                  //width:window.innerWidth,
                  height:window.innerHeight
                }
            },
            {
              id:'videoinfo',
              type:'panel',
              content:'Infos sur vidéo'
            },
            {
              id:'talkerinfo',
              type:'panel',
              content:'Infos sur talker'
            }
          ]
        }
      ];
      
      // UI specialization : the video control bar is useless on environments without a mouse
      //console.log(Joshfire.adapter);
      if(Joshfire.adapter === 'browser') {
        aUITree.push(  {
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
