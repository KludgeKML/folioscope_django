/**
 * SAWS Parallel Text Viewer Document Handling Functions
 *
 * Project: KCL/SAWS
 * Last Changed: $LastChangedDate: 2013-04-26 18:53:06 +0100 (Fri, 26 Apr 2013) $
 * SVN Revision: $Rev: 535 $
 */

documentLibrary =
{
	init: function ( callback, errorCallback )
	{
		this.documentsMenu = '';
		this.relationshipsCache = {};
		this.documentsData = {};
		this.urlBase = url_base;

		var t = this;

		$.ajax({
			dataType: "html",
			url: document_endpoint,

			error: function ( jqXHR, textStatus, errorThrown )
			{
				errorCallback();
			},

			success: function ( data )
			{
				t.documentsMenu = data;
				t.parseDocumentsMenu();
				callback();
			}
		});
	},

	getIndex: function ( type, index, filter, callback, errorCallback )
	{
		var t = this;

		var indexURL = './indices/' + type + '/' + index;
		if (filter != "")
			indexURL = indexURL + '?doc=' + filter;

		$.ajax({
			dataType: "html",
			url: indexURL,

			error: function ( jqXHR, textStatus, errorThrown )
			{
				errorCallback();
			},

			success: function ( data )
			{
				var contentDiv = $('.contentSection', data);
				callback(contentDiv);
			}
		});
	},

	getEmptyDocument: function ( text )
	{
		var contentDiv = $('<div>' + text + '</div>', { id: 'content' });
		var document = new Document(this, '_blank_', '', text, 'ltr', contentDiv);
		return document;
	},

	getDefaultDocument: function ( callback )
	{
		var firstID = Object.keys(this.documentsData)[0];
		return this.getDocumentByID(firstID, 0, callback);
	},

	getDocumentByID: function ( id, callbackID, callback )
	{
		var documentData = this.documentsData[this.getDocumentID(id)];
		var t = this;
		var url = documentData.url;

		//var bits = url.split(':');
		//url = bits[1].replace('/', '__');
		url = url.replace(/\//g, '__');
		url = url.replace(/\-diplomatic/g, '__diplomatic');
		url = url.replace(/\:/g, '__');
		//url = 'xmlcache/' + url + '.html';

		$.ajax(
		{
			url: document_endpoint + '/' + url,

			error: function ( jqXHR, textStatus, errorThrown )
			{
				callback(callbackID, textStatus, null);
			},

			success: function ( message )
			{
				//var dom = $.parseHTML(message);
				var title = $('h1.headerLogo', message).html();
				if (title == "")
					title = "(Title not found)";
				var contentDiv = $('#content', message);
				var document = new Document(t, t.getDocumentID(id), documentData.group, documentData.name, 'ltr', contentDiv);
				callback(callbackID, "", document);
			}
		});
	},


	parseDocumentsMenu: function ( )
	{
		var t = this;
		$("li.menuItem,li.subMenuItem", this.documentsMenu).each(function()
		{
			var document = {};
			document.url = $(this).attr('id');

			var parts = document.url.split('/');
			document.id = parts[1];
			if (parts.length > 2) document.id += '/' + parts[2];
			document.group = parts[0];
			document.name = $(this).text();
			t.documentsData[document.id] = document;
		});
	},

	getDocumentMenu: function ( )
	{
		return this.documentsMenu;
	},

	clearRelationshipsCache: function ( )
	{
		this.relationshipsCache = {};
	},

	getRelatedInformation: function ( documentID, infoType, callback )
	{
		var idInfo = this.parseIDInfo(documentID);
		var t = this;

		$.ajax(
		{
			url: './' + infoType + '/' + idInfo['document'],

			error: function ( jqXHR, textStatus, errorThrown )
			{
				callback(textStatus, null);
			},

			success: function ( message )
			{
				var documentInfo = message;
				callback("", documentInfo);
			}
		});
	},

	getDocumentInformation: function ( documentID, callback )
	{
		this.getRelatedInformation(documentID, 'info', callback);
	},

	getDocumentBibliography: function ( documentID, callback )
	{
		this.getRelatedInformation(documentID, 'biblio', callback);
	},

	getRelationships: function ( relationshipID, languageCode, callback )
	{
		if (relationshipID in this.relationshipsCache)
		{
			if (console) console.log("Getting relationships from cache");
			callback(this.relationshipsCache[relationshipID]);
			return;
		}

		var t = this;
		var relations = [];
		var format = 'application/sparql-results+json';

		var sparql = 'SELECT DISTINCT ?value ?relation ?relationLabel ' +
				'WHERE {  ' +
					'<' + relationshipID + '> ?relation ?value . ' +
					'?relation  <http://www.w3.org/2000/01/rdf-schema#subPropertyOf>* <http://purl.org/saws/ontology#isRelatedTo> . ' +
					' FILTER (?relation != <http://purl.org/saws/ontology#fallsWithin>) .' +
					' OPTIONAL {?relation <http://www.w3.org/2000/01/rdf-schema#label> ?relationLabel . FILTER(LANG(?relationLabel) = "' + languageCode + '") } .' +
				'}'

		if (console) console.log(sparql);

		$.ajax(
		{
			url: sparql_endpoint,

			accepts: { 'json': format },

			dataType: 'json',

			crossDomain: true,

			data: { 'query': sparql, 'format': format },

			type: 'GET',

			success: function ( data )
			{
				var relations = [];

				for (var i in data.results.bindings)
				{
					if (t.isLocal(data.results.bindings[i].value.value))
					{
						var localID = t.getSubFragmentID(data.results.bindings[i].value.value);
						var documentID = t.getDocumentID(localID);
						var documentName = t.getDocumentNameByID(documentID);
						var label = data.results.bindings[i].relation.value.split('#')[1];
						if (data.results.bindings[i].relationLabel !== undefined)
						{
							label = data.results.bindings[i].relationLabel.value;
						}
						var detail =  { internal: true,
								type: data.results.bindings[i].relation.value,
								typeLabel: label,
								id: localID,
								documentID: documentID ,
								documentName: documentName ,
						              };
						relations.push(detail);
					}
					else
					{
						var detail =  { internal: false,
								type: data.results.bindings[i].relation.value,
								typeLabel: data.results.bindings[i].relationLabel.value,
								url: data.results.bindings[i].value.value,
						              };
						relations.push(detail);
					}
				}
				t.relationshipsCache[relationshipID] = relations;
				callback(relations);
			}
		});
	},


	parseIDInfo: function ( id )
	{
		var idParts = {'document': '', 'edition': '', 'line': '', 'isLocal': false,
			       'load': '', 'documentURL': '', 'documentLoadURL': '', 'fullLine': ''};
		if (id == '_blank_') return idParts;

		if (id.substr(0, this.urlBase.length) == this.urlBase)
		{
			id = id.substr(this.urlBase.length);
			idParts['isLocal'] = true;
		}
		var parts = id.split(':');
		var subParts = parts[1].split('/');

		idParts['document'] = parts[0] + ':' + subParts[0];
		idParts['load'] = idParts['document'];
		if (subParts.length > 1)
		{
			idParts['edition'] = subParts[1];
			idParts['load'] = idParts['load'] + '/' + idParts['edition'];
		}
		if (parts.length > 2)
		{
			idParts['line'] = parts[2];
			idParts['fullLine'] = idParts['document'] + ":" + parts[2];
		}
		idParts['documentURL'] = this.urlBase + idParts['document'];
		idParts['documentLoadURL'] = this.urlBase + idParts['load'];

		return idParts;
	},


	getDocumentID: function ( fragmentID )
	{
		var parts = fragmentID.split(':');
		return parts[0] + ':' + parts[1];
	},

	getLineID: function ( fragmentID )
	{
		var parts = fragmentID.split(':');
		return parts[2];
	},

	getDocumentNameByID: function ( documentID )
	{
 		var selector = '[id$="' + documentID.replace( /(:|\.|\/|\%|\[|\])/g, "\\$1" ) + '"]';
		var value = $(selector, this.documentsMenu);
		if (value.length < 1) return '[' + documentID + ']';

		return value.get(0).textContent;
	},

	getFragmentFullID: function ( fragmentID )
	{
		return this.urlBase + fragmentID;
	},

	getSubFragmentID: function ( fullFragmentID )
	{
		return fullFragmentID.substr(this.urlBase.length);
	},

	isLocal: function ( fullFragmentID )
	{
		if (fullFragmentID.substr(0,this.urlBase.length) == this.urlBase) return true;

		return false;
	},

	isLineID: function ( fragmentID )
	{
		var parts = fragmentID.split(':');

		if (parts.length > 2) return true;

		return false;
	}
};


Document = function ( library, id, group, name, nameDirection, contentElement )
{
	this.library = library;
	this.id = id;
	this.group = group;
	this.name = name;
	this.nameDirection = nameDirection;
	this.contentElement = contentElement;
	this.documentInformation = "";
	this.documentBibliography = "";

	this.contentElement.addClass('pv-visible-body')

	/* TODO: Fix this so that it shows the correct direction from the document */
	this.contentDirection = nameDirection;

	this.editions = [];

	var t = this;

	this.idInfo = this.library.parseIDInfo(this.id);

	this.citationInfo = {};

	this.citationInfo['title'] = $('#cite-title', contentElement).html();
	this.citationInfo['publisher'] = $('#cite-publisher', contentElement).html();
	this.citationInfo['year'] = $('#cite-year', contentElement).html();

	// TODO: verify that this is necessary - should -diplomatic be a part of the id?
	var tempParts = this.id.split("-diplomatic");
	this.teiLocation = "/tei/" + group + "/" + tempParts[0];

	if (id == '_blank_') return;

	$('.pb', contentElement).each(function()
	{
		var ed = "";

		var classList = this.className.split(/\s+/);

		for(var j = 0; j < classList.length; j++)
		{
			var className = classList[j];
			if (className.substring(0,3) == 'ED-')
			{
				ed = className.substring(3);
			}
		}

		if (ed == '')
			$(this).addClass('pv-ED-Default');

	// TODO: Fix for IE8
		if (t.editions.indexOf(ed) == -1)
			t.editions.push(ed);
	});

	if (this.editions.length == 0)
		this.editions.push('');

	this.library.getDocumentInformation(this.id, function(status, value)
	{
		if (status == '') t.documentInformation = value;
	});

	this.library.getDocumentBibliography(this.id, function(status, value)
	{
		if (status == '') t.documentBibliography = value;
	});
}

Document.prototype =
{
	getEditionList: function ( )
	{
		return this.editions;
	},

	getStyleMap: function ( )
	{
		var parts = this.id.split(':');
		var styleMap = [  { className: parts[0],   url: parts[0] },
				  { className: this.group, url: this.group },
				  { className: parts[1],   url: this.group + '/' + parts[1] } ];
		return styleMap;
	},


	getCTSFamily: function ( )
	{
		var parts = this.id.split(':');
		return parts[0];
	},


	getGroup: function ( )
	{
		return this.group;
	},


	getContentElement: function ( )
	{
		return this.contentElement;
	},


	getContentDirection: function ( )
	{
		return this.contentDirection;
	},


	getID: function ( )
	{
		return this.id;
	},

	getIDInfo: function ( )
	{
		return this.idInfo;
	},

	getInformation: function ( )
	{
		return this.documentInformation;
	},

	getBibliography: function ( )
	{
		return this.documentBibliography;
	},


	getName: function ( )
	{
		return this.name;
	},


	getNameDirection: function ( )
	{
		return this.nameDirection;
	},

	getFragmentFullID: function ( fragmentID )
	{
		return this.library.getFragmentFullID(fragmentID);
	},

	getSubFragmentID: function ( fullFragmentID )
	{
		return this.library.getSubFragmentID(fullFragmentID);
	},

	getCitationInfo: function ( )
	{
		return this.citationInfo;
	},

	getTEILocation: function ( )
	{
		return this.teiLocation;
	},
};
