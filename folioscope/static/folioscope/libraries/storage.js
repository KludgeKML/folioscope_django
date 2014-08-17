/**
 * SAWS Parallel Text Viewer Local Storage Library
 *
 * Project: KCL/SAWS
 * Last Changed: $LastChangedDate: 2013-04-26 18:53:06 +0100 (Fri, 26 Apr 2013) $
 * SVN Revision: $Rev: 535 $
 *
 * This object represents a safe access to HTML5 local storage and also implements
 * a watch system so that objects can be notified by callback function when a storage
 * item is changed. This allows settings dialogs to be decoupled from the consumers
 * of those settings.
 *
 * Usage:
 * 
 * storage.init();  	// it must be initialised before use
 * 
 * ...                  
 * 
 * storage.store('key','value');   // stores key=value
 * var keyVal = storage.retrieve('key') // gets 'value' into keyVal
 * 
 * ...
 * 
 * var watchID = storage.watch('key',function(value) {  // sets a watch function to be
 *    alert('something changed key to: ' + value);      // called whenever the value of key
 * });                                                  // changes.
 * 
 * ...
 * 
 * storage.ignore(watchID);        // removes the watch function
 */

storage =
{
	// Creates the watch list and checks if HTML5 local storage available
	init: function (  )
	{
		this.watchNextID = 0;
		this.watchList = [];
		if (typeof(Storage) === undefined)
		{
			if (console.log) console.log('Local storage disabled');
		}
	},


	// Gets a value for a key, or an empty string if no storage or key undefined
	retrieve: function ( key )
	{
		if (typeof(Storage) === undefined) return '';
		if (localStorage[key] === undefined)
		{
			if (console.log) console.log('Tried to retrieve undefined key: ' + key + ' from local storage');
			return '';
		}
		return localStorage[key];
	},


	// Stores a value to a key if local storage available and key has changed,
	// then calls back any functions on the watch list interested in that key.
	store: function ( key, value )
	{
		if (typeof(Storage) === undefined) return;
		
		if (value != this.retrieve(key))
		{
			localStorage[key] = value;

			for (i in this.watchList)
			{
				if (this.watchList[i].key == key)
				{
					this.watchList[i].callback(value);
				}
			}
		}
	},

	// Adds a callback function to the watchlist to be called when a the value
	// of a certain key is changed. Returns a sequence ID that can be used to
	// remove the callback later with the ignore function.
	watch: function ( key, callback )
	{
		var watchID = this.callbackNextID;
		var watchObject = { 'watch': watchID, 'key': key, 'callback': callback };

		this.watchList.push(watchObject);
		this.watchNextID += 1;

		return watchID;
	},


	// Removes a watch from the watch list by ID.
	ignore: function ( watchID )
	{
		// TODO: Implement!
	},
};
