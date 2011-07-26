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


var build = {
  baseUrl: '../',
  name: 'mytedtv',
  dir: '../export-optimized/',
  modules: [
    {
      name: 'ipad',
      adapter: 'ios',
      js: {
        'include': [
          'src/app.ios',
          // Dynamically loaded dependencies - not autodetectable
          'joshfire/adapters/ios/uielements/video.mediaelement',
          'joshfire/adapters/ios/uielements/mediacontrols',
          'joshfire/adapters/ios/uielements/video.youtube'
        ]
      },
      css: {}
    },
    {
      name: 'iphone',
      adapter: 'ios',
      js: {
        'include': [
          'src/app.ios',
          // Dynamically loaded dependencies - not autodetectable
          'joshfire/adapters/ios/uielements/video.mediaelement',
          'joshfire/adapters/ios/uielements/mediacontrols',
          'joshfire/adapters/ios/uielements/video.youtube'
        ]
      },
      css: {}
    },
    {
      name: 'androidphone',
      adapter: 'ios',
      js: {
        'include': [
          'src/app.ios',
          // Dynamically loaded dependencies - not autodetectable
          'joshfire/adapters/ios/uielements/video.mediaelement',
          'joshfire/adapters/ios/uielements/mediacontrols',
          'joshfire/adapters/ios/uielements/video.youtube'
        ]
      },
      css: {}
    }
  ]
};
