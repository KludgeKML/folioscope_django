/**
 * SAWS Parallel Text Viewer Startup Function
 *
 * Project: KCL/SAWS
 * Last Changed: $LastChangedDate: 2013-04-26 18:53:06 +0100 (Fri, 26 Apr 2013) $
 * SVN Revision: $Rev: 535 $
 */

jQuery(function($)
{
	translationMap.init();
	storage.init();
	styleManager.init('styles/');
	tooltipManager.init('#infoPopup');
	tooltipManager.addItem('lemma');
	tooltipManager.addItem('related');

	viewContainer.init($('#viewContainer'), $('#footnotes'), $(window), translationMap);

	documentLibrary.init(function()
	{
		viewContainer.setDocumentLibrary(documentLibrary);

		var query = $.getQuery();

		var pathSections = decodeURIComponent(window.location.pathname).split('/');
		var loadIDBlock = pathSections[pathSections.length - 1];
		var loadIDSections = loadIDBlock.split('&viewOffsets=')

		var loadIDs = $.getQuery().viewColumns;
		var offsets = '';

		if (loadIDs !== undefined)
		{
			offsets = $.getQuery().viewOffsets;
			if (offsets === undefined) offsets = '';
		}
		else
		{

			loadIDs = loadIDSections[0];
			if (loadIDSections.length > 1) offsets = loadIDSections[1];
			if (loadIDs == '')
			{
				loadIDs = storage.retrieve('viewColumns');
				offsets = storage.retrieve('viewOffsets');
			}
		}

		if (loadIDs == '')
		{
			viewContainer.addViewWithDefaultDocument();
		}
		else if (loadIDs =='_blank_' || loadIDs =='blank')
		{
			viewContainer.addViewWithEmptyDocument();
		}
		else
		{
			var items = loadIDs.split('|');
			var itemOffsets = [];
			if (offsets != '') itemOffsets = offsets.split('|');

			viewContainer.batchAddViewsWithDocuments(items, itemOffsets);
		}
	}, function ()
	{
		alert(this.translationMap.errorDocumentListLoad);
	});

	tour.init();
	tour.setTranslationMap(translationMap);
	$('#tour').click(function(event)
	{
		tour.showTour();
		event.stopPropagation();
		return false;
	});

	$('#citationInfo').click(function(event)
	{
		viewContainer.populateDocumentCitationDialog('#infoDialog');
		$('#infoDialog').dialog('option', 'title', translationMap.citationInfoTitle);
		$('#infoDialog').dialog('open');
		event.stopPropagation();
		return false;
	});

	$('#thanks').click(function(event)
	{
		$('#infoDialog').html(translationMap.thanksInfo);
		$('#infoDialog').dialog('option', 'title', translationMap.thanksTitle);
		$('#infoDialog').dialog('open');
		event.stopPropagation();
		return false;
	});

	$("#infoDialog").dialog(
	{
		title: translationMap.apparatusTitle,
		width: 500,
		height: 350,
		autoOpen: false,
	});

	$("#indicesDialog").dialog(
	{
		title: translationMap.indicesTitle,
		width: 800,
		height: 550,
		modal: true,
		autoOpen: false,
	});

	$("#sgvzlDialog").dialog(
	{
		title: translationMap.visualiserTitle,
		width: 500,
		height: 350,
		autoOpen: false,
	});
	sgvizler.loadLibs();
	sgvizler.charts.loadCharts();

	$("#settingsDialog").dialog(
	{
		width: 600,
		height: 280,
		modal: true,
		autoOpen: false,
	});

	$('#settings').click(function(source)
	{
		$("#settingsDialog").dialog('open');
	});

	$("#settingsDialog select").each(function()
	{
		var storeValue = storage.retrieve(this.name);
		if (storeValue == '')
			storage.store(this.name, this.value);
		else
			this.value = storeValue;
	});

	$("#settingsDialog select").change(function(eventObject)
	{
		storage.store(this.name, this.value);
	});

	$("#docSettingsDialog").dialog(
	{
		width: 550,
		height: 230,
		modal: true,
		autoOpen: false,
	});

	$('#addColumn').click(function()
	{
		viewContainer.addViewWithDefaultDocument();
	});

	$('#menuControl').click(function(source)
	{
		toggleSiteMenu();
	});

	$('#visualiser').click(function(source)
	{
		viewContainer.openVisualiser();
	});

	$('#indices').click(function(source)
	{
		viewContainer.openIndex(viewContainer.indexType, viewContainer.indexValue, viewContainer.indexFilter);
	});
});


/*
 * toggleSiteMenu
 *
 * Toggles the integrated SAWS menu (put outside of viewContainer because
 * it will probably be moved to an integration class
 */
function toggleSiteMenu ( )
{
	if ($('#menuControl').hasClass('menuVisible'))
	{
		$('#menuControl').removeClass('menuVisible');
		$('#siteMenu').css('display','none');
		viewContainer.onResize();
	}
	else
	{
		$('#menuControl').addClass('menuVisible');
		$('#siteMenu').css('display','block');
		viewContainer.onResize();
	}
}


/*
 * MakeJQueryID
 *
 * Escapes xml IDs so that they can be used in JQuery selectors. This is necessary
 * because JQuery uses the "." and ":" characters as specials, and sometimes an item
 * id will have those characters in.
 */
function makeJQueryID ( myid )
{
	return "#" + myid.replace( /(:|\.|\/|\%|\[|\])/g, "\\$1" );
}

/*
 * MakeJQueryClass
 *
 * Escapes xml classes so that they can be used in JQuery selectors. This is necessary
 * because JQuery uses the "." and ":" characters as specials, and sometimes an item
 * class will have those characters in.
 */
function makeJQueryClass ( myclass )
{
	return "." + myclass.replace( /(:|\.|\/|\%|\[|\])/g, "\\$1" );
}



