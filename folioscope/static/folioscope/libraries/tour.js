/**
 * SAWS Parallel Text Viewer Website Tour Functions
 *
 * Project: KCL/SAWS
 * Last Changed: $LastChangedDate: 2013-04-26 18:53:06 +0100 (Fri, 26 Apr 2013) $
 * SVN Revision: $Rev: 535 $
 *
 * This object controls a tour of the website. The data field contains a list of 
 * tour items made up of 'text:' items that contain HTML text to be displayed in 
 * the tour dialog, and optional 'arrow' items that contain a JQuery Selector. When
 * the selector matches an item in the DOM, the tour will display an arrow pointing to
 * the centre of that item in the page.
 *
 * Current requirements:
 * - icons/tour_arrow_dr.png (arrow pointing down right, transparent background)
 * - icons/tour_arrow_dl.png (arrow pointing down leftt, transparent background)
 * - icons/tour_arrow_ur.png (arrow pointing up right, transparent background)
 * - icons/tour_arrow_ul.png (arrow pointing up left, transparent background)
 * 
 * ...and the following code in the root of the target HTML:
 * <div id="tour-Dialog" title="Tour">
 *	<div id="tour-Text"></div>
 *	<div id="tour-Button">Next</div>
 * </div>
 * <div id="tour-Arrow"></div> 
 *
 * Usage:
 * 
 * tour.init();  			// it must be initialised before use
 * ...
 * tour.setButtons('Next','Close); 	// Set the button text (optional, it defaults
 *					// to English
 * var data = [
 *     { data: 'This is the close button', arrow: '#closeButton' },
 *     { data: 'This is the end of the tour' },
 * ];
 * tour.setData(data);  		// Set the tour data, a list of maps of strings 
 *					// and optional selectors for arrows
 * ...                  
 * tour.showTour();     		// pops up the tour dialog in modal mode, 
 *					// and starts the tour
 * 
 * To Do:
 * - generate dialog HTML automatically, so end user doesn't need to include it
 * - generate arrows via SVG or canvas, perhaps?
 */

tour = {
	tourPrefix: 'tour-',
	
	data: [ { data: 'Sorry, tour data has not been set.' } ],
	nextText: 'Next',
	closeText: 'Close',
	keypress: 'space',


	init: function ( )
	{
		var tourDialogSelector = '#' + this.tourPrefix + 'Dialog';
		$(tourDialogSelector).dialog(
		{
			width: 550,
			height: 230,
			modal: true,
			autoOpen: false,
		});
	},
	

	setTranslationMap: function ( translationMap )
	{
		this.setButtons(translationMap.tourNext, translationMap.tourClose);
		this.setData(translationMap.tourData);
		this.keypress = translationMap.controls.tourNextKey.shortcut;
	},

	setButtons: function ( next, close )
	{
		this.nextText = next;
		this.closeText = close;
	},

	setData: function ( data )
	{
		this.data = data;
	},
	

	showTour: function ( )
	{
		this.page = 0;
		this.showPage(this.page);
		this.lastArrowClass = '';
	},

	showPage: function ( page )
	{
		var t = this;
		var tourDialogSelector = '#' + this.tourPrefix + 'Dialog';
		var tourArrowSelector = '#' + this.tourPrefix + 'Arrow';
		var tourTextSelector = '#' + this.tourPrefix + 'Text';
		var tourButtonSelector = '#' + this.tourPrefix + 'Button';

		var pageData = this.data[page];

		$(tourArrowSelector).css('display', 'none');
		$(tourArrowSelector).removeClass(this.lastArrowClass);

		$(tourTextSelector).html(pageData.text);

		$(tourButtonSelector).off('click');
	
		var clickFunction = function(){};

		if (t.page + 1 < t.data.length)
		{
			$(tourButtonSelector).html(t.nextText);
			clickFunction = function(event)
			{
				shortcut.remove(t.keypress);
				t.page = t.page+1;
				t.showPage(t.page);
				event.stopPropagation();
				return false;
			};
		}
		else
		{
			$(tourButtonSelector).html(t.closeText);
			clickFunction = function(event)
			{
				shortcut.remove(t.keypress);
				$(tourDialogSelector).dialog('close');
				event.stopPropagation();
				return false;
			};
		}
		
		$(tourButtonSelector).click(clickFunction);
		shortcut.add(this.keypress, clickFunction);

		if (pageData.arrow !== undefined)
		{
			var element = $(pageData.arrow);
			var domElement = element.get(0);

			var absPosition = getElementAbsolutePos(domElement);

			var itemLeft = absPosition.x;
			var itemTop = absPosition.y;

			var pointerTop = itemTop + (domElement.offsetHeight / 2);
			var pointerLeft = itemLeft + (domElement.offsetWidth / 2);

			var arrowClass = "";

			if (itemTop > ($(window).height() / 2))
			{
				arrowClass = "d";
				pointerTop = pointerTop - 140;
			}
			else
			{
				arrowClass = "u";
			}

			var width = $(window).width();

			if (itemLeft > ($(window).width() / 2))
			{
				arrowClass = arrowClass + "r";
				pointerLeft = pointerLeft - 140;
			}
			else
			{
				arrowClass = arrowClass + "l";
			}

			$(tourArrowSelector).addClass(arrowClass);
			this.lastArrowClass = arrowClass;

			$(tourArrowSelector).css('left', pointerLeft); 
			$(tourArrowSelector).css('top', pointerTop); 
			$(tourArrowSelector).css('display', 'block');
		}

		$(tourDialogSelector).dialog('open');
	}
};