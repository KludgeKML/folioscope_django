/**
 * SAWS Parallel Text Translations File (Esperanto)
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

eo_Translation =
{
	translationDescription: 'Esperanto translation',
	translationLanguageCode: 'eo',
	HTML: 'viewer_eo.html',
	
	controls: {
		addColumnKey:         { shortcut: 'n', title: 'Aldoni nova kolumno' },
		removeColumnKey:      { shortcut: 'control+x', title:  'Forigi aktiva kolumno' },
		documentSettingsKey:  { shortcut: 'd', title: 'Malfermi dokumentaj agordoj dialogo' },
		globalSettingsKey:    { shortcut: 's', title: 'Malfermi mondaj agordoj dialogo'},
		togglePopupsKey:      { shortcut: 'k', title: 'Baskuli ŝprucfenestroj kiam supermusas' },
		togglePageNumbersKey: { shortcut: 'p', title: 'Baskuli paĝaj numeroj en aktiva kolumno' },
		toggleLineNumbersKey: { shortcut: 'l', title: 'Baskuli liniaj numeroj en aktiva kolumno' },
		toggleSegmentIDsKey:  { shortcut: 't', title: 'Baskuli segmentidentoj en aktiva kolumno' },
		openVisualiserKey:    { shortcut: 'v', title: 'Malfermi vidilo dialogo' },
		openDocInfoKey:	      { shortcut: 'i', title: 'Malfermi dokumentinformo dialog' },
		openBibliographyKey:  { shortcut: 'b', title: 'Malfermi bibliografio dialog' },
		columnLeftKey:        { shortcut: 'control+left', title: 'Movi aktiva kolumno al maldekstra' },
		columnRightKey:       { shortcut: 'control+right', title: 'Movi aktiva kolumno al dekstra' },
		tourNextKey:          { shortcut: 'space', title: 'Elekti sekva paĝo de le rondvojaĝo (kiam rondvojaĝo aktivas)' },
	},


	apparatusTitle: 'Aparatoj',
	apparatusLink: '(a#)',
	noteTitle: 'Notoj',
	generalNoteLink: '(n#)',
	commentaryNoteLink: '(kn#)',
	sourceNoteLink: '(fn#)',
	apparatusNoteLink: '(an#)',
	visualiserTitle: 'Vidilo',
	indicesTitle: 'Indeksoj',
	informationTitle: 'Informo pri Dokumento',
	bibliographyTitle: 'Bibliografio',
	citationInfoTitle: 'Kiel citi',

	thanksTitle: 'Dankoj',
	thanksInfo: '<p>Folioscope usas:</p><ul>' +
			'<li>Jquery (<a target="_blank" href="http://www.jquery.com">www.jquery.com</a>)</li>' +
			'<li>AWLD.js (<a target="_blank" href="http://isawnyu.github.io/awld-js/">isawnyu.github.io/awld-js/</a>)</li>' +
			'<li>sgvizler (<a target="_blank" href="https://code.google.com/p/sgvizler/">code.google.com/p/sgvizler/</a>)</li>' +
			'<ul><p>...kaj kreatiĝis por la Departamento de Ciferecaj Humanecoj (DDH) en KCL per <a href="mailto:keith@kludge.co.uk">Keith Lawrence</a></p>',


	errorDocumentListLoad:    'Problemo ŝarĝante dokumentlisto el servaro',
	errorDefaultDocumentLoad: 'Problemo ŝarĝante defaŭlta dokumento el servaro',
	errorDocumentLoad: 	  'Problemo ŝarĝante dokumento el servaro: ', //'Problemo ŝarĝante dokumento: {{docID}} el servaro:',


	footnotesTitle:	'Notoj kaj Aparatoj:', 

	inDocumentText: 'en dokumento',
	externalURLText: 'ekstera URL',

	relationshipsRelatedTo:   'Relata al',
	relationshipsNoneFound:    '(Neniu relatoj montri por tiu ero)',
	relationshipsClickToAlign: '(Klaki liniigi relataj eroj en malfermaj dokumentoj\nSHIFT-klaki malfermi ĉuij relataj dokumentoj kaj liniigi).',

	loading: 'Ŝarĝanta...',

	tourNext: 'Sekva',
	tourClose: 'Fermi',

	chooseDocument: 'Klaku ĉi tie elekti dokumenton...',

	init: function ( )
	{
		this.tourData = [
			{ text: 'Bonvenu al la SAWS Folioscope (Foliskopo)! <br /><br />Klaku ' + this.tourNext + ' aŭ premu <em>' + this.controls.tourNextKey.shortcut + '</em> por daŭri'},

			{ text: 'Baskuli la SAWS menuo (fari spaco por dokumentoj), klaku ĉi tie.', arrow: '#menuControl'},
			{ text: 'Aldoni nova dokumentvido, klaku ĉi tie, aŭ premu <em>' + this.controls.addColumnKey.shortcut + '</em>', arrow: '#addColumn'},
			{ text: 'Ŝanĝi mondaj agordoj, klaku ĉi tie. Ŝanĝoj tuŝos ĉiuj dokumentoj.', arrow: '#settings'},
			{ text: 'Malfermi indeksoj de homoj, lokoj, kaj nomoj, klaku ĉi tie. ', arrow: '#indices'},

			{ text: 'La alia regiloj agi en individuaj dokumentoj'},
			{ text: 'Dokumentoj montris en uno aŭ pli kolumnoj en la centra parto de la ekrano.'},
			{ text: 'Klaku en la dokumenttitolo por ŝanĝi la dokumentoj kiu montriĝas en la kolumno.', arrow: '.titleChooser'},
			{ text: 'Kiam pli ol uno dokumento estas malferma, rulumi uno rulumos ĉiuj. Por malebligi, klaku la ŝloso piktogramo ĉi tie.', arrow: '.linkControl'},
			{ text: 'Ankaŭ, kiam pli ol uno dokumento estas malferma piktogramo aperos por ebligi fermi dokumentoj: <span class="removeColumnTour"> </span> ...aŭ premu <em>' + this.controls.removeColumnKey.shortcut + '</em>'},
			{ text: 'Ŝanĝi individuaj dokumentaj algordoj, klaku ĉi tie, aŭ premu <em>' + this.controls.documentSettingsKey.shortcut + '</em>', arrow: '.docSettings'},
			{ text: 'Vidi informo pri la dokumento, klaku ĉi tie, aŭ premu <em>' + this.controls.openDocInfoKey.shortcut + '</em>', arrow: '.docInformation'},
			{ text: 'Vidi la bibliografio de la dokumento, klaku ĉi tie, aŭ premu <em>' + this.controls.openBibliographyKey.shortcut + '</em>', arrow: '.docBibliography'},
			{ text: 'Eroj en dokumentoj kiu havas ligoj al aliaj dokumentoj akcentas kun verda baroj. Kiam egala dokumento malfermas en alia kolumno, klaku en la ero liniigis rilataj eroj en la alia(j) dokumento(j).'},
			{ text: 'Premu SHIFT kaj klaku malfermas ĉiuj rilataj dokumentoj kaj liniigas. (dokumentoj ne en Folioscope malfermos en nova fenestro).'},
			{ text: 'Kiam ero elektas, klaku ĉi tie malfermi vidilo. ', arrow: '#visualiser'},
			{ text: 'Tiu estas la fino de la rondvojaĝo.'},
		];
	}
};