viewContainer =
{
	init: function ( container, footnotes, window, translationMap )
	{
		this.container = container;
		this.footnotes = footnotes;
		this.window = window;
		this.translationMap = translationMap;

		this.views = [];
		this.updateOnChanged = true;
		this.footnoteHeight = footnotes.css('height');

		this.blocksMode = false;
		this.debugMode = false;

		this.selectedItemRelationships = [];

		this.indexType = "place";
		this.indexValue = "A";
		this.indexFilter = "";


		this.noteDetails =
		[
			{
				title: this.translationMap.apparatusTitle,
				settingsName: 'apparatusStyle',
				selector: '.apparatus',
				sourceSelector: '.apparatusLink.text',
				linkSelector: '.doc-apparatusLink',
				linkClass: 'doc-apparatusLink',
				id: 'app-',
				linkText: this.translationMap.apparatusLink,
			},
			{
				title: this.translationMap.noteTitle,
				settingsName: 'generalNoteStyle',
				selector: '.general',
				sourceSelector: '.noteLink.general',
				linkSelector: '.doc-noteLink.general',
				linkClass: 'doc-noteLink general',
				id: 'note-',
				linkText: this.translationMap.generalNoteLink,
			},
			{
				title: this.translationMap.noteTitle,
				settingsName: 'commentaryNoteStyle',
				selector: '.commentary',
				sourceSelector: '.noteLink.commentary',
				linkSelector: '.doc-noteLink.commentary',
				linkClass: 'doc-noteLink commentary',
				id: 'note-comm-',
				linkText: this.translationMap.commentaryNoteLink,
			},
			{
				title: this.translationMap.noteTitle,
				settingsName: 'sourceNoteStyle',
				selector: '.source',
				sourceSelector: '.noteLink.source',
				linkSelector: '.doc-noteLink.source',
				linkClass: 'doc-noteLink source',
				id: 'note-source-',
				linkText: this.translationMap.sourceNoteLink,

			},
			{
				title: this.translationMap.noteTitle,
				settingsName: 'apparatusNoteStyle',
				selector: '.appNote',
				sourceSelector: '.noteLink.appNote',
				linkSelector: '.doc-noteLink.appNote',
				linkClass: 'doc-noteLink appNote',
				id: 'note-app-',
				linkText: this.translationMap.apparatusNoteLink,
			},
		];

		var t = this;

		this.setNoteWatches();
		this.changeNoteStyles();

		storage.watch('hoverPopups', function(newValue)
		{
			tooltipManager.setEnabled(storage.retrieve('hoverPopups') == "show" ? true : false);
		});

		tooltipManager.setEnabled(storage.retrieve('hoverPopups') == "show" ? true : false);

		storage.watch('awldPopups', function(newValue)
		{
			t.setClassBySelector(".documentField", "awld-scope",
				(newValue == "show" ? true : false));
			awld.init();
		});

		this.setClassBySelector(".documentField", "awld-scope",
			(storage.retrieve('awldPopups') == "show" ? true : false));

		this.window.resize(function() { t.onResize(); });

		this.onResize();

		this.createShortcuts();
	},

	getNoteDetails: function ( )
	{
		return this.noteDetails;
	},

	setNoteWatches: function ( tagList )
	{
		var t = this;
		for (var i in this.noteDetails)
		{
			storage.watch(this.noteDetails[i].settingsName, function()
			{
				t.changeNoteStyles();
			});
		}
	},

	createShortcuts: function ( )
	{
		var t = this;
		var controls = this.translationMap.controls;

		shortcut.add(controls.globalSettingsKey.shortcut, function()
		{
			$("#settingsDialog").dialog('open');
		});

		shortcut.add(controls.addColumnKey.shortcut, function()
		{
			t.addViewWithDefaultDocument();
		});

		shortcut.add(controls.removeColumnKey.shortcut,function()
		{
			if (t.getViewCount() > 1)
			{
				t.removeView(t.activeView);
			}
		});

		shortcut.add(controls.documentSettingsKey.shortcut, function()
		{
			t.activeView.populateDocumentSettingsDialog('#docSettingsDialog');
			$('#docSettingsDialog').dialog('open');
		});

		shortcut.add(controls.togglePopupsKey.shortcut, function()
		{
			if (storage.retrieve('hoverPopups') == 'show')
			{
				storage.store('hoverPopups', 'hide');
			}
			else
			{
				storage.store('hoverPopups', 'show');
			}
		});

		shortcut.add(controls.toggleLineNumbersKey.shortcut, function()
		{
			t.activeView.toggleSetting('lineNumbers', '#docSettingsDialog select[name=lineNumbers]', '#docSettingsDialog');
		});

		shortcut.add(controls.togglePageNumbersKey.shortcut, function()
		{
			t.activeView.toggleSetting('pageNumbers', '#docSettingsDialog select[name=pageNumbers]', '#docSettingsDialog');
		});

		shortcut.add(controls.toggleSegmentIDsKey.shortcut, function()
		{
			t.activeView.toggleSetting('linkIDs', '#docSettingsDialog select[name=linkIDs]', '#docSettingsDialog');
		});

		shortcut.add(controls.openBibliographyKey.shortcut, function()
		{
			t.activeView.populateDocumentBibliographyDialog('#infoDialog');
			$('#infoDialog').dialog('option', 'title', translationMap.bibliographyTitle);
			$('#infoDialog').dialog('open');
		});

		shortcut.add(controls.openDocInfoKey.shortcut, function()
		{
			t.activeView.populateDocumentInformationDialog('#infoDialog');
			$('#infoDialog').dialog('option', 'title', translationMap.informationTitle);
			$('#infoDialog').dialog('open');
		});

		t.visualiserQuery = $('#sgvzl_example1').attr('data-sgvizler-query');
		shortcut.add(controls.openVisualiserKey.shortcut, function()
		{
			this.openVisualiser();
		});

		shortcut.add(controls.columnLeftKey.shortcut, function()
		{
			var activeViewIndex = 0;
			for (var i in t.views)
			{
				if (t.views[i] == t.activeView)
				{
					activeViewIndex = parseInt(i);
				}
			}

			if (activeViewIndex != 0)
			{
				var temp = t.views[activeViewIndex-1];
				t.views[activeViewIndex-1] = t.activeView;
				t.views[activeViewIndex] = temp;
				t.resetViews();
				t.contentsChanged();
			}
		});

		shortcut.add(controls.columnRightKey.shortcut, function()
		{
			var activeViewIndex = 0;
			for (var i in t.views)
			{
				if (t.views[i] == t.activeView)
				{
					activeViewIndex = parseInt(i);
				}
			}

			if (activeViewIndex != (t.views.length-1))
			{
				var temp = t.views[activeViewIndex+1];
				t.views[activeViewIndex+1] = t.activeView;
				t.views[activeViewIndex] = temp;
				t.resetViews();
				t.contentsChanged();
			}
		});


		shortcut.add("control+b", function()
		{
			if (t.blocksMode == false)
			{
				styleManager.addStyleSheet('blocks');
				t.blocksMode = true;
			}
			else
			{
				styleManager.removeStyleSheet('blocks');
				t.blocksMode = false;
			}
		});


		shortcut.add("control+d", function()
		{
			if (t.debugMode == false)
			{
				t.debugMode = true;
			}
			else
			{
				t.debugMode = false;
			}
		});

		shortcut.add("control+shift+d", function()
		{
			var parent = t.activeView.documentContainer.get(0);
			var top = parent.scrollTop;
			t.activeView.findFirstVisible(parent, top);
		});
	},

	openVisualiser: function ( )
	{
		if( $('.ciSelected').length > 0 )
		{
			var value = this.documentLibrary.getFragmentFullID($('.ciSelected').get(0).id);
			var query = this.visualiserQuery.replace('$NODE$', '<' + value + '>');
			$('#sgvzl_example1').attr('data-sgvizler-query', query);
			$('#sgvzlDialog').dialog('open');
			sgvizler.drawContainerQueries();
		}
	},

	openIndex: function ( type, index, filter )
	{
		var t = this;

		t.indexType = type;
		t.indexValue = index;
		t.indexFilter = filter;

		$('#indicesDialog').dialog('open');
		$('#indicesDialog').addClass('loading');

		t.documentLibrary.getIndex(t.indexType, t.indexValue, t.indexFilter, function(indexPage)
		{
			// Make the apply button invisible
			$('form input', indexPage).css('display','none');

			// Activate the filter selector
			$('form select', indexPage).change(function()
			{
				t.openIndex(t.indexType, t.indexValue, $(this).val());
			});

			// letters in the alphabet index when clicked change the page displayed
			$('.index a', indexPage).click(function(event)
			{
				var sections = event.currentTarget.href.split('?');
				sections = sections[0].split('/');
				var newIndex = sections[sections.length-1];
				t.openIndex(t.indexType, newIndex, t.indexFilter);
				event.preventDefault();
			});

			// toggles between person/place indices
			// NB - this is outside the indexPage, so has a different
			// scope limit!
			$('#indicesDialog .types a').click(function(event)
			{
				var sections = event.currentTarget.href.split('/');
				var newType = sections[sections.length-1];
				if (newType.substr(0,5) == 'type:')
					newType = sections[sections.length-2] + '/' + newType;
				t.openIndex(newType, t.indexValue, t.indexFilter);
				event.preventDefault();
			});

			$('#indicesDialog .types a.selected').removeClass('selected');
			$('#indicesDialog .types a[href$="' + t.indexType + '"]').addClass('selected');

			// when index items clicked, load the required document in the
			// active view (or view[0] when no active view)
			$('.letterGroup .internal a', indexPage).click(function(event)
			{
				var sections = event.currentTarget.href.split('/');
				var docID = sections[sections.length-1];

				$('#indicesDialog').dialog('close');

				if (t.activeView === undefined) t.activeView = t.views[0];

				var changingView = t.activeView;
				changingView.setBusy(true);
				t.documentLibrary.getDocumentByID(docID, 0, function(callbackID, status, document)
				{
					if (status == "")
					{
						changingView.setDocument(document);
					}
					else
					{
						// TODO: put docID into string!
						alert(t.translationMap.errorDocumentLoad + docID);
						if (console) console.log('Failed to load document: ' + docID + ' (' + status + ')');
					}
					changingView.setBusy(false);
				});

				event.preventDefault();
			});
			$('#indicesDialog .contents').html(indexPage);
			$('#indicesDialog').removeClass('loading');
		},
		function()
		{
			alert("Problem loading index..");
		});
	},

	setClassBySelector: function ( selector, newClass, state )
	{
		if (state == true)
			$(selector).addClass(newClass);
		else
			$(selector).removeClass(newClass);
	},


	changeNoteStyles: function (  )
	{
		var footerRequired = false;

		for (i in this.noteDetails)
		{
			var style = storage.retrieve(this.noteDetails[i].settingsName);
			var linkSelector = this.noteDetails[i].linkSelector;
			var selector = this.noteDetails[i].selector + '.pv-inline';

			if (style == "footer")
			{
				footerRequired = true;
				$(linkSelector).css('display', 'none');
				$(selector).css('display','none');
			}

			if (style == "popUp")
			{
				$(linkSelector).css('display', 'inline');
				$(selector).css('display','none');
			}

			if (style == "inline")
			{
				$(linkSelector).css('display', 'none');
				$(selector).css('display','inline');
			}

			if (style == "hidden")
			{
				$(linkSelector).css('display', 'none');
				$(selector).css('display','none');
			}
		}

		if (footerRequired == true)
		{
			this.footnotes.css('height', this.footnoteHeight);
			this.footnotes.css('display', 'block');
		}
		else
		{
			this.footnotes.css('height', 0);
			this.footnotes.css('display', 'none');
		}

		this.onResize();
	},


	handleUpdates: function ( state )
	{
		this.updateOnChanged = state;
	},


	onResize: function ( )
	{
		var windowHeight = this.window.innerHeight();
		var windowWidth = this.window.innerWidth();

		var furnitureHeight = 0;
		var rightBorder = 0;

		$('.furniture').each(function()
		{
			if ($(this).css('display') != 'none')
				furnitureHeight += $(this).outerHeight()
		});

		$('#footnotesContent').height(1);
		var oHt = $('#footnotesContent').outerHeight() - 1;

		$('#footnotesContent').height($('#footnotes').height() - oHt);

		this.container
			.height(windowHeight - furnitureHeight)
			.width(windowWidth - rightBorder);

		this.resizeViews();
	},


	addView: function ( )
	{
		var newView = new View(this, new String(this.views.length + 1));
		this.views[this.views.length] = newView;
		this.resetViews();

		return newView;
	},

	addViewWithEmptyDocument: function ( )
	{
		var view = this.addView();
		var t = this;
		view.setDocument(this.documentLibrary.getEmptyDocument(t.translationMap.chooseDocument));
		view.setBusy(false);
	},

	addViewWithDefaultDocument: function ( )
	{
		var view = this.addView();
		var t = this;
		this.documentLibrary.getDefaultDocument(function(callbackID, status, document)
		{
			if (status == "")
			{
				view.setDocument(document);
				t.scrollNewViewToMatchLinked(view);
			}
			else
			{
				alert(t.translationMap.errorDefaultDocumentLoad);
				if (console) console.log('Failed to load default document (' + status + ')');
			}

			view.setBusy(false);
		});
	},


	batchAddViewsWithDocuments: function (items, itemOffsets, callback)
	{
		var viewOffset = this.getViewCount();

		this.handleUpdates(false);
		for (var i in items)
		{
			this.addView();
		}

		var updatesRemaining = items.length;
		var t = this;

		for (var i in items)
		{
			this.documentLibrary.getDocumentByID(items[i], parseInt(i) + parseInt(viewOffset), function(callbackID, status, document)
			{
				var targetView = t.getView(callbackID);

				if (status == "")
				{
					targetView.setDocument(document);
					t.changeNoteStyles();
					var idInfo = t.documentLibrary.parseIDInfo(items[i]);
					if (idInfo['line'] != '')
					{
						if (itemOffsets.length > 0)
							targetView.offsetViewOn(idInfo['fullLine'], parseInt(itemOffsets[i]));
						else
							targetView.centerViewOn(idInfo['fullLine']);
					}
					else
					{
						t.scrollNewViewToMatchLinked(targetView);
					}
				}
				else
				{
					alert(t.translationMap.errorDocumentLoad + items[i]);
					if (console) console.log('Failed to load document: ' + items[callbackID] + " (" + status + ")");
				}
				targetView.setBusy(false);

				updatesRemaining -= 1;
				if (updatesRemaining == 0)
				{
					t.handleUpdates(true);
					t.contentsChanged();
					if (callback !== undefined) callback();
				}
			});
		}
	},

	removeView: function ( dyingView )
	{
		for(var i in this.views)
		{
			if(this.views[i] == dyingView)
			{
			        this.views.splice(i,1);
			        break;
		        }
		}
		this.resetViews();
		this.contentsChanged();
	},


	/*
	 	getView

	 	returns one of the open views (0 = leftmost)
         */
	getView: function ( index )
	{
		return this.views[index];
	},


	/*
	 	getViewCount

	 	returns the number of active view columns.
         */
	getViewCount: function ( )
	{
		return this.views.length;
	},


	/*
	 	scrollViewsToPos

	 	Instruct all views to adjust their scroll position when a linked
         	view is manually scrolled (called from the View's scroll event handler).
         	Note that unlinked views will simply ignore the call.
         */
	scrollViewsToPos: function ( scrollTop )
	{
		if (this.updateOnChanged == false) return;
		for(var v in this.views)
		{
			this.views[v].adjustScroll(scrollTop);
		}
	},


	/*
	 	scrollNewViewToMatchLinked

	 	Scrolls a view (normally a new view, but it works with any view) so that it
	 	matches the scroll position of the left-most linked view. This function is
	 	used when a view isn't being opened to a specific position (like a named or
	 	related ID) but should still match scroll positions in linked documents for
	 	consistency.
         */
	scrollNewViewToMatchLinked: function ( newView )
	{
		if (this.getViewCount() > 1)
		{
			for (var v in this.views)
			{
				if ((this.views[v].linked == true) && (this.views[v] != newView) && (this.views[v].getDocument() !== undefined))
				{
					newView.adjustScroll(this.views[v].getScrollTop());
					return;
				}
			}
		}
	},


	/*
		populatDocumentCitationDialog

		Adds the citation information for all open documents into the specified
		dialog.
	*/

	populateDocumentCitationDialog: function ( dialogSelector )
	{
		var allCiteInfo = "";

		for (var v in this.views)
		{
			var citeInfo = this.views[v].getDocument().getCitationInfo();
			var link = 'http://www.ancientwisdoms.ac.uk/folioscope/' +
					this.views[v].getDocument().getID();

			allCiteInfo += '<div class="citationBlock">' +
						citeInfo['title'] + " (" +
						citeInfo['publisher'] + ", " +
						citeInfo['year'] + ")<br /><br />" +
						'Direct link: <a href="' + link + '">' + link + '</a>' +
						"</div>"

			if (this.views[v].getDocument().getID() == '_blank_')
			{
				allCiteInfo = "<p>Please select a document first</p>";
			}
		}

		$(dialogSelector).html(allCiteInfo);
	},


	/*
	 	resetViews

	 	Removes all documents from the view container, then reinserts them in order,
		also puts in the close buttons if there are more than one. Called whenever a
		view is added or removed from the container.
         */
	resetViews: function ( )
	{
		this.container.find('.documentView').detach();

		var displayCloseBoxes = 'none';
		if (this.views.length > 1)
		{
			displayCloseBoxes = 'inline';
		}

		for ( var i = 0; i < this.views.length; i++ )
		{
			this.container.append(this.views[i].getContainer().get(0));
			this.views[i].getContainer().find('.removeColumn').css('display', displayCloseBoxes);
			this.views[i].scrollToLastOffset();
		}

		this.onResize();
	},


	resizeViews: function ( )
	{
		if (this.views.length == 0)
			return;

		var containerWidth = this.container.width();
		var documentMargin = 0;
		//this.views[0].container.outerWidth(true) - this.views[0].container.width();

		var viewWidth = containerWidth / this.views.length - documentMargin;

		$('#documentMenu').css('max-height','' + (this.container.height() - 30) + 'px');
		$('#documentMenu').css('max-width','' + (viewWidth - 30) + 'px');
		$('#documentMenu').css('min-width','' + (viewWidth / 2) + 'px');

		var left = 0;

		for (var i=0; i < this.views.length; i++)
		{
			var view = this.views[i];
			var footerHeight = $('.footerSection').height();

			view.setLeft(left);
			view.setWidth(viewWidth);
			view.setHeight(this.container.height() - footerHeight - 12);

			left += viewWidth;
		}

		if ($("#documentMenu").css('display') == 'block')
		{
			var title = this.menuView.titleChooser;
			$("#documentMenu").css('left', title.offset().left);
			$("#documentMenu").css('top', title.offset().top + title.height());
		}


		this.matchDocumentSizes();
	},


	matchDocumentSizes: function ( )
	{
		//TODO: confirm that this is a reasonable assumption to make about the source docs
		$(".documentContent .pv-visible-body").height(1);
		$(".documentContent .pv-visible-body").css('height','auto');
		$(".documentContent .pv-visible-body").equalHeights();
	},


	/*
	 	setDocumentLibrary

	 	Attaches a document library to this view container - this library will be used to
		load all documents before they are added to views, and also provides the menu of
		documents that will be attached as a drop-down.
         */
	setDocumentLibrary: function ( documentLibrary )
	{
		this.documentLibrary = documentLibrary;

		$("#documentMenu").html(this.documentLibrary.getDocumentMenu());

		var t = this;

		$('#documentMenu').find('li.menuGroup').click(function(event)
		{
			var originalState = $('>ul', this).css('display');
			$('#documentMenu .menuGroup ul').css('display','none');
			if (originalState == 'none')
			{
				$('>ul', this).css('display','block');
			}
			else
			{
				$('>ul', this).css('display','none');
			}
			$('>ul', this).parents('ul').css('display','block');
			event.stopPropagation();
		});

		//TODO: can we be sure that li is the item that will appear in the menu?
		$("#documentMenu").find('li.menuItem').click(function(event)
		{
			$("#documentMenu").css('display','none');
			$('#documentMenu .menuGroup ul').css('display','none');
			var changingView = t.menuView;
			var parts = this.id.split('/');
			var docID = parts[1];
			if (parts.length > 2) docID += '/' + parts[2];
			changingView.setBusy(true);
			t.documentLibrary.getDocumentByID(docID, 0, function(callbackID, status, document)
			{
				if (status == "")
				{
					changingView.setDocument(document);
					t.scrollNewViewToMatchLinked(changingView);
				}
				else
				{
					// TODO: put docID into string!
					alert(t.translationMap.errorDocumentLoad + docID);
					if (console) console.log('Failed to load document: ' + docID + ' (' + status + ')');
				}
				changingView.setBusy(false);
			});
			event.stopPropagation();
		});
	},


	setActiveView: function ( view )
	{
		this.activeView = view;
	},

	getActiveView: function ( )
	{
		if (this.activeView === undefined) this.activeView = this.views[0];
		return this.activeView;
	},

	setMenuView: function ( view )
	{
		this.menuView = view;
	},


	/*
		markRelatedItems

		Probably one of the most important functions here, it takes a local and full ID (the
		local ID is the one in the document, the full includes all the SAWS namespaces necessary
		to query the document library), and finds all contentItems related to that ID, marking
		them with the state supplied (at the moment this is either "Hovered" or "Selected", and
		optionally executing a callback function.
	*/
	markRelatedItems: function ( localID, fullID, state, callback )
	{
		var targetState = 'ci' + state;
		var relatedState = 'ciRelatedTo' + state;

		this.selectedItemRelationships = [];

		// Clear existing states and mark chosen item

		$('.' + targetState).removeClass(targetState);
		$('.' + relatedState).removeClass(relatedState);

		$(makeJQueryID(localID)).addClass(targetState);

		var t = this;

		// Get simple translation matches first (those where the document is marked as a translation,
		// and the end parts of the IDs match

		var parts = localID.split(':');
		if (parts.length > 2)
		{
			var translationID = parts[2];
			$('.translation .contentItem[id$="' + translationID + '"]').each(function()
			{
				if ($(this).attr('id') != localID)
				{
					$(makeJQueryID($(this).attr('id'))).addClass(relatedState).addClass('isTranslationOf');
				}
			});
		}

		// Ask document library for all tags related to selected tag

		this.documentLibrary.getRelationships(fullID, this.translationMap.translationLanguageCode, function(relationships)
		{
			// mark all relationships with related state, and create string listing them
			// to put in the title.

			var titleString = '';

			for (var i in relationships)
			{
				var relationType = relationships[i].type.split('#')[1];

				var relationLabel = relationships[i].typeLabel;
				if (relationLabel == '') relationLabel = relationType;
				var relationText = "";

				if (relationships[i].internal == true)
				{
					$(makeJQueryID(relationships[i].id)).addClass(relatedState).addClass(relationType);
					relationText += relationships[i].id + ' ' + this.translationMap.inDocumentText + ' "' + relationships[i].documentName + '"';
				}
				else
				{
					relationText += this.translationMap.externalURLText + ' ' + relationships[i].url;
				}

				titleString += ' - ' + relationLabel + " " + relationText + '<br />';
			}

			if (titleString == '')
			{
				titleString = "";
			}
			else
			{
				titleString = '<span class="title">' + this.translationMap.relationshipsRelatedTo + ':</span><br />' + titleString + this.translationMap.relationshipsClickToAlign;
			}

			// set the selected/hovered contentItem's title to show relationship ids and documents
			//$(makeJQueryID(localID)).attr('title', titleString);

			tooltipManager.setItem('related', titleString);

			// save in case they're necessary for opening related documents
			t.selectedItemRelationships = relationships;

			if (callback !== undefined) callback();
		});
	},


	/*
		alignItemsToID

		 Find the first related item in each document
		 and adjust scrollTop to match the selected item.
	*/
	alignItemsToID: function ( id, state )
	{
		var selectedState = 'ci' + state;
		var relatedState = 'ciRelatedTo' + state;
		var lineTop = $(makeJQueryID(id)).offset().top;

		for (var v in this.views)
		{
			if ($(selectedState, this.views[v].getContainer()).length != 0) continue;
			this.views[v].scrollItemTo('.' + relatedState, lineTop);
		}
	},

	itemSelected: function ( selectedLocalID, selectedFullID )
	{
		var t = this;
		this.markRelatedItems(selectedLocalID, selectedFullID, 'Selected', function()
		{
			t.alignItemsToID(selectedLocalID, 'Selected');
			$('#visualiser').removeClass('disabled');
		});
	},

	itemSelectedAndOpened: function ( selectedLocalID, selectedFullID, sourceView )
	{
		var t = this;
		this.markRelatedItems(selectedLocalID, selectedFullID, 'Selected', function()
		{
			var relationships = t.selectedItemRelationships;

			var opened = [];
			var newTabs = [];

			for (var i in relationships)
			{
				if (relationships[i].internal == true)
				{
					var alreadyOpen = false;

					if (opened.indexOf(relationships[i].documentID) != -1) alreadyOpen = true;
					for (var v in t.views)
					{
						if (t.views[v].document.getID() == relationships[i].documentID) alreadyOpen = true;
					}

					if (alreadyOpen == false)
					{
						opened.push(relationships[i].documentID);
						newTabs.push(relationships[i].documentID);
					}
				}
				else
				{
					if (opened.indexOf(relationships[i].url) != -1) continue;
					window.open(relationships[i].url, '_blank');
					opened.push(relationships[i].url);
				}
			}

			t.batchAddViewsWithDocuments(newTabs, [], function()
			{
				sourceView.centerViewOn(selectedLocalID);
				t.markRelatedItems(selectedLocalID, selectedFullID, 'Selected');
				t.alignItemsToID(selectedLocalID, 'Selected');
			});
		});
	},

	clearSelected: function ( )
	{
		$(".ciSelected").removeClass("ciSelected");
		$(".ciRelatedToSelected").removeClass("ciRelatedToSelected");
		$('#visualiser').addClass('disabled');
	},


	itemHovered: function ( hoveredLocalID, hoveredFullID, source )
	{
		tooltipManager.setItem('related', '<span class="title">' + this.translationMap.relationshipsRelatedTo + ':</span> ' + this.translationMap.loading);
		tooltipManager.setPosition(source.clientX, source.clientY + 3);

		if (storage.retrieve('hoverBehaviour') == 'getRelated')
			this.markRelatedItems(hoveredLocalID, hoveredFullID, 'Hovered');
		else if (storage.retrieve('hoverBehaviour') == 'highlight')
			$(makeJQueryID(hoveredLocalID)).addClass('ciHovered');
	},


	clearHovered: function ( )
	{
		tooltipManager.setItem('related','');
		$(".ciHovered").removeClass("ciHovered");
		$(".ciRelatedToHovered").removeClass("ciRelatedToHovered");
	},


	addFootnote: function ( html )
	{
		$('#footnotesContent', this.footnotes).html('<div title="' + this.translationMap.footnotesTitle + '">' + html + '</div>');
	},

	updatePermalink: function ( )
	{
		var columns = "";
		var offsets = "";
		var offsetsFound = false;

		for (var i in this.views)
		{
			var firstID = this.views[i].getFirstVisibleID();
			if (firstID !== undefined)
			{
				var offset = this.views[i].getFirstVisibleOffset();
				if (offset != 0) offsetsFound = true;

				if (columns != "") columns += "|";
				columns += firstID;

				if (offsets != "") offsets += "|";
				offsets += offset;
			}
			else
			{
				var document = this.views[i].getDocument();
				if (document !== undefined)
				{
					if (columns != "") columns += "|";
					columns += document.getID();

					if (offsets != "") offsets += "|";
					offsets += '0';
				}
			}
		}

//		var permalinkURL = '/folioscope/' + encodeURIComponent(columns);
		var permalinkURL = encodeURIComponent(columns);

//		if (permalinkURL == '/folioscope/_blank_')
//			permalinkURL = '/folioscope/blank';

		if (offsetsFound) permalinkURL += '&viewOffsets=' + encodeURIComponent(offsets);

		storage.store('viewColumns', columns);
		if (offsetsFound) storage.store('viewOffsets', offsets);

		// Not all browsers support history.pushState, so check before using
		if (typeof history.pushState === "function")
		{
			var stateObj = { foo: "bar" };
			history.pushState(stateObj, "Updated", permalinkURL);
		}
	},

	contentsChanged: function ( )
	{
		if (this.updateOnChanged == false) return;

		this.clearSelected();

		this.updatePermalink();

		this.changeNoteStyles();

		awld.init();
	},
};




