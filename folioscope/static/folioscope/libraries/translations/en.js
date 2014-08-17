/**
 * SAWS Parallel Text Translations File (English)
 *
 * Project: KCL/SAWS
 * Last Changed: $LastChangedDate: 2013-04-26 18:53:06 +0100 (Fri, 26 Apr 2013) $
 * SVN Revision: $Rev: 535 $
 *
 * This object contains strings for key UI texts to ease internationalisation - currently
 * this includes tour information and keyboard shortcuts, and viewer.js strings. Changing
 * the values in this file and the displayed text in viewer.html should translate all
 * externally-viewable code (logs and code will still be in English).
 *
 */

en_Translation =
{
	translationDescription: 'English translation',
	translationLanguageCode: 'en',
	HTML: 'viewer.html',

	controls: {
		addColumnKey:         { shortcut: 'n', title: 'Add a new column' },
		removeColumnKey:      { shortcut: 'control+x', title:  'Remove active column' },
		documentSettingsKey:  { shortcut: 'd', title: 'Open document settings dialog' },
		globalSettingsKey:    { shortcut: 's', title: 'Open global settings dialog'},
		togglePopupsKey:      { shortcut: 'k', title: 'Toggle popups on rollovers' },
		togglePageNumbersKey: { shortcut: 'p', title: 'Toggle page numbers on active column' },
		toggleLineNumbersKey: { shortcut: 'l', title: 'Toggle line numbers on active column' },
		toggleSegmentIDsKey:  { shortcut: 't', title: 'Toggle segment IDs on active column' },
		openVisualiserKey:    { shortcut: 'v', title: 'Open visualiser dialog' },
		openDocInfoKey:	      { shortcut: 'i', title: 'Open document information dialog' },
		openBibliographyKey:  { shortcut: 'b', title: 'Open bibliography dialog' },
		columnLeftKey:        { shortcut: 'control+left', title: 'Moves active column to the left' },
		columnRightKey:       { shortcut: 'control+right', title: 'Moves active column to the right' },
		tourNextKey:          { shortcut: 'space', title: 'Select next page of tour (when tour active)' },
	},


	apparatusTitle: 'Apparatus',
	apparatusLink: '(a#)',
	noteTitle: 'Notes',
	generalNoteLink: '(n#)',
	commentaryNoteLink: '(cn#)',
	sourceNoteLink: '(sn#)',
	apparatusNoteLink: '(an#)',
	visualiserTitle: 'Visualiser',
	indicesTitle: 'Indices',
	informationTitle: 'Document Information',
	bibliographyTitle: 'Document Bibliography',
	citationInfoTitle: 'How to cite',

	thanksTitle: 'Thanks',
	thanksInfo: '<p>Folioscope uses:</p><ul>' +
			'<li>Jquery (<a target="_blank" href="http://www.jquery.com">www.jquery.com</a>)</li>' +
			'<li>AWLD.js (<a target="_blank" href="http://isawnyu.github.io/awld-js/">isawnyu.github.io/awld-js/</a>)</li>' +
			'<li>sgvizler (<a target="_blank" href="https://code.google.com/p/sgvizler/">code.google.com/p/sgvizler/</a>)</li>' +
			'</ul><p>...and was created for the Department of Digital Humanities at KCL by <a href="mailto:keith@kludge.co.uk">Keith Lawrence</a></p>',

	errorDocumentListLoad:    'Problem loading document list from server',
	errorDefaultDocumentLoad: 'Problem loading default document from server',
	errorDocumentLoad: 	  'Problem loading document from server: ', //'Problem loading document: {docID} from server',


	footnotesTitle:	'Notes and Apparatus:',

	inDocumentText: 'in document',
	externalURLText: 'external URL',

	relationshipsRelatedTo:   'Related to',
	relationshipsNoneFound:    '(No relationships to display for this item)',
	relationshipsClickToAlign: '(Click to align related items in open documents,\nSHIFT-click to open all related documents and align).',

	loading: 'Loading...',

	tourNext: 'Next',
	tourClose: 'Close',

	chooseDocument: 'Click here to choose a document...',

	init: function ( )
	{
		this.tourData = [
			{ text: 'Welcome to the SAWS Folioscope! <br /><br />Click ' + this.tourNext + ' or press <em>' + this.controls.tourNextKey.shortcut + '</em> to continue'},

			{ text: 'To toggle the SAWS menu (useful to allow more space for documents), click here', arrow: '#menuControl'},
			{ text: 'To add a new document view, click here, or press <em>' + this.controls.addColumnKey.shortcut + '</em>', arrow: '#addColumn'},
			{ text: 'To change global settings, click here. Changes affect all documents.', arrow: '#settings'},
			{ text: 'To open indices of people, places, and names, click here.', arrow: '#indices'},

			{ text: 'The rest of the controls work on individual documents'},
			{ text: 'Documents are displayed in one or more columns in the central part of the screen.'},
			{ text: 'Click on the title of a document to change which document is shown in that view.', arrow: '.titleChooser'},
			{ text: 'If more than one document is open, scrolling one will scroll them all by the same amount. To prevent this, click the lock icon here.', arrow: '.linkControl'},
			{ text: 'Also, if more than one document is open an icon will appear to allow you to close documents: <span class="removeColumnTour"> </span> ...or you can press <em>' + this.controls.removeColumnKey.shortcut + '</em>'},
			{ text: 'To change individual document settings, click here,  or press <em>' + this.controls.documentSettingsKey.shortcut + '</em>', arrow: '.docSettings'},
			{ text: 'To view information about the document, click here,  or press <em>' + this.controls.openDocInfoKey.shortcut + '</em>', arrow: '.docInformation'},
			{ text: 'To view the document\'s bibliography, click here,  or press <em>' + this.controls.openBibliographyKey.shortcut + '</em>', arrow: '.docBibliography'},
			{ text: 'To download the original TEI file for the document, click here', arrow: '.downloadTEI'},
			{ text: 'Items in documents that have links to other documents are marked with green bars. If a matching document is open in another column, clicking on one of these items will align related items in the other document(s).'},
 			{ text: 'Holding down shift and then clicking will open all related documents and align related sections (related links outside of the scope of the library will open in another window/tab).'},
			{ text: 'When an item is selected, click here, or press <em>' + this.controls.openVisualiserKey.shortcut + '</em> to open a visualiser tool showing its relationships.', arrow: '#visualiser'},
			{ text: 'This is the end of the tour.'},
		];
	}
};
