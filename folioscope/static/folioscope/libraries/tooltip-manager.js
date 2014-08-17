/**
 * SAWS Parallel Text Viewer Info Popup Handling Functions
 *
 * Project: KCL/SAWS
 * Last Changed: $LastChangedDate: 2013-04-26 18:53:06 +0100 (Fri, 26 Apr 2013) $
 * SVN Revision: $Rev: 535 $
 *
 * This object controls a popup which can be written into from various locations, 
 * allowing more varied control than a simple title="" tooltip.
 */

tooltipManager = 
{
	init: function ( block )
	{ 
		this.block = $(block);
		this.items = {};
		this.visible = true;
	},

	setEnabled: function ( state )
	{
		this.visible = state;
		this.format();
	},

	setPosition: function ( x, y )
	{
		this.block.css('left', x); 
		this.block.css('top', y); 
	},

	addItem: function ( id )
	{	
		this.items[id] = "";
		this.format();
		return id;
	},

	removeItem: function ( id )
	{
		delete this.items[id];
		this.format();
	},

	setItem: function ( id, message )
	{
		this.items[id] = message;
		this.format();
	},

	format: function ( )
	{
		var html = "";

		for (var key in this.items)
		{
			if (this.items[key] != '')
				html += '<div>' + this.items[key] + '<div>';
		}

		this.block.html(html);

		if ((html == "") || (this.visible == false))
			this.block.css('display','none');		
		else
			this.block.css('display','block');		
	}
};