View = function ( viewContainer, id )
{
	this.viewContainer = viewContainer;
	this.id = id;
	this.scrollBufferID = "scrollBuffer_" + this.id;
	this.linked = true;

	this.HTML = $('#documentViewPrototype').clone();

	this.container = $(this.HTML);
	this.container.attr('id',id);
	this.documentContainer = this.container.find('.documentContent');
	this.documentContainer.parent().addClass('loading');

	this.header = this.container.find('.documentHeader');
	this.titleChooser = this.header.find('.titleChooser');
	this.linkControl = this.container.find('.linkControl');

	this.ignoreScrollEvents = false;

	this.document = undefined;
	this.firstVisibleID = undefined;
	this.firstVisibleOffset = 0;



	var t = this;

	this.container.mouseenter(function()
	{
		t.viewContainer.setActiveView(t);
	});


	this.container.click(function()
	{
		$("#documentMenu").css('display','none');
	});

	this.titleChooser.click(function(event)
	{
		t.viewContainer.setMenuView(t);
		$("#documentMenu").css('display','block');
		var title = $(event.currentTarget);
		$("#documentMenu").css('left', title.offset().left);
		$("#documentMenu").css('top', title.offset().top + title.height());
		event.stopPropagation();
	});

	this.container.find('.downloadTEI').click(function()
	{
		window.location = t.getDocument().getTEILocation();
	});

	this.container.find('.docBibliography').click(function(source)
	{
		t.populateDocumentBibliographyDialog('#infoDialog');
		$('#infoDialog').dialog('option', 'title', translationMap.bibliographyTitle);
		$('#infoDialog').dialog('open');
	});

	this.container.find('.docInformation').click(function(source)
	{
		t.populateDocumentInformationDialog('#infoDialog');
		$('#infoDialog').dialog('option', 'title', translationMap.informationTitle);
		$('#infoDialog').dialog('open');
	});

	this.container.find('.docSettings').click(function(source)
	{
		t.populateDocumentSettingsDialog('#docSettingsDialog');
		$('#docSettingsDialog').dialog('open');
	});

	this.linkControl.click(function(source)
	{
		if (t.linked == true)
		{
			t.linked = false;
			t.linkControl.removeClass('pv-scroll-linked').addClass('pv-scroll-unlinked');
		}
		else
		{
			t.linked = true;
			t.linkControl.removeClass('pv-scroll-unlinked').addClass('pv-scroll-linked');
		}
	});

	this.documentContainer.scroll(function(source)
	{
		var ignore = t.ignoreScrollEvents;
		t.ignoreScrollEvents = false;

		if (ignore) return;

		if (t.linked == true)
		{
			t.viewContainer.scrollViewsToPos(source.currentTarget.scrollTop);
		}


		$('.debug-firstVisible').removeClass('debug-firstVisible');
		$('.debug-checking').removeClass('debug-checking');

		var found = false;
		var top = source.currentTarget.scrollTop;

		t.findFirstVisible(t.documentContainer, top);
		t.viewContainer.updatePermalink();

	});

	this.container.find('.removeColumn').click(function(source)
	{
		if (t.viewContainer.getViewCount() > 1)
		{
			t.viewContainer.removeView(t);
			t.cleanUp();
		}
	});
};

