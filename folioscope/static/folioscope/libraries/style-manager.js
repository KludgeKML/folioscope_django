/**
 * SAWS Parallel Text Viewer Dynamic Stylesheet Handling Functions
 *
 * Project: KCL/SAWS
 * Last Changed: $LastChangedDate: 2013-04-26 18:53:06 +0100 (Fri, 26 Apr 2013) $
 * SVN Revision: $Rev: 535 $
 *
 * This object allows stylesheets to be loaded dynamically in supported browsers, 
 * keeping track of how many calls to a stylesheet are active so that it does not
 * add a stylesheet more than once and can remove it from the DOM when it is no
 * longer referenced.
 *
 * Usage:
 * 
 * styleManager.init('style/');  // it must be initialised before use with a directory
 * ...                           // to load stylesheets from (can be an empty string)
 * styleManager.addStylesheet('colours');     // add colours.css to DOM
 * ...
 * styleManager.removeStylesheet('colours');  // remove colours.css from DOM
 * 
 */

styleManager = 
{
	init: function ( dir )
	{ 
		this.dir = dir;
		this.styleSheets = {};
	},

	addStyleSheet: function ( id )
	{
		if (this.styleSheets[id] === undefined)
		{
			var fileref = window.document.createElement('link');
	  		fileref.setAttribute('rel', 'stylesheet');
	 		fileref.setAttribute('type', 'text/css');
	  		fileref.setAttribute('href', this.dir + id + '.css');
			window.document.getElementsByTagName('head')[0].appendChild(fileref);

			var styleSheet =
			{
				id: id,
				useCount: 1,
				ref: fileref,
			};
			
			this.styleSheets[id] = styleSheet;
		}
		else
		{
			this.styleSheets[id].useCount += 1;
		}		
	},

	removeStyleSheet: function ( id )
	{
		if (this.styleSheets[id] === undefined) return;
			
		this.styleSheets[id].useCount -= 1;

		if (this.styleSheets[id].useCount < 1)
		{
			window.document.getElementsByTagName('head')[0].removeChild(
				this.styleSheets[id].ref);
			delete this.styleSheets[id];
		}
	}
};