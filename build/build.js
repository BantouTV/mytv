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
  dir: '../export/',
  modules: [
    {
  		name: 'ipad',
  		adapter: 'ios',
  		js: {
  			'include': [
  				'src/ted.ios',
  				// Dynamically loaded dependencies - not autodetectable
  				'joshfire/adapters/browser/uielements/video.youtube.swf',
  				'joshfire/adapters/browser/uielements/mediacontrols',
  				'joshfire/adapters/browser/uielements/list',
  				'joshfire/adapters/browser/inputs/mouse',
  				'joshfire/adapters/browser/inputs/keyboard'
  			]
  		},
  		css: {
  		  
  		}
  	}

	]
};