View.prototype =
{
	cleanUp: function ( )
	{
		if (this.document !== undefined)
		{
			var oldStyles = this.document.getStyleMap();
			for (var i in oldStyles)
			{
				style = oldStyles[i];
				styleManager.removeStyleSheet(style.url);
			}
		}
	},

	confirmFirstVisible: function ( )
	{
		if ($(this.firstVisibleID).css('display') == 'none')
		{
			alert("first visible is invisible!");
		}
	},

	findFirstVisible: function ( rootParent, top )
	{
		this.found = false;
		this.findFirstVisibleRecurse('#content>*', rootParent, top);
	},


	findFirstVisibleRecurse: function ( rootSelector, rootParent, top )
	{
		var t = this;
		$(rootSelector, rootParent).each(function()
		{
			if (t.found == true) return;

			var pos = $(this).offset();
			var height = $(this).outerHeight(true);

			if ($(this).css('display') != 'none')
			{
				if ((pos.top <= top) && (height > top))
				{
					if (t.viewContainer.debugMode == true)
					{
						$('.debug-checking').removeClass('debug-checking');
						$(this).addClass('debug-checking');
					}
					if ($(this).children().length > 0)
					{
						t.findFirstVisibleRecurse('>*', this, top);
						if (t.found == false)
							t.markFirstVisible(this, pos.top);
					}
				}
				else if (pos.top + height > 1)
				{
					t.markFirstVisible(this, pos.top);
				}
			}
		});
	},


	markFirstVisible: function ( firstVisible, offset )
	{
		var docID = this.document.getID().split('/')[0];

		if (firstVisible.id.substring(0,docID.length) != docID)
		{
			return;
		}

		if (this.viewContainer.debugMode == true)
		{
			$(firstVisible).addClass('debug-firstVisible');
		}
		this.firstVisibleID = firstVisible.id;
		this.firstVisibleOffset = Math.round(offset);
		this.found = true;
	},

	setDocument: function ( document )
	{
		this.cleanUp();

		this.document = document;
		this.titleChooser.attr('dir', document.getNameDirection());
		this.titleChooser.html(document.getName());
		this.documentContainer.attr('dir', document.getContentDirection());
		this.documentContainer.attr('class', 'documentContent');
		this.documentContainer.html(document.getContentElement());
		this.documentContainer.prepend('<div id="' + this.scrollBufferID + '"></div>');

		// add link to document-family-/group-/file-specific stylesheets
		var styles = document.getStyleMap();
		for (var i in styles)
		{
			style = styles[i];
			this.documentContainer.addClass(style.className);
			styleManager.addStyleSheet(style.url);
		}

		this.makeDocumentIDSpans('linkID');

		this.viewContainer.matchDocumentSizes();

		var noteDetails = this.viewContainer.getNoteDetails();

		for (var i in noteDetails)
		{
			this.makeIntraDocumentLinks(noteDetails[i], '#infoDialog')
		}

		this.makeInterDocumentLinks();

		this.makeLemmaPopups();

		var t = this;

		// TODO: This selector should come from the document (or from document library via document), allowing different document classes
		var matchableItemSelector = '.contentItem,.narrative,.statement';

		this.container.find(matchableItemSelector).click(function(source)
		{
			if ($(source.currentTarget).hasClass('ignoreHover')) return;
			var id = $(source.currentTarget).attr('id')
			if (id !== undefined)
			{
				if (source.shiftKey == true)
				{
					viewContainer.itemSelectedAndOpened(id, t.document.getFragmentFullID(id), t);
				}
				else
				{
					viewContainer.itemSelected(id, t.document.getFragmentFullID(id));
				}

				viewContainer.addFootnote(t.getFootnoteHTML(t.viewContainer.getNoteDetails(), id));
			}
		});

		this.container.find(matchableItemSelector).mouseenter(function(source)
		{
			if ($(source.currentTarget).hasClass('ignoreHover')) return;
			var id = $(source.currentTarget).attr('id');
			if (id !== undefined)
			{
				viewContainer.itemHovered(id, t.document.getFragmentFullID(id), source);
			}
		});

		this.container.find(matchableItemSelector).mouseleave(function(source)
		{
			if ($(source.currentTarget).hasClass('ignoreHover')) return;
			var id = $(source.currentTarget).attr('id');
			if (id !== undefined) viewContainer.clearHovered(id);
		});

		this.setDisplaySpans('line_num', storage.retrieve(this.document.getID() + '#lineNumbers'));
		this.setDisplaySpans('pb', storage.retrieve(this.document.getID() + '#pageNumbers'));
		this.setDisplaySpans('surplus', storage.retrieve(this.document.getID() + '#surplusBlocks'));
		this.setDisplaySpans('linkID', storage.retrieve(this.document.getID() + '#linkIDs'));

		storage.watch(this.document.getID() + '#' + 'lineNumbers', function(state)
		{
			t.setDisplaySpans("line_num", state);
			t.confirmFirstVisible();
			t.offsetViewOn(t.firstVisibleID, t.firstVisibleOffset);
		});

		storage.watch(this.document.getID() + '#' + 'pageNumbers', function(state)
		{
			t.setDisplaySpans("pb" ,state);
			t.confirmFirstVisible();
			t.offsetViewOn(t.firstVisibleID, t.firstVisibleOffset);
		});

		storage.watch(this.document.getID() + '#' + 'surplusBlocks', function(state)
		{
			t.setDisplaySpans("surplus", state);
			t.confirmFirstVisible();
			t.offsetViewOn(t.firstVisibleID, t.firstVisibleOffset);
		});

		storage.watch(this.document.getID() + '#' + 'linkIDs', function(state)
		{
			t.setDisplaySpans("linkID" ,state);
			t.offsetViewOn(t.firstVisibleID, t.firstVisibleOffset);
		});

		this.findFirstVisible(this.documentContainer, this.documentContainer.scrollTop());
		viewContainer.contentsChanged();
	},

	makeLemmaPopups: function ( )
	{
	/*	Lemma Popups currently disabled (surplus to requirements)
		var t = this;

		$('span[data-lemma]').mouseenter(function(source)
		{
			tooltipManager.setItem('lemma', '<span class="title">Lemma:</span> ' + $(this).attr('data-lemma'));
			tooltipManager.setPosition(source.clientX, source.clientY + 3);
		});

		$('span[data-lemma]').mouseleave(function()
		{
			tooltipManager.setItem('lemma','');
		});
	*/
	},

	getFootnoteHTML: function ( noteDetails, id )
	{
		var title = "";
		var html = "";

		for (var i in noteDetails)
		{
			var noteDetail = noteDetails[i];

			if (storage.retrieve(noteDetail.settingsName) == 'footer')
			{
				var query = makeJQueryID(id) + ' ' + noteDetail.linkSelector;
				$(query).each(function()
				{
					var targetID = this.id;
					var skipLength = ('#to-' + noteDetail.id).length
					var contentID = noteDetail.id + "text-" + targetID.substring(skipLength);
					var content = $(makeJQueryID(contentID));
					title = content.attr('title')
					if (html != '') html += '<br />';
					html += noteDetail.linkText + ': ' + content.html();
				});
			}
		}

		return html;
	},

	makeDocumentIDSpans: function ( className )
	{
		$('[id^="' + this.document.getID() + '"]', this.documentContainer).each(function()
		{
			var id = $(this).attr('id');
			$(this).prepend('<span class="' + className + '">' + id + '</span>');
		});
	},


	/*
	 * makeIntraDocumentLinks
	 *
	 * This function takes a note type, and creates the links and hidden segments necessary
	 * to all it to appear in the footnote, as a pop-up link, or inline.
	 */
	makeIntraDocumentLinks: function ( noteDetail, dialogSelector )
	{
		var t = this;
		var edition = this.document.getIDInfo()['edition'];
		var skipLength = ('#to-' + noteDetail.id).length;

		this.container.find(noteDetail.sourceSelector).replaceWith(function()
		{
			// Hide (by deleting) any note/apparatus that doesn't match this edition,
			// if editions are being used.
			if (edition != '')
			{
				if ($(this).hasClass(edition) == false) return ('<span></span>');
			}

			var href = this.attributes.href.value;
			var re = /\([A-Za-z]+(\d*)\)/;

			var values = $(this).text().match(re);
			var linkText = noteDetail.linkText.replace('#','');
			if (values != null)
				linkText = noteDetail.linkText.replace('#', values[1]);

			var linkSpan = '<span class="' + noteDetail.linkClass + ' ignoreHover" id="' + href + '">' + linkText + '</span>'

			var contentID = noteDetail.id + "text-" + href.substring(skipLength);
			var content = t.documentContainer.find(makeJQueryID(contentID));
			var contentHTML = content.html();

			if (contentHTML !== undefined)
			{
				linkSpan += '<span class="' + noteDetail.selector.substring(1) +' ignoreHover pv-inline" id="' + noteDetail.id + 'inline' +
							href.substring(skipLength) + '" title="' + content.attr('title') + '">' + content.html() + '</span>';
			}

			return linkSpan;
		});

		this.container.find(noteDetail.linkSelector).click(function(source)
		{
			var contentID = noteDetail.id + "text-" + source.currentTarget.id.substring(skipLength);
			var content = t.documentContainer.find(makeJQueryID(contentID));

			$(dialogSelector).html('<span title="' + content.attr('title') + '">' + content.html() + '</span>')
			$(dialogSelector).dialog('option', 'title', noteDetail.title);
			$(dialogSelector).dialog('open');
		});
	},


	/*
	 * makeInterDocumentLinks
	 *
	 * This function converts remaining a tags (those not covered by the note links) into
	 * two kinds: external links (which will have their target attribute set as target="_blank"
	 * so that they open in a new window, and "internal" links (those not inside this document
	 * but going to the parallel viewer in another document (which will have their click function
	 * altered so that the target document will be opened in a new column if not already open, or
	 * scrolled in its current column if already open).
	 */
	makeInterDocumentLinks: function ( )
	{
		var page = this.viewContainer.translationMap.HTML;
		var t = this;

		$('a', this.container).each(function()
		{
			var href = $(this).attr('href');

			if (href.indexOf(page) != -1)
			{
				$(this).click(function(event)
				{
					event.preventDefault();
					var target = event.currentTarget.href.split('=');

					if (target.length > 1)
					{
						var targetInfo = t.viewContainer.documentLibrary.parseIDInfo(target[1]);
						var alreadyOpen = false;
						for (var v in t.viewContainer.views)
						{
							if (t.viewContainer.views[v].document.getID() == targetInfo['load'])
							{
								t.viewContainer.views[v].offsetViewOn(targetInfo['fullLine'],150);
								var originalBackground = $(makeJQueryID(targetInfo['fullLine'])).css('background-color');
								$(makeJQueryID(targetInfo['fullLine'])).css('background-color', 'gray');
								$(makeJQueryID(targetInfo['fullLine'])).animate({'background-color': ''}, 1000);
								alreadyOpen = true;
							}
						}

						if (alreadyOpen == false)
						{
							t.viewContainer.batchAddViewsWithDocuments([targetInfo['fullLine']], [150], function()
							{
								var originalBackground = $(makeJQueryID(targetInfo['fullLine'])).css('background-color');
								$(makeJQueryID(targetInfo['fullLine'])).css('background-color', 'gray');
								$(makeJQueryID(targetInfo['fullLine'])).animate({'background-color': ''}, 1000);
							});
						}
					}
				});
			}
			else if ((href.indexOf('http://') == 0) || (href.indexOf('/') == 0))
			{
				$(this).attr('target','_blank');
			}
		});
	},

	populateDocumentInformationDialog: function ( dialogSelector )
	{
		$(dialogSelector).html(this.document.getInformation());
		$(dialogSelector + ' .documentName').css('display','none');
	},

	populateDocumentBibliographyDialog: function ( dialogSelector )
	{
		$(dialogSelector).html(this.document.getBibliography());
		$(dialogSelector + ' .documentName').css('display','none');
	},

	populateDocumentSettingsDialog: function ( dialogSelector )
	{
		var docID = this.document.getID();
		var t = this;

		var pageNumbers = $('select[name="pageNumbers"]', dialogSelector);

		var pageNumbersHTML = '<option value="hide" selected>Hide</value>';

		var editions = this.document.getEditionList();
		for (i in editions)
		{
			if (editions[i] == "") editions[i] = "(Default)";
			pageNumbersHTML = pageNumbersHTML + '<option value="' + editions[i] + '">' + editions[i] + '</value>';
		}
		pageNumbers.html(pageNumbersHTML);

		$("select", dialogSelector).each(function()
		{
			var storeValue = storage.retrieve(docID + '#' + this.name);
			if (storeValue == '')
				storage.store(docID + '#' + this.name, this.value);
			else
				this.value = storeValue;
		});

		$("select", dialogSelector).off('change');
		$("select", dialogSelector).change(function(eventObject)
		{
			storage.store(docID + '#' + this.name, this.value);
		});
	},


	getContainer: function ( )
	{
		var t = this;
		return t.container;
	},


	getDocument: function ( )
	{
		return this.document;
	},


	getFirstVisibleID: function ( )
	{
		if (this.firstVisibleID === undefined) return this.firstVisibleID;

		var lineParts = this.firstVisibleID.split(':');
		if (lineParts.length > 2)
			return this.document.getID() + ':' + lineParts[2];
		return this.document.getID();
	},


	getFirstVisibleOffset: function ( )
	{
		return this.firstVisibleOffset;
	},


	setBusy: function ( state )
	{
		if (state)
			this.documentContainer.parent().addClass('loading');
		else
			this.documentContainer.parent().removeClass('loading');
	},


	setDisplaySpans: function ( targetClass, state )
	{
		$('.' + targetClass, this.documentContainer).addClass('hidden');

		if (state == "show")
		{
			$('.' + targetClass, this.documentContainer).removeClass('hidden');
		}
		else if (state == 'hide')
		{
			// do nothing!
		}
		else if (state == '(Default)')
		{
			$('.' + targetClass + '.pv-ED-Default', this.documentContainer).removeClass('hidden');
		}
		else
		{
			$('.' + targetClass + makeJQueryClass('ED-' + state), this.documentContainer).removeClass('hidden');
		}

		this.viewContainer.matchDocumentSizes();
	},


	setHeight: function ( newHeight )
	{
		var t = this;
		t.container.height(newHeight);
		t.documentContainer.height(newHeight - t.header.height());
	},


	setLeft: function ( newLeft )
	{
		var t = this;
		t.container.css('left', newLeft);
	},


	setWidth: function ( newWidth )
	{
		var t = this;
		t.container.width(newWidth);
	},

	toggleSetting: function ( settingName, valuesSelector, dialogSelector )
	{
		this.populateDocumentSettingsDialog(dialogSelector);

		var currentValue = storage.retrieve(this.document.getID() + '#' + settingName);
		var newValue = currentValue;
		var valuesObject = $(valuesSelector).get(0);

		if (valuesObject.nodeName == 'SELECT')
		{
			for (var i in valuesObject.options)
			{
				if (valuesObject.options[i].value == currentValue)
				{
					var index = parseInt(i) + 1;
					if (index >= valuesObject.options.length) index = 0;
					newValue = valuesObject.options[index].value;
				}
			}
		}

		if (newValue != currentValue)
		{
			storage.store(this.document.getID() + '#' + settingName, newValue);
		}
	},

	adjustScroll: function ( scrollTop )
	{
		if (this.linked == false) return;

		if (this.documentContainer.get(0).scrollTop != scrollTop)
		{
			this.ignoreScrollEvents = true;
			this.documentContainer.get(0).scrollTop = scrollTop;

			this.findFirstVisible(this.documentContainer, scrollTop);
		}
	},


	adjustScrollBuffer: function ( newSize )
	{
		$('#' + this.scrollBufferID).css('min-height', newSize);
	},


	getScrollTop: function ( )
	{
		return this.documentContainer.scrollTop();
	},

	scrollItemTo: function ( selector, position )
	{
		var related = this.documentContainer.find(selector);
		if (related.length == 0) return;

		var isHidden = false;

		this.adjustScrollBuffer(0);

		if ($(related).hasClass('hidden'))
		{
			isHidden = true;
			$(related).removeClass('hidden');
		}

		var scroll = -1 * (position - $(related).offset().top);
		//var scroll = -1 * (position - related[0].offsetTop);
		var scrollTarget = this.documentContainer.scrollTop() + scroll;

		if (scrollTarget < 0)
		{
			var scrollbox = $('#' + this.scrollSpaceID);
			this.adjustScrollBuffer(scrollTarget * -1);
		}
		else
		{
			this.ignoreScrollEvents = true;
			this.documentContainer.scrollTop(scrollTarget);
		}

		if (isHidden == true)
		{
			$(related).addClass('hidden');
		}
	},

	centerViewOn: function ( id )
	{
		this.scrollItemTo(makeJQueryID(id), (this.documentContainer.outerHeight() / 2));
		this.findFirstVisible(this.documentContainer, this.documentContainer.scrollTop());
	},

	offsetViewOn: function ( id, offset )
	{
		this.scrollItemTo(makeJQueryID(id), offset);
		this.findFirstVisible(this.documentContainer, this.documentContainer.scrollTop());
	},

	scrollToLastOffset: function (  )
	{
		if (this.firstVisibleID !== undefined)
			this.scrollItemTo(makeJQueryID(this.firstVisibleID), this.firstVisibleOffset);
	}
};